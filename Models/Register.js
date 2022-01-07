const Mongo = require('mongoose')

module.exports = Mongo.model("striga_yetkili_kayıtları", new Mongo.Schema({
   sunucu: String,
   user: String,
   erkek: Number,
   kadın: Number,
   toplam: Number,
   kayıtlar: Array
}));