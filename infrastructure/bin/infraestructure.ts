#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { WebAppStack } from '../lib/webapp';
import { StorageStack } from '../lib/storage';
import { ServicesStack } from '../lib/services';
import { Lambda } from 'aws-cdk-lib/aws-ses-actions';
import { LambdaStack } from '../lib/lambda';

const appName = 'resume-coach';

const app = new cdk.App({
  context: {
    'appName': appName,
  },
});

new StorageStack(app, 'storage', {
  stackName: `${appName}-storage`,
});

new ServicesStack(app, 'services', {
  stackName: `${appName}-services`,
});

new WebAppStack(app, 'webapp', {
  stackName: `${appName}-webapp`,
});

new LambdaStack(app, 'lambda', {
  stackName: `${appName}-lambda`,
});