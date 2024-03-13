const {command , getBuffer, isPrivate} = require("../lib");
const  dl = require("@xaviabot/fb-downloader");
const fetch = require("node-fetch");
 command({
 pattern: "fb",
 on: "text",
 fromMe: true,  
 desc: "fb downloader"
},

async(message , match)=>{
try{
if(!match.includes("facebook.com")) return;
await message.reply("downloading please wait ⏳");
let {sd , hd ,thumbnail}= await dl(match);
let img = await getBuffer(thumbnail);
if(match.split(";")[1] == "hd"){
 await message.client.sendMessage(message.jid , {video: {url: hd} , caption:"Supported by Tshephang 🖤" , thumbnail: img }, {quoted: message});
}
 

let rs = await (await fetch(sd)).buffer();

await message.client.sendMessage(message.jid , {video:  rs, caption:"Supported by Tshephang 🖤" , thumbnail: img }, {quoted: message});
}catch(e){
await message.reply(`
*Download failed 
Error: ${e}*
`)
}
});

