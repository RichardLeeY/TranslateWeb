#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkTranslateWebStack } from '../lib/cdk-translate-web-stack';

const app = new cdk.App();
new CdkTranslateWebStack(app, 'CdkTranslateWebStack', {
  /* Using the current AWS account and region from the CLI configuration */
  env: { 
    account: process.env.CDK_DEFAULT_ACCOUNT, 
    region: process.env.CDK_DEFAULT_REGION || 'us-east-1'
  },
  description: 'Multilingual News Website Translation API (CDK Version)'
});