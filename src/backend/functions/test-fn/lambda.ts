import {
  given,
  Given,
  apiGatewayLambda,
  ApiGatewayEvent,
  ApiGatewayResponse,
  decodeBody,
  Tested,
  success,
  ApiGatewayBusinessResponseBody,
} from "@bgpc/aws-serverless-toolkit";
import { getDynamoDb } from "@/backend/providers/dynamodb";
import { TestTable } from "@/infra/config/tables/test-table/config.json";

export type RequestBody = {
  email: string;
};

export const tested: Tested<RequestBody> = {
  email: {
    test: (value?: string): boolean => {
      if (value !== undefined) return value.length > 10;
      return false;
    },
  },
};

export type SuccessfulResponsePayload = {
  email: string;
};

export type PossibleErrorPayloads = Given<RequestBody>;

export type ResponsePayload = ApiGatewayBusinessResponseBody<
  SuccessfulResponsePayload,
  PossibleErrorPayloads
>;

export async function main(event: ApiGatewayEvent): Promise<ApiGatewayResponse> {
  const body = decodeBody<RequestBody>(event.body);
  if (given<RequestBody>(body, tested)) {
    const { email } = body;
    const dynamodb = getDynamoDb({ TestTable });
    await dynamodb
      .put({
        Item: {
          PKHK: email,
        },
        TableName: TestTable.TableName,
      })
      .promise();
    return success<SuccessfulResponsePayload>({
      email,
    });
  }
}

export const handler = apiGatewayLambda(main);
