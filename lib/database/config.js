const { DATABASE } = require("../../database/settings");
const { DataTypes } = require('sequelize');

const ConfigVarsDB = DATABASE.define('ConfigVars', {
    Key: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    Value: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

async function NewConfigVars(confVar, confVal) {
    var ConfigVars = await ConfigVarsDB.findAll({
        where: {Key: confVar}
    });

    if (ConfigVars.length >= 1) {
        return false;
    } else {
        return await ConfigVarsDB.create({ Key: confVar, Value: confVal });
    }
}

module.exports = { ConfigVarsDB ,NewConfigVars};

