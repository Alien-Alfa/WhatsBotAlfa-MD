const { command, isPrivate } = require('../lib/');
const Config = require('../config');
const Heroku = require('heroku-client');

const heroku = new Heroku({ token: Config.HEROKU_API_KEY });

command({
    pattern: 'update',
    fromMe: isPrivate,
    desc: "Updates bot",
    type: 'owner'
}, async (message, match) => {
await message.CheckUpdate(message)
});

command({
    pattern: 'updatenow',
    fromMe: isPrivate,
    desc: "Updates bot",
    dontAddCommandList: true,
    type: 'owner'
}, async (message, match) => {
    let isHeroku = false; // Adjust based on your conditions

    if (isHeroku) {
        await message.UpdateHeroku(message);
    } else {
        await message.UpdateLocal(message);
    }
});

