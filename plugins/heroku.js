/*const got = require("got");
const Heroku = require("heroku-client");
const { command, isPrivate, tiny } = require("../lib/");
const Config = require("../config");
const heroku = new Heroku({ token: Config.HEROKU_API_KEY });
const { PassThrough } = require('stream');
const simpleGit = require("simple-git");
const git = simpleGit();
const exec = require("child_process").exec;


function secondsToDhms(seconds) {
        seconds = Number(seconds);
        var h = Math.floor(seconds % (3600*24) / 3600);
        var m = Math.floor(seconds % 3600 / 60);
        var s = Math.floor(seconds % 60);
        
        var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
        var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
        var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
        return hDisplay + mDisplay + sDisplay;
        }

let baseURI = "/apps/" + Config.HEROKU_APP_NAME;


command(
  {
    pattern: "restart",
    fromMe: true,  
    type: "heroku",
    desc: "Restart Dyno",
    type: "heroku",
  },
  async (message) => {
    await message.sendMessage(`_Restarting_`);
    await heroku.delete(baseURI + "/dynos").catch(async (error) => {
      await message.sendMessage(`HEROKU : ${error.body.message}`);
    });
  }
);


command(
  {
    pattern: "shutdown",
    fromMe: true,  
    type: "heroku",
    desc: "Dyno off",
    type: "heroku",
  },
  async (message) => {
    await heroku
      .get(baseURI + "/formation")
      .then(async (formation) => {
        await message.sendMessage(`_Shutting down._`);
        await heroku.patch(baseURI + "/formation/" + formation[0].id, {
          body: {
            quantity: 0,
          },
        });
      })
      .catch(async (error) => {
        await message.sendMessage(`HEROKU : ${error.body.message}`);
      });
  }
);


command(
  {
    pattern: "dyno",
    fromMe: true,  
    desc: "Show Quota info",
    type: "heroku",
  },
  async (message) => {
    try {
      heroku
        .get("/account")
        .then(async (account) => {
          const url = "https://api.heroku.com/accounts/" + account.id + "/actions/get-quota";

          headers = {
            "User-Agent": "Chrome/80.0.3987.149 Mobile Safari/537.36",
                "Authorization": "Bearer " + Config.HEROKU_API_KEY,
                "Accept": "application/vnd.heroku+json; version=3.account-quotas",       
      };
          const res = await got(url, { headers });
          const resp = JSON.parse(res.body);
          const total_quota = Math.floor(resp.account_quota);
          const quota_used = Math.floor(resp.quota_used);
          const remaining = total_quota - quota_used;
          const quota = `Total Quota : ${secondsToDhms(total_quota)}
Used  Quota : ${secondsToDhms(quota_used)}
Remaning    : ${secondsToDhms(remaining)}`;
          await message.sendMessage("```" + quota + "```");
        })
        .catch(async (error) => {
          return await message.sendMessage(`HEROKU : ${error.message}`);
        });
    } catch (error) {
      await message.sendMessage(error.message);
    }
  }
);


command(
  {
    pattern: "setvar ",
    fromMe: true,  
    type: "heroku",
    desc: "Set heroku env",
    type: "heroku",
  },
  async (message, match) => {
    if (!match)
      return await message.sendMessage(`_Example: .setvar SUDO:918113921898_`);
    const [key, value] = match.split(":");
    if (!key || !value)
      return await message.sendMessage(`_Example: .setvar SUDO:918113921898_`);
    heroku
      .patch(baseURI + "/config-vars", {
        body: {
          [key.toUpperCase()]: value,
        },
      })
      .then(async () => {
        await message.sendMessage(`_${key.toUpperCase()}: ${value}_`);
      })
      .catch(async (error) => {
        await message.sendMessage(`HEROKU : ${error.message}`);
      });
  }
);

command(
  {
    pattern: "allvar",
    fromMe: true,  
    type: "heroku",
    desc: "Heroku all env",
    type: "heroku",
  },
  async (message) => {
    let msg = "```Here your all Heroku vars\n\n\n";
    heroku
      .get(baseURI + "/config-vars")
      .then(async (keys) => {
        for (const key in keys) {
          msg += `${key} : ${keys[key]}\n\n`;
        }
        return await message.sendMessage(msg + "```");
      })
      .catch(async (error) => {
        await message.sendMessage(`HEROKU : ${error.body.message}`);
      });
  }
);


command(
{
pattern : "update",
fromMe: true,  
desc : "hem",
type : "update",
 },
 
 async (message, match) => {
 	await git.fetch();
    var commits = await git.log(['master' + '..origin/' + 'master']);
    if (commits.total === 0) {
        return await message.client.sendMessage(message.jid, { text:"_Bot up to date_"})

    } else {
        await message.client.sendMessage(message.jid, { text:"_Started update.._"})

            try {
                var app = await heroku.get('/apps/' + Config.HEROKU_APP_NAME)
            } catch {
                await message.client.sendMessage(message.jid, { text:"Heroku information wrong!"})
                
            }
            git.fetch('upstream', 'master');
            git.reset('hard', ['FETCH_HEAD']);

            var git_url = app.git_url.replace(
                "https://", "https://api:" + Config.HEROKU.API_KEY + "@"
            )
            
            try {
                await git.addRemote('heroku', git_url);
            } catch { console.log('heroku remote ekli'); }
            await git.push('heroku', 'master');

            await message.client.sendMessage(message.jid, { text:"_Successfully updated_"})
           await message.client.sendMessage(message.jid, { text:"_Restarting_"})
            }

  });
  */
