/*const {command, isPrivate} = require ("../lib")
const truecallerjs = require('truecallerjs');
const fs = require("fs-extra")

command(
        {
           pattern: 'true',
           fromMe: isPrivate,  
           desc: 'spoof',
           type: 'mics',
        },
        async (message,match) => {
if(!(match || message.reply_message.jid)) return await message.reply("i need something");
if(match.includes(`@`)) return await match.replace(`@`, ``);
let nums = match || (message.reply_message.jid).split("@")[0] || match
var searchData = {
    number: `"${nums}"`,
    countryCode: "IN",
    installationId: "a1i0T--bmJjUYFOFLAbTgVtxBwANfr7Qg4DXomaBqjh0XB4Q3nzPKlgAT6_HpPfP",
    output: "JSON"
}

var sn = truecallerjs.searchNumber(searchData);
sn.then(async function(response) {
    let r = response
  let {name , score , access } = r.data[0]
  let {e164Format , numberType ,dialingCode , carrier, countryCode} = r.data[0].phones[0]

message.reply(`
╭─❏ ❮ 𝑆𝐸𝐴𝑅𝐶𝐻 𝑅𝐸𝑆𝑈𝐿𝑇 ❯ ❏
│-𝑁𝐴𝑀𝐸: ${name}
│-𝑁𝑈𝑀𝐵𝐸𝑅: ${e164Format}
│-𝐶𝑂𝐷𝐸: ${dialingCode}
│-𝐶𝑂𝑈𝑁𝑇𝑅𝑌: ${countryCode}
│-𝑆𝐶𝑂𝑅𝐸: ${score}
│-𝐶𝐴𝑅𝑅𝐼𝐸𝑅: ${carrier}
│-𝑇𝑌𝑃𝐸: ${numberType}
╰─❏`);
});


});
*/
