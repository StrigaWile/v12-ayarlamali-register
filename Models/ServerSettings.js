const Mongo = require('mongoose')

module.exports = Mongo.model("striga_sunucu_ayarları", new Mongo.Schema({
   Sunucu: { type: String, default: "" },
   TaglıAlım: { type: Boolean, default: false },
   StrigaKayıt: { type: Boolean, default: true },
   AtlKayıt: { type: Boolean, default: false },
   NormalHG: { type: Boolean, default: true }, 
   EmbedHG: { type: Boolean, default: false },
}));