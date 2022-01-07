const Mongo = require('mongoose')

module.exports = Mongo.model("striga_kayıt", new Mongo.Schema({
    sunucu: String,
    user: String,
    isimler: Array
}));