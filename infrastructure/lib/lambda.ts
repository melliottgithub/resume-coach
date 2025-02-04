import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';

export class LambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const appName = this.node.getContext('appName');

    // Retrieve environment variables
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      console.error(`${id}: JWT_SECRET environment variable is required`);
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) {
      console.error(`${id}: OPENAI_API_KEY environment variable is required`);
    }

    // Lookup existing DynamoDB Table
    const dynamoTable = dynamodb.Table.fromTableName(this,
      `${this.stackName}-db-lookup`,
      appName
    );

    // Lookup existing S3 Bucket
    const documentBucket = s3.Bucket.fromBucketName(this,
      `${this.stackName}-s3-doc-lookup`,
      `${appName}-documents`
    );

    // Lookup existing ECR Repository
    const ecrRepo = ecr.Repository.fromRepositoryName(this,
      `${appName}-ecr-lookup`,
      appName
    );

    // Create an IAM Role for the Lambda
    const lambdaRole = new iam.Role(this, `${this.stackName}-lambda-role`, {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    // Allow Lambda to write logs to CloudWatch
    lambdaRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')
    );

    // Grant the role access to S3 and DynamoDB
    // (Similar to your previous ECS Task Role policies)
    documentBucket.grantReadWrite(lambdaRole);

    const dynamoPolicyStatement = new iam.PolicyStatement({
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
    });

    lambdaRole.addToPolicy(dynamoPolicyStatement);

    // Create the container-based Lambda Function
    const containerFunction = new lambda.DockerImageFunction(this, `${this.stackName}-container-lambda`, {
      functionName: `${appName}-lambda`,
      code: lambda.DockerImageCode.fromEcr(ecrRepo, {
        // Use the appropriate tag if needed. Defaults to "latest" if omitted.
        tagOrDigest: 'latest', 
      }),
      // Use the IAM role we just created
      role: lambdaRole,
      // Environment variables inside the container
      environment: {
        OTEL_SDK_DISABLED: 'true',
        CREWAI_STORAGE_DIR: '/tmp',
        JWT_SECRET: JWT_SECRET ?? '',
        OPENAI_API_KEY: OPENAI_API_KEY ?? '',
      },
      // Optionally configure memory, timeout, etc.
      memorySize: 512,
      timeout: cdk.Duration.seconds(120),
    });

    // Create a Lambda Function URL (no auth, public)
    const functionUrl = containerFunction.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
      cors: {
        allowedOrigins: ['*'],
        allowedMethods: [
          lambda.HttpMethod.GET,
          lambda.HttpMethod.POST,
          // lambda.HttpMethod.OPTIONS,
          lambda.HttpMethod.PUT,
          lambda.HttpMethod.PATCH,
          lambda.HttpMethod.DELETE,
        ],
        allowedHeaders: ['*'],
        allowCredentials: false,
      },
    });

    // CDK Output for the Function URL
    new cdk.CfnOutput(this, 'LambdaFunctionUrl', {
      value: functionUrl.url,
      description: 'The public URL of the container-based Lambda',
    });
  }
}
