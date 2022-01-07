const Discord = require("discord.js")
const STG = require('../Settings.json')
const config = require('../config')
const Data = require('../Models/ServerSettings')
const moment = require('moment'); require("moment-duration-format")
moment.locale("tr")

module.exports = class {
    constructor(client) {
        this.client = client;
    }
   async run(member) {
       
    const guvenilirlik = Date.now()-member.user.createdTimestamp < 1000*60*60*24*7;
    if(guvenilirlik) {
        setTimeout(async() => {     
    member.roles.set([STG.PunitiveRoles.Suspect])
}, 1000)
        member.guild.channels.cache.get(STG.Logs.suspectLog).send(new MessageEmbed().setAuthor(member.guild.name, member.guild.iconURL({dynamic:true})).setDescription(`${member} kişisinin hesabı \`${moment(member.user.createdTimestamp).fromNow()}\` önce açıldığı için <@&${STG.PunitiveRoles.Suspect}> verdim.`).setTimestamp().setColor('RANDOM'))
    } else {     

        let gifs = ["https://cdn.discordapp.com/attachments/742291863406379028/928688091873542185/sunucugif.gif", "https://cdn.discordapp.com/attachments/742291863406379028/928688821044912159/tumblr_2a94d0056b52955026524be11448585c_432b0bf9_640.gif", "https://cdn.discordapp.com/attachments/742291863406379028/928688819866304572/BackWellmadeGopher-max-1mb.gif", "https://cdn.discordapp.com/attachments/742291863406379028/928688820285747280/evan-munro-rain.gif", "https://cdn.discordapp.com/attachments/742291863406379028/928688820545810432/motocross-saito-400.gif", "https://cdn.discordapp.com/attachments/742291863406379028/928688821393051721/steamuserimages-a.akamaihd.gif"]
        const randomGif = gifs[Math.floor(Math.random() * gifs.length)];
         let database = await Data.findOne({sunucu: member.guild.id})
         if(!database) return

         let kontrol;
         if(guvenilirlik) { kontrol = `Hesabın Güvenilir Değil. ${this.client.emojis.cache.find(x => x.name === "axze_iptal")}`} else { kontrol = `Hesap Güvenilir ${this.client.emojis.cache.find(x => x.name === "axze_onay")}` }
     

         if(database.NormalHG === true) { member.guild.channels.cache.get(STG.Logs.welcomeChat).send(`🎉 Striga'ya hoş geldin ${member} ! Hesabın ${moment(member.user.createdTimestamp).format("LLL")} tarihinde (${moment(member.user.createdTimestamp).fromNow()}) oluşturulmuş.\n\nSunucu kurallarımız <#${STG.Logs.rulesChannel}> kanalında belirtilmiştir. Unutma sunucu içerisinde ki ceza işlemlerin kuralları okuduğunu varsayarak gerçekleştirilecek.\nSeninle beraber ${member.guild.members.cache.size} kişi olduk! Tagımızı (${config.Tag}) alarak bizlere destek olabilirsin.\n\nSes teyit için yetkililerimiz seni V.Confirmed kanallarında bekliyor olacak. İyi eğlenceler!`) } else if(database.EmbedHG === true) { 

            let embed = new Discord.MessageEmbed()
            .setAuthor(member.guild.name, member.guild.iconURL({dynamic:true}))
            .setDescription(`Merhaba ${member}! Aramıza hoş geldin!
            
            Sunucumuzun kurallarını (<#${STG.Logs.rulesChannel}>) okuyarak ceza-i işlemler hakkında bilgi sahibi olmanı öneriyoruz.
        
            Seninle Beraber **${member.guild.members.cache.size}** kişi olduk! Tagımızı alarak bizleri destekleyebilirsin.
        
            Ses kanallarında (\`V.Confirmed\`) yetkililere ses teyit vererek kayıt olabilirsin.`)
            .addField(`Hesap Tarihi`, `${moment(member.user.createdTimestamp).format("LLL")}`, true)
            .addField(`Güvenilirlik`, `${kontrol}`, true)
            .setImage(randomGif)
            .setColor('RANDOM')
            .setFooter(config.EmbedFooter)
        
             member.guild.channels.cache.get(STG.Logs.welcomeChat).send(embed)
          }


        setTimeout(async() => {

            await member.setNickname(`${config.SecondaryTag} İsim | Yaş`)
            await member.roles.add(STG.Roles.unregisterRoles)

            if(member.user.username.includes(config.Tag)) {
                member.roles.add(STG.Roles.familyRole)
              } 
            }, 1000) //ANİDEN ÜYE AKIŞLARINDA BUGLANMAMASI İÇİN SANİYEDE 1 İŞLEM GÖRMESİNİ SAĞLIYORUZ.

    }

    }
}
