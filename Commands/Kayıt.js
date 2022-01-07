const Discord = require('discord.js')
const Command = require('../Base/Command')
const moment = require('moment'); require('moment-duration-format')
const Database = require('../Models/Register')
const Schema = require('../Models/User')
const stg = require('../Settings.json')
const Client_Settings = require('../Models/ServerSettings')

class Kayıt extends Command {
    constructor(client) {
        super(client, {
            name: "isim",
            aliases: ["kayıt"],

        });
    }
    async run(client, message, args) {
        
        let server_Data = await Client_Settings.findOne({sunucu: message.guild.id})
        if(!server_Data) return this.client.hızlı(`<@${this.client.config.OwnerID}> - bot yapımcısına ulaşın ve kurulumun tamamlanmadığını söyleyin.`, message.author, message.channel)

        if(!message.member.roles.cache.get(stg.Roles.registerAuthy) && !stg.Roles.kayitYapabilenRoller.some(x => message.member.roles.cache.has(x)) && !message.member.hasPermission('ADMINISTRATOR')) return

        let registerTimes = this.client.registerTimer.get(message.author.id) || 0
        if(registerTimes === 3) return this.client.hızlı("30 saniyede 3 kayıt işlemi gerçekleştirebilirsiniz.", message.author, message.channel) 
        setTimeout(async() => { this.client.registerTimer.set(message.author.id, registerTimes - 3) }, 30000)

        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if(!member) return this.client.hızlı(`Bir üye etiketle ve tekrardan dene!`, message.author, message.channel)

        let isim = args.slice(1).filter(arg => isNaN(arg)).map(arg => arg[0].toUpperCase() + arg.slice(1).toLowerCase()).join(" ");
        let yaş = args.slice(1).filter(arg => !isNaN(arg))[0] ?? undefined;

        if(!isim) return this.client.hızlı(`Lütfen **isim** belirt ve tekrardan dene.`, message.author, message.channel);
        if(!yaş || isNaN(yaş)) return this.client.hızlı(`Lütfen **yaş** belirt ve tekrardan dene.`, message.author, message.channel)
        if(isim && (await this.client.chatKoruma(isim))) return tihs.client.hızlı(`Üyenin isime küfürlü veya link içeren bir şey yazamazsınız, geçerli bir isim belirtin!`, message.author, message.channel)
        if(isim.length > 30) return this.client.hızlı(`Hata! \`${isim}\` ismi 30 karakterden uzun, karakter sınırını geçmeyiniz.`, message.author, message.channel)
        if(yaş > 99) return this.client.hızlı(`Hata! Yaş iki basamağın üstüne çıkamaz.`, message.author, message.channel)

        if(message.author.id === member.id) return this.client.hızlı(`Bu işlemi kendinize uygulayamazsınız.`, message.author, message.channel)
        if(message.member.roles.highest.position <= member.roles.highest.position) return this.client.hızlı(`Belirtilen kişi sizden üst/aynı pozisyonda bulunduğu için işlem yapılamaz.`, message.author, message.channel)
        if(!member.manageable) return this.client.hızlı(`Belirtilen kişinin üzerinde yetkim bulunmamakta.`, message.author, message.channel)
        
       if(member.roles.cache.has(stg.PunitiveRoles.Suspect) || member.roles.cache.has(stg.PunitiveRoles.Jail) || 
       member.roles.cache.has(stg.PunitiveRoles.Karantina) || stg.PunitiveRoles.kayıtıYasaklıRoller.some(x => member.roles.cache.has(x))) 
       return this.client.hızlı(`${member} kişisinin üzerinde kayıtına engel olan yasaklı bir rol bulunmakta lütfen üst yetkililere danışın.`, message.author, message.channel)

       if(server_Data.TaglıAlım === true && !member.roles.cache.has(stg.Roles.vip) && !member.premiumSince && !message.member.hasPermission('VIEW_AUDIT_LOG')) return this.client.hızlı(`Şuan da \`Taglı Alım\` mevcuttur. Dilerseniz tagımızı (${this.client.config.Tag}) alarak veya Boost basarak sunucumuza kayıt olabilirsiniz.`, message.author, message.channel) 
      if(!member.roles.cache.has(stg.Roles.unregisterRole)) return this.client.hızlı(`Kişinin üzerinde **Kayıtsız** rolü bulunmadığı için işleme devam edemiyorum.`, message.author, message.channel)

       let isimAyar = `${member.user.username.includes(this.client.config.Tag) ? this.client.config.Tag : this.client.config.SecondaryTag} ${isim} | ${yaş}`;
       
        member.setNickname(`${isimAyar}`)

        let registerModel = await Schema.findOne({
          sunucu: message.guild.id,
          user: member.id
        });
        
        if (!registerModel) registerModel = await Schema.create({
          sunucu: message.guild.id,
          user: member.id,
          kayıtlar: []
          });

            Schema.findOne({sunucu: message.guild.id, user: member.id}, async(err, dbres) => {
                if(!dbres) {
                        let embed1 = new Discord.MessageEmbed()
                        .setAuthor(message.author.tag, message.author.avatarURL({dynamic: true}))
                        .setDescription(`${member} kişisinin ismi \`${isimAyar}\` olarak güncellendi.`)
                        .setColor('RANDOM')
                        .setFooter(this.client.config.EmbedFooter)
                    message.channel.send(embed1)
        
                } else {
                    let embed1 = new Discord.MessageEmbed()
                    .setAuthor(message.author.tag, message.author.avatarURL({dynamic: true}))
                    .setDescription(`${member} kişisinin ismi \`${isimAyar}\` olarak güncellendi, bu üye daha önce farklı isimlerle kayıt olmuş.
                    
                    ${this.client.emojis.cache.find(x => x.name === "axze_iptal")} Kişinin toplamda **${dbres.isimler.length}** kayıtı bulundu.
                    ${dbres.isimler.map(x => `\`• ${x.isimler}\` (${x.rol})`).slice(0, 5).join("\n ")}
        
                    Kişinin önceki isimlerine \`!isimler @Striga/ID\` komutuyla bakabilirsiniz.
                    `)
                    .setColor('RANDOM')
                    .setFooter(this.client.config.EmbedFooter)
                message.channel.send(embed1)
            }
        })

       const onay = await message.channel.awaitMessages((m) => m.author.id == message.author.id && ["!e", "!k", "!iptal",".e", ".k", ".iptal"].some(cevap => m.content.toLowerCase().includes(cevap)), {max: 1, time: 1000 * 30 });

       if (onay.size < 1) {
        Schema.findOne({user: member.id}, async(err,res) => {
          if(!res) {
          let arr = []
          arr.push({isimler: isimAyar, rol: `İsim Değiştirme`, yetkili: message.author.id, tarih: Date.now()})
          let newData = new Schema({ 
          user: member.id,
          isimler: arr
        })
        newData.save().catch(e => console.log(e))
      } else {
        res.isimler.push({isimler: isimAyar, rol: `İsim Değiştirme`, yetkili: message.author.id, tarih: Date.now()})
        res.save().catch(e => console.log(e))
      }
    })
  }

       if(server_Data.StrigaKayıt === true) return
      
       let kullanici = args.length > 0 ? message.mentions.users.first() || await this.client.client_üye(args[0]) || message.author : message.author
       let uye = message.guild.member(kullanici);
       const onayContent = onay.first().content.toLowerCase();


       if (["e", "erkek", "man"].some(x => onayContent.includes(x))) {
        Schema.findOne({sunucu: message.guild.id, user: uye.id}, async(err, dbres) => {
            if(!dbres) {
                let arr = []
                arr.push({isimler: isimAyar, rol: `<@&${stg.Roles.manRole}>`, yetkili: message.author.id, tarih: Date.now()})
                new Schema({sunucu: message.guild.id, user: uye.id, isimler: arr}).save().catch(err => console.log(`isimler (erkek.js) kayıt edilemedi\nSorun:`+ err))
    
                    let embed1 = new Discord.MessageEmbed()
                    .setAuthor(message.author.tag, message.author.avatarURL({dynamic: true}))
                    .setDescription(`${uye} üyesine ${stg.Roles.manRoles.map(x => `<@&${x}>`)} rolleri verildi.`)
                    .setColor('RANDOM')
                    .setFooter(this.client.config.EmbedFooter)
    
                message.channel.send(embed1)
    
            } else {
                dbres.isimler.push({isimler: isimAyar, rol: `<@&${stg.Roles.manRole}>`, yetkili: message.author.id, tarih: Date.now()})
                dbres.save().catch(err => console.log(`isimler (erkek.js) kayıt edilemedi\nSorun:`+ err))

                let embed1 = new Discord.MessageEmbed()
                .setAuthor(message.author.tag, message.author.avatarURL({dynamic: true}))
                .setDescription(`${uye} üyesine ${stg.Roles.manRoles.map(x => `<@&${x}>`)} rolleri verildi.`)
                .setColor('RANDOM')
                .setFooter(this.client.config.EmbedFooter)
                
            message.channel.send(embed1)
            }
        })
    
         Database.findOne({ user: message.author.id }, async (err, res) => {
            if (res) {
              if (res.kayıtlar.includes(uye.id)) {
                res.erkek = res.erkek
                res.save().catch(e => console.log(e))
              } else {
                res.kayıtlar.push(uye.id)
                res.erkek = res.erkek + 1
                res.toplam = res.toplam + 1
                res.save().catch(e => console.log(e))
              }
            } else if (!res) {
              let arr = []
              arr.push(uye.id)
              const data = new Database({
                sunucu: message.guild.id,
                user: message.author.id,
                erkek: 1,
                kadın: 0,
                toplam: 1,
                kayıtlar: arr
              })
              data.save().catch(e => console.log(e))
            }
          })
    
          uye.setNickname(`${isimAyar}`)
        setTimeout(() => { uye.roles.add(stg.Roles.manRoles).catch(err => console.log(`erkek rolü verilemedi\nsorun:`+ err)) }, 1500)
        uye.roles.remove(stg.Roles.unregisterRoles).catch(err => {{}})
    
        this.client.registerTimer.set(message.author.id, registerTimes + 1)
    
        let regLog = new Discord.MessageEmbed()
        .setAuthor(message.guild.name, message.guild.iconURL({dynamic: true}))
        .setDescription(`${message.author} tarafından ${uye} kişisinin kayıt işlemi gerçekleştirildi. ${this.client.emojis.cache.find(x => x.name === "axze_onay")}
        ─────────────────────────────
        Kullanıcı: ${uye} - (${uye.id})
        Yetkili: ${message.author} - (${message.author.id})
        İsim Yaşı: \`${isimAyar}\`
        Cinsiyet: \`Erkek\`
        Verilen Roller: ${stg.Roles.manRoles.map(x => `<@&${x}>`)}
        Alınan Roller: ${stg.Roles.unregisterRoles.map(x => `<@&${x}>`)}`)
        .setColor('#94DAFF')
        .setFooter(this.client.config.EmbedFooter)
        this.client.channels.cache.get(stg.Logs.registerLog).send(regLog)
        return;
       }





       if (["k", "kadın", "woman"].some(x => onayContent.includes(x))) { 

        
       Schema.findOne({sunucu: message.guild.id, user: uye.id}, async(err, dbres) => {
        if(!dbres) {
            let arr = []
            arr.push({isimler: isimAyar, rol: `<@&${stg.Roles.womanRole}>`, yetkili: message.author.id, tarih: Date.now()})
            new Schema({sunucu: message.guild.id, user: uye.id, isimler: arr}).save().catch(err => console.log(`isimler (kadın.js) kayıt edilemedi\nSorun:`+ err))

                let embed1 = new Discord.MessageEmbed()
                .setAuthor(message.author.tag, message.author.avatarURL({dynamic: true}))
                .setDescription(`${uye} üyesine ${stg.Roles.womanRoles.map(x => `<@&${x}>`)} rolleri verildi.`)
                .setColor('RANDOM')
                .setFooter(this.client.config.EmbedFooter)

            message.channel.send(embed1)

        } else {
            dbres.isimler.push({isimler: isimAyar, rol: `<@&${stg.Roles.womanRole}>`, yetkili: message.author.id, tarih: Date.now()})
            dbres.save().catch(err => console.log(`isimler (kadın.js) kayıt edilemedi\nSorun:`+ err))

            let embed1 = new Discord.MessageEmbed()
            .setAuthor(message.author.tag, message.author.avatarURL({dynamic: true}))
            .setDescription(`${uye} üyesine ${stg.Roles.womanRoles.map(x => `<@&${x}>`)} rolleri verildi.`)
            .setColor('RANDOM')
            .setFooter(this.client.config.EmbedFooter)
            
        message.channel.send(embed1)
        }
    })

     Database.findOne({ user: message.author.id }, async (err, res) => {
        if (res) {
          if (res.kayıtlar.includes(uye.id)) {
            res.kadın = res.kadın
            res.save().catch(e => console.log(e))
          } else {
            res.kayıtlar.push(uye.id)
            res.kadın = res.kadın + 1
            res.toplam = res.toplam + 1
            res.save().catch(e => console.log(e))
          }
        } else if (!res) {
          let arr = []
          arr.push(uye.id)
          const data = new Database({
            sunucu: message.guild.id,
            user: message.author.id,
            erkek: 0,
            kadın: 1,
            toplam: 1,
            kayıtlar: arr
          })
          data.save().catch(e => console.log(e))
        }
      })

    uye.setNickname(`${isimAyar}`)
    setTimeout(() => { uye.roles.add(stg.Roles.womanRoles).catch(err => console.log(`erkek rolü verilemedi\nsorun:`+ err)) }, 1500)
    uye.roles.remove(stg.Roles.unregisterRoles).catch(err => {{}})
    this.client.registerTimer.set(message.author.id, registerTimes + 1)
    let regLog = new Discord.MessageEmbed()
    .setAuthor(message.guild.name, message.guild.iconURL({dynamic: true}))
    .setDescription(`${message.author} tarafından ${uye} kişisinin kayıt işlemi gerçekleştirildi. ${this.client.emojis.cache.find(x => x.name === "axze_onay")}
    ─────────────────────────────
    Kullanıcı: ${uye} - (${uye.id})
    Yetkili: ${message.author} - (${message.author.id})
    İsim Yaşı: \`${isimAyar}\`
    Cinsiyet: \`Kadın\`
    Verilen Roller: ${stg.Roles.womanRoles.map(x => `<@&${x}>`)}
    Alınan Roller: ${stg.Roles.unregisterRoles.map(x => `<@&${x}>`)}`)
    .setColor('#ff94f4')
    .setFooter(this.client.config.EmbedFooter)
    this.client.channels.cache.get(stg.Logs.registerLog).send(regLog)
    return;
}

    }
}

module.exports = Kayıt;