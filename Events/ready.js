const {Discord, MessageEmbed} = require('discord.js')
const config = require('../config')
module.exports = class {
    constructor(client) {
        this.client = client;
    } 
    async run() {

        this.client.user.setPresence({activity: {name: config.Client_Message }, status: config.Client_Status})
        if(config.Client_Voice && this.client.channels.cache.has(config.Client_Voice)) this.client.channels.cache.get(config.Client_Voice).join().catch(err => {{}}) 
        console.log(`Client sesli odaya bağlandı. ✔`)

    }
}