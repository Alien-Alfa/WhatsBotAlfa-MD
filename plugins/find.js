const {command , isPrivate , getBuffer} = require("../lib/");
const ytsr = require('ytsr');
const acrcloud = require("acrcloud")

command(
{
pattern : "find",
fromMe: true,  
desc : "yts player",
type : "music",
 },
 
 async (message, match, m) => {
  try{
 if (!m.quoted.message.videoMessage && !m.quoted.message.audioMessage)
      return await message.sendMessage("*Need Video! Or Audio*");
	
 let buff = await m.quoted.download()
try{
 	const acr = new acrcloud({
  host: "identify-eu-west-1.acrcloud.com",
  access_key: "df8c1cffbfa4295dd40188b63d363112",
  access_secret: "d5mygczEZkPlBDRpFjwySUexQM26jix0gCmih389"
});


let res = await acr.identify(buff)


let {code , msg}  = res.status
if(code !== 0) return await message.reply(msg)

let {title , name , album} = res.metadata.music[0]
    
const {tilte , url , bestThumbnail , id } = await syt(album?.name)
let im = await getBuffer(bestThumbnail.url)
    let  text = ` 
Title : ${title}
Link : ${url}
ID : ${id}`

 	return await message.client.sendMessage(message.jid, {image: im, caption: text}, {quoted: message})
 }catch(e){
message.reply(e)
}
 
} catch (error) {
  console.error("[Error]:", error);
}

})
async function syt(res){
const filters = await ytsr.getFilters(res);
    const filter = filters.get('Type').get('Video');
    const options = {
      limit: 1, // Retrieve only the first result
    };
const sr = await ytsr(filter.url , options);
  return sr.items[0]
}
