import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as iam from 'aws-cdk-lib/aws-iam';
import { NetworkLoadBalancer, Protocol } from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { LogGroup } from 'aws-cdk-lib/aws-logs';

export class ServicesStack extends cdk.Stack {
  public readonly taskRole: iam.Role;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const appName = this.node.getContext('appName');

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      console.error(`${id}: JWT_SECRET environment variable is required`);
    }
    
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) {
      console.error(`${id}: OPENAI_API_KEY environment variable is required`);
    }

    // Lookup DynamoDB Table
    const dynamoTable = dynamodb.Table.fromTableName(this,
      `${this.stackName}-db-lookup`, 
      appName
    );

    // Lookup S3 Bucket
    const documentBucket = s3.Bucket.fromBucketName(this,
      `${this.stackName}-s3-doc-lookup`,
      `${appName}-documents`
    );

    // Lookup ECR Repository
    const ecrRepo = ecr.Repository.fromRepositoryName(this,
      `${appName}-ecr-lookup`,
      appName
    );

    // Custom VPC
    const vpc = new ec2.Vpc(this, `${this.stackName}-vpc`, {
      maxAzs: 2,
    });

    // ECS Cluster
    const ecsCluster = new ecs.Cluster(this, `${this.stackName}-ecs`, {
      clusterName: appName,
      vpc: vpc,
    });

    // IAM Role for ECS Task
    this.taskRole = new iam.Role(this, `${this.stackName}-ecs-task-role`, {
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
    });

    documentBucket.grantReadWrite(this.taskRole);

    const policy = new iam.PolicyDocument({
      statements: [
        new iam.PolicyStatement({
          actions: [
            'dynamodb:GetItem',
            'dynamodb:Query',
            'dynamodb:Scan',
            'dynamodb:PutItem',
            'dynamodb:UpdateItem',
          ],
          resources: [
            dynamoTable.tableArn,
            `${dynamoTable.tableArn}/index/GSI1`,
          ],
        }),
      ],
    });

    this.taskRole.attachInlinePolicy(new iam.Policy(this, `${this.stackName}-ecs-task-policy`, {
      policyName: `${this.stackName}-ecs-task-policy`,
      document: policy,
    }));

    // Fargate Task Definition
    const taskDefinition = new ecs.FargateTaskDefinition(this, `${this.stackName}-ecs-task`, {
      memoryLimitMiB: 512,
      cpu: 256,
      taskRole: this.taskRole,
    });

    // Add Container to Task
    const container = taskDefinition.addContainer(`${this.stackName}-ecs-container`, {
      image: ecs.ContainerImage.fromEcrRepository(ecrRepo),
      memoryLimitMiB: 512,
      logging: new ecs.AwsLogDriver({
        streamPrefix: `${this.stackName}-ecs-container`,
        logGroup: new LogGroup(this, `${this.stackName}-log-group`, {
          logGroupName: `${this.stackName}-ecs-log-group`,
          removalPolicy: cdk.RemovalPolicy.DESTROY,
        }),
      }),
      environment: {
        JWT_SECRET: JWT_SECRET as string,
        OPENAI_API_KEY: OPENAI_API_KEY as string,
      }
    });

    // Security Group for the Fargate Service
    const fargateSecurityGroup = new ec2.SecurityGroup(this, `${this.stackName}-fargate-sg`, {
      vpc,
      description: 'Security group for the Fargate service',
      allowAllOutbound: true,
    });

    // Allow inbound traffic on port 8000
    fargateSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(8000), 'Allow inbound traffic on port 8000');
    fargateSecurityGroup.addIngressRule(ec2.Peer.anyIpv6(), ec2.Port.tcp(8000), 'Allow inbound traffic on port 8000');

    // Expose a port for the container
    container.addPortMappings({
      containerPort: 8000,
    });

    const fargateService = new ecs.FargateService(this, `${this.stackName}-ecs-service`, {
      serviceName: `${appName}-service`,
      cluster: ecsCluster,
      taskDefinition: taskDefinition,
      desiredCount: 1,
      securityGroups: [fargateSecurityGroup]
    });


    // Create the Network Load Balancer
    const nlb = new NetworkLoadBalancer(this, `${this.stackName}-lb`, {
      loadBalancerName: this.stackName,
      vpc,
      internetFacing: true,
    });

    // Add a listener for TCP traffic on port 80
    const listener = nlb.addListener('Listener', {
      port: 80,
    });

    // Register the ECS Service with the NLB Target Group
    listener.addTargets(`${this.stackName}-ecs-tg`, {
      targetGroupName: `${this.stackName}-tg`,
      port: 8000, // The port the NLB forwards to on the tasks
      protocol: Protocol.TCP,
      targets: [fargateService], // ECS service as the target
      healthCheck: {
        enabled: true,
        timeout: cdk.Duration.seconds(5),
      },
    });

    // Outputs
    new cdk.CfnOutput(this, 'NlbDnsName', {
      value: nlb.loadBalancerDnsName,
      description: 'The DNS name of the Network Load Balancer',
    });

  }
}
