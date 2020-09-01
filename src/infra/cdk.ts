import path from "path";
import * as CDK from "@aws-cdk/core";
import * as DynamoDB from "@aws-cdk/aws-dynamodb";
import * as Lambda from "@aws-cdk/aws-lambda";
import * as ApiGateway from "@aws-cdk/aws-apigateway";
import { name } from "../infra/config.json";
import { TestTable } from "./config/tables/test-table/config.json";
import { RemovalPolicy } from "@aws-cdk/core";

class App extends CDK.Stack {
  constructor(app: CDK.App, id: string, props?: CDK.StackProps) {
    super(app, id, props);

    const testApi = new ApiGateway.RestApi(this, "testApi", {});

    const testTable = new DynamoDB.Table(this, "testTable", {
      billingMode: DynamoDB.BillingMode.PROVISIONED,
      partitionKey: {
        name: "PKHK",
        type: DynamoDB.AttributeType.STRING,
      },
      sortKey: {
        name: "PKRK",
        type: DynamoDB.AttributeType.STRING,
      },
      tableName: TestTable.TableName,
      readCapacity: 5,
      writeCapacity: 5,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const testFn = new Lambda.Function(this, "TestFn", {
      code: new Lambda.AssetCode(path.join(__dirname, "../../build/functions/test-fn")),
      handler: "index.handler",
      runtime: Lambda.Runtime.NODEJS_12_X,
    });

    testTable.grantReadWriteData(testFn);

    const testFnInteg = new ApiGateway.LambdaIntegration(testFn);

    const testFnRs = testApi.root.addResource("test-fn");

    testFnRs.addMethod("POST", testFnInteg);
  }
}

const app = new CDK.App();
new App(app, name);
app.synth();
