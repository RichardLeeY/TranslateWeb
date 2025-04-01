import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as path from 'path';

export class CdkTranslateWebStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create the Lambda function for translation
    const translateFunction = new lambda.Function(this, 'TranslateFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'translate.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
      memorySize: 256, // Increased memory for AI models
      timeout: cdk.Duration.seconds(30), // Increased timeout for AI processing
    });

    // Grant the Lambda function permission to use Amazon Bedrock
    translateFunction.addToRolePolicy(new iam.PolicyStatement({
      actions: [
        'bedrock:InvokeModel',
        'bedrock:InvokeModelWithResponseStream'
      ],
      resources: [
        // Claude 3.5 Haiku
        'arn:aws:bedrock:*::foundation-model/anthropic.claude-3-5-haiku-20240307-v1:0',
        // Nova models
        'arn:aws:bedrock:*::foundation-model/amazon.nova-1-micro-20240201-v1:0',
        'arn:aws:bedrock:*::foundation-model/amazon.nova-1-lite-20240201-v1:0',
        'arn:aws:bedrock:*::foundation-model/amazon.nova-1-pro-20240201-v1:0'
      ],
    }));

    // Create the API Gateway with CORS enabled
    const api = new apigateway.RestApi(this, 'TranslateApi', {
      restApiName: 'Translate Service API',
      description: 'API for translating content with AI models',
      deployOptions: {
        stageName: 'prod',
        loggingLevel: apigateway.MethodLoggingLevel.INFO,
        dataTraceEnabled: true,
      },
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: [
          'Content-Type',
          'X-Amz-Date',
          'Authorization',
          'X-Api-Key',
        ],
        allowCredentials: true,
      },
    });

    // Create an API key
    const apiKey = new apigateway.ApiKey(this, 'ApiGatewayApiKey', {
      apiKeyName: 'TranslateApiKey',
      description: 'API Key for Translation Service',
      enabled: true,
    });

    // Create a usage plan
    const usagePlan = new apigateway.UsagePlan(this, 'ApiGatewayUsagePlan', {
      name: 'TranslateUsagePlan',
      description: 'Usage plan for Translation API',
      apiStages: [
        {
          api,
          stage: api.deploymentStage,
        },
      ],
      quota: {
        limit: 1000,
        period: apigateway.Period.MONTH,
      },
      throttle: {
        rateLimit: 5,
        burstLimit: 10,
      },
    });

    // Add the API key to the usage plan
    usagePlan.addApiKey(apiKey);

    // Create the /translate resource
    const translateResource = api.root.addResource('translate');
    
    // Integration with the Lambda function
    const translateIntegration = new apigateway.LambdaIntegration(translateFunction);
    
    // Add the POST method with API key required
    translateResource.addMethod('POST', translateIntegration, {
      apiKeyRequired: true,
    });

    // Output the API endpoint URL and API key ID
    new cdk.CfnOutput(this, 'TranslateApiUrl', {
      description: 'API Gateway endpoint URL for Translate function',
      value: `${api.url}translate`,
    });

    new cdk.CfnOutput(this, 'TranslateFunctionArn', {
      description: 'Translate Lambda Function ARN',
      value: translateFunction.functionArn,
    });

    new cdk.CfnOutput(this, 'ApiKeyId', {
      description: 'API Key ID',
      value: apiKey.keyId,
    });
  }
}