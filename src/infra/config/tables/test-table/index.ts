import fs from "fs";
import path from "path";
import { configify } from "../../../configify";

// eslint-disable-next-line
export const config = () => ({
  TestTable: {
    TableName: configify("TestTable"),
    BillingMode: "PROVISIONED",
    // LocalSecondaryIndexes : [],
    // PointInTimeRecoverySpecification : PointInTimeRecoverySpecification,
    ProvisionedThroughput: {
      // TODO: make these dynamic based on the table; optionally we can scale prod when they get overloaded
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
    // SSESpecification: SSESpecification, // defaults are good in almost all cases
    // StreamSpecification: StreamSpecification, // NOTE: almost certain this isnt available in js sdk
    // Tags : [],
    TimeToLiveSpecification: {
      AttributeName: "TTLATTRIBUTE",
      Enabled: true,
    }, // NOTE: this isnt available throught the js sdk, so createTable can fail
    KeySchema: [
      {
        AttributeName: "PKHK",
        KeyType: "HASH",
      },
    ],
    // GlobalSecondaryIndexes: [
    //   {
    //     IndexName: "GSI1",
    //     KeySchema: [
    //       {
    //         AttributeName: "GSI1PK",
    //         KeyType: "HASH",
    //       },
    //       {
    //         AttributeName: "GSI1SK",
    //         KeyType: "RANGE",
    //       },
    //     ],
    //     Projection: {
    //       NonKeyAttributes: ["projectedData"],
    //       ProjectionType: "INCLUDE",
    //     },
    //     ProvisionedThroughput: {
    //       WriteCapacityUnits: 5,
    //       ReadCapacityUnits: 5,
    //     },
    //   },
    //   {
    //     IndexName: "GSI2",
    //     KeySchema: [
    //       {
    //         AttributeName: "GSI2PK",
    //         KeyType: "HASH",
    //       },
    //       {
    //         AttributeName: "GSI2SK",
    //         KeyType: "RANGE",
    //       },
    //     ],
    //     Projection: {
    //       NonKeyAttributes: ["projectedData"],
    //       ProjectionType: "INCLUDE",
    //     },
    //     ProvisionedThroughput: {
    //       WriteCapacityUnits: 5,
    //       ReadCapacityUnits: 5,
    //     },
    //   },
    // ],
    AttributeDefinitions: [
      {
        AttributeName: "PKHK",
        AttributeType: "S",
      },
      // {
      //   AttributeName: "GSI1PK",
      //   AttributeType: "S",
      // },
      // {
      //   AttributeName: "GSI1SK",
      //   AttributeType: "S",
      // },
      // {
      //   AttributeName: "GSI2PK",
      //   AttributeType: "S",
      // },
      // {
      //   AttributeName: "GSI2SK",
      //   AttributeType: "S",
      // },
    ],
  },
});

fs.writeFileSync(path.resolve(__dirname, "config.json"), JSON.stringify(config(), null, 2));
