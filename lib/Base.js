"use strict";
const fileType = require("file-type");
const config = require("../config");
const {
  isUrl,
  getBuffer,
  writeExifImg,
  writeExifVid,
  writeExifWebp,
  tiny,
  parseJid,
  getRandom,
  isNumber,
  decodeJid,
} = require(".");
const simpleGit = require('simple-git');
const git = simpleGit();
const { exec } = require('child_process');
const { PassThrough } = require('stream');
const fs = require("fs");
const {translate} = require('@vitalets/google-translate-api');
const { connected } = require("process");
const {
  generateForwardMessageContent,
  generateWAMessageFromContent,
  generateWAMessage,
  generateWAMessageContent,
} = require("@whiskeysockets/baileys");
class Base {
  constructor(client, msg) {
    Object.defineProperty(this, "client", { value: client });
    Object.defineProperty(this, "m", { value: msg });
  }

  _clone() {
    return Object.assign(Object.create(this), this);
  }

  _patch(data) {
    return data;
  }
}

class Video extends Base {
  constructor(client, data, msg) {
    super(client);
    if (data) this._patch(data, msg);
  }

  _patch(data, msg) {
    this.isGroup = data.isGroup;
    this.id = data.key.id === undefined ? undefined : data.key.id;
    this.jid = data.key.remoteJid;
    this.pushName = data.pushName;
    this.participant = data.sender;
    this.sudo = config.SUDO.split(",").includes(this.participant.split("@")[0]);
    this.caption = data.body;
    this.fromMe = data.key.fromMe;
    this.timestamp =
      typeof data.messageTimestamp === "object"
        ? data.messageTimestamp.low
        : data.messageTimestamp;
    this.key = data.key;
    this.message = data.message.videoMessage;
    if (data.quoted) {
      this.reply_message = data.quoted;
    } else {
      this.reply_message = false;
    }

    return super._patch(data);
  }
}

class Image extends Base {
  constructor(client, data, msg) {
    super(client);
    if (data) this._patch(data, msg);
  }

  _patch(data, msg) {
    this.isGroup = data.isGroup;
    this.id = data.key.id === undefined ? undefined : data.key.id;
    this.jid = data.key.remoteJid;
    this.pushName = data.pushName;
    this.participant = data.sender;
    this.sudo = config.SUDO.split(",").includes(this.participant.split("@")[0]);
    this.caption = data.body;
    this.fromMe = data.key.fromMe;
    this.timestamp =
      typeof data.messageTimestamp === "object"
        ? data.messageTimestamp.low
        : data.messageTimestamp;
    this.key = data.key;
    this.message = data.message.imageMessage;
    if (data.quoted) {
      this.reply_message = data.quoted;
    } else {
      this.reply_message = false;
    }

    return super._patch(data);
  }
  async reply(text, opt = { withTag: true }) {
    return this.client.sendMessage(
      this.jid,
      {
        text: require("util").format(text),
        ...opt,
      },
      { ...opt, quoted: this.data }
    );
  }
}
class Message extends Base {
  constructor(client, data, msg) {
    super(client, data);
    if (data) this._patch(data, msg);
  }
  _patch(data, msg) {
    this.user = decodeJid(this.client.user.id);
    this.key = data.key;
    this.isGroup = data.isGroup;
    this.prefix = data.prefix;
    this.id = data.key.id === undefined ? undefined : data.key.id;
    this.jid = data.key.remoteJid;
    this.message = { key: data.key, message: data.message };
    this.pushName = data.pushName;
    this.participant = data.sender;
    this.sudo = config.SUDO.split(",").includes(this.participant.split("@")[0]);
    this.text = data.body;
    this.fromMe = data.key.fromMe;
    this.message = msg.message;
    this.timestamp =
      typeof data.messageTimestamp === "object"
        ? data.messageTimestamp.low
        : data.messageTimestamp;

    if (
      data.message.hasOwnProperty("extendedTextMessage") &&
      data.message.extendedTextMessage.hasOwnProperty("contextInfo") === true &&
      data.message.extendedTextMessage.contextInfo.hasOwnProperty(
        "mentionedJid"
      )
    ) {
      this.mention = data.message.extendedTextMessage.contextInfo.mentionedJid;
    } else {
      this.mention = false;
    }

    if (
      data.message.hasOwnProperty("extendedTextMessage") &&
      data.message.extendedTextMessage.hasOwnProperty("contextInfo") === true &&
      data.message.extendedTextMessage.contextInfo.hasOwnProperty(
        "quotedMessage"
      )
    ) {
      this.reply_message = new ReplyMessage(
        this.client,
        data.message.extendedTextMessage.contextInfo,
        data
      );
      this.reply_message.type = data.quoted.type || "extendedTextMessage";
      this.reply_message.mtype = data.quoted.mtype;
      this.reply_message.mimetype = data.quoted.text.mimetype || "text/plain";
      this.reply_message.key = data.quoted.key;
      this.reply_message.message = data.quoted.message;
    } else {
      this.reply_message = false;
    }

    return super._patch(data);
  }
  async log() {
    console.log(this.data);
  }
  async sendFile(content, options = {}) {
    let { data } = await this.client.getFile(content);
    let type = await fileType.fromBuffer(data);
    return this.client.sendMessage(
      this.jid,
      { [type.mime.split("/")[0]]: data, ...options },
      { ...options }
    );
  }
  async downloadMediaMessage() {
    let buff = await this.m.download();
    let type = await fileType.fromBuffer(buff);
    await fs.promises.writeFile(new Date() + type.ext, buff);
    return new Date() + type.ext;
  }
  async reply(text, opt = {}) {
    return this.client.sendMessage(
      this.jid,
      {
        text: require("util").format(text),
        ...opt,
      },
      { ...opt, quoted: this }
    );
  }
  async treply(text, opt = {}) {

    let result = await translate(text, {
      to: "en",
      autoCorrect: true
   }).catch(_ => null)


    return this.client.sendMessage(
      this.jid,
      {
        text: require("util").format(text),
        ...opt,
      },
      { ...opt, quoted: this }
    );
  }
  async send(jid, text, opt = {}) {
    return this.client.sendMessage(
      jid,
      {
        text: require("util").format(text),
        ...opt,
      },
      { ...opt }
    );
  }
  async sendMessage(
    content,
    opt = { packname: "Xasena", author: "X-electra" },
    type = "text"
  ) {
    switch (type.toLowerCase()) {
      case "text":
        {
          return this.client.sendMessage(
            this.jid,
            {
              text: content,
              ...opt,
            },
            { ...opt }
          );
        }
        break;
      case "image":
        {
          if (Buffer.isBuffer(content)) {
            return this.client.sendMessage(
              this.jid,
              { image: content, ...opt },
              { ...opt }
            );
          } else if (isUrl(content)) {
            return this.client.sendMessage(
              this.jid,
              { image: { url: content }, ...opt },
              { ...opt }
            );
          }
        }
        break;
      case "video": {
        if (Buffer.isBuffer(content)) {
          return this.client.sendMessage(
            this.jid,
            { video: content, ...opt },
            { ...opt }
          );
        } else if (isUrl(content)) {
          return this.client.sendMessage(
            this.jid,
            { video: { url: content }, ...opt },
            { ...opt }
          );
        }
      }
      case "audio":
        {
          if (Buffer.isBuffer(content)) {
            return this.client.sendMessage(
              this.jid,
              { audio: content, ...opt },
              { ...opt }
            );
          } else if (isUrl(content)) {
            return this.client.sendMessage(
              this.jid,
              { audio: { url: content }, ...opt },
              { ...opt }
            );
          }
        }
        break;
      case "template":
        let optional = await generateWAMessage(this.jid, content, opt);
        let message = {
          viewOnceMessage: {
            message: {
              ...optional.message,
            },
          },
        };
        await this.client.relayMessage(this.jid, message, {
          messageId: optional.key.id,
        });

        break;
      case "sticker":
        {
          let { data, mime } = await this.client.getFile(content);
          if (mime == "image/webp") {
            let buff = await writeExifWebp(data, opt);
            await this.client.sendMessage(
              this.jid,
              { sticker: { url: buff }, ...opt },
              opt
            );
          } else {
            mime = await mime.split("/")[0];

            if (mime === "video") {
              await this.client.sendImageAsSticker(this.jid, content, opt);
            } else if (mime === "image") {
              await this.client.sendImageAsSticker(this.jid, content, opt);
            }
          }
        }
        break;
    }
  }

  async forward(jid, message, options = {}) {
    let m = generateWAMessageFromContent(jid, message, {
      ...options,
      userJid: this.client.user.id,
    });
    await this.client.relayMessage(jid, m.message, {
      messageId: m.key.id,
      ...options,
    });
    return m;
  }
  async sendFromUrl(url, options = {}) {
    let buff = await getBuffer(url);
    let mime = await fileType.fromBuffer(buff);
    let type = mime.mime.split("/")[0];
    if (type === "audio") {
      options.mimetype = "audio/mpeg";
    }
    if (type === "application") type = "document";
    return this.client.sendMessage(
      this.jid,
      { [type]: buff, ...options },
      { ...options }
    );
  }
  async PresenceUpdate(status) {
    await sock.sendPresenceUpdate(status, this.jid);
  }
  async delete(key) {
    await this.client.sendMessage(this.jid, { delete: key });
  }
  async updateName(name) {
    await this.client.updateProfileName(name);
  }
  async getPP(jid) {
    return await this.client.profilePictureUrl(jid, "image");
  }
  async setPP(jid, pp) {
    if (Buffer.isBuffer(pp)) {
      await this.client.updateProfilePicture(jid, pp);
    } else {
      await this.client.updateProfilePicture(jid, { url: pp });
    }
  }
  /**
   *
   * @param {string} jid
   * @returns
   */
async editMessage(jid, msg, key){
  return await this.client.relayMessage(jid, {
  protocolMessage: {
    key: key,
    type: 14,
    editedMessage: {
      conversation: msg
    }
  }
}, {})
}

  
  async block(jid) {
    await this.client.updateBlockStatus(jid, "block");
  }
  /**
   *
   * @param {string} jid
   * @returns
   */
  async unblock(jid) {
    await this.client.updateBlockStatus(jid, "unblock");
  }
  /**
   *
   * @param {array} jid
   * @returns
   */
  async add(jid) {
    return await this.client.groupParticipantsUpdate(this.jid, jid, "add");
  }
  /**
   *
   * @param {array} jid
   * @returns
   */
  async kick(jid) {
    return await this.client.groupParticipantsUpdate(this.jid, jid, "remove");
  }
  /**
  *
  * @param {array} message
  * @returns
  */
  async CheckUpdate(message) {
    function _0x46db(_0x1c7957,_0x1f0a8a){const _0x246434=_0x2464();return _0x46db=function(_0x46db13,_0x45e468){_0x46db13=_0x46db13-0xe8;let _0x5ef59c=_0x246434[_0x46db13];return _0x5ef59c;},_0x46db(_0x1c7957,_0x1f0a8a);}const _0x423c4b=_0x46db;(function(_0x28fa11,_0x4373a2){const _0x4070c0=_0x46db,_0x5b594b=_0x28fa11();while(!![]){try{const _0x2b9f48=parseInt(_0x4070c0(0xf9))/0x1+-parseInt(_0x4070c0(0x101))/0x2*(-parseInt(_0x4070c0(0xf0))/0x3)+-parseInt(_0x4070c0(0xf1))/0x4*(-parseInt(_0x4070c0(0xea))/0x5)+-parseInt(_0x4070c0(0x100))/0x6+-parseInt(_0x4070c0(0xf5))/0x7*(-parseInt(_0x4070c0(0xee))/0x8)+-parseInt(_0x4070c0(0xff))/0x9*(-parseInt(_0x4070c0(0xeb))/0xa)+parseInt(_0x4070c0(0xfc))/0xb*(-parseInt(_0x4070c0(0x103))/0xc);if(_0x2b9f48===_0x4373a2)break;else _0x5b594b['push'](_0x5b594b['shift']());}catch(_0x18b07b){_0x5b594b['push'](_0x5b594b['shift']());}}}(_0x2464,0x9116c));function _0x2464(){const _0x4d7f78=['message','47235TWGEPn','30DpdBde','ᴜᴘᴅᴀᴛᴇ\x20ᴄʜᴇᴄᴋᴇʀ','Updating\x20bot...','4006120VuTjwg','\x0a\x0a\x20Type\x20*UpdateNow*\x20to\x20start\x20Update','2796354uuuxzV','316rhSTcf','_Bot\x20up\x20to\x20date!_','total','•\x20*','7MBrBLW','Error\x20in\x20update\x20command:','reply','sendMessage','710907dwnDqF','all','jid','55OrydrY','Update\x20process\x20completed.','log','2821482lbnCZQ','2359608djAAoE','2HSbHCG','client','6823308dkjdhN','fetch','error','main','An\x20error\x20occurred\x20during\x20the\x20update\x20process.','..origin/'];_0x2464=function(){return _0x4d7f78;};return _0x2464();}try{console[_0x423c4b(0xfe)](_0x423c4b(0xed)),await git[_0x423c4b(0x104)]();const commits=await git[_0x423c4b(0xfe)]([_0x423c4b(0x106)+_0x423c4b(0xe8)+_0x423c4b(0x106)]);let mss='';if(commits[_0x423c4b(0xf3)]===0x0)mss=_0x423c4b(0xf2),await message[_0x423c4b(0xf7)](mss);else{let changelog='_Pending\x20updates:_\x0a\x0a';for(let i in commits[_0x423c4b(0xfa)]){changelog+=parseInt(i)+0x1+_0x423c4b(0xf4)+commits[_0x423c4b(0xfa)][i][_0x423c4b(0xe9)]+'*\x0a';}mss=changelog+_0x423c4b(0xef);const buttonMessage={'text':mss,'footer':_0x423c4b(0xec),'headerType':0x1};await message[_0x423c4b(0x102)][_0x423c4b(0xf8)](message[_0x423c4b(0xfb)],buttonMessage);}console['log'](_0x423c4b(0xfd));}catch(_0x52d5e3){console[_0x423c4b(0x105)](_0x423c4b(0xf6),_0x52d5e3),await message[_0x423c4b(0xf7)](_0x423c4b(0x107));}
  }
  /**
   *
   * @param {array} message
   * @returns
   */
  async UpdateLocal(message) {
  function _0x550c(_0x19a4fd,_0x4c4db6){const _0x474a03=_0x474a();return _0x550c=function(_0x550c92,_0x170235){_0x550c92=_0x550c92-0x182;let _0x5e10bd=_0x474a03[_0x550c92];return _0x5e10bd;},_0x550c(_0x19a4fd,_0x4c4db6);}const _0x5c20af=_0x550c;(function(_0x9f7734,_0x21aa0c){const _0x300ced=_0x550c,_0x310026=_0x9f7734();while(!![]){try{const _0x1ddddd=parseInt(_0x300ced(0x197))/0x1*(parseInt(_0x300ced(0x193))/0x2)+parseInt(_0x300ced(0x192))/0x3*(parseInt(_0x300ced(0x194))/0x4)+-parseInt(_0x300ced(0x18b))/0x5+-parseInt(_0x300ced(0x188))/0x6*(-parseInt(_0x300ced(0x18c))/0x7)+-parseInt(_0x300ced(0x184))/0x8*(-parseInt(_0x300ced(0x182))/0x9)+-parseInt(_0x300ced(0x195))/0xa+parseInt(_0x300ced(0x185))/0xb*(parseInt(_0x300ced(0x187))/0xc);if(_0x1ddddd===_0x21aa0c)break;else _0x310026['push'](_0x310026['shift']());}catch(_0x2d7ec2){_0x310026['push'](_0x310026['shift']());}}}(_0x474a,0x55b3e));function _0x474a(){const _0x1d7064=['client','log','Error\x20during\x20update:','_Bot\x20up\x20to\x20date_','7842VhjJqI','5754OrACSo','20zHzgkO','4052470VvIGOV','fetch','67RXllrl','main','sendMessage','..origin/','jid','71262nIczNT','send','224mLjYON','11XqXRjS','_Update\x20failed_','8113116JrhvWM','12iqPQpE','_Started\x20update.._','error','2125375nyxmTV','272069uqoAbb','_Restarting_'];_0x474a=function(){return _0x1d7064;};return _0x474a();}try{await git[_0x5c20af(0x196)]();const commits=await git[_0x5c20af(0x18f)]([_0x5c20af(0x198)+_0x5c20af(0x19a)+_0x5c20af(0x198)]);return commits['total']===0x0?await message[_0x5c20af(0x18e)][_0x5c20af(0x199)](message['jid'],{'text':_0x5c20af(0x191)}):(await message['client'][_0x5c20af(0x199)](message[_0x5c20af(0x19b)],{'text':_0x5c20af(0x189)}),await new Promise((_0x5344f5,_0x1c26ac)=>{exec('git\x20pull\x20origin\x20main',(_0x4f6f7d,_0x274a80,_0x457424)=>{_0x4f6f7d?_0x1c26ac(_0x4f6f7d):_0x5344f5(_0x274a80);});}),await message[_0x5c20af(0x18e)][_0x5c20af(0x199)](message[_0x5c20af(0x19b)],{'text':'_Successfully\x20updated_'}),await message[_0x5c20af(0x18e)][_0x5c20af(0x199)](message[_0x5c20af(0x19b)],{'text':_0x5c20af(0x18d)}),await process[_0x5c20af(0x183)]('reset'));}catch(_0x4a733c){console[_0x5c20af(0x18a)](_0x5c20af(0x190),_0x4a733c),await message['client'][_0x5c20af(0x199)](message[_0x5c20af(0x19b)],{'text':_0x5c20af(0x186)});}
  }
  /**
   *
   * @param {array} message
   * @returns
   */
  async UpdateHeroku(message) {
  const _0x53cd19=_0x3b2c;function _0x3b2c(_0x1a1f8e,_0x5a1627){const _0x3bf217=_0x3bf2();return _0x3b2c=function(_0x3b2c02,_0x9c4fa4){_0x3b2c02=_0x3b2c02-0x1c7;let _0x2acbec=_0x3bf217[_0x3b2c02];return _0x2acbec;},_0x3b2c(_0x1a1f8e,_0x5a1627);}function _0x3bf2(){const _0x2fa192=['..origin/','hard','_Started\x20update.._','655102ARzFSi','1851vbwFJO','503822DzWaGE','1518654XujbOU','log','fetch','jid','HEROKU_APP_NAME','sendMessage','client','336MnHKqk','2SDUVGd','_Heroku\x20update\x20failed_','get','https://','heroku\x20remote\x20already\x20added','total','replace','2043uoAvup','push','15859883mFIeQz','169913AjhAsP','main','120dZlSul','HEROKU_API_KEY','35290DIYJHs','25oHqWMa','Error\x20getting\x20Heroku\x20app\x20information:','reset','addRemote','heroku','error','_Bot\x20up\x20to\x20date_','2420BONIDZ','_Heroku\x20information\x20retrieval\x20failed_','_Restarting_'];_0x3bf2=function(){return _0x2fa192;};return _0x3bf2();}(function(_0x53e03f,_0x4184f7){const _0x2b06dc=_0x3b2c,_0x258c17=_0x53e03f();while(!![]){try{const _0x469793=-parseInt(_0x2b06dc(0x1d6))/0x1*(parseInt(_0x2b06dc(0x1cc))/0x2)+parseInt(_0x2b06dc(0x1e9))/0x3*(parseInt(_0x2b06dc(0x1e2))/0x4)+parseInt(_0x2b06dc(0x1db))/0x5*(parseInt(_0x2b06dc(0x1eb))/0x6)+-parseInt(_0x2b06dc(0x1e8))/0x7*(parseInt(_0x2b06dc(0x1d8))/0x8)+parseInt(_0x2b06dc(0x1d3))/0x9*(parseInt(_0x2b06dc(0x1da))/0xa)+parseInt(_0x2b06dc(0x1ea))/0xb*(parseInt(_0x2b06dc(0x1cb))/0xc)+-parseInt(_0x2b06dc(0x1d5))/0xd;if(_0x469793===_0x4184f7)break;else _0x258c17['push'](_0x258c17['shift']());}catch(_0x5b3d3e){_0x258c17['push'](_0x258c17['shift']());}}}(_0x3bf2,0xe2ba3));try{await git['fetch']();const commits=await git[_0x53cd19(0x1ec)]([_0x53cd19(0x1d7)+_0x53cd19(0x1e5)+_0x53cd19(0x1d7)]);if(commits[_0x53cd19(0x1d1)]===0x0)return await message[_0x53cd19(0x1ca)][_0x53cd19(0x1c9)](message[_0x53cd19(0x1c7)],{'text':_0x53cd19(0x1e1)});else{await message[_0x53cd19(0x1ca)]['sendMessage'](message[_0x53cd19(0x1c7)],{'text':_0x53cd19(0x1e7)});try{const app=await heroku[_0x53cd19(0x1ce)]('/apps/'+Config[_0x53cd19(0x1c8)]);}catch(_0x598c5b){console[_0x53cd19(0x1e0)](_0x53cd19(0x1dc),_0x598c5b),await message[_0x53cd19(0x1ca)]['sendMessage'](message[_0x53cd19(0x1c7)],{'text':_0x53cd19(0x1e3)}),await new Promise(_0x27de98=>setTimeout(_0x27de98,0x3e8));}git[_0x53cd19(0x1ed)]('upstream','main'),git[_0x53cd19(0x1dd)](_0x53cd19(0x1e6),['FETCH_HEAD']);const git_url=app['git_url'][_0x53cd19(0x1d2)](_0x53cd19(0x1cf),'https://api:'+Config[_0x53cd19(0x1d9)]+'@');try{await git[_0x53cd19(0x1de)](_0x53cd19(0x1df),git_url);}catch(_0x11f65a){console[_0x53cd19(0x1ec)](_0x53cd19(0x1d0));}await git[_0x53cd19(0x1d4)](_0x53cd19(0x1df),_0x53cd19(0x1d7)),await message[_0x53cd19(0x1ca)][_0x53cd19(0x1c9)](message[_0x53cd19(0x1c7)],{'text':'_Successfully\x20updated_'}),await message['client'][_0x53cd19(0x1c9)](message[_0x53cd19(0x1c7)],{'text':_0x53cd19(0x1e4)});}}catch(_0x23047c){console[_0x53cd19(0x1e0)]('Error\x20during\x20Heroku\x20update:',_0x23047c),await message['client'][_0x53cd19(0x1c9)](message[_0x53cd19(0x1c7)],{'text':_0x53cd19(0x1cd)});}
  }
  /**
   *
   * @param {array} jid
   * @returns
   */
  async promote(jid) {
    return await this.client.groupParticipantsUpdate(this.jid, jid, "promote");
  }
  /**
   *
   * @param {array} jid
   * @returns
   */
  async demote(jid) {
    return await this.client.groupParticipantsUpdate(this.jid, jid, "demote");
  }
}

class ReplyMessage extends Base {
  constructor(client, data, msg) {
    super(client, msg);
    if ((data, msg)) this._patch(data, msg);
  }

  _patch(data, msg) {
    this.key = data.key;
    this.id = data.stanzaId;
    this.jid = data.participant;
    this.sudo = config.SUDO.split(",").includes(data.participant.split("@")[0]);
    this.fromMe = data.fromMe;

    if (data.quotedMessage && data.quotedMessage.imageMessage) {
      this.message =
        data.quotedMessage.imageMessage.caption === null
          ? data.message.imageMessage.caption
          : "";
      this.caption =
        data.quotedMessage.imageMessage.caption === null
          ? data.message.imageMessage.caption
          : "";
      this.url = data.quotedMessage.imageMessage.url;
      this.mimetype = data.quotedMessage.imageMessage.mimetype;
      this.height = data.quotedMessage.imageMessage.height;
      this.width = data.quotedMessage.imageMessage.width;
      this.mediaKey = data.quotedMessage.imageMessage.mediaKey;
      this.image = true;
      this.video = false;
      this.sticker = false;
    } else if (data.quotedMessage && data.quotedMessage.videoMessage) {
      this.message =
        data.quotedMessage.videoMessage.caption === null
          ? data.message.videoMessage.caption
          : "";
      this.caption =
        data.quotedMessage.videoMessage.caption === null
          ? data.message.videoMessage.caption
          : "";
      this.url = data.quotedMessage.videoMessage.url;
      this.mimetype = data.quotedMessage.videoMessage.mimetype;
      this.height = data.quotedMessage.videoMessage.height;
      this.width = data.quotedMessage.videoMessage.width;
      this.mediaKey = data.quotedMessage.videoMessage.mediaKey;
      this.video = true;
    } else if (data.quotedMessage && data.quotedMessage.conversation) {
      this.message = data.quotedMessage.conversation;
      this.text = data.quotedMessage.conversation;
      this.image = false;
      this.video = false;
      this.sticker = false;
    } else if (data.quotedMessage && data.quotedMessage.stickerMessage) {
      this.sticker = { animated: data.quotedMessage.stickerMessage.isAnimated };
      this.mimetype = data.quotedMessage.stickerMessage.mimetype;
      this.message = data.quotedMessage.stickerMessage;
      this.image = false;
      this.video = false;
    } else if (data.quotedMessage && data.quotedMessage.audioMessage) {
      this.audio = data.quotedMessage.audioMessage;
      this.mimetype = data.quotedMessage.audioMessage.mimetype;
    }

    return super._patch(data);
  }
  async downloadMediaMessage() {
    let buff = await this.m.quoted.download();
    let type = await fileType.fromBuffer(buff);
    await fs.promises.writeFile("./media" + type.ext, buff);
    return "./media" + type.ext;
  }
}

class Sticker extends Base {
  constructor(client, data, msg) {
    super(client, msg);
    if ((data, msg)) this._patch(data, msg);
  }
  _patch(data, msg) {
    this.key = data.key;
    this.id = data.key.id;
    this.jid = data.key.remoteJid;
    this.isGroup = data.isGroup;
    this.participant = data.sender;
    this.message = data.message.stickerMessage;
    this.pushName = data.pushName;
    this.sudo = config.SUDO.split(",").includes(data.sender.split("@")[0]);
    this.timestamp =
      typeof data.messageTimestamp === "object"
        ? data.messageTimestamp.low
        : data.messageTimestamp;
    this.sticker = true;
    return super._patch(data);
  }
  async downloadMediaMessage() {
    let buff = await this.m.download();
    let name = new Date();
    await fs.promises.writeFile(name, buff);
    return name;
  }
}

module.exports = { Base, Image, Message, ReplyMessage, Video, Sticker };
