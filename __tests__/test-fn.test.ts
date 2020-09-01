import { handler, RequestBody, ResponsePayload } from "@/backend/functions/test-fn/lambda";
import { getDynamoDb } from "@/backend/providers/dynamodb";
import { TestTable } from "@/infra/config/tables/test-table/config.json";
import { makePost } from "@bgpc/aws-serverless-toolkit";
import { ApiGatewayLocalClient } from "@bgpc/aws-serverless-toolkit/dist/providers/apigateway/";
import { DynamoDB } from "aws-sdk";

describe("test-fn tests", () => {
  it("should work", async () => {
    const baseUrl = "http://localhost:3002";
    const call = makePost<RequestBody, ResponsePayload>(`${baseUrl}/test-fn`);
    const api = new ApiGatewayLocalClient({
      "/test-fn": {
        fn: handler,
        method: "post",
      },
    });
    api.init(3002);
    const email = "test@gmail.com";
    const response = await call({
      email,
    });
    expect(response.payload).toStrictEqual({
      email,
    });
    const dynamodb = getDynamoDb({ TestTable });
    const ddbresponse = await dynamodb
      .get({
        Key: {
          PKHK: email,
        },
        TableName: TestTable.TableName,
      })
      .promise();
    expect(ddbresponse.Item).toStrictEqual({
      PKHK: email,
    });
    api.server?.close();
    const dbManager = new DynamoDB({ endpoint: "http://localhost:8000", region: "local" });
    await dbManager.deleteTable({ TableName: TestTable.TableName }).promise();
  });
});
