import {
  LocalDocumentClient,
  TableConfigs,
} from "@bgpc/aws-serverless-toolkit/dist/providers/dynamodb";
import { DynamoDB } from "aws-sdk";

if (!process.env.NODE_ENV || !["development", "production", "test"].includes(process.env.NODE_ENV))
  throw new Error("Missing NODE_ENV");

export const getDynamoDb = (tableConfigs: TableConfigs): DynamoDB.DocumentClient => {
  if (["development", "production"].includes(process.env.NODE_ENV as string))
    return new DynamoDB.DocumentClient();
  return (new LocalDocumentClient({ tableConfigs }) as unknown) as DynamoDB.DocumentClient;
};
