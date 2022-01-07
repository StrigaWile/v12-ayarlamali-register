const Discord = require('discord.js')
const Command = require('../Base/Command')
const moment = require('moment'); require('moment-duration-format')
const Database = require('../Models/Register')
const Schema = require('../Models/User')
const stg = require('../Settings.json')
const Client_Settings = require('../Models/ServerSettings')

class Unregister extends Command {
    constructor(client) {
        super(client, {
            name: "unregister",
            aliases: ["kayıtsız", "unreg"],

        });
    }
    async run(client, message, args) {

        if(!message.member.roles.cache.get(stg.Roles.registerAuthy) && !stg.Roles.kayitYapabilenRoller.some(x => message.member.roles.cache.has(x)) && !message.member.hasPermission('ADMINISTRATOR')) return

        let registerTimes = this.client.unregisterLimit.get(message.author.id) || 0
        if(registerTimes === 1) return this.client.hızlı("60 saniyede 1 kayıtsız işlemi gerçekleştirebilirsiniz.", message.author, message.channel) 
        setTimeout(async() => { this.client.unregisterLimit.set(message.author.id, registerTimes - 3) }, 60000)

        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if(!member) return this.client.hızlı(`Bir üye etiketle ve tekrardan dene!`, message.author, message.channel)

        if(message.author.id === member.id) return this.client.hızlı(`Bu işlemi kendinize uygulayamazsınız.`, message.author, message.channel)
        if(message.member.roles.highest.position <= member.roles.highest.position) return this.client.hızlı(`Belirtilen kişi sizden üst/aynı pozisyonda bulunduğu için işlem yapılamaz.`, message.author, message.channel)
        if(!member.manageable) return this.client.hızlı(`Belirtilen kişinin üzerinde yetkim bulunmamakta.`, message.author, message.channel)
        
       if(member.roles.cache.has(stg.Roles.unregisterRole)) return this.client.hızlı(`Kişinin üzerinde **Kayıtsız** rolü zaten var!`, message.author, message.channel) 
       if(member.roles.cache.has(stg.PunitiveRoles.Suspect) || member.roles.cache.has(stg.PunitiveRoles.Jail) || 
       member.roles.cache.has(stg.PunitiveRoles.Karantina) || stg.PunitiveRoles.kayıtıYasaklıRoller.some(x => member.roles.cache.has(x))) 
       return this.client.hızlı(`${member} kişisinin üzerinde olan yasaklı bir rol bulunmakta lütfen üst yetkililere danışın.`, message.author, message.channel)

    setTimeout(() => { member.roles.add(stg.Roles.unregisterRoles).catch(err => console.log(`unregister rolü verilemedi\nsorun:`+ err)) }, 1500)


    this.client.unregisterLimit.set(message.author.id, registerTimes + 1)

    let regLog = new Discord.MessageEmbed()
    .setAuthor(message.guild.name, message.guild.iconURL({dynamic: true}))
    .setDescription(`${message.author} tarafından ${member} kişisi kayıtsıza atıldı! ${this.client.emojis.cache.find(x => x.name === "axze_onay")}`)
    .setColor('#ff94f4')
    .setFooter(this.client.config.EmbedFooter)
    .setTimestamp()
    this.client.channels.cache.get(stg.Logs.unregisterLog).send(regLog)


    }
}

module.exports = Unregister;