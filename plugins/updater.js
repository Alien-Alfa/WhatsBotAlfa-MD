const { command, isPrivate } = require('../lib/');
const Config = require('../config');
const Heroku = require('heroku-client');

const heroku = new Heroku({ token: Config.HEROKU_API_KEY });

command({
    pattern: 'update',
    fromMe: true,
    desc: "Updates bot",
    type: 'owner'
}, async (message, match) => {
    if(!match){
await message.CheckUpdate(message)
} else if(match === "now"){
    try{
        let isHeroku = false; // Adjust based on your conditions
        if (isHeroku) {
            await message.UpdateHeroku(message);
        } else {
            await message.UpdateLocal(message);
        }
    } catch (error) {
      console.error("[Error]:", error);
    }
}
});

