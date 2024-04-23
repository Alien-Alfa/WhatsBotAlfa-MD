const { command, getUrl, isPrivate, PluginDLevel } = require("../lib");
const got = require("got");
const fs = require("fs");
const { PluginDB, installPlugin } = require("../database/plugins");

command(
  {
    pattern: "install ?(.*)",
    fromMe: true,  
    desc: "Installs External plugins",
    type:'user'
  },
  async (message, match) => {
    try{
    if (!match) return await message.sendMessage("_Send a plugin url_");
    for (let Url of getUrl(match)) {
      try {
        var url = new URL(Url);
      } catch {
        return await message.sendMessage("_Invalid Url_");
      }

      if (url.host === 'gist.github.com') {
        url.host = 'gist.githubusercontent.com';
        url = url.toString() + '/raw'
    } else {
        url = url.toString()
    }

    var response = await got(url);
    if (response.statusCode == 200) {
        let plugin_name = /pattern: ["'](.*)["'],/g.exec(response.body)
	plugin_name = plugin_name[1].split(' ')[0]
        fs.writeFileSync("./plugins/" + plugin_name + ".js", response.body);
        try {
          require("./" + plugin_name);
        } catch (e) {
          fs.unlinkSync(__dirname+"/" + plugin_name + ".js");
          return await message.sendMessage("Invalid Plugin\n ```" + e + "```");
        }

        await installPlugin(url, plugin_name);
        await message.reply(`New Plugin: ${plugin_name}\nDanger Level: ${await PluginDLevel(response.body)}`);

      }
    }
  } catch (error) {
    console.error("[Error]:", error);
  }
  }
);

command(
  { pattern: "plugin", fromMe: true,   desc: "plugin list" ,type:'user'},
  async (message, match) => {
    try{
    var mesaj = "";
    var plugins = await PluginDB.findAll();
    if (plugins.length < 1) {
      return await message.sendMessage("_No external plugins installed_");
    } else {
      plugins.map((plugin) => {
        mesaj +=
          "```" +
          plugin.dataValues.name +
          "```: " +
          plugin.dataValues.url +
          "\n";
      });
      return await message.sendMessage(mesaj);
    }
  } catch (error) {
    console.error("[Error]:", error);
  }
  }
);

command(
  {
    pattern: "remove(?: |$)(.*)",
    fromMe: true,  
    desc: "Remove external plugins",
    type:'user'
  },
  async (message, match) => {
    try{
    if (!match) return await message.sendMessage("_Need a plugin name_");

    var plugin = await PluginDB.findAll({ where: { name: match } });

    if (plugin.length < 1) {
      return await message.sendMessage("_Plugin not found_");
    } else {
      await plugin[0].destroy();
      delete require.cache[require.resolve("./" + match + ".js")];
      fs.unlinkSync("./plugins/" + match + ".js");
      await message.sendMessage(`Plugin ${match} deleted`);
    }
  } catch (error) {
    console.error("[Error]:", error);
  }
  }
);
