const Discord = require('discord.js')
const Command = require('../Base/Command')
const kayıtlar = require('../Models/Register')
const stg = require('../Settings.json')

class Kayıtlarım extends Command {
    constructor(client) {
        super(client, {
            name: "kayıt-bilgi",
            aliases: ["kayıtbilgi", "kayıtlar", "teyitlerim", "teyitler", "teyit"]
        });
    }
    async run(client, message, args, data) {
        if(!message.member.roles.cache.get(stg.Roles.registerAuthy) && !stg.Roles.kayitYapabilenRoller.some(x => message.member.roles.cache.has(x)) && !message.member.hasPermission('ADMINISTRATOR')) return

        let user = message.mentions.members.first() || await this.client.üye(args[0], message.guild) || message.member
         kayıtlar.findOne({ user: user.id }, async (err, res) => {
            if (!res) return this.client.hızlı("<@" + user.id + "> kişisinin hiç kayıt bilgisi yok.", message.author, message.channel)
            let üyeler = await this.client.shuffle(res.kayıtlar.map(x => "<@" + x + ">"))
            if (üyeler.length > 10) üyeler.length = 10
            this.client.uzun("<@" + user.id + "> kişisi toplam " + res.toplam + " kayıt (**" + res.erkek + "** erkek, **" + res.kadın + "** kadın) uygulamış.\nKaydettiği bazı kişiler: " + üyeler.join(",") + " ", user.user, message.channel)
        })
    }
}

module.exports = Kayıtlarım;
     