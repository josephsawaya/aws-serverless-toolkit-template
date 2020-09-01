import fs from "fs";
import glob from "glob";
import path from "path";
import { configify } from "./configify";

const { NODE_ENV, AWS_ACCOUNT_ID, DEVNAME } = process.env;
if (process.env.NODE_ENV && ["development", "production", "test"].includes(process.env.NODE_ENV)) {
  const cfg = () => ({
    name: configify("Stack"),
    api: {
      name: configify("Api"),
    },
    NODE_ENV,
    AWS_ACCOUNT_ID,
    DEVNAME,
  });

  glob.sync(path.join(__dirname, "./config/**/**/index.ts")).forEach(function (file) {
    const { config } = require(path.resolve(file));
    console.log(file);
    config();
  });

  fs.writeFileSync(path.join(__dirname, "./config.json"), JSON.stringify(cfg(), null, 2));
} else throw new Error('Bad environment: NODE_ENV is not "development", "production" or "test"');
