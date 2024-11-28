import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export class StorageStack extends cdk.Stack {
  public readonly documentBucket: s3.Bucket;
  public readonly ecrRepository: ecr.Repository;
  public readonly dynamoTable: dynamodb.Table;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const appName = this.node.getContext('appName');

    // S3 Bucket for Document Storage
    this.documentBucket = new s3.Bucket(this, `${this.stackName}-doc-bucket`, {
        bucketName: `${appName}-documents`,
        encryption: s3.BucketEncryption.S3_MANAGED,
      });

    // ECR Repository
    this.ecrRepository = new ecr.Repository(this, `${this.stackName}-ecr`, {
      repositoryName: appName,
    });

    // DynamoDB Table
    this.dynamoTable = new dynamodb.Table(this, `${this.stackName}-dynamodb`, {
      tableName: appName,
      partitionKey: { name: 'PK', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'SK', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    // Adding Global Secondary Index
    this.dynamoTable.addGlobalSecondaryIndex({
      indexName: 'GSI1',
      partitionKey: { name: 'GSI1_PK', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'GSI1_SK', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // Outputs
    new cdk.CfnOutput(this, 'DocumentBucket', {
      value: this.documentBucket.bucketName,
    });

    new cdk.CfnOutput(this, 'ECRRepository', {
      value: this.ecrRepository.repositoryUri,
    });

    new cdk.CfnOutput(this, 'DynamoDBTable', {
      value: this.dynamoTable.tableName,
    });
  }
}