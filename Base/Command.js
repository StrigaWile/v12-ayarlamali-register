class Command {
    constructor (client, {
      name = null,
      description = "Açıklaması Bulunmamakta.",
      category = "Kategorisi Bulunmamakta.",
      usage = "Kullanımı Bulunmamakta.",
      enabled = true,
      guildOnly = false,
      aliases = new Array(),
      permLevel = "User",
      coolDown = 0
    }) {
      this.client = client;
      this.conf = { enabled, guildOnly, aliases, permLevel, coolDown };
      this.help = { name, description, category, usage, coolDown };
    }
  }
  module.exports = Command;