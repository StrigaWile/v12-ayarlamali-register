const Discord = require('discord.js')
const Command = require('../Base/Command')
const moment = require('moment'); require('moment-duration-format')
const Database = require('../Models/Register')
const Schema = require('../Models/User')
const stg = require('../Settings.json')
const Client_Settings = require('../Models/ServerSettings')

class Bilgilendirme extends Command {
    constructor(client) {
        super(client, {
            name: "txt",
            aliases: [],

        });
    }
    async run(client, message, args) {

      if(message.author.id !== this.client.config.OwnerID) return

      let server_Data = await Client_Settings.findOne({sunucu: message.guild.id})
      if(!server_Data) return this.client.hızlı(`<@${this.client.config.OwnerID}> - bot yapımcısına ulaşın ve kurulumun tamamlanmadığını söyleyin.`, message.author, message.channel)

        if(!args[0]) return this.client.hızlı(`Seçenek belirt atl/stg`, message.author, message.channel)

        if(args[0] === "atl") {
            let embed1 = new Discord.MessageEmbed()
            .setAuthor(message.guild.name, message.guild.iconURL({dynamic: true}))
            .setDescription(`Selam dostlar ilk öncelikle teyitsiz kimseyi kayıt etmemenizi öneriyoruz aksi taktirde kimin kadın kimin erkek olduğunu anlamayazsınız, aşağıda ki bilgilendirmeyi okuyup nasıl kayıt yapacağınızı rahatlıkla anlayabilirsiniz görevinizde başarılar dileriz!
            
            Kayıt Komutları;
            \` • \` **!isim @Striga/ID isim yaş**
            \` • \` **!erkek / kadın**
    
            Not: \`İlk öncelikle isim komutunu kullanın sonra kullanıcıyı\` __etiketlemeden__ \`!erkek ya da !kadın komutunu yazın.\``)
            .setColor('BLACK')
            message.channel.send(embed1)
        }

        if(args[0] === "stg") {
            let embed1 = new Discord.MessageEmbed()
            .setAuthor(message.guild.name, message.guild.iconURL({dynamic: true}))
            .setDescription(`Selam dostlar ilk öncelikle teyitsiz kimseyi kayıt etmemenizi öneriyoruz aksi taktirde kimin kadın kimin erkek olduğunu anlamayazsınız, aşağıda ki bilgilendirmeyi okuyup nasıl kayıt yapacağınızı rahatlıkla anlayabilirsiniz görevinizde başarılar dileriz!
            
            Kayıt Komutları;
            \` • \` **!erkek @Striga/ID isim yaş**
            \` • \` **!kadın @Striga/ID isim yaş**
            \` • \` **!isim @Striga/ID isim yaş**
    
            Not: \`!isim komutu ile yanlış yazılan isimleri düzeltebilirsiniz\`
            Hatırlatma: kişinin 1 den fazla ismi varsa örneğin Striga Wile !erkek @Striga/ID Striga Wile 21 olarak kayıt yapabilirsiniz.
            `)
            .setColor('BLACK')
            message.channel.send(embed1)
        }


    }
}

module.exports = Bilgilendirme;