# Infrastructure as Code

This project uses the AWS Cloud Development Kit (CDK) to define and deploy the infrastructure for the Resume Coach application. The infrastructure is organized into three main stacks:

- **WebAppStack**: Manages the Single Page Application (SPA) hosted in an S3 bucket.
- **StorageStack**: Handles S3, DynamoDB, and ECR resources.
- **ClusterStack**: Sets up ECS clusters, services, and associated IAM roles.

## Prerequisites

Before running the project, ensure you have the following:

1. **AWS CDK CLI**: Install globally if not already done:
   ```bash
   npm install -g aws-cdk
   ```

2. **AWS Account**: Ensure you have access to an AWS account and configured credentials.

3. **Node.js**: Install Node.js and npm to manage dependencies.

## Deployment Instructions

### 1. Build the project:
Ensure your TypeScript code is compiled into JavaScript:
```bash
npm run build
```
### 2. Deploy individual stacks:
#### Deploy the Storage Stack
```bash
cdk deploy storage
```

#### Deploy the Services Stack with environment variables:
Before deploying, export the necessary environment variables:
```bash
export JWT_SECRET=secret-key
export OPENAI_API_KEY=your-openai-key
cdk deploy services
```
## Project Structure

- **`infrastructure/bin/infraestructure.ts`**: Entry point for defining the application and stacks.
- **Stacks**:
  - `WebAppStack`: Manages the static website hosted in an S3 bucket.
  - `StorageStack`: Provisions S3, DynamoDB, and ECR for persistent storage and container images.
  - `ServicesStack`: Configures ECS services, a network load balancer, and IAM policies.

## Environment Variables

Ensure the following environment variables are set before deploying the services stack:

- `JWT_SECRET`: Used for application authentication.
- `OPENAI_API_KEY`: API key for integrating with OpenAI.

## Outputs

After deployment, useful outputs include:

1. **StorageStack**:
   - `DocumentBucketOutput`: Name of the S3 bucket for document storage.
   - `ECRRepositoryOutput`: URI of the ECR repository.
   - `DynamoDBTable`: Name of the DynamoDB table.

2. **WebAppStack**:
   - `BucketName`: Name of the S3 bucket hosting the webapp.
   - `URL`: Public URL of the webapp.

3. **ServicesStack**:
   - `NlbDnsName`: DNS name of the network load balancer.

## Other Useful Commands

- **List stacks**: List all stacks in the app.
  ```bash
  npx cdk list
  ```
- **View stack differences**: Compare deployed stack with local changes.
  ```bash
  npx cdk diff
  ```
- **Synthesize template**: Generate the CloudFormation template.
  ```bash
  npx cdk synth
  ```