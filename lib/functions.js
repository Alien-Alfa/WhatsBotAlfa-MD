/*const mongoose = require("mongoose");

const userDB = new mongoose.Schema({

  id: { type: String, unique: true, required: true },

  cmd: { type: String }

});

const cmdDB = mongoose.models.cmds || mongoose.model("cmds", userDB);

async function setcmd(hash , newcmd) { 

await cmdDB.find({id: hash}).then(async (iscmd)=> {

if(!iscmd[0]){

await new cmdDB({id: hash , cmd: newcmd }).save()

}else {

await cmdDB.findOneAndUpdate({id: hash , cmd: newcmd})

}

});

return "success"

}

module.exports = { cmdDB , setcmd }*/
