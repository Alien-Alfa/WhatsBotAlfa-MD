/*

const { command, isPrivate , Writer , getBuffer, getJson} = require("../lib");
const fs = require("fs-extra");
const yts  = require("yt-search");
const ytdl = require('ytdl-core');
const { Readable } = require('stream');
const ffmpeg = require("../lib/myffmpeg");
const canvacord = require('canvacord')
const fetch = require('node-fetch')
const axios = require("axios");


const got = require("got");
const { createWriteStream } = require("fs");


const getRandom = (text) => {
    return `${Math.floor(Math.random() * 10000)}${text}`
}
const mYtId = (query) => {
const ytIdRegex =
	/(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:watch\?.*(?:|\&)v=|embed|shorts\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/
let yturlm = query.match(ytIdRegex)
  return yturlm
}
const getInstagramId = (query) => {
    const instagramIdRegex =
        /(?:http(?:s|):\/\/|)(?:www\.|)instagram\.com\/(?:p|tv|reel)\/([-_0-9A-Za-z]{11})/
    let instagramUrlMatch = query.match(instagramIdRegex);
    return instagramUrlMatch;
};

//


command(
  {
    pattern: "song",
    fromMe: true,  
    type: "downloader",
  },
  async (message, match) => {
    match = match || message.reply_message.text;

    if (!match) return await message.reply("_Enter Song Name_");

    // await message.reply(`User: ${message.pushName}\nRequest: ${match}`);
    let mes = await message.reply(message.jid, { text: "_Searching..._" });

    try {
      const res = await axios.get(`https://api-viper-x.koyeb.app/api/song?name=${match}`);
      const response = res.data;

      message.client.sendMessage(message.jid, { text: `_Downloading: ${response.data.title}_`, edit: mes.key });

      const songbuff = await (await fetch(response.data.downloadUrl)).buffer();

      await message.client.sendMessage(message.jid, { audio: songbuff, mimetype: 'audio/mpeg' }, { quoted: mes });
    } catch (error) {
      console.error(error);
      await message.client.sendMessage(message.jid, { text: "_Error downloading the song_" }, { quoted: mes });
    }
  }
);

command(
  {
    pattern: "video",
    fromMe: true,  
    type: "downloader",
  },
  async (message, match) => {
    let vids = await yts(match)
    let { title , image } = await vids.all[0]
    match = match || message.reply_message.text;
    if (!match) return await message.reply("_Enter Video Name_");
    let im = await getBuffer(image)
    const dMp4 = async (Link ) => {
    	try{
    		await ytdl.getInfo(Link);
    		let mp4File = getRandom('.mp4') 
    		ytdl(Link, {filter: 'audioandvideo', quality: 'lowestvideo' })
     
.pipe(fs.createWriteStream('./media/'+mp4File))
.on("finish", async () => {    
await message.sendMessage(
          fs.readFileSync('./media/'+mp4File),
          { quoted: message , 
            caption: `${vids.all[0].title}`,
            jpegThumbnail: im
          }, 
          "video"
        );
fs.unlinkSync('./media/'+mp4File)
        })       
        } catch (err){
//console.log(err)
}
}
var videoId = await mYtId(match)
if (videoId !== null){
	let Link = 'https://youtu.be/' + videoId[1]
	dMp4(Link)
	} else {
		let search = await yts(match)  
		dMp4(search.all[0].url)
	}
}
);



command({
  pattern: "ig ?(.*)",
  fromMe: true,  
  desc: "downloads video from instagram",
  type: "downloader",
}, async (message, match, m) => {
  match = match || message.reply_message.text;
if (!match) return await message.reply("*_Need Text_*");
let img = await getBuffer("https://avatars.githubusercontent.com/u/64305844?v=4")
const instagramId = getInstagramId(match);

if (instagramId !== null) {
    let link = 'https://www.instagram.com/p/' + instagramId[1] + '/';
    let api = await `https://api.akuari.my.id/downloader/igdl?link=${link}`
    let tts = await getJson(api)	
    await message.client.sendMessage(message.jid , {video:  { url: tts.respon[0] }, caption:"Instagram Downloader" , thumbnail: img });
  
}


});


module.exports = {
  name: "ytmp3",
  alias: ["mp3"],
  category: "downloader",
  desc: "download music from YouTube",
  async run({msg, conn},{q, prefix}){
   if (!q) return msg.reply('pleas enter valid youtube link', {adReply: true})







(async () => {
  try {

    conn.sendMessage(msg.from, {audio: buffer, mimetype: 'audio/mpeg'}, {quoted: msg})
  } catch (err) {
    return err
  }
})();
}}


*/