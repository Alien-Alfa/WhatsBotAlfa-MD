async function reply(m, trigger, mime_data = false) {    
    const quoted = m.quoted ? m.quoted.mtype : m.type;    
    const mime = quoted;     
    let response = { msg: "", mime: mime, status: 0 };    


    const validMimes = {
         "text" : ["conversation"],
        "image": ["imageMessage"],        
        "video": ["videoMessage"],        
        "audio": ["audioMessage"],        
        "image&video": ["imageMessage", "videoMessage"],        
        "audio&video": ["audioMessage", "videoMessage"],        
        "all": ["imageMessage", "audioMessage", "videoMessage"]    
    };    


    const triggerMsg = {
    	"text": "reply to a text",
        "image": "reply to an image",
        "video": "reply to a video",
        "audio": "reply to an audio",
        "image&video": "reply to an image or video",
        "audio&video": "reply to an audio or video",
        "all": "reply to an image, audio, or video"
    };


    if (!validMimes[trigger]) {
        response.msg = "Invalid trigger type"; 
        return response;
    }


    response.msg = triggerMsg[trigger];


    if (!validMimes[trigger].includes(mime)) {        
        return response;    
    }    


    if (mime_data) {        
        return { mime: mime, status: 1 };    
    } else {        
        console.log("success");    
    }
}


module.exports = { reply };
