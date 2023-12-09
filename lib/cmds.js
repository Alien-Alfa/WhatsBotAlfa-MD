/*const mongoose = require("mongoose");

const userDB = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  cmd: { type: String }
});

const cmdDB = mongoose.models.cmds || mongoose.model("cmds", userDB);

async function setcmd(hash, newcmd) {
  try {
    const existingCmd = await cmdDB.findOne({ id: hash });

    if (!existingCmd) {
      await new cmdDB({ id: hash, cmd: newcmd }).save();
    } else {
      await cmdDB.deleteMany({ id: hash });
    }

    return "success";
  } catch (error) {
    console.error("Error setting cmd:", error);
    throw error;
  }
}

module.exports = { cmdDB, setcmd };
*/
