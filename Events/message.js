const {Discord, MessageEmbed} = require("discord.js")
const config = require('../config')

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(message) {
    if (message.author.bot || !message.guild) return;
        let prefixler = config.Prefix
        let strg = false;
        for (const içindeki of prefixler) {if (message.content.startsWith(içindeki)) strg = içindeki;}
        if (!strg) return;
        const args = message.content.slice(strg.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();
        if (message.guild && !message.member) await message.guild.fetchMember(message.author);
        const client = this.client
        const cmd = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command));
        if (!cmd) return
        cmd.run(client, message, args);
 }
};