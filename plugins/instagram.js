const { command, getJson,isPrivate } = require("../lib/");

const instagramGetUrl = require("instagram-url-direct")

/*
command({
    pattern: "infffsta ?(.*)",
    fromMe: isPrivate,
    desc: "downloads video from instagram",
    type: "downloader",
  }, async (message, match, m) => { //credit: Ray Senpai ❤️ https://github.com/EternityBots/Nezuko
    let arg = match
    if ( arg.length === 0) return message.sendMessage(`Where is the link?`)
            let urlInsta =  arg
            if (!(urlInsta.includes("instagram.com/p/") ||
                urlInsta.includes("instagram.com/reel/") ||
                urlInsta.includes("instagram.com/tv/")))
                return   message.client.sendMessage(message.jid, { text: `The link you provided is not a instagram link\n\n${urlInsta}` } ); 

                if (urlInsta.includes("?"))
                urlInsta = urlInsta.split("/?")[0];

            console.log(urlInsta);

          let res = await instagramGetUrl(urlInsta)
                if (res.results_number == 1) {
     //               if (res.url_list.mtype == "video") {
                          message.client.sendMessage(message.jid, {video: { url: res.url_list.url }} )
        //            }else if (res.url_list.mtype == "image") {
        //                  message.client.sendMessage(message.jid, {image: { url: res.url_list.url }} )
         //           }
                }
                else if (res.results_number > 1) {
                    for (let i = 0; i < res.results_number; i++) {
                        if (res.url_list.mtype == "video") {
                              message.client.sendMessage(message.jid, {video: { url: res.url_list.url }} )
                        } else if (res.url_list.mtype == "image") {
                              message.client.sendMessage(message.jid, {image: { url: res.url_list.url }} )
                        }
                    }
                }            

            console.log(res)
    }
);






command({
    pattern: "story ?(.*)",
    fromMe: isPrivate,
    desc: "downloads story from instagram",
    type: "downloader",
  }, async (message, match, m) => {
    match = match || message.reply_message.text;
    if (!match) return await message.treply("_Enter Username_");
    let response = await getJson(
      `https://hermit-network.herokuapp.com/api/story?username=${match}&key=adithyan`
    );
    if(!response.status) return message.treply('Not Found')
    for (let i of response.result) {
      message.sendFromUrl(i);
    }
  }
);

*/