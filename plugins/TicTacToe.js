const { command,isAdmin, parseJid, isPrivate } = require("../lib/");
command({
    pattern: "delttt",
    fromMe: true,
    desc: "delete TicTacToe running game.",
    type: "game"
  },
  async (message, match, m) => {
         let isadmin = await isAdmin(message.jid, message.user, message.client);
    
        if(!isadmin) return message.treply('This command is only for Group Admin and my owner.')
         this.game = this.game ? this.game : false
         if (
        Object.values(this.game).find(
          (room) =>
            room.id.startsWith("tictactoe")
        )
      ) {
        delete this.game
        return message.treply(`_Successfully Deleted running TicTacToe game._`);
        } else {
              return message.treply(`No TicTacToe game🎮 is running.`)
                    
        }
  })
  
command({
    pattern: "ttt ?(.*)",
    fromMe: isPrivate,
    desc: "Play TicTacToe",
    type: "game",
  },
  async (message, match, m) => {
    let {prefix} = message
    {
      let TicTacToe = require("../lib/tictactoe");
      this.game = this.game ? this.game : {};
      if (
        Object.values(this.game).find(
          (room) =>
            room.id.startsWith("tictactoe") &&
            [room.game.playerX, room.game.playerO].includes(m.sender)
        )
      )
        return message.treply("_You're still in the game\n\nUse *skip* to quit_");
      let room = Object.values(this.game).find(
        (room) =>
          room.state === "WAITING" && (match ? room.name === match : true)
      );
      if (room) {
        room.o = message.jid;
        room.game.playerO = message.participant || message.mention[0];
        room.state = "PLAYING";
        let arr = room.game.render().map((v) => {
          return {
            X: "❌",
            O: "⭕",
            1: "1️⃣",
            2: "2️⃣",
            3: "3️⃣",
            4: "4️⃣",
            5: "5️⃣",
            6: "6️⃣",
            7: "7️⃣",
            8: "8️⃣",
            9: "9️⃣", 
          }[v];
        });
        let str = `*TicTacToe*

Turn: @${room.game.currentTurn.split("@")[0]}

${arr.slice(0, 3).join("")}
${arr.slice(3, 6).join("")}
${arr.slice(6).join("")}

`;

        return await message.client.sendMessage(message.jid, {
          text: str,
        //  buttons: [{ buttonId: "give_up", buttonText: { displayText: "Give UP" } },],
          mentions: parseJid(str),
        });
      } else {
        room = {
          id: "tictactoe-" + +new Date(),
          x: message.jid,
          o: "",
          game: new TicTacToe(m.sender, "o"),
          state: "WAITING",
        };
        if (match) room.name = match;
        message.treply("_Waiting for partner\n\nUse *skip* to quit_ ");
        this.game[room.id] = room;
      }
    }
  }
);

command({
    on: "text",
    fromMe: isPrivate,
  },
  async (message, match, m) => {
    let {prefix} = message
    this.game = this.game ? this.game : {};
    let room = Object.values(this.game).find(
      (room) =>
        room.id &&
        room.game &&
        room.state &&
        room.id.startsWith("tictactoe") &&
        [room.game.playerX, room.game.playerO].includes(m.sender) &&
        room.state == "PLAYING"
    );
    if (room) {
      let ok;
      let isWin = !1;
      let isTie = !1;
      let isSurrender = !1;
      
      if (!/^([1-9]|(me)?give_up|surr?ender|off|skip)$/i.test(match)) return;
      isSurrender = !/^[1-9]$/.test(match);
      if (m.sender !== room.game.currentTurn) {
        if (!isSurrender) return !0;
      }
      if (
        !isSurrender &&
        1 >
          (ok = room.game.turn(
            m.sender === room.game.playerO,
            parseInt(match) - 1
          ))
      ) {
        message.treply(
          {
            "-3": "The game is over",
            "-2": "Invalid",
            "-1": "_Invalid Position_",
            0: "_Invalid Position_",
          }[ok]
        );
        return !0;
      }
      if (m.sender === room.game.winner) isWin = true;
      else if (room.game.board === 511) isTie = true;
      let arr = room.game.render().map((v) => {
        return {
          X: "❌",
          O: "⭕",
          1: "1️⃣",
          2: "2️⃣",
          3: "3️⃣",
          4: "4️⃣",
          5: "5️⃣",
          6: "6️⃣",
          7: "7️⃣",
          8: "8️⃣",
          9: "9️⃣",
        }[v];
      });
      if (isSurrender) {
        room.game._currentTurn = m.sender === room.game.playerX;
        isWin = true;
      }
      let winner = isSurrender ? room.game.currentTurn : room.game.winner;
      let str = `*TicTacToe*
      
      ${
        isWin
          ? `@${winner.split("@")[0]} 𝙒𝙊𝙉 𝙏𝙃𝙀 𝙂𝘼𝙈𝙀❗`
          : isTie
          ? `*𝙏𝙄𝙀*`
          : `Move ${["❌", "⭕"][1 * room.game._currentTurn]} @${
              room.game.currentTurn.split("@")[0]
            }`
      }

${arr.slice(0, 3).join("")}
${arr.slice(3, 6).join("")}
${arr.slice(6).join("")}

❌: @${room.game.playerX.split("@")[0]}
⭕: @${room.game.playerO.split("@")[0]}`;

      if ((room.game._currentTurn ^ isSurrender ? room.x : room.o) !== m.chat)
        room[room.game._currentTurn ^ isSurrender ? "x" : "o"] = m.chat;
      if (isWin || isTie) {
        await message.client.sendMessage(message.jid, {
          text: str,
          buttons: [
            {
              buttonId: `${global.prefix}ttt`,
              buttonText: { displayText: "Play again" },
            },
          ],
          mentions: parseJid(str),
        });
      } else {
        await message.client.sendMessage(message.jid, {
          text: str,
        //  buttons: [{ buttonId: "give_up", buttonText: { displayText: "Give UP" } },],
          mentions: parseJid(str),
        });
      }
      if (isTie || isWin) {
        delete this.game[room.id];
      }
    }
  }
);
