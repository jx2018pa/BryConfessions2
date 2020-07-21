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
const client = new Discord.Client();

const auth = require("./auth.json");



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
var args;
var userInd;
var options;
var s,v;
var anonyPoll = false;

function addReaction() {

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

client.on("ready", () => {
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
    client.user.setActivity("Type \"bryhelp\" or \"bryrules\" for more info");
});

client.on("guildCreate", guild => {
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
});

client.on("guildDelete", guild => {
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
});


client.on("message", async message => {
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
});

client.login(auth.token);