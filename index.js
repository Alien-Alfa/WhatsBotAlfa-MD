const fs = require("fs").promises;
const fsx = require("fs");
const path = require("path");
const config = require("./config");
const connect = require("./lib/connection");
const { getandRequirePlugins } = require("./assets/database/plugins");
const { UpdateLocal, WriteSession} = require("./lib");

global.__basedir = __dirname;

async function auth() {
  try{
    if (!fsx.existsSync("./session/creds.json")) {
      const id = config.SESSION_ID;
      if (id === "") return;
      return await WriteSession(id).then(() => {
          return initialize();
      });
  } else if (fsx.existsSync("./session/creds.json")) {
    return initialize();
  }
} catch (error) {
  return console.error("AuthFile Generation Error:", error);
}
}
auth()
const readAndRequireFiles = async (directory) => {
  try {
    const files = await fs.readdir(directory);
    return Promise.all(
      files
        .filter((file) => path.extname(file).toLowerCase() === ".js")
        .map((file) => require(path.join(directory, file)))
    );
  } catch (error) {
    return console.error("Error reading and requiring files:", error);
  }
};

async function initialize() {
 
  console.log("============> Aurora-MD [Alien-Alfa] <============");
  try {
    await readAndRequireFiles(path.join(__dirname, "/assets/database/"));
    console.log("Syncing Database");

    await config.DATABASE.sync();

    console.log("⬇  Installing Plugins...");
    await readAndRequireFiles(path.join(__dirname, "/assets/plugins/"));
    await getandRequirePlugins();
    console.log("✅ Plugins Installed!");

    return  await connect();
  } catch (error) {
    console.error("Initialization error:", error);
    return process.exit(1); // Exit with error status
  }
}




