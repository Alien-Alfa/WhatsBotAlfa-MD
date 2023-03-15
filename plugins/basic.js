/*const { command, isPrivate } = require("../lib/");
const { isAdmin, parsedJid, isUrl } = require("../lib");
const { cron, saveSchedule } = require("../lib/scheduler");
const {
	Function,
	isPrivate,
	sendAlive,
	RandomFancy,
	runtime,
	chatBot,
	isChatBot,
	chatbot
} = require("../lib/extra");
const config = require('../config')




command({
	pattern: 'alive ?(.*)',
	fromMe: isPrivate,
	desc: 'Does bot work?',
	type: 'info'
}, async (message, match, client) => {
	await sendAlive(client, message, match);
});

command({
	pattern: 'jid',
	fromMe: isPrivate,
	desc: 'to get remoteJid',
	type: 'whatsapp'
}, async (message, match, m) => {
	await message.reply(message.mentionedJid[0] ? message.mentionedJid[0] : message.quoted ? message.quoted.sender : message.chat)
});

command({
	pattern: 'runtime',
	fromMe: isPrivate,
	desc: 'get bots runtime',
	type: 'info'
}, async (message, match, client) => {
	await message.send(await runtime(process.uptime()));
});

command({
	pattern: 'chatbot ?(.*)',
	fromMe: true,
	desc: 'set chat bot',
	type: 'misc'
}, async (message, match, m) => {
	await chatBot(message, match)
});

command({
	on: 'text',
	fromMe: isPrivate
}, async (message, match, m) => {
	if (!await isChatBot(message)) return
	if (!message.reply_message) return
	if (!message.reply_message.data.key.fromMe) return
	await message.reply(await chatbot(message))
})*/