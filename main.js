/*
 * Copyright (c) 2020 Aditya Saligrama, Anthony Cui, Emma Hsiao, John Lian.
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
const slowChannels = ["675201659558690875", "675350296142282752", "675381993642393641"];

const reactions = [
  "[NAME]'s pants were soaked for some reason", 
  "i dunno man, seems kinda gay to me", 
  "and that's why i'll never be grabbed from behind",
  "kinda makes me wanna chiu chiu your ass out",
  "is this why neil will never pin me to the wall?",
  "My mum is pissed at me, she looks at infinite campus and she is happy at first, then she sees the C+ in french.  'French is the easiest course Vingts Cinq, what happened'.  Then she yelled at me, and threw stuff at me, then she pinned me onto the bed.  She brought a balloon.  Then my dad came in and then I was kicked out while.  They locked the door.  This is what happened after.",
  "time for a threesome?",
  "this has me *thirsting* for anthony's purple derple",
  "*shits affectionately*",
  "and [NAME] slightly enjoyed it",
  "and [NAME] dreamed about it vividly that night",
  "but [NAME] didn't want it to end",
  "Jimmy liked it",
  "They undress, their stomachs are white.\nIn the yard, dewy and shivering\nwith crickets, they lie naked,\nface-up, face-down.\nThey learn Chinese.\nCrickets: chiu chiu. Dew: I’ve forgotten.\nNaked:   I’ve forgotten.\nNi, wo:   you and me.\nLegs are parted,\none tells the other\nthey are beautiful as the moon.",
  "ngl thats kinda hot",
  "i just came in my trousers",
  "that's the most outrageous thing i've seen today",
  "damn girl.  wanna 'make codes' together? ;))",
  "don't worry, i'll 'take care' of you ;))",
  "SSSCCCCLLLLLUUUURRRRRRRPPPPPPPPPP",
  "So I get bored and I play Overwatch.  I see Emma **** with Junkrat as usual.  And then I go onto DeviantArt, and I see Angela x Anthony **** as usual.  And then I walk into John Lian's class, and I see John Lian with, with, with Tao Lao Shi.  So I walk out and hang myself.",
  "And then Mr. Davidson walks in, 'cats are cool bye', and goes on a one hour linguistics lab, which everyone is bored.  Then he gives us a test about circles and vibrations.  And after the test is finished, everyone begins to have sex.",
  "And I throw up, and then I wake up again, and I see myself in the bed again, but the bed is full of white stuff.  I flip over the person and I see the face off Kulass' ass, and I wake up and scream.  I find myself in a pile of PurpleDerples, and they yell at me saying 'oh yeah' and making those lips noises, and it was great.  Then I time traveled to the past so I could see the dinosaurs, and I licked all the dinosaurs, and it was great.  And then the Dinos all died from STDs and whatevers that thing is.  I insert my **** into the dinos, and Derples are born.  And then meteorites fall, and a star appears.  Surprise surprise it’s Angela.",
  "Pal is right in front of me, and he bites me, and I bite him beck, and I think he’s traumatised.  So Pal runs away screaming.",
  "we decided to duke it out using our fidget spinners.  We fight each other with our ****s.",
  "After I bit my dick, I see Pal with the bible, descending from Heaven.  Then he shoves the bible in [NAME]'s ass, saying 'my disciple, do you like it?' [NAME] yells out yes.  But then he launched a nuke saying '2sinful4me'.  But we decided to shemx anyways bam bam, pow pow, and I created humans.  And this is why you guys can’t suck ur dick or else Pal will come down from Heaven again and smack you with the Bible, and with the title 'Repent'.",
  "[NAME]'s dick, shocked by the revelation, flies into my mouth, and I spit it out.  Then I roast it, and then I dry it, and then I slow roast it, add some mushrooms, and some saute sauce, and I suck on it.  Then I cut it into pieces and I eat it like a French lady.  I cut them into tiny pieces, but then I invent a robotic penis, and they're is fine, just like how Genji has a robotic penis.  So I eat their dick with a lot of saute sauce, and I slowly chew it.  It’s soft, with a nice texture, but it’s also hard on it inside, and then I realize there’s still some semen left in it, so I poop out a baby."
]
const names = [
  "Adi",
  "Anthony",
  "Angela",
  "Ben",
  "Bryant",
  "Byrnart", 
  "Cuwee Cwee",
  "Chunnathan Liar",
  "Dadi Sawigwama",
  "Daddy BoKo", 
  "Daddy mitch", 
  "Daniel",
  "Emma",
  "Jimmy",
  "John",
  "Krist Offer",
  "Neil",
  "Neil Krishna Malur",
  "Matthew",
  "Mister :full_moon_with_face:",
  "Vincent",
  "Wes",
  "Willy",
  "Zander",
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

  var ret = reactions[Math.floor(Math.random() * reactions.length)];
  if (ret.includes("[NAME]")) {
    ret = ret.replace("[NAME]", names[Math.floor(Math.random() * names.length)]);
  }

  return ret;
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
  client.user.setActivity("DM confessions here | add !noreact for serious messages");

  const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name='pool';").get();
  if (!table['count(*)']) {
    sql.prepare("CREATE TABLE pool (id INTEGER PRIMARY KEY AUTOINCREMENT, message TEXT, date TEXT, reaction TEXT);").run();
    sql.pragma("synchronous = 1");
    sql.pragma("journal_mode = wal"); //pin me to the wal
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

  if (message.content.trim().split(" ").length < 3 && message.content.trim().length < 15) {
    message.channel.send(new Discord.RichEmbed()
      .setColor('#d08770')
      .setTitle('Error')
      .setDescription('Sorry, confessions should be longer than 3 words or 15 characters')
    );
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
  //message.channel.send(confessionReturn);
  //Make it so that the bot does not respond to confessions so we can delete our degeneracy :)
  message.channel.send(new Discord.RichEmbed()
      .setColor('#88c0d0')
      .setTitle('Success')
      .setDescription('Confession saved!')
  );
});

client.login(auth.token);
