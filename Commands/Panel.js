const Discord = require('discord.js')
const Command = require('../Base/Command')
const stg = require('../Settings.json')
const Client_Settings = require('../Models/ServerSettings')

class Panel extends Command {
    constructor(client) {
        super(client, {
            name: "panel",
            aliases: ["striga-panel"],

        });
    }
    async run(client, message, args) {
        if(message.author.id !== this.client.config.OwnerID) return

        if(!args[0]) return this.client.normal(`
        \`Emoji Kurulumu\` .striga-panel emoji-kur
        \`Data Kurulumu\` .striga-panel kur
        \`Data Kontrol\` .striga-panel kontrol 
        \`Taglı Alım\` .striga-panel taglı-alım aç/kapat
        \`Kayıt Sistemi\` .striga-panel kayıt-sistemi atl/normal
        \`Hoş geldin Mesajı\` .striga-panel hoş-geldin normal/embedli
        `, message.author, message.channel)

        if(args[0] === "kontrol") {
            let data1 = await Client_Settings.findOne({ sunucu: message.guild.id })
            if(!data1) {
                this.client.uzun(`**${message.guild.name}** Sunucusunun ayarlamaları tamamlanmamış \`.striga-panel kur\` komutuyla kurulmları tamamlayın`, message.author, message.channel)
            } else {
               let embed = new Discord.MessageEmbed()
               .setAuthor(message.guild.name, message.guild.iconURL({dynamic: true}))
               .setDescription(`Aşağıdan sunucunun ayarlarını kontrol edebilirsiniz.`)
               .addField(`Sunucu`, `\`\`\`${message.guild.name}\`\`\``, true)
               .addField(`Taglı Alım`, `\`\`\`${data1.TaglıAlım === true ? "Aktif.":"Kapalı."}\`\`\``, true)
               .addField(`Normal Kayıt`, `\`\`\`${data1.StrigaKayıt === true ? "Aktif.":"Kapalı."}\`\`\``, true)
               .addField(`Atlantis Kayıt`, `\`\`\`${data1.AtlKayıt === true ? "Aktif.":"Kapalı."}\`\`\``, true)
               .addField(`Normal Hoş Geldin`, `\`\`\`${data1.NormalHG === true ? "Aktif.":"Kapalı."}\`\`\``, true)
               .addField(`Embedli Hoş Geldin`, `\`\`\`${data1.EmbedHG === true ? "Aktif.":"Kapalı."}\`\`\``, true)
               .setColor('RANDOM')
               .setFooter(this.client.config.EmbedFooter)
               message.channel.send(embed).then(message.react(this.client.emojis.cache.find(x => x.name === "axze_onay"))).catch(err => {{[]}})
            }
        }


        if(args[0] === "kur") {
            let data1 = await Client_Settings.findOne({ sunucu: message.guild.id })
            if(!data1) {
            new Client_Settings({sunucu: message.guild.id}).save();
            this.client.normal(`**${message.guild.name}** sunucusunun \`Database'i\` kuruldu!`, message.author, message.channel)
            } else {
                this.client.hızlı(`Zaten \`Database\` **kurulu**! ${this.client.emojis.cache.find(x => x.name === "axze_iptal")}`, message.author, message.channel)
            }

        }

        if(args[0] === "emoji-kur") {
            let onay = "https://cdn.discordapp.com/emojis/810113745459478558.gif?size=96";
            let iptal = "https://cdn.discordapp.com/emojis/673576480487506011.gif?v=1"; 
            let axze_erkek = "https://cdn.discordapp.com/emojis/782554741896773633.gif?v=1";
            let axze_kadin = "https://cdn.discordapp.com/emojis/782554741669888000.gif?v=1";
            let axze_deynek = "https://cdn.discordapp.com/emojis/794553871405285386.gif?v=1"
            
            message.guild.emojis.create(onay, "axze_onay").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
            message.guild.emojis.create(iptal, "axze_iptal").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
            message.guild.emojis.create(axze_erkek, "axze_erkek").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
            message.guild.emojis.create(axze_kadin, "axze_kadin").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
            message.guild.emojis.create(axze_deynek, "axze_deynek").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
        }


        if(args[0] === "taglı-alım" || args[0] === "taglıalım") {
            if(!args[1]) return this.client.hızlı(`Açmak mı istiyorsun kapatmak mı ? \`.striga-panel taglı-alım aç/kapat\``, message.author, message.channel)
            
            if(args[1] === "aç") {
                let data = await Client_Settings.findOne({ sunucu: message.guild.id })
                if(!data) return this.client.uzun(`**${message.guild.name}** Sunucusunun ayarlamaları tamamlanmamış \`.striga-panel kur\` komutuyla kurulmları tamamlayın`, message.author, message.channel)
                
                if(data.TaglıAlım === true) return this.client.hızlı(`Taglı alım zaten açık!`, message.author, message.channel)
                
                if(data.TaglıAlım === false) {
                    data.TaglıAlım = true
                    data.save();
                    this.client.normal(`Taglı alım **açıldı**! ${this.client.emojis.cache.find(x => x.name === "axze_onay")}`, message.author, message.channel)
                }
            }

            if(args[1] === "kapat") {

                let data = await Client_Settings.findOne({ sunucu: message.guild.id })
                if(!data) return this.client.uzun(`**${message.guild.name}** Sunucusunun ayarlamaları tamamlanmamış \`.striga-panel kur\` komutuyla kurulmları tamamlayın`, message.author, message.channel)
                
                if(data.TaglıAlım === false) return this.client.hızlı(`Taglı alım zaten kapalı!`, message.author, message.channel)
                
                if(data.TaglıAlım === true) {
                    data.TaglıAlım = false
                    data.save();
                    this.client.normal(`Taglı alım **kapatıldı**! ${this.client.emojis.cache.find(x => x.name === "axze_onay")}`, message.author, message.channel)
                }
            }
        }

        if(args[0] === "kayıt-sistemi") {
            if(!args[1]) return this.client.hızlı(`Atlantis mi yoksa basit sistem mi ? \`.striga-panel kayıt-sistemi emoji/normal\``, message.author, message.channel)
            
            if(args[1] === "atl" || args[1] === "atlantis") {
                let data = await Client_Settings.findOne({ sunucu: message.guild.id })
                if(!data) return this.client.uzun(`**${message.guild.name}** Sunucusunun ayarlamaları tamamlanmamış \`.striga-panel kur\` komutuyla kurulmları tamamlayın`, message.author, message.channel)
                
                if(data.AtlKayıt === true) return this.client.hızlı(`Atlantis kayıt sistemi zaten açık!`, message.author, message.channel)
                if(data.AtlKayıt === false) {
                    data.StrigaKayıt = false;
                    data.AtlKayıt = true;
                    data.save();
                    this.client.normal(`Atlantis kayıt sistemi **aktif** edildi! ${this.client.emojis.cache.find(x => x.name === "axze_onay")}`, message.author, message.channel)
                }
            }

            if(args[1] === "striga" || args[1] === "basit" || args[1] === "normal") {

                let data = await Client_Settings.findOne({ sunucu: message.guild.id })
                if(!data) return this.client.uzun(`**${message.guild.name}** Sunucusunun ayarlamaları tamamlanmamış \`.striga-panel kur\` komutuyla kurulmları tamamlayın`, message.author, message.channel)
                
                if(data.StrigaKayıt === true) return this.client.hızlı(`Normal (Striga) kayıt sistemi zaten açık!`, message.author, message.channel)
                if(data.StrigaKayıt === false) {
                    data.AtlKayıt = false;
                    data.StrigaKayıt = true;
                    data.save();
                    this.client.normal(`Normal (Striga) kayıt sistemi **aktif** edildi! ${this.client.emojis.cache.find(x => x.name === "axze_onay")}`, message.author, message.channel)
                }
            }
        } 


        if(args[0] === "hoş-geldin" || args[0] === "hg" || args[0] === "hoşgeldin") {
                
            if(args[1] === "normal") {

            let data = await Client_Settings.findOne({ sunucu: message.guild.id })
            if(!data) return this.client.uzun(`**${message.guild.name}** Sunucusunun ayarlamaları tamamlanmamış \`.striga-panel kur\` komutuyla kurulmları tamamlayın`, message.author, message.channel)

            if(data.NormalHG === true) return this.client.hızlı(`Normal HG mesajı zaten açık!`, message.author, message.channel) 
            if(data.NormalHG === false) {
                data.EmbedHG = false;
                data.NormalHG = true;
                data.save()
                this.client.normal(`Normal HG mesajı **aktif** edildi! ${this.client.emojis.cache.find(x => x.name === "axze_onay")}`, message.author, message.channel)
            }
        }

        if(args[1] === "embed" || args[1] === "embedli") {

            let data = await Client_Settings.findOne({ sunucu: message.guild.id })
            if(!data) return this.client.uzun(`**${message.guild.name}** Sunucusunun ayarlamaları tamamlanmamış \`.striga-panel kur\` komutuyla kurulmları tamamlayın`, message.author, message.channel)

            if(data.EmbedHG === true) return this.client.hızlı(`Embed HG mesajı zaten açık!`, message.author, message.channel) 
            if(data.EmbedHG === false) {
                data.NormalHG = false;
                data.EmbedHG = true;
                data.save()
                this.client.normal(`Embed HG mesajı **aktif** edildi! ${this.client.emojis.cache.find(x => x.name === "axze_onay")}`, message.author, message.channel)
            }
        }

        }


    }
}

module.exports = Panel;