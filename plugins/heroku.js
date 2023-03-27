const got = require("got");
const Heroku = require("heroku-client");
const heroku = new Heroku({ token: process.env.HEROKU_API_KEY });
const { command, isPrivate, tiny } = require("../lib");
const baseURI = "/apps/" + process.env.HEROKU_APP_NAME;
const simpleGit = require("simple-git");
const { secondsToDHMS } = require("../lib");
const git = simpleGit();
const exec = require("child_process").exec;
const config = require('../database/settings')

   
command( 
  {
    pattern: "Restart",
    fromMe: true,
    desc: "Restart",
    type: "heroku",

  },  async (message, match, m) => {


  let buttonsntilink = [
     {
        buttonId: `rs`,
        buttonText: {
           displayText: 'Restart'
        },
        type: 1
             },
     {
        buttonId: `reboot`,
        buttonText: {
           displayText: 'Reboot'
        },
        type: 1
             }
    ]

  let buttonMessage = {
     text: `Restart bot
Reboot service`,
     footer: 'process.env.FOOTER',
     buttons: buttonsntilink,
     headerType: 2
  }

  return await message.client.sendMessage(message.jid, buttonMessage)

})


command(
  {
    pattern: "reboot",
    fromMe: true,
    desc: "Restart Dyno",
    type: "heroku",

  },
  async (message, match, m) => {
    await message.sendMessage(`_Restarting_`);
    await heroku.delete(baseURI + "/dynos").catch(async (error) => {
      await message.sendMessage(`HEROKU : ${error.body.message}`);
    });
  }
);

command({
    pattern: "rs",
  fromMe: true,
  desc: "Restart Index",
  type: "heroku",
},
async (message, match, m) => {
   await message.sendMessage(`_Restarting..._`) 

   return process.send('reset')
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
  async (message, match, m) => {
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
    pattern: 'dyno',
    fromMe: true,
    desc: 'Show Quota info',
    type: 'heroku',
  },
  async (message, match) => {
    try {
      heroku
        .get('/account')
        .then(async (account) => {
          const url = `https://api.heroku.com/accounts/${account.id}/actions/get-quota`
          headers = {
            'User-Agent': 'Chrome/80.0.3987.149 Mobile Safari/537.36',
            Authorization: 'Bearer ' + process.env.HEROKU_API_KEY,
            Accept: 'application/vnd.heroku+json; version=3.account-quotas',
          }
          const res = await got(url, { headers })
          const resp = JSON.parse(res.body)
          const total_quota = Math.floor(resp.account_quota)
          const quota_used = Math.floor(resp.quota_used)
          const percentage = Math.round((quota_used / total_quota) * 100);
          const remaining = total_quota - quota_used
          const quota = `Total Quota : ${ await secondsToDHMS(total_quota).toLowerCase().replace(" ","")}
Used  Quota : ${ await secondsToDHMS(quota_used).toLowerCase().replace(" ","")}
Remaning    : ${ await secondsToDHMS(remaining).toLowerCase().replace(" ","")}
Usage %     : ${ await secondsToDHMS(percentage).toLowerCase().replace(" ","")}
`
          await message.sendMessage('```' + quota + '```')
        })
        .catch(async (error) => {
          return await message.sendMessage(`HEROKU : ${error}`)
        })
    } catch (error) {
      await message.send(error)
    }
  }
)



command(
  {
    pattern: "setvar ",
    fromMe: true,
    type: "heroku",
    desc: "Set heroku env",
    type: "heroku",
  },
  async (message, match, m) => {
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
        await message.sendMessage(`HEROKU : ${error.body.message}`);
      });
  }
);



command(
  {
    pattern: "delvar ",
    fromMe: true,
    type: "heroku",
    desc: "Delete Heroku env",
    type: "heroku",
  },
  async (message, match, m) => {
    if (!match) return await message.sendMessage(`_Example: delvar sudo_`);
    heroku
      .get(baseURI + "/config-vars")
      .then(async (vars) => {
        const key = match.trim().toUpperCase();
        if (vars[key]) {
          await heroku.patch(baseURI + "/config-vars", {
            body: {
              [key]: null,
            },
          });
          return await message.sendMessage(`_Deleted ${key}_`);
        }
        await message.sendMessage(`_${key} not found_`);
      })
      .catch(async (error) => {
        await message.sendMessage(`HEROKU : ${error.body.message}`);
      });
  }
);



command(
  {
    pattern: "getvar ",
    fromMe: true,
    type: "heroku",
    desc: "Show heroku env",
    type: "heroku",
  },
  async (message, match, m) => {
    if (!match) return await message.sendMessage(`_Example: getvar sudo_`);
    const key = match.trim().toUpperCase();
    heroku
      .get(baseURI + "/config-vars")
      .then(async (vars) => {
        if (vars[key]) {
          return await message.sendMessage(
            "_{} : {}_".replace("{}", key).replace("{}", vars[key])
          );
        }
        await message.sendMessage(`${key} not found`);
      })
      .catch(async (error) => {
        await message.sendMessage(`HEROKU : ${error.body.message}`);
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
  async (message, match, m) => {
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
    pattern: "update",
    fromMe: true,
    type: "heroku",
    desc: "check for update",
  },
  async (message, match, m) => {
    if (/now/.test(match)) {
      UpdateNow(message)
    }
    await git.fetch();
    var commits = await git.log([config.BRANCH + "..origin/" + config.BRANCH]);
    if (commits.total === 0) {
      await message.sendMessage("_𝘈𝘭𝘳𝘦𝘢𝘥𝘺 𝘰𝘯 𝘭𝘢𝘵𝘦𝘴𝘵 𝘷𝘦𝘳𝘴𝘪𝘰𝘯_");
    } else {
      CheckUpdate(message)
    }
  }
);




