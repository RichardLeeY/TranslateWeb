# TranslateWeb - Multilingual News Website

This project implements a multilingual news website using AWS services. It allows users to translate news articles into different languages using Amazon Translate.

## Project Structure

- `cdk-translate-web/` - CDK project for deploying AWS infrastructure
- `public/` - Frontend web application files

## Architecture

This application uses the following AWS services:

- **Amazon API Gateway** - Provides a REST API endpoint
- **AWS Lambda** - Processes translation requests
- **API Keys & Usage Plans** - Secures and manages API access

## Deployment

### Prerequisites

- Node.js 14.x or later
- AWS CLI configured with appropriate credentials
- AWS CDK installed (`npm install -g aws-cdk`)

### Deploy the Backend

```bash
# Install dependencies and deploy
npm run deploy
```

This will:
1. Build the CDK project
2. Deploy the infrastructure to your AWS account

### Run the Frontend Locally

```bash
# Start the local web server
npm start
```

Then open your browser to http://localhost:8080

## API Usage

After deployment, you'll receive:
- API Gateway endpoint URL
- API Key ID

To use the API:

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

## Frontend Configuration

After deploying the backend infrastructure, you need to configure the frontend to connect to your API:

1. Open the file `public/js/app.js` in your preferred code editor
2. Locate the `config` object at the top of the file (around line 2)
3. Update the following properties:

```javascript
const config = {
    apiEndpoint: 'https://[API_ID].execute-api.[REGION].amazonaws.com/prod/translate',
    apiKey: '[YOUR_API_KEY]',
    supportedLanguages: {
        // You can customize supported languages here if needed
    },
    languageModels: {
        // You can customize available translation models here if needed
    }
};
```

4. Replace `[API_ID]`, `[REGION]`, and `[YOUR_API_KEY]` with the values from your deployed API Gateway
5. Save the file and refresh your browser to connect to your API

The `apiEndpoint` should be the full URL to your API Gateway endpoint, ending with `/translate`.
The `apiKey` is the API key value you retrieved from the AWS Console or AWS CLI.

## Customizing Articles

To modify the news articles displayed on the website:

1. Open the file `public/js/app.js` in your preferred code editor
2. Locate the `articles` array (around line 20)
3. Edit the existing articles or add new ones using the following format:

```javascript
const articles = [
    {
        id: '1',
        title: "Your Article Title",
        content: "Your article content goes here. You can write multiple paragraphs.",
        date: "Month DD, YYYY"
    },
    // Add more articles as needed
];
```

4. Save the file and refresh your browser to see the updated articles

Each article object requires:
- `id`: A unique identifier (string)
- `title`: The article headline
- `content`: The main text of the article
- `date`: Publication date in a readable format