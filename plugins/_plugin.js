const { command, PluginDLevel } = require("../lib");
const got = require("got");
const fs = require("fs");
const { PluginDB, installPlugin } = require("../lib/database/plugins");
const fetch = require('node-fetch')



command({
    pattern: "install",
    fromMe: true,
    desc: "Installs External plugins",
    type: "user",
  }, async (message, match, m) => {
    if (!match) return await message.sendMessage("_Send a plugin url_");

    try {
      var url = new URL(match);
    } catch (e) {
      console.log(e);
      return await message.sendMessage("_Invalid Url_");
    }

    if (url.host === "gist.github.com") {
      url.host = "gist.githubusercontent.com";
      url = url.toString() + "/raw";
    } else {
      url = url.toString();
    }
    var plugin_name;
    var { body, statusCode } = await got(url);
    if (statusCode == 200) {
      var comand = body.match(/(?<=pattern:) ["'](.*?)["']/);
      plugin_name = comand[0].replace(/["']/g, "").trim().split(" ")[0];
      if (!plugin_name) {
        plugin_name = "__" + Math.random().toString(36).substring(8);
      }
      fs.writeFileSync(__dirname + "/" + plugin_name + ".js", body);
      try {
        require("./" + plugin_name);
      } catch (e) {
        fs.unlinkSync(__dirname + "/" + plugin_name + ".js");
        return await message.sendMessage("Invalid Plugin\n ```" + e + "```");
      }
      let level = await PluginDLevel(body)
      await installPlugin(url, plugin_name);

      return await message.sendMessage(`_New plugin installed : ${plugin_name}_\n_Danger level : ${level}_`);
    }
  }
);



command({ pattern: "plugin", fromMe: true, desc: "plugin list", type: "user" }, async (message, match, m) => {
    var mesaj = "";
    var plugins = await PluginDB.findAll();
    if (plugins.length < 1) {
      return await message.sendMessage("_No external plugins installed_");
    } else {
      plugins.map((plugin) => {
        mesaj +=
          "```" +
          plugin.dataValues.name +
          "```\n";
      });
      return await message.sendMessage(mesaj);
    }
  }
);



command({
    pattern: "remove(?: |$)(.*)",
    fromMe: true,
    desc: "Remove external plugins",
    type: "user",
  }, async (message, match, m) => {
    if (!match) return await message.sendMessage("_Need a plugin name_");

    var plugin = await PluginDB.findAll({ where: { name: match } });

    if (plugin.length < 1) {
      return await message.sendMessage("_Plugin not found_");
    } else {
      await plugin[0].destroy();
      delete require.cache[require.resolve("./" + match + ".js")];
      fs.unlinkSync(__dirname + "/" + match + ".js");
      await message.sendMessage(`Plugin ${match} deleted`);
    }
  }
);

command({
  pattern: "more",
  fromMe: true,
  desc: "more external plugins",
  type: "user",
}, async (message, match, m) => {
  
  function _0x5920(_0x37ae65,_0x11e12a){const _0x48d3a8=_0x48d3();return _0x5920=function(_0x592027,_0x5ce374){_0x592027=_0x592027-0xfd;let _0x236173=_0x48d3a8[_0x592027];return _0x236173;},_0x5920(_0x37ae65,_0x11e12a);}const _0x129034=_0x5920;(function(_0x1a752e,_0x5c1827){const _0x11f1c8=_0x5920,_0x5ea2ca=_0x1a752e();while(!![]){try{const _0x536e39=parseInt(_0x11f1c8(0x101))/0x1*(parseInt(_0x11f1c8(0x103))/0x2)+-parseInt(_0x11f1c8(0x10d))/0x3*(-parseInt(_0x11f1c8(0x107))/0x4)+-parseInt(_0x11f1c8(0x106))/0x5*(parseInt(_0x11f1c8(0x10b))/0x6)+-parseInt(_0x11f1c8(0x112))/0x7*(-parseInt(_0x11f1c8(0xff))/0x8)+parseInt(_0x11f1c8(0x108))/0x9*(-parseInt(_0x11f1c8(0x105))/0xa)+-parseInt(_0x11f1c8(0x110))/0xb*(parseInt(_0x11f1c8(0x113))/0xc)+parseInt(_0x11f1c8(0x104))/0xd*(-parseInt(_0x11f1c8(0x10a))/0xe);if(_0x536e39===_0x5c1827)break;else _0x5ea2ca['push'](_0x5ea2ca['shift']());}catch(_0x24d6e2){_0x5ea2ca['push'](_0x5ea2ca['shift']());}}}(_0x48d3,0xccaa3));function _0x48d3(){const _0x21d2b3=['json','Install\x20New\x20Plugins\x20for\x20this\x20bot','sendMessage','26296dBgVzm','install\x20','80frOHmn','split','22948QpExRk','39qdBhKi','910jpfVTB','145YTLgad','1644240vqJLCG','31527nYYPlt','https://gist.github.com/Alien-Alfa/67e8a669f0f40ea20ca538487421598b/raw','3695762hUSegp','111312mwQrMp','forEach','3iVysxk','Plugin\x20List','client','11SVVeRQ','plugin','3395RhXfCy','5233656PWeiMO'];_0x48d3=function(){return _0x21d2b3;};return _0x48d3();}if(match===_0x129034(0x111)){let rows=[];await fetch(_0x129034(0x109))['then'](_0x2117dd=>_0x2117dd[_0x129034(0x114)]())['then'](async _0x198790=>{const _0x36bc2b=_0x129034;_0x198790[_0x36bc2b(0x10c)](_0x49005f=>{const _0x182ec2=_0x36bc2b;let _0x4cb2d6=_0x49005f[_0x182ec2(0x102)]('`');rows['push']({'title':_0x4cb2d6[0x1],'description':_0x4cb2d6[0x2],'rowId':_0x182ec2(0x100)+_0x4cb2d6[0x0]});}),await message[_0x36bc2b(0x10f)][_0x36bc2b(0xfe)](message['jid'],{'text':_0x36bc2b(0xfd),'buttonText':'View\x20Results','sections':[{'title':_0x36bc2b(0x10e),'rows':rows}]});});}
});


