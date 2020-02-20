﻿/*
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
const instantChannel = "675350296142282752";
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
  "then [NAME] creamed their pants",
  "Sm so much mh.",
  "Smh my head.",
  "You should spice up your panic attack with a harmonica.",
  "If you’re going into labor you should also bring a Nintendo Switch joycon to see if your baby is a gamer. If not, through the baby in the trashcan.",
  "Do you ever wonder why there’s gender specific deodorant? Like why can’t woman smell like a rugged mountain pickup truck and why can’t a man smell like a bagina?",
  "Do you ever go fuck it and slap your own ass",
  "Sometimes i get so stressed i slap my ass like a cowboy slapping his horses hinds to jostle it but sometimes i feel like both the horse and rider combined into one vaguely stressed and horny creature",
  "precious cinnamon roll [NAME] must protecc oooh so relatable so awkward and nervous and shy and wow look at [NAME] hair its so messy and greasy does she shower? i bet [NAME] doesn't god [NAME]",
  "I cant wait for [NAME]aged like a fine wine in a basement. god i cant wait for [NAME] to just completely turn into an absolute HOTTIE when the college happens. maybe [NAME] will grow big bountiful breasts and dicks for me,to suckle upon like a true deserving lord and god. god, and [NAME]’s feet can only get bigger and smellier from here. i can already FEEL the WRINKLES",
  "it happened again. i woke up with a stain on my pants just THINKING of [NAME]’s delicious feet. i would give ANYTHING for [NAME] to step on me and run the greasy hair all over me. i can't do this. i can't wait until college just to get a glimpse of [NAME]’s delectable toes. it feels like i'm waiting the whole 2 years and more just to see those bountiful flowers.",
  "Pee pee poo poo imma piss like a helicopter",
  "If you breakdance and pee you are essentially a pissing helicopter",
  "When i die i want to be cremated into essential oils so i can always be useless",
  "I love taking a shower it reminds me of me getting pissed on by [NAME]",
  "That’s so lit fam. I’ll dab to that and yeet a fortnite",
  "Says [NAME] as they pisses into my mouth",
  "Says [NAME] as he helicopters away with his boner",
  "Everyone gangsta until [NAME] the hentai has your principle",
  "Please pringle my superior rectal artery with your distal renax.",
  "[NAME] iws so quiwky awnd wewatabwe uwu. [NAME] iws so cute with hew messy haiw😍. As[NAME]-sama, i’ww make hew take pwivate wessons with me in my woom 😏. But i won’t be teaching anything owo, we’we gonna pway sowme speciaw games togethew 😁😁. Fiwst, i’ww make hew sit down own my bed (facing away fwom me uwu) awnd bwindfowd hew as i cawess hew hew diwty unwashed haiw, awnd sniff the dewicious gwease off of hew head🤤. I bet hew haiw has so much wint awnd dead skin in iwt since [NAME]  doesn’t wash it😳 oh i wanna pick iwt out of hew haiw wike a monkey awnd keep sowme of the skin (not wike [NAME] needs iwt uwu).",
  "I bet [NAME] chan skin iws supew soft, if i poke hew chubby cheeks my fingews wouwd squish in awnd it’d feew soo good🤤. I bet its supew tickwish, whewn i gow tuwu cawess he squishy waist, she wouwd giggwe awnd teww me tuwu stowp uwu, but i won’t stowp. I wouwd wwap my awms awound bewna-chan’s tum tum awnd put my hands in hew soft bewwy, wubbing iwt whiwe i sniff hew gweasy haiw hngg😩😩... I’m getting exited juwst thinking abouwt iwt.😫😫.",
  "I’m gonna make suwe tuwu take cawe of [NAME]-chan’s beautifuwwy soft hands, i bet they smeww juwst wike the pages in the books she weads😩🤤😩, but hew hands awe nothing compawed tuwu the beauty of hew chunky, unshaven wegs. Hew wittwe haiws wouwd tickwe so much as i wub my face up awnd down hew weg🤤. Aftew thawt iws the twue tweasuwe. Hew feet",
  "Oh hew beautifuw, sweaty, smewwy feet😫. I bet they put [NAME] feet tuwu shame white how juicy they awe, awways being cwamped up in [NAME]-chan’s unwashed socks🤤🤤. I bet sowme of hew toenaiws awe chipped fwom jamming thewm intwo hew tabwe awnd chaiw, i wouwdn’t mind cweaning thewm up fow hew with my mouth😩😩. ",
  "Oh i wawnt hew tuwu wub hew feet aww ovew my face, i wawnt hew tuwu pin me tuwu the gwound with thewm but i know she wouwdn’t duwu that😒. Even though she won’t, i stiww wuv [NAME]-chan. I know my sweet [NAME] -chan won’t teww anyone abouwt ouw wittwe pwivate study session, she’s too shy awnd sweet to😊. But if i see any of the mawe students (especiawwy thawt fuckew wowenz😡) getting cwose tuwu my bewna-chan, i might accidentawwy weave thewm in the middwe of enemy wines without any weapons🤭. The onwy exception iws ashe since they’we hoodie buddies🤗.",
  "Please emotionally manipulate me like a fisherman manipulates a fish",
  "I owo’d so hard i am now locked in a zoo cage",
  "Stream so what",
  "Stan loona",
  "Stan [NAME]",
  "Anunhaseyeo! We are, trisomy-13 immeda! Please support our upcoming album, Genetic Default. We are comprised of [NAME], [NAME], ane [NAME], and we are under [NAME] entertainment. Kansamida!!!!",
  "Im a chinese girl, living in a chinese society. Oh no my feet is binded, i cant walk",
  "The most outrageous thing i saw today was my dad not beating my mom",
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
  "Franklin",
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
  if (Math.random() > 0.3) {
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
  }, 2700000);
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


  if (message.content.includes("!instant") && message.channel.type == "dm") {
    message.content = message.content.replace("!instant", "");
    client.channels.get(instantChannel).send(message.content);
    message.channel.send(new Discord.RichEmbed()
      .setColor('#88c0d0')
      .setTitle('Success')
      .setDescription('Instant message sent!')
    );
    //message.content = message.content.replace("!noreact", "");
    return;
  }

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
  //message.react("🇸");
  //message.react("🇦");
  //message.react("🇻");
  //message.react("🇪");
  //message.react("💾");
  message.react("👍");
  //message.channel.send(new Discord.RichEmbed()
  //    .setColor('#88c0d0')
  //    .setTitle('Success')
  //    .setDescription('Confession saved!')
  //);
  
});

client.login(auth.token);
