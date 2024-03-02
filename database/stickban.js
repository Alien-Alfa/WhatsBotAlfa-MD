const config = require("../../config");
const { DataTypes } = require("sequelize");

const StickBan = config.DATABASE.define("StickBan", {
  chat: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pattern: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  regex: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
 
});

async function getStickBan(jid = null, filter = null) {
  var Wher = { chat: jid };
  if (filter !== null) Wher.push({ pattern: filter });
  var Msg = await StickBan.findAll({
    where: Wher,
  });

  if (Msg.length < 1) {
    return false;
  } else {
    return Msg;
  }
}

async function saveStickBan(jid = null, filter = null, regx = false) {
  var Msg = await StickBan.findAll({
    where: {
      chat: jid,
      pattern: filter,
    },
  });

  if (Msg.length < 1) {
    return await StickBan.create({
      chat: jid,
      pattern: filter,
      regex: regx,
    });
  } else {
    return await Msg[0].update({
      chat: jid,
      pattern: filter,
      regex: regx,
    });
  }
}

async function deleteStickBan(jid = null, filter) {
  var Msg = await StickBan.findAll({
    where: {
      chat: jid,
      pattern: filter,
    },
  });
  if (Msg.length < 1) {
    return false;
  } else {
    return await Msg[0].destroy();
  }
}

module.exports = {
  StickBan: StickBan,
  getStickBan: getStickBan,
  saveStickBan: saveStickBan,
  deleteStickBan: deleteStickBan,
};
