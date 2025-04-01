# Translate Web CDK Project

This project implements a multilingual news website translation API using AWS CDK. It creates an API Gateway with a Lambda function that uses Amazon Translate to translate content.

## Architecture

The project creates the following AWS resources:

- **Lambda Function**: Handles translation requests using Amazon Translate
- **API Gateway**: Exposes the Lambda function as a REST API
- **API Key**: Secures the API with an API key
- **Usage Plan**: Controls API usage with quotas and throttling

## Prerequisites

- Node.js 14.x or later
- AWS CLI configured with appropriate credentials
- AWS CDK installed (`npm install -g aws-cdk`)

## Setup and Deployment

1. Install dependencies:
   ```
   npm install
   ```

2. Bootstrap your AWS environment (if you haven't already):
   ```
   cdk bootstrap
   ```

3. Deploy the stack:
   ```
   cdk deploy
   ```

4. After deployment, the CDK will output:
   - The API Gateway endpoint URL
   - The Lambda function ARN
   - The API Key ID

## Using the API

1. Retrieve your API key from the AWS Console or using the AWS CLI:
   ```
   aws apigateway get-api-key --api-key [API_KEY_ID] --include-value
   ```

2. Make a POST request to the API endpoint:
   ```
   curl -X POST \
     https://[API_ID].execute-api.[REGION].amazonaws.com/prod/translate \
     -H 'Content-Type: application/json' \
     -H 'x-api-key: [YOUR_API_KEY]' \
     -d '{
       "articles": [
         {
           "title": "Sample Article",
           "content": "This is a sample article content."
         }
       ],
       "targetLanguage": "es"
     }'
   ```

## Useful Commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template