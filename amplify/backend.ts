import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { firstBucket, secondBucket } from "./storage/resource";
import { data } from "./data/resource";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Stack } from "aws-cdk-lib";


const backend = defineBackend({
  auth,
  data,
  firstBucket, 
  secondBucket,
});

const MODEL_ID = "anthropic.claude-3-sonnet-20240229-v1:0";

const bedrockDataSource = backend.data.addHttpDataSource(
  "BedrockDataSource",
  "https://bedrock-runtime.us-east-1.amazonaws.com",
  {
    authorizationConfig: {
      signingRegion: "us-east-1",
      signingServiceName: "bedrock",
    },
  }
);

bedrockDataSource.grantPrincipal.addToPrincipalPolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ["bedrock:InvokeModel"],
    resources: [
      `arn:aws:bedrock:us-east-1::foundation-model/${MODEL_ID}`,
    ],
  })
);

backend.data.resources.cfnResources.cfnGraphqlApi.environmentVariables = {
  MODEL_ID
}