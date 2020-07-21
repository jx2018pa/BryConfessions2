/*
 * Copyright (c) 2020 Aditya Saligrama, Anthony Cui, Emma Hsiao, John Lian, Vincent Lian.
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

//md5
const md5 = require('md5');
//write to file
const fs = require('fs');
let cNum = parseInt(fs.readFileSync("confnum.txt", "utf8"));
const secret = parseInt(fs.readFileSync("secretkey.txt", "utf8"));
//console.log(cNum);

// This is your client. Some people call it `bot`, some people call it `self`,
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const client = new Discord.Client();

// Here we load the config.json file that contains our token and our prefix values.
const auth = require("./auth.json");

// config.token contains the bot's token
// config.prefix contains the message prefix.

//const SQLite = require("better-sqlite3");
//const sql = new SQLite("./pool.sqlite");

const banList = require("./banlist.json"); //this should never be uploaded publicly
const config = require("./config.json");


//const logChannel = "675193177656918039";
const instantChannel = "675350296142282752";
//const slowChannels = ["675201659558690875", "675350296142282752", "675381993642393641"];

let postIds = [];
let postTimes = [];
let postWarn = [];

let repPostNum = [];
let repPostUser = [];
let repPostVol = [];
let repPostReppers = [];
let currentPoll = false;
let option1 = 0;
let option2 = 0;
let pollVoters = "111111111111111111";
let pollTime = 300000;
let pollMinutes = 5;
let currentPollTitle = "";
let currentPollOpt1 = "";
let currentPollOpt2 = "";
let pollEndTime = 5;
//let repPostReporters=[[]];
var args;
var userInd;
var options;
var s,v;
var anonyPoll = false;
//var pool = []

/*
function timeConverter(UNIX_timestamp) {
  var a = new Date(UNIX_timestamp);
  time = a.toLocaleString('en-US');
  return time;
}
*/
function addReaction() {
    //if (Math.random() > 0.4) {
    //  return null;
    //}

    var ret = config.reactions[Math.floor(Math.random() * config.reactions.length)];
    while (ret.includes("[NAME]")) {
        ret = ret.replace("[NAME]", config.names[Math.floor(Math.random() * config.names.length)]);
    }

    return ret;
}

function generateShip() {
	v = Math.random();
   	v = config.starts.length * v;
    v = v - v % 1;
		s = Math.random();
		s = config.ends.length * s;
		s = s - s % 1;
		while (s === v) {
			s = Math.random();
			s = config.ends.length * s;
			s = s - s % 1;
		}
		if(config.starts[v].slice(config.starts[v].length-1) == config.ends[s].slice(0,1)) {
  return config.starts[v].slice(0,config.starts[v].length-1)+config.ends[s];

}
		return config.starts[v] + config.ends[s];
}

function hashId(authId) {
	var haId = md5(authId);
    for (i = 0; i < secret; i++) {
        haId = md5(haId);
    }
    return haId;
}

/*
function createConfession(userMessage) {
  var embed = new Discord.RichEmbed()
    .setColor('#88c0d0')
    .setTitle('Confession #' + userMessage.id)
    .setDescription(userMessage.message)
    //.setFooter("posted at " + timeConverter(userMessage.date));
  );
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
*/
client.on("ready", () => {
    // This event will run if the bot starts, and logs in, successfully.
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);

    //new RegExp((?<=\[)(.*?)(?=\])); //get conf number
    // Example of changing the bot's playing game to something useful. `client.user` is what the
    // docs refer to as the "ClientUser".
    client.user.setActivity("Type \"bryhelp\" or \"bryrules\" for more info");

    /*
      const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name='pool';").get();
      if (!table['count(*)']) {
        sql.prepare("CREATE TABLE pool (id INTEGER PRIMARY KEY AUTOINCREMENT, message TEXT, date TEXT, reaction TEXT);").run();
        sql.pragma("synchronous = 1");
        sql.pragma("journal_mode = wal"); //pin me to the wal
      }
    */
    /*
      client.getMessage = sql.prepare("SELECT * FROM pool ORDER BY RANDOM() LIMIT 1;");
      client.deletePulled = sql.prepare("DELETE FROM pool WHERE id=?");
      client.pushMessage = sql.prepare("INSERT INTO pool (message, date, reaction) VALUES (@message, @date, @reaction);");
      client.getLast = sql.prepare("SELECT * FROM pool ORDER BY id DESC LIMIT 1;");
      client.returnId = sql.prepare("SELECT id FROM pool WHERE message=?");
    */
    /*
      var interval = setInterval(function() {
        for (var i = 0; i < 5; i++) {
          var toSend = selectMessage();
          console.log(toSend);
          if (toSend != null) {
            slowChannels.forEach(channel => client.channels.get(channel).send(toSend));
          }
        }
      }, 1800000);
      */
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
    //client.channels.get(instantChannel).send("testing 123");
    if (message.author.bot) {
        return;
    }
    var hashedId = hashId(message.author.id);
    if (banList.bans.indexOf(hashedId) >= 0 && message.channel.type == "dm") {
            return;
    }
    
    if(message.content.includes("brypic")) {
    	var picarr = message.content.split(" ");
    	var brynum = parseInt(picarr[1])

    	if(picarr.length == 2) {
    		if(picarr[1].includes("latest")) {
    			message.channel.send("Brypic #"+(config.brypics.length));
    			message.channel.send(config.brypics[config.brypics.length-1]);
    		} else if(brynum >= 1 && brynum <= config.brypics.length) {
    			message.channel.send("Brypic #"+brynum);
    			message.channel.send(config.brypics[brynum-1]);
    		} else {
    			message.channel.send("Invalid input!");
    		}
    		
    	} else if(message.content == "brypic") {
    		var brypic = Math.floor(Math.random() * config.brypics.length);
    		message.channel.send("Brypic #"+(brypic+1));
    		message.channel.send(config.brypics[brypic]);
    	} else {
            message.channel.send("Invalid input!");
        }
    	

    }

    
    if(message.content.includes("bryquote")) {
        var picarr = message.content.split(" ");
        var brynum = parseInt(picarr[1])

        if(picarr.length == 2) {
            if(picarr[1].includes("latest")) {
                message.channel.send("Bryquote #"+(config.bryquotes.length));
                message.channel.send(config.bryquotes[config.bryquotes.length-1]);
            } else if(brynum >= 1 && brynum <= config.bryquotes.length) {
                message.channel.send("Bryquote #"+brynum);
                message.channel.send(config.bryquotes[brynum-1]);
            } else {
                message.channel.send("Invalid input!");
            }
            
        } else if(message.content == "bryquote") {
            var brypic = Math.floor(Math.random() * config.bryquotes.length);
            message.channel.send("Bryquote #"+(brypic+1));
            message.channel.send(config.bryquotes[brypic]);
        } else {
            message.channel.send("Invalid input!");
        }
        

    }

    if(message.content.toLowerCase() == "pollstatus") {
    	if(currentPoll == false) {
    		message.channel.send("There is no poll currently running!");
    		return;
    	}
    	client.channels.get(instantChannel).send("Title: "+currentPollTitle+"\nOption 1: "+currentPollOpt1+"\nOption 2: "+currentPollOpt2+"\nAnonymous: "+anonyPoll+"\nEnds in: "+Math.round(((pollEndTime-Date.now()) / 1000) / 60)+" minutes\n"+(option1+option2)+" people have voted");
    	return;
    }
    if(message.content.toLowerCase() == "createpoll" || message.content.toLowerCase() == "pollhelp") {
		message.channel.send("DM the bot \"createpoll|<option1>|<option2>|<title (optional)>|anonpoll (optional)|duration (in minutes, optional)\"");
		return;
    }
    if(message.content.toLowerCase() == "ship") {
    	message.react("✅");
		client.channels.get(instantChannel).send("Bry declares that " + generateShip() + " is the new hip ship in town.");
		return;
    }

    if (message.content.toLowerCase() == "vote a" && message.channel.type == "dm" && anonyPoll == true) {
        for (i = 0; i < (pollVoters.length / 18); i++) {
            userInd = parseInt(pollVoters.slice(i * 18, i * 18 + 18));
            if (userInd == message.author.id) {
                return;
            }
        }
        option1++;
        message.react("✅");
        pollVoters = pollVoters + message.author.id.toString();
        return;
    }

    if (message.content.toLowerCase() == "vote b" && message.channel.type == "dm" && anonyPoll == true) {
        for (i = 0; i < (pollVoters.length / 18); i++) {
            userInd = parseInt(pollVoters.slice(i * 18, i * 18 + 18));
            if (userInd == message.author.id) {
                return;
            }
        }
        option2++;
        message.react("✅");
        pollVoters = pollVoters + message.author.id.toString();
        return;
    }

    if (message.content.toLowerCase() == "bryhelp" && message.channel.id == instantChannel) {
        client.channels.get(instantChannel).send(new Discord.RichEmbed()
            .setColor('#ffff00')
            .setTitle('Bry Confessions Help')
            .setDescription('DM the bot to submit a new confession. Confessions will be anonymously posted to #bry-confessions.\nThere is a 5-minutes cooldown for all users by default, but users that have been reported or are spamming may receive longer cooldowns.\nIf you would like to report a confession, type \"report <confession number>\" and confessions with more than 3 reports will impose a cooldown on the posting user.\nWant to make a poll? DM the bot \"createpoll|<option1>|<option2>|<title (optional)>|anonpoll (optional)|duration (in minutes, optional)\"')
        );
        return;
    }
    if (message.content.toLowerCase() == "bryrules" && message.channel.id == instantChannel) {
        client.channels.get(instantChannel).send(new Discord.RichEmbed()
            .setColor('#ffff00')
            .setTitle('Bry Confessions Rules')
            .setDescription('Any content that can be perceived as hateful, harmful, dangerous or otherwise highly distasteful can result in a temporary or permanent ban.\nRepetitive spam may result in a 24hour cooldown or possibly a ban if behavior continues.')
        );
        return;
    }
    if (message.content.toLowerCase() == "vote a" && message.channel.id == instantChannel && currentPoll == true) {
        if (anonyPoll == true) {
            return;
        }
        for (i = 0; i < (pollVoters.length / 18); i++) {
            userInd = parseInt(pollVoters.slice(i * 18, i * 18 + 18));
            if (userInd == message.author.id) {
                return;
            }
        }
        option1++;
        message.react("✅");
        pollVoters = pollVoters + message.author.id.toString();
        return;
    }
    if (message.content.toLowerCase() == "vote b" && message.channel.id == instantChannel && currentPoll == true) {
        if (anonyPoll == true) {
            return;
        }
        for (i = 0; i < (pollVoters.length / 18); i++) {
            userInd = parseInt(pollVoters.slice(i * 18, i * 18 + 18));
            if (userInd == message.author.id) {
                return;
            }
        }
        option2++;
        message.react("✅");
        pollVoters = pollVoters + message.author.id.toString();
        return;
    }
    if (message.channel.id == instantChannel && message.content.toLowerCase().slice(0, 6).includes("report")) {
        args = message.content.slice(7);
        let reported = parseInt(args);
        let repUsrId = message.author.id.toString();
        //console.log("received report for conf "+reported);
        //console.log(repPostReporters);
        const reportsNeeded = 3;
        if (repPostNum.indexOf(reported) > -1) {
            let reportIndex = repPostNum.indexOf(reported);
            for (i = 0; i < (repPostReppers[reportIndex].length / 18); i++) {
                userInd = parseInt(repPostReppers[reportIndex].slice(i * 18, i * 18 + 18));
                if (userInd == message.author.id) {
                    message.channel.send("You have already reported confession #" + repPostNum[reportIndex] + "!");
                    return;
                }
            }
            /*
            if(repPostReporters[reportIndex].indexOf(message.author.id) > -1) {
            	message.channel.send("You have already reported confession #"+repPostNum[reportIndex]+"!");
            	return;
            }
            */
            if (repPostVol[reportIndex] >= reportsNeeded) {
                var reportUserIndex = postIds.indexOf(repPostUser[reportIndex]);
                postWarn[reportUserIndex] = true;
                message.channel.send("Your report for confession #" + repPostNum[reportIndex] + " has been counted. The user who sent the confession now has a 24 hour cooldown.");
                return;
            }
            message.channel.send("Your report for confession #" + repPostNum[reportIndex] + " has been counted. " + (reportsNeeded - repPostVol[reportIndex]) + " more report(s) are needed.");
            //repPostReppers[reportIndex].concat(repUsrId);
            repPostReppers[reportIndex] = repPostReppers[reportIndex] + repUsrId;
            repPostVol[reportIndex]++;
            return;
            //repPostReporters[reportIndex].push(message.author.id);
        } else {
            message.channel.send("That confession is unable to be reported!");
            return;
        }
    }

    if (message.channel.type != "dm") {
        return;
    }
    if (message.channel.type == "dm" && message.author.bot != true) {
        if (message.content.toLowerCase().slice(0, 11).includes("createpoll|")) {
        	pollTime = 300000;
        	pollMinutes = 5;
            if (currentPoll == true) {
                client.users.get(message.author.id).send("There is already a poll running! Please wait for that one to finish.");
                return;
            } else {
                options = message.content.slice(11);
                var optionsArray = options.split("|");
                if(parseInt(optionsArray[optionsArray.length-1]) >= 2 && parseInt(optionsArray[optionsArray.length-1]) <= 45 && isNaN(parseInt(optionsArray[optionsArray.length-1])) == false) {
                	pollMinutes = parseInt(optionsArray[optionsArray.length-1]);
                	pollTime = pollMinutes*60000;
                	optionsArray.pop();
                } else if(isNaN(parseInt(optionsArray[optionsArray.length-1])) == false) {
                	message.channel.send("Invalid number! Poll duration must be more than 2 minutes and less than 45 minutes inclusive.");
                	return;
                }
                pollEndTime = Date.now() + pollTime;
				currentPollOpt1 = optionsArray[0];
				currentPollOpt2 = optionsArray[1];
				currentPollTitle = "";
                if (optionsArray.length == 3) {
                    if (optionsArray[2].toLowerCase().includes("anonpoll")) {
                        //noTitleAnon = true;
                        anonyPoll = true;



                        option1 = 0;
                        option2 = 0;
                        pollVoters = "111111111111111111";
                        currentPoll = true;
                        message.react("✅");

                        

                        fs.appendFile('messagelogs.txt', '\n' + hashedId + '-' + message.content, function(err) {
                            if (err) throw err;
                            console.log('Poll logged');
                        });
                        client.channels.get(instantChannel).send(new Discord.RichEmbed()
                            .setColor('#800080')
                            .setTitle('Anonymous Poll')
                            .setDescription('A: ' + optionsArray[0] + '\nB: ' + optionsArray[1])
                            .addField('ANONYMOUS POLL', 'Bot will only accept votes via DM! Send \"vote a\" or \"vote b\" to cast your vote!\nPoll runs for '+pollMinutes+' minutes.\nType \"pollstatus\" to check on the poll!')
                        );
                        setTimeout(() => {
                            client.channels.get(instantChannel).send(new Discord.RichEmbed()
                                .setColor('#800080')
                                .setTitle('Anonymous Poll Results')
                                .setDescription(optionsArray[0] + ': ' + option1 + '\n' + optionsArray[1] + ': ' + option2)
                                //.addField('Vote now!', 'Type \"vote a\" or \"vote b\" to cast your vote!\nPoll runs for 5 minutes.')
                            );
                            currentPoll = false;
                            anonyPoll = false;

                        }, pollTime);
                        return;




                    }
                }
                if (optionsArray.length == 4) {
                    if (optionsArray[3].includes("anonpoll")) {
                        //titleAnon
                        anonyPoll = true;


                        option1 = 0;
                        option2 = 0;
                        pollVoters = "111111111111111111";
                        currentPoll = true;
                        message.react("✅");

                        currentPollTitle = optionsArray[2];

                        fs.appendFile('messagelogs.txt', '\n' + hashedId + '-' + message.content, function(err) {
                            if (err) throw err;
                            console.log('Poll logged');
                        });
                        client.channels.get(instantChannel).send(new Discord.RichEmbed()
                            .setColor('#800080')
                            .setTitle('Anonymous Poll - ' + optionsArray[2])
                            .setDescription('A: ' + optionsArray[0] + '\nB: ' + optionsArray[1])
                            .addField('ANONYMOUS POLL', 'Bot will only accept votes via DM! Send \"vote a\" or \"vote b\" to cast your vote!\nPoll runs for '+pollMinutes+' minutes.\nType \"pollstatus\" to check on the poll!')
                        );
                        setTimeout(() => {
                            client.channels.get(instantChannel).send(new Discord.RichEmbed()
                                .setColor('#800080')
                                .setTitle('Anonymous Poll Results - ' + optionsArray[2])
                                .setDescription(optionsArray[0] + ': ' + option1 + '\n' + optionsArray[1] + ': ' + option2)
                                //.addField('Vote now!', 'Type \"vote a\" or \"vote b\" to cast your vote!\nPoll runs for 5 minutes.')
                            );
                            currentPoll = false;
                            anonyPoll = false;

                        }, pollTime);
                        return;



                    }
                }

                if (optionsArray.length == 3) {




                    option1 = 0;
                    option2 = 0;
                    pollVoters = "111111111111111111";
                    currentPoll = true;

                    currentPollTitle = optionsArray[2];

                    message.react("✅");

                    fs.appendFile('messagelogs.txt', '\n' + hashedId + '-' + message.content, function(err) {
                        if (err) throw err;
                        console.log('Poll logged');
                    });
                    client.channels.get(instantChannel).send(new Discord.RichEmbed()
                        .setColor('#FFA500')
                        .setTitle('Poll - ' + optionsArray[2])
                        .setDescription('A: ' + optionsArray[0] + '\nB: ' + optionsArray[1])
                        .addField('Vote now!', 'Type \"vote a\" or \"vote b\" to cast your vote!\nPoll runs for '+pollMinutes+' minutes.\nType \"pollstatus\" to check on the poll!')
                    );
                    setTimeout(() => {
                        client.channels.get(instantChannel).send(new Discord.RichEmbed()
                            .setColor('#FFA500')
                            .setTitle('Poll Results - ' + optionsArray[2])
                            .setDescription(optionsArray[0] + ': ' + option1 + '\n' + optionsArray[1] + ': ' + option2)
                            //.addField('Vote now!', 'Type \"vote a\" or \"vote b\" to cast your vote!\nPoll runs for 5 minutes.')
                        );
                        currentPoll = false;

                    }, pollTime);
                    return;




                }
                if (optionsArray.length == 2) {


                    option1 = 0;
                    option2 = 0;
                    pollVoters = "111111111111111111";
                    currentPoll = true;
                    message.react("✅");

                    fs.appendFile('messagelogs.txt', '\n' + hashedId + '-' + message.content, function(err) {
                        if (err) throw err;
                        console.log('Poll logged');
                    });
                    client.channels.get(instantChannel).send(new Discord.RichEmbed()
                        .setColor('#FFA500')
                        .setTitle('Poll')
                        .setDescription('A: ' + optionsArray[0] + '\nB: ' + optionsArray[1])
                        .addField('Vote now!', 'Type \"vote a\" or \"vote b\" to cast your vote!\nPoll runs for '+pollMinutes+' minutes.\nType \"pollstatus\" to check on the poll!')
                    );
                    setTimeout(() => {
                        client.channels.get(instantChannel).send(new Discord.RichEmbed()
                            .setColor('#FFA500')
                            .setTitle('Poll Results')
                            .setDescription(optionsArray[0] + ': ' + option1 + '\n' + optionsArray[1] + ': ' + option2)
                            //.addField('Vote now!', 'Type \"vote a\" or \"vote b\" to cast your vote!\nPoll runs for 5 minutes.')
                        );
                        currentPoll = false;

                    }, pollTime);
                    return;
                }

                client.users.get(message.author.id).send("Invalid poll input! Use \"createpoll|<option1>|<option2>|<title (optional)>|anonpoll (optional)|duration (in minutes, optional)\"");
                return;

            }
        }
        var userIndex = postIds.indexOf(hashedId);
        var cooldown = 120000
        if (postWarn[userIndex] == true) {
            cooldown = 86400000;
        }
        //console.log(userIndex);
        //console.log("Array is at "+userIndex);
        if ((Date.now() - postTimes[userIndex]) <= cooldown && userIndex != -1) {
            client.users.get(message.author.id).send("Cooldown! You cannot send a message for the next " + Math.round(((cooldown - (Date.now() - postTimes[userIndex])) / 1000) / 60) + " minutes");
            return;
        }
        
        //message.content = message.content.replace("!instant", "");
        
        if(message.attachments.size > 0) {
            var attach = (message.attachments).array();
            client.channels.get(instantChannel).send('Confession #' + cNum);
            client.channels.get(instantChannel).send(attach[0].url);
            //return;
        } else if (message.content.slice(message.content.length-3) == "png" || message.content.slice(message.content.length-3) == "jpg" || message.content.slice(message.content.length-3) == "gif" ||  message.content.slice(message.content.length-4) == "jpeg" || message.content.includes("youtube.com") || message.content.includes("youtu.be") || message.content.includes("imgur.com") || message.content.includes("twitter.com") || message.content.includes("tenor.com")) {
            client.channels.get(instantChannel).send('Confession #' + cNum);
            client.channels.get(instantChannel).send(message.content);
        } else if (Math.random() < 0.4) {
            client.channels.get(instantChannel).send(new Discord.RichEmbed()
                .setColor('#13fc03')
                .setTitle('Confession #' + cNum)
                .setDescription(message.content)
                .addField('Word of rngesus', addReaction())
            );
        } else {
            client.channels.get(instantChannel).send(new Discord.RichEmbed()
                .setColor('#13fc03')
                .setTitle('Confession #' + cNum)
                .setDescription(message.content)
            );
        }
        if (userIndex > -1) {
            postTimes[userIndex] = Date.now()
        } else {
            postIds.push(hashedId);
            postTimes.push(Date.now());
            postWarn.push(false);
        }
        repPostNum.push(cNum);
        repPostVol.push(0);
        repPostUser.push(hashedId);
        repPostReppers.push("111111111111111111");
        //repPostReporters.push(cNum);

        message.react("✅");
        cNum++;
        if(message.attachments.size > 0) {
             fs.appendFile('messagelogs.txt', '\n' + hashedId + '-' + attach[0].url, function(err) {
            if (err) throw err;
            console.log('Confession logged');
        });
        } else {

        
        fs.appendFile('messagelogs.txt', '\n' + hashedId + '-' + message.content, function(err) {
            if (err) throw err;
            console.log('Confession logged');
        });
    }
        fs.writeFile("confnum.txt", cNum, function(err) {
            if (err) return console.log(err);
        });
        //message.channel.send(new Discord.RichEmbed()
        //  .setColor('#88c0d0')
        //  .setTitle('Success')
        //  .setDescription('IM sent!')
        //);
        //message.content = message.content.replace("!noreact", "");
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
    /*
      var reaction = addReaction();
      if (message.content.includes("!noreact")) {
        reaction = null;
        message.content = message.content.replace("!noreact", "");
      }
    */
    //  client.pushMessage.run({'message': message.content, 'date': timeConverter(message.createdTimestamp), 'reaction': reaction});
    //  var id = client.returnId.get(message.content).id;
    //  var confessionReturn = createConfession({'id': id, 'message': message.content, 'date': timeConverter(message.createdTimestamp), 'reaction': reaction})
    //  client.channels.get(logChannel).send(confessionReturn);
    //message.channel.send(confessionReturn);
    //Make it so that the bot does not respond to confessions so we can delete our degeneracy :)
    //message.react("🇸");
    //message.react("🇦");
    //message.react("🇻");
    //message.react("🇪");
    //message.react("💾");
    //message.react("👍");
    //message.channel.send(new Discord.RichEmbed()
    //    .setColor('#88c0d0')
    //    .setTitle('Success')
    //    .setDescription('Confession saved!')
    //);

});

client.login(auth.token);