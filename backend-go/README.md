# Vivah Matchmaking Application - Backend

## Overview

This is the backend component of the Vivah matchmaking application. It's built using Go and leverages AWS services (like DynamoDB and Lambda) for scalability and cost-effectiveness.

## Environment Setup

To run this project, you need to have Go installed on your machine.

## Configuration

The `config.go` file is used to store configuration variables. It currently holds:

*   **`SecretKey`:** The secret key used for signing and verifying JWT tokens. This value should be stored in the `JWT_SECRET` environment variable. If not set, it defaults to `"your-secret-key"`.
*   **DynamoDB Table Names:**
    *   `UsersTableName`: Set to `"Users"`.
    *   `ProfilesTableName`: Set to `"Profiles"`.
    *   `MatchesTableName`: Set to `"Matches"`.
    *   `LikesTableName`: Set to `"Likes"`.
    *   `MessagesTableName`: Set to `"Messages"`.

## Request/Response structure

This section will be used to document the request and response structures for the various API endpoints as they are implemented.

## Local Setup

### DynamoDB Local Setup

DynamoDB Local is a downloadable version of DynamoDB that runs on your local machine. This is used to speed up development and testing, allowing you to interact with a local database without needing to connect to a remote AWS instance.

To download and run DynamoDB Local, execute the following command in your terminal:
```
docker run -p 8000:8000 amazon/dynamodb-local
```
Once the command is run, you will have a local DynamoDB instance running on port 8000. You can use the AWS CLI to interact with this local instance.

This section will be updated later with more instructions.

### Lambda Emulation

We will be using the AWS SAM CLI to emulate our Lambda functions locally.

#### Installation

To install the AWS SAM CLI, follow the instructions in the official AWS documentation: [https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html)

#### SAM Template (template.yaml)

We will need a `template.yaml` file in the root of our `backend-go` directory. This file defines our serverless application's resources, including our Lambda functions and API Gateway configuration.

We will create this file later and add detailed instructions on how to configure it.

#### Build the Application

To build the application, run the following command in the root directory:



This section will be used to document the Lambda emulation setup.