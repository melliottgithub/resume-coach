import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';

export class WebAppStack extends cdk.Stack {
  public readonly webAppBucket: s3.Bucket;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const appName = this.node.getContext('appName');

    // S3 Bucket for Website Hosting
    this.webAppBucket = new s3.Bucket(this, 'WebAppBucket', {
      bucketName: appName,
      websiteIndexDocument: 'index.html',
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS,
      publicReadAccess: true,
    });

    // Output the WebAppURL Bucket Name
    new cdk.CfnOutput(this, 'BucketName', {
      value: this.webAppBucket.bucketName,
    });

    // Output the WebAppURL URL
    new cdk.CfnOutput(this, 'URL', {
      value: this.webAppBucket.bucketWebsiteUrl,
    });
  }
}
