const simpleGit = require('simple-git');
const git = simpleGit();
const {Module, isPrivate} = require('../lib/');
const Config = require('../config');
const exec = require('child_process').exec;
const Heroku = require('heroku-client');
const { PassThrough } = require('stream');
const heroku = new Heroku({ token: Config.HEROKU_API_KEY })
Module({
    pattern: 'update',
    fromMe: isPrivate,  
    desc: "Updates bot",
    type: 'owner'
}, (async (message, match) => {
     await git.fetch();
    var commits = await git.log(['main' + '..origin/' + 'main']);
    var mss = '';
    if (commits.total === 0) {
        mss = "_Bot up to date!_"
        return await message.reply(mss+"\n\n Type *UpdateNow* to start Update");
    } else {
        var changelog = "_Pending updates:_\n\n";
        for (var i in commits.all){
        changelog += `${(parseInt(i)+1)}• *${commits.all[i].message}*\n`
    }
        mss = changelog;
          mss = changelog;
        var buttons = [{buttonId: '.updut', buttonText: {displayText: 'START UPDATE'}, type: 1}]
    }
          const buttonMessage = {
              image: {url: 'https://i.imgur.com/biqxAoi.jpeg'},
              caption: mss,
              footer: 'ᴜᴘᴅᴀᴛᴇ ᴄʜᴇᴄᴋᴇʀ',
              headerType: 1
          }
    return await message.client.sendMessage(message.jid, buttonMessage)   
}));
  
Module({pattern: 'updatenow',type: 'owner', fromMe: isPrivate,  dontAddCommandList: true, desc: "Updates bot"}, (async (message, match) => {
    await git.fetch();
    var commits = await git.log(['main' + '..origin/' + 'main']);
    if (commits.total === 0) {
        return await message.client.sendMessage(message.jid, { text:"_Bot up to date_"})

    } else {
        await message.client.sendMessage(message.jid, { text:"_Started update.._"})

            try {
                var app = await heroku.get('/apps/' + Config.HEROKU_APP_NAME)
            } catch {
                await message.client.sendMessage(message.jid, { text:"Heroku information wrong!"})

                await new Promise(r => setTimeout(r, 1000));
            }
            git.fetch('upstream', 'main');
            git.reset('hard', ['FETCH_HEAD']);

            var git_url = app.git_url.replace(
                "https://", "https://api:" + Config.HEROKU_API_KEY + "@"
            )
            
            try {
                await git.addRemote('heroku', git_url);
            } catch { console.log('heroku remote ekli'); }
            await git.push('heroku', 'main');

            await message.client.sendMessage(message.jid, { text:"_Successfully updated_"})
           await message.client.sendMessage(message.jid, { text:"_Restarting_"})
            }
}));


