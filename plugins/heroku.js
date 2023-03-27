const got = require("got");
const Heroku = require("heroku-client");
const { command, isPrivate, tiny } = require("../lib");
const heroku = new Heroku({ token: process.env.HEROKU_API_KEY });
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
            Authorization: 'Bearer ' + config.HEROKU_API_KEY,
            Accept: 'application/vnd.heroku+json; version=3.account-quotas',
          }
          const res = await got(url, { headers })
          const resp = JSON.parse(res.body)
          const total_quota = Math.floor(resp.account_quota)
          const quota_used = Math.floor(resp.quota_used)
          const percentage = Math.round((quota_used / total_quota) * 100);
          const remaining = total_quota - quota_used
          const quota = `Total Quota : ${ await secondsToHms(total_quota)}
Used  Quota : ${ await secondsToHms(quota_used)}
Remaning    : ${ await secondsToHms(remaining)}
Usage %     : ${ await secondsToDHMS(percentage)}
`
          await message.send('```' + quota + '```')
        })
        .catch(async (error) => {
          return await message.send(`HEROKU : ${error.body.message}`)
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
  //  let {prefix} = message
    
    if (/now/.test(match)) {
      await git.fetch();
      var commits = await git.log([
        config.BRANCH + "..origin/" + config.BRANCH,
      ]);
      if (commits.total === 0) {
        return await message.sendMessage("_Already on latest version_");
      } else {
        await message.treply("_Updating_");

        try {
          var app = await heroku.get("/apps/" + process.env.HEROKU_APP_NAME);
        } catch {
          await message.sendMessage("_Invalid Heroku Details_");

          await new Promise((r) => setTimeout(r, 1000));
        }

        git.fetch("upstream", config.BRANCH);
        git.reset("hard", ["FETCH_HEAD"]);

        var git_url = app.git_url.replace(
          "https://",
          "https://api:" + process.env.HEROKU_API_KEY + "@"
        );

        try {  
          await git.addRemote("heroku", git_url);
        } catch {
          console.log("heroku remote error");
        }
        await git.push("heroku", config.BRANCH);

        await message.sendMessage("UPDATED");
      }
    }
    await git.fetch();
    var commits = await git.log([config.BRANCH + "..origin/" + config.BRANCH]);
    if (commits.total === 0) {
      await message.sendMessage("_Already on latest version_");
    } else {
      var availupdate = "*ᴜᴘᴅᴀᴛᴇs ᴀᴠᴀɪʟᴀʙʟᴇ* \n\n";
      commits["all"].map((commit, num) => {
        availupdate += num + 1 + " ●  " + tiny(commit.message) + "\n";
      });
      return await message.client.sendMessage(message.jid, {
        text: availupdate,
        footer: tiny("click here to update"),
        buttons: [
          {
            buttonId: `${global.prefix}update now`,
            buttonText: { displayText: tiny("update now") },
          },
        ],
      });
    }
  }
);



  command(
    {
      pattern: "updt",
      fromMe: true,
      desc: 'Checks or start bot updates',
      type: 'heroku'
        },
    async (message, match, m) => {
	if (!match || match === 'check') {
		let n = await git.log([config.BRANCH + "..origin/" + config.BRANCH]);


		if (n.total === 0) return await message.sendMessage('_Bot is completely up-to-date!_')
		var up = 'ɴᴇᴡ ᴜᴘᴅᴀᴛᴇ ᴀᴠᴀɪʟᴀʙʟᴇ ғᴏʀ ʙᴏᴛ!\n\nᴄʜᴀɴɢᴇs:\n'
		let no = 1
		n['all'].map((c) => {
			up += '' + no++ + '. ' + '[' + c.date.substring(0, 10) + ']: ' + c.message + '\n';
		});
		let buttons = [{
			buttonId: prefix + 'updt now',
			buttonText: {
				displayText: 'UPDATE START'
			},
			type: 1
		}, ]
		const buttonMessage = {
			text: up,
			footer: 'Click the button to start update',
			buttons: buttons,
			headerType: 1
		}
		await message.client.sendMessage(message.jid, buttonMessage)
	} else if (match === 'start' || match === 'now') {
		let n = await git.log([config.BRANCH + "..origin/" + config.BRANCH]);
		if (!process.env.HEROKU_API_KEY && !process.env.HEROKU_APP_NAME) {
		await git.reset("hard",["HEAD"])
        await git.pull()
        await message.sendMessage('_Updated_')
        await message.sendMessage('_Rebooting..._')
        return require('pm2').restart('index.js');
        }
		if (n === 500) return await message.sendMessage('_Bot is completely up-to-date!_')
		await message.sendMessage('_Build started_')



try{

        try {
          var app = await heroku.get("/apps/" + process.env.HEROKU_APP_NAME);
        } catch {
          await message.sendMessage("_Invalid Heroku Details_");
          await new Promise((r) => setTimeout(r, 1000));
        }
        git.fetch("upstream", config.BRANCH);
        git.reset("hard", ["FETCH_HEAD"]);

        var git_url = app.git_url.replace(
          "https://",
          "https://api:" + process.env.HEROKU_API_KEY + "@"
        );

        try {  
          await git.addRemote("heroku", git_url);
        } catch {
          console.log("heroku remote error");
        }
        await git.push("heroku", config.BRANCH);

        await message.sendMessage("UPDATED");
      }catch(err){

        message.sendMessage('*Your Heroku information is wrong!*')
      }


		if (n === 404) return await message.sendMessage('*Your Heroku information is wrong!*')
		if (n === 408) return await message.sendMessage('_Your account has reached its concurrent builds limit!. Please wait for the other app to finish its deploy_')
		if (n === 200) return await message.sendMessage('_Successfully Updated!_')
	} else {
		let n = await git.log([config.BRANCH + "..origin/" + config.BRANCH]);
		let buttons = [{
				buttonId: prefix + 'updt now',
				buttonText: {
					displayText: 'UPDATE START'
				},
				type: 1
			},
			{
				buttonId: prefix + 'updt check',
				buttonText: {
					displayText: 'UPDATE CHECK'
				},
				type: 1
			}
		]
		const buttonMessage = {
			text: 'Update Manager',
			footer: n == 500 ? '*Bot is up-to-date.*' : n.total + ' New Updates are available',
			buttons: buttons,
			headerType: 1
		}
		await message.client.sendMessage(message.jid, buttonMessage)
	}
});



