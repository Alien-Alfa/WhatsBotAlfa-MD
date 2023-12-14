const { command, isPrivate , Writer , getBuffer, getJson} = require("../lib");
const fs = require("fs-extra");
const yts  = require('ytdl-core');
const ytdl = require('ytdl-core');
const { Readable } = require('stream');
const ffmpeg = require("../lib/myffmpeg");
const canvacord = require('canvacord')
const fetch = require('node-fetch')


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
    fromMe: isPrivate,  
    type: "downloader",
  },
  async (message, match) => {
    match = match || message.reply_message.text;

    if (!match) return await message.reply("_Enter Song Name_");
   //await message.reply(`User: ${message.pushName}\nRequest: ${match}`)

    
let f = await  yts(match)
let { title, image, author, description } = await f.all[0]

const card = await new canvacord.Spotify()
.setAuthor(author.name)
.setAlbum(author.name)
.setStartTimestamp(1)
.setEndTimestamp(179000)
.setBackground('COLOR', '#A30000')
.setImage(image)
.setTitle(title)

await await message.client.sendMessage(
  message.jid,
  {
      image: await card.build(),
      caption: await title.split(',')[0],
  }
)

const stream2buffer = async (stream) => {
 const chunks = [];
 return new Promise((resolve, reject) => {
  stream.on('data', (chunk) => {
   chunks.push(chunk);
  });
  stream.on('end', () => {
   const buffer = Buffer.concat(chunks);

   resolve(buffer);
  });
  stream.on('error', (err) => {
   reject(err);
  });
 });
};
const downloadMp3 = async (url) => {
 const stream = ytdl(url, {
  filter: 'audioonly',
  quality: 'highestaudio'
 });
 const buffer = await stream2buffer(stream);
 return buffer;
};
    const buffer = await downloadMp3(q);











let COOKIE = `JgFbgOwmjr0TuuGL/A6wKGiRkvCEIiYXXj;88KhdW2GFHKvrnCW/AZPkJoHsDEffqPQ6_;88KhdW2GFHKvrnCW/AZPkJoHsDEffqPQ6_;88KhdW2GFHKvrnCW/AZPkJoHsDEffqPQ6_;VAhsr5JTgy-5zvJLLGBBPXRyKuFBMTFxpzwbCfjg9gExSsLyhU4u9gDfoTtILu_8Zioc6A.;AFvIBn8biMT7vVMETEipYjsCAXtzCMDFmqLSooQH3dmntpOIT_3Jpb4NpDkGRrXIJXsZPwnQBA`    
const dMp3 = async (Link ) => {
    	try{
    	 
    	 

let im = await getBuffer(image)

 
const logo = await getBuffer("https://avatars.githubusercontent.com/u/64305844?v=4") 	

            await message.client.sendMessage(message.jid, {
                audio: buffer,
                mimetype: 'audio/mpeg',
                ptt: true,
                waveform: ["00","99","00","99","00","99","00"],
                contextInfo: {
                  externalAdReply: {
                  title: "YT Downloader",
                  body: "ᴠᴏɪᴄᴇ : ▮▮▮▮▮▮▯▯▯",
                  mediaType: 1,
                  thumbnail: logo,
                  mediaUrl: 'https://www.instagram.com/alienalfa',
                  sourceUrl: 'https://www.instagram.com/alienalfa',
                  }
              }})
            await fs.unlinkSync('./media/MOD'+mp3File)
            await fs.unlinkSync('./media/'+mp3File)
	
	
         

        } catch (err){
message.reply(err)
}
}
var songId = await mYtId(match)
if (songId !== null){
	let Link = 'https://youtu.be/' + songId[1]
	dMp3(Link)
	} else {
		let search = await yts(match)  
		dMp3(search.all[0].url)
	}
}
);
command(
  {
    pattern: "video",
    fromMe: isPrivate,  
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
  fromMe: isPrivate,  
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