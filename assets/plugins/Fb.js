const {command , getBuffer, isPrivate} = require("../../lib");
const  dl = require("@xaviabot/fb-downloader");
const fetch = require("node-fetch");
 command({
 pattern: "fb",
 on: "text",
 fromMe: isPrivate,  
 desc: "fb downloader"
},

async(message , match)=>{
try{
    match = match || message.reply_message.text;
if(!match.includes("facebook.com")) return;
await message.reply("_Downloading..._");
// Regular expression to match the URL
const regex = /(https?:\/\/[^\s]+)/;
const link = match.match(regex);
let {sd , hd ,thumbnail, title}= await dl(link[0]);
let img = await getBuffer("https://avatars.githubusercontent.com/u/64305844?v=4");
if(match.split(";")[1] == "hd"){
 await message.client.sendMessage(message.jid , {video: {url: hd} , caption: "[Quality: HD]\n\n"+title , thumbnail: img }, {quoted: message});
}
 

let rs = await (await fetch(sd)).buffer();

await message.client.sendMessage(message.jid , {video:  rs, caption: "[Quality: SD]\n\n"+title , thumbnail: img }, {quoted: message});
}catch(e){
await message.reply(`
*[Download Failed]*
[Error]: ${e}*
`)
}
});

