const simpleGit = require('simple-git');
const git = simpleGit();
const { command, isPrivate } = require('../lib/');
const Config = require('../config');
const { exec } = require('child_process');
const Heroku = require('heroku-client');
const { PassThrough } = require('stream');

const heroku = new Heroku({ token: Config.HEROKU_API_KEY });

command({
    pattern: 'update',
    fromMe: isPrivate,
    desc: "Updates bot",
    type: 'owner'
}, async (message, match) => {
    try {
        console.log('Updating bot...');

        // Fetching latest changes from the remote repository
        await git.fetch();

        // Retrieving commit log
        const commits = await git.log(['main' + '..origin/' + 'main']);
        let mss = '';

        if (commits.total === 0) {
            // Bot is up to date
            mss = "_Bot up to date!_";
            await message.reply(mss + "\n\n Type *UpdateNow* to start Update");
        } else {
            // Constructing a changelog message
            let changelog = "_Pending updates:_\n\n";
            for (let i in commits.all) {
                changelog += `${(parseInt(i) + 1)}• *${commits.all[i].message}*\n`;
            }
            mss = changelog;

            // Sending changelog message
            const buttonMessage = {
                text: mss,
                footer: 'ᴜᴘᴅᴀᴛᴇ ᴄʜᴇᴄᴋᴇʀ',
                headerType: 1
            };
            await message.client.sendMessage(message.jid, buttonMessage);
        }

        console.log('Update process completed.');

    } catch (error) {
        console.error('Error in update command:', error);
        await message.reply('An error occurred during the update process.');
    }
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
        await UpdateHeroku(message);
    } else {
        await UpdateLocal(message);
    }
});

async function UpdateLocal(message) {
    try {
        await git.fetch();
        const commits = await git.log(['main' + '..origin/' + 'main']);

        if (commits.total === 0) {
            return await message.client.sendMessage(message.jid, { text: "_Bot up to date_" });
        } else {
            await message.client.sendMessage(message.jid, { text: "_Started update.._" });

            // Git pull to update files
            await new Promise((resolve, reject) => {
                exec('git pull origin main', (error, stdout, stderr) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(stdout);
                    }
                });
            });

            await message.client.sendMessage(message.jid, { text: "_Successfully updated_" });
            await message.client.sendMessage(message.jid, { text: "_Restarting_" });
            return await process.send("reset");
        }
    } catch (error) {
        console.error("Error during update:", error);
        await message.client.sendMessage(message.jid, { text: "_Update failed_" });
    }
}

async function UpdateHeroku(message) {
    try {
        await git.fetch();
        const commits = await git.log(['main' + '..origin/' + 'main']);

        if (commits.total === 0) {
            return await message.client.sendMessage(message.jid, { text: "_Bot up to date_" });
        } else {
            await message.client.sendMessage(message.jid, { text: "_Started update.._" });

            try {
                const app = await heroku.get('/apps/' + Config.HEROKU_APP_NAME);
            } catch (error) {
                console.error("Error getting Heroku app information:", error);
                await message.client.sendMessage(message.jid, { text: "_Heroku information retrieval failed_" });
                await new Promise(r => setTimeout(r, 1000));
            }

            // Fetch and reset using git commands
            git.fetch('upstream', 'main');
            git.reset('hard', ['FETCH_HEAD']);

            const git_url = app.git_url.replace(
                "https://", "https://api:" + Config.HEROKU_API_KEY + "@"
            );

            try {
                await git.addRemote('heroku', git_url);
            } catch (error) {
                console.log('heroku remote already added');
            }

            await git.push('heroku', 'main');

            await message.client.sendMessage(message.jid, { text: "_Successfully updated_" });
            await message.client.sendMessage(message.jid, { text: "_Restarting_" });
        }
    } catch (error) {
        console.error("Error during Heroku update:", error);
        await message.client.sendMessage(message.jid, { text: "_Heroku update failed_" });
    }
}
