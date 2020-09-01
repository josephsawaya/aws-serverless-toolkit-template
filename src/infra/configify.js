const uuidv4 = require("uuid").v4;

const { NODE_ENV, DEVNAME, AWS_ACCOUNT_ID, PROJECT_NAME } = process.env;

if (!AWS_ACCOUNT_ID) throw "Missing AWS_ACCOUNT_ID";

const safetySalt = "854bd253";

function salt() {
  return uuidv4().substr(0, 8);
}

function configify(resourceName) {
  switch (NODE_ENV) {
    case "production":
      return `${resourceName}-${PROJECT_NAME}-Prod-${safetySalt}`;
    case "development":
      if (!DEVNAME) throw "Missing DEVNAME";
      // We deploy dev stacks over our own accounts (each developer has a dev stack which gets updated)
      return `${resourceName}-${PROJECT_NAME}-Dev-${safetySalt}-${DEVNAME}`;
    case "test":
      return `${resourceName}-BGPC-Test-${safetySalt}-Test-${salt()}`;
  }

  throw "Bad environment";
}

module.exports = {
  configify,
  salt,
  safetySalt,
};
