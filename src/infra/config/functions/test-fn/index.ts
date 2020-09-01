import fs from "fs";
import path from "path";
import { configify } from "../../../configify";

// eslint-disable-next-line
export const config = () => ({
  testFn: {
    name: configify("RevokeSessions"),
  },
});

fs.writeFileSync(path.join(__dirname, "./config.json"), JSON.stringify(config(), null, 2));
