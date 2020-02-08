/*
 * Copyright (c) 2018 Aditya Saligrama.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO
 * EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES
 * OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

// Load up the discord.js library
const Discord = require("discord.js");

// This is your client. Some people call it `bot`, some people call it `self`,
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const client = new Discord.Client();

// Here we load the config.json file that contains our token and our prefix values.
const auth = require("./auth.json");
// config.token contains the bot's token
// config.prefix contains the message prefix.

const SQLite = require("better-sqlite3");
const sql = new SQLite("./pool.sqlite");

const logChannel = "675193177656918039";
//const slowChannels = ["675201659558690875", "675350296142282752"];
const slowChannels = ["675201659558690875"];

const reactions = [
  "[NAME]'s pants were soaked for some reason", 
  "i dunno man, seems kinda gay to me", 
  "and that's why i'll never be grabbed from behind",
  "kinda makes me wanna chiu chiu your ass out",
  "is this why neil will never pin me to the wall?",
  "and that's why my mum is pissed at me...",
  "time for a threesome?",
  "this has me *thirsting* for anthony's purple derple",
  "*shits affectionately*",
  "Rawr! X3 nuzzles pounces on you UwU you so warm, couldn't help but notice your bulge from across the floor",
  "and [NAME] slightly enjoyed it",
  "and [NAME] dreamed about it vividly that night",
  "but [NAME] didn't want it to end",
  "Jimmy liked it",
  "They undress, their stomachs are white.\nIn the yard, dewy and shivering\nwith crickets, they lie naked,\nface-up, face-down.\nThey learn Chinese.\nCrickets: chiu chiu. Dew: I’ve forgotten.\nNaked:   I’ve forgotten.\nNi, wo:   you and me.\nLegs are parted,\none tells the other\nthey are beautiful as the moon.",
  "ngl thats kinda hot",
  "i just came in my trousers"
]

var pool = []

function timeConverter(UNIX_timestamp) {
  var a = new Date(UNIX_timestamp);
  time = a.toLocaleString('en-US');
  return time;
}

function addReaction() {
  if (Math.random() > 0.2) {
    return null;
  }
  return reactions[Math.floor(Math.random() * reactions.length)];
}

function createConfession(userMessage) {
  var embed = new Discord.RichEmbed()
    .setColor('#88c0d0')
    .setTitle('Confession #' + userMessage.id)
    .setDescription(userMessage.message)
    .setFooter("posted at " + timeConverter(userMessage.date));

  if (userMessage.reaction != null) {
    embed = embed.addField('Word of rngesus', userMessage.reaction);
  }
  return embed;
}

function selectMessage() {
  var toSend = client.getMessage.get();
  if (!toSend) {
    return null;
  }
  client.deletePulled.run(toSend.id);
  var message = createConfession(toSend);
  return message;
}

client.on("ready", () => {
  // This event will run if the bot starts, and logs in, successfully.
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
  client.user.setGame("DM me your confessions");

  const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name='pool';").get();
  if (!table['count(*)']) {
    sql.prepare("CREATE TABLE pool (id INTEGER PRIMARY KEY AUTOINCREMENT, message TEXT, date TEXT, reaction TEXT);").run();
    sql.pragma("synchronous = 1");
    sql.pragma("journal_mode = wal");
  }

  client.getMessage = sql.prepare("SELECT * FROM pool ORDER BY RANDOM() LIMIT 1;");
  client.deletePulled = sql.prepare("DELETE FROM pool WHERE id=?");
  client.pushMessage = sql.prepare("INSERT INTO pool (message, date, reaction) VALUES (@message, @date, @reaction);");
  client.getLast = sql.prepare("SELECT * FROM pool ORDER BY id DESC LIMIT 1;");
  client.returnId = sql.prepare("SELECT id FROM pool WHERE message=?");

  var interval = setInterval(function() {
    for (var i = 0; i < 5; i++) {
      var toSend = selectMessage();
      console.log(toSend);
      if (toSend != null) {
        slowChannels.forEach(channel => client.channels.get(channel).send(toSend));
      }
    }
  }, 3600000);
});

client.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
});

client.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
});


client.on("message", async message => {
  // This event will run on every single message received, from any channel or DM.

  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").

  if (message.author.bot || message.channel.type != "dm") {
    return;
  }


  var reaction = addReaction();
  if (message.content.includes("!noreact")) {
    reaction = null;
    message.content = message.content.replace("!noreact", "");
  }

  client.pushMessage.run({'message': message.content, 'date': timeConverter(message.createdTimestamp), 'reaction': reaction});
  var id = client.returnId.get(message.content).id;
  var confessionReturn = createConfession({'id': id, 'message': message.content, 'date': timeConverter(message.createdTimestamp), 'reaction': reaction})
  client.channels.get(logChannel).send(confessionReturn);
  message.channel.send(confessionReturn);
});

client.login(auth.token);
