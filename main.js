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
const store = require('data-store')({
    path: process.cwd() + '/persistent.json'
});
//md5
const md5 = require('md5');
//write to file
const fs = require('fs');
const client = new Discord.Client();
let cNum = store.get('cNum');
let starUsers = store.get('starUsers');
let userEmojis = store.get('userEmojis');
let cashUserIds = store.get('userIds');
let cashUserBals = store.get('userBals');
let cashUserInv = store.get('userInv');
let cashUserBank = store.get('userBank');
let cashUserDeposit = store.get('userDeposit');
let cashUserStocks = store.get('userStocks');
const cashShopListings = store.get('shopListings');
const cashShopCosts = store.get('shopCosts');
const secret = store.get('secretKey');
const auth = require("./auth.json");
let bannedIds = store.get('banUserIds');
let bannedExpiry = store.get('banUserExpiry');
let bannedNum = store.get('bannedNum');
let bannedAppealed = store.get('bannedAppealed');
const config = require("./config.json");
let instantChannel = store.get('instChan');
let currentNum = store.get('currentNum');
let postIds = [];
let postTimes = [];
let repPostNum = [];
let repPostUser = [];
let repPostVol = [];
let repPostTime = [];
let repPostReppers = [];
let appealNums = 0;
let appealVol = 0;
let appealVoters = "111111111111111111";
let rateUserId = ["x"];
let rateUserTime = [2];
let rateUserRefresh = [4];
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
let serious = false;
let verifyNum = -1;
let explo = false;
let isRoulette = false;
var args;
var userInd;
var options;
var s, v;
var anonyPoll = false;
var startTime = 0;
let dayToday = 0;
let ranksEarned = 0;
let confsEarned = 0;
let revealsEarned = 0;
let randomDisplay = 0;
let lastUser = "";
let rouletteHit = store.get('rouletteHits');
let rouletteSave = store.get('rouletteSaves');
let topGamblesWager = store.get('gambWager');
let topGamblesInfo = store.get('gambInfo');
let factionNames = store.get('factionNames');
let factionVault = store.get('factionVault');
let factionWarchest = store.get('factionWarchest');
let factionOwner = store.get('factionOwner');
let factionLevel = store.get('factionLevel');
let userFaction = store.get('userFaction');
let lastTaxed = Date.now();
let stockPrice = store.get('stockPrice');
let lastStockPrice = stockPrice;
const brycoinWhitelist = ["743902996567425089", "739250815700828292", "739221630596808744", "739247750020989029", "514170284027150385", "740275815622639656", "493553508251861012", "651622265666142248", "508822430123425794", "739253509576327268", "741360591368618034", "496796970929618945"];
const bannedCmds = ["balance", "brybank", "gamble", "titles", "rankup", "rob", "transfer", "leaderboard", "togglerank", "buy", "inventory", "makeitrain", "ranks", "topgambles", "createfaction", "disbandfaction", "invite", "kick", "listfactions", "factioninfo", "vaultdeposit", "vaultwithdraw", "factionlist", "disableinvites", "raid", "acceptinvites", "levelup", "warchestdeposit", "warchestwithdraw","buystocks","stockmarket","sellstocks"];
const allTitles = ["🗑️ Bum",
    "🧱 Commoner",
    "🎖️ Ensign",
    "⚓ Captain",
    "🗺️ Journeyman",
    "🎈 Yeoman",
    "💰 Governor",
    "🛡️ Viceroy",
    "🔢 Count/🔢 Countess",
    "🥪 Earl",
    "🔮 Magistrate",
    "🐔 Chanticleer",
    "🖖 Colonel",
    "⚔️ Knight",
    "🥄 Aristocrat",
    "📌 Kingpin",
    "🕵️ Agent",
    "🏰 His Excellency/🏰 Her Excellency",
    "👲 Duke/👲 Duchess",
    "🐴 Prince/🐴 Princess",
    "🗿 Taoisearch",
    "💸 Marquis/💸 Marquess",
    "🔥 Grand Duke/🔥 Grand Duchess",
    "❤️ Lord/❤️ Lady",
    "🐉 Emperor/🐉 Empress",
    "🔺 President",
    "👑 King/👑 Queen",
    "🌟 The Holy One",
    "✨ Bry Himself"
];
let titlePerks = ["",
    "+Insurance",
    "",
    "",
    "",
    "",
    "+2k BC when someone ranks up",
    "Access to Lounge",
    "",
    "+50 BC when any conf is sent",
    "",
    "",
    "",
    "+150 BC on roulette reveal",
    "",
    "",
    "Additional 50 BC when conf sent",
    "",
    "",
    "Double bank account",
    "",
    "",
    "",
    "",
    "",
    "Access to bbb",
    "",
    "",
    "",
    "",
    ""
];

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
    if (config.starts[v].slice(config.starts[v].length - 1) == config.ends[s].slice(0, 1)) {
        return config.starts[v].slice(0, config.starts[v].length - 1) + config.ends[s];

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

function retArr(array) {
    var indX = Math.floor(Math.random() * array.length);
    return array[indX];
}

function readableDate(ms) {
    var diff = Math.abs(ms - Date.now());
    if (diff < 60000) {
        return Math.round((ms - Date.now()) / 1000) + " seconds";
    } else if (diff < 3600000) {
        return Math.round((ms - Date.now()) / 60000) + " minutes";
    } else if (diff < 86400000) {
        return Math.round((ms - Date.now()) / 3600000) + " hours";
    } else {
        return Math.round((ms - Date.now()) / 86400000) + " days";
    }
}

function addTitle(id) {
    let indexxxx = cashUserIds.indexOf(id);
    let g = false;
    let rankId = 0;

    if (cashUserInv[indexxxx] == "inv") {
        return "🥔 Peasant <@" + id + ">";
    }
    if (cashUserInv[indexxxx].slice(0, 1) == "f") {
        g = true;
        rankId = parseInt(cashUserInv[indexxxx].slice(1));
    } else {
        g = false;
        rankId = parseInt(cashUserInv[indexxxx].slice(1));
    }

    if (isNaN(rankId)) {
        return "<@" + id + ">";
    }
    let title = allTitles[rankId].split("/");
    if (g == false || title.length == 1) {
        return title[0] + " <@" + id + ">";
    } else {
        return title[1] + " <@" + id + ">";
    }
    return "<@" + id + ">";
}

function getRankId(id) {
    let indexxxx = cashUserIds.indexOf(id);
    let rankId = 0;
    if (cashUserInv[indexxxx] == "inv") {
        rankId = 0;
    } else if (cashUserInv[indexxxx].slice(0, 1) == "f") {
        rankId = parseInt(cashUserInv[indexxxx].slice(1));
    } else {
        rankId = parseInt(cashUserInv[indexxxx].slice(1));
    }
    return rankId;
}

function getRankCost(num) {
    if (num <= 0) {
        return 0;
    }
    return Math.round(Math.pow((num + 1), 2.1) * 200);
}

function getBankBal(id) {
    let ussIndd = cashUserIds.indexOf(id);
    if (cashUserBank[ussIndd] == 0) {
        return 0;
    }
    let epoch = Math.floor((Date.now() - cashUserDeposit[ussIndd]) / 86400000);
    let theoBal = Math.floor(cashUserBank[ussIndd] * Math.pow(1.10, epoch));
    if ((theoBal - cashUserBank[ussIndd]) > 10000) {
        theoBal = cashUserBank[ussIndd] + 10000;
    }
    return theoBal;
}

function getHourlyReward(rankId) {
    if (rankId <= 0) {
        return 50;
    }
    return parseInt(50 + (rankId * 30));
}


client.on("ready", () => {
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
    client.user.setActivity("Type \"bryhelp\", \"bryrules\" or \"brycoinhelp\" for more info");
    startTime = Date.now();
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
    if(message.channel.id == "752646474348757033") {
        if(message.author.id == lastUser) {
            message.delete();
            //message.channel.send("Someone else needs to type the next number!");
        } else if(message.content != currentNum.toString()) {
            message.delete();
            //message.channel.send("That's not correct, please type "+currentNum);
        } else {
            lastUser = message.author.id;
            currentNum++;
            store.set('currentNum', currentNum);
        }
    }
    if (starUsers.indexOf(message.author.id) > -1 && message.channel.type != "dm") {
        try {
            message.react(userEmojis[starUsers.indexOf(message.author.id)]);
        } catch (err) {
            console.log("User react failed");
        }

    }
    if (message.channel.type != "dm") {
        let moneyIndex = cashUserIds.indexOf(message.author.id);
        if (moneyIndex == -1) {
            cashUserIds.push(message.author.id);
            cashUserBals.push(1);
            cashUserInv.push("inv");
            cashUserBank.push(0);
            cashUserDeposit.push(0);
            userFaction.push(-1);
            cashUserStocks.push(0);
            return;
        }
        let rankId = getRankId(message.author.id);
        let vv = true;
        let rateUserIndex = rateUserId.indexOf(message.author.id);
        let rankCost = getRankCost(rankId);
        if (cashUserBals[moneyIndex] == null) {
            cashUserBals[moneyIndex] = 1;
        }
        if (rateUserIndex == -1) {
            rateUserId.push(message.author.id);
            rateUserTime.push(Date.now());
            rateUserRefresh.push(Date.now());
            return;
        } else {
            if ((Date.now() - rateUserRefresh[rateUserIndex]) > 3600000) {
                cashUserBals[moneyIndex] = cashUserBals[moneyIndex] + getHourlyReward(rankId);
                store.set('userIds', cashUserIds);
                store.set('userBals', cashUserBals);
                rateUserRefresh[rateUserIndex] = Date.now();
                if (brycoinWhitelist.indexOf(message.channel.id) != -1) {
                    message.channel.send(addTitle(message.author.id) + " just claimed their hourly " + getHourlyReward(rankId) + " Brycoin reward!");
                } else {
                    try {
                        message.react("💸");
                    } catch (err) {
                        console.log("User react failed");
                    }
                }
                return;
            } else if ((Date.now() - rateUserTime[rateUserIndex]) < 30000) {
                vv = false;
            } else {
                if (Math.random() < 0.0001) {
                    message.channel.send(addTitle(message.author.id) + " HIT THE JACKPOT!!!! This has a 0.01% chance of happening per message 😱\nYou gained 10000 brycoins!");
                    cashUserBals[moneyIndex] = cashUserBals[moneyIndex] + 10000;
                    store.set('userIds', cashUserIds);
                    store.set('userBals', cashUserBals);
                    return;
                }
                if (Math.random() < 0.01) {
                    let miniPrize = parseInt(getHourlyReward(getRankId(message.author.id)) * 5 + 100);
                    if (isNaN(miniPrize)) {
                        miniPrize = 500;
                    }
                    message.channel.send(addTitle(message.author.id) + " got a mini prize! This has a 1% chance of happening per message 😱\nYou gained " + miniPrize + " brycoins!");
                    cashUserBals[moneyIndex] = cashUserBals[moneyIndex] + miniPrize;
                    store.set('userIds', cashUserIds);
                    store.set('userBals', cashUserBals);
                    return;
                }

                rateUserTime[rateUserIndex] = Date.now();
            }

        }
        if (vv) {
            let messageReward = parseInt(2 + (rankId));
            cashUserBals[moneyIndex] += messageReward;
        }
        store.set('userIds', cashUserIds);
        store.set('userBals', cashUserBals);
        store.set('userInv', cashUserInv);
    }

    if (message.content == "brycoinhelp") {
        let fulltxt = "";
        for (var i = 0; i < bannedCmds.length; i++) {
            fulltxt += bannedCmds[i] + ", ";
        }
        message.channel.send(new Discord.RichEmbed()
            .setColor('#FFDF00')
            .setTitle('Brycoin Commands')
            .setDescription(fulltxt)
        );

    }

    if (brycoinWhitelist.indexOf(message.channel.id.toLowerCase()) == -1 && message.channel.type != "dm") {
        for (var i = 0; i < bannedCmds.length; i++) {
            if (message.content.startsWith(bannedCmds[i])) {
                /*
                let fineAmt = 50;
                if(cashUserBals[cashUserIds.indexOf(message.author.id)] < fineAmt) {
                    fineAmt = cashUserBals[cashUserIds.indexOf(message.author.id)];
                }
                if(fineAmt == 0) {
                    return;
                }
                message.channel.send(addTitle(message.author.id)+" just got fined "+fineAmt+" using a Brycoin command in the wrong channel!");
                cashUserBals[cashUserIds.indexOf(message.author.id)] -= fineAmt
                */
                return;
            }
        }
    }

    if (message.content.toLowerCase().startsWith("balance")) {
        let targetUserId = message.author.id;
        let sluice = message.content.slice(11, 29);
        if (sluice.length > 2) {
            targetUserId = sluice;
        }
        let indd = cashUserIds.indexOf(targetUserId);
        let rateUserIndex = rateUserId.indexOf(targetUserId);
        if (indd == -1) {
            message.channel.send("The specified user does not have a balance!");
            return;
        }
        let rankId = getRankId(targetUserId);
        let rankCost = parseInt(getRankCost(rankId));
        let insuranceCost = Math.floor(rankCost * 0.75);
        let balanceString = addTitle(targetUserId) + '\n' + cashUserBals[indd] + ' Brycoins in Wallet\n' + getBankBal(targetUserId) + ' Brycoins in Brybank\n'+cashUserStocks[indd]+' Brystocks\nThis user is insured for ' + insuranceCost + ' Brycoins.\nNext hourly ' + getHourlyReward(rankId) + ' BC reward in ' + Math.round((3600000 - (Date.now() - rateUserRefresh[rateUserIndex])) / 60000) + ' minutes.';
        if (userFaction[indd] > -1) {
            balanceString += "\nMember of " + factionNames[userFaction[indd]];
        }
        message.channel.send(new Discord.RichEmbed()
            .setColor('#FFDF00')
            .setTitle('Balance')
            .setDescription(balanceString)
        );
        return;
    }

    if(message.content.toLowerCase().startsWith("buystocks")) {
    	let buyAmt = 0;
    	if(message.content.toLowerCase() == "buystocks") {
    		buyAmt = 1;
    	} else {
    		buyAmt = parseInt(message.content.slice(9));
    	} 
    	let totalPayAmt = 0;
    	if(buyAmt > 100) {
    		message.channel.send("You can't buy that much stock!");
    		return;
    	}
    	//let theoStockCost = stockPrice;
    	for(var i = 1; i < buyAmt+1; i++) {
    		totalPayAmt += stockPrice +(i*50);
    	}
    	if(buyAmt <= 0 || isNaN(buyAmt) || cashUserIds.indexOf(message.author.id) == -1 || totalPayAmt > cashUserBals[cashUserIds.indexOf(message.author.id)] || totalPayAmt < 0) {
    		message.channel.send("Error! You might not have enough money to buy that many stocks! You would need "+totalPayAmt+" BC.");
    		return;
    	}
    	if(((buyAmt+cashUserStocks[cashUserIds.indexOf(message.author.id)])*stockPrice) > 13000) {
    		message.channel.send("You can't own that many stocks! Based on market dynamics you can own up to "+Math.floor(13000/stockPrice)+" Brystocks right now.");
    		return;
    	}
    	stockPrice = stockPrice+(50*buyAmt);
    	cashUserStocks[cashUserIds.indexOf(message.author.id)] += buyAmt;
    	cashUserBals[cashUserIds.indexOf(message.author.id)] -= totalPayAmt;
    	store.set('stockPrice', stockPrice);
    	store.set('userStocks', cashUserStocks);
    	message.channel.send(new Discord.RichEmbed()
            .setColor('#FFDF00')
            .setTitle('Transaction Summary')
            .setDescription('You just paid '+totalPayAmt+' BC for '+buyAmt+' Brystocks!\nYou paid an average of '+(totalPayAmt/buyAmt)+' BC per share\nThe stock price is now '+stockPrice+' BC per share.')
        );
        return;

    }

    if(message.content.toLowerCase().startsWith("sellstocks")) {
    	let sellAmt = 0;
    	if(message.content.toLowerCase() == "sellstocks") {
    		sellAmt = 1;
    	} else {
    		sellAmt = parseInt(message.content.slice(11));
    	}
    	let totalPayAmt = 0;
    	//let theoStockCost = stockPrice;
    	if(sellAmt > 40) {
    		message.channel.send("You can't sell that much stock!");
    		return;
    	}
    	for(var i = 0; i < sellAmt; i++) {
    		totalPayAmt += stockPrice-(i*50);
    	}
    	if(sellAmt <= 0 || isNaN(sellAmt) || cashUserIds.indexOf(message.author.id) == -1 || sellAmt > cashUserStocks[cashUserIds.indexOf(message.author.id)]) {
    		message.channel.send("Error! You might not have enough stocks to sell!");
    		return;
    	}
    	stockPrice = stockPrice-(50*sellAmt);
    	cashUserStocks[cashUserIds.indexOf(message.author.id)] -= sellAmt;
    	cashUserBals[cashUserIds.indexOf(message.author.id)] += totalPayAmt;
    	store.set('stockPrice', stockPrice);
    	store.set('userStocks', cashUserStocks);
    	message.channel.send(new Discord.RichEmbed()
            .setColor('#FFDF00')
            .setTitle('Transaction Summary')
            .setDescription('You just earned '+totalPayAmt+' BC for selling '+sellAmt+' Brystocks!\nYou earned an average of '+(totalPayAmt/sellAmt)+' BC per share\nThe stock price is now '+stockPrice+' BC per share.')
        );
        return;

    }

    if(message.content.toLowerCase() == "stockmarket") {
    	message.channel.send(new Discord.RichEmbed()
            .setColor('#FFDF00')
            .setTitle('Stock Market')
            .setDescription('Current Brystock Price: '+stockPrice+'\n24 hr change: 📈 '+(((stockPrice-lastStockPrice)/lastStockPrice)*100).toString().slice(0,5)+'%')
        );
        return;
    }



    if (message.content.toLowerCase().startsWith("makeitrain")) {
        let number = parseInt(message.content.slice(11));
        let senderInd = cashUserIds.indexOf(message.author.id);
        if (isNaN(number) || senderInd == -1 || number > cashUserBals[senderInd] || number < 0) {
            message.channel.send("Failed to make it rain!");
            return;
        }
        if ((rateUserId.length - 2) < 2) {
            message.channel.send("Not enough users were recently online!");
            return;
        }
        cashUserBals[senderInd] -= number;
        let perUserBal = Math.floor(number / (rateUserId.length - 2));
        for (var i = 1; i < rateUserId.length; i++) {
            if (rateUserId[i] == message.author.id) {
                //skip sender
            } else {
                let recipInd = cashUserIds.indexOf(rateUserId[i]);
                cashUserBals[recipInd] += perUserBal;
            }
        }
        let remainder = (number - (perUserBal * (rateUserId.length - 2)));
        if (remainder < 0) {
            message.channel.send("Critical error, please contact bot operator");
            return;
        }
        cashUserBals[senderInd] += remainder;
        message.channel.send(addTitle(message.author.id) + " made it rain! 🤑 " + number + " BC was distributed across " + (rateUserId.length - 2) + " recently online users, each receiving " + perUserBal + " BC!\nA remainder of " + remainder + " BC was returned to the sender.");
        return;

    }

    if (cashUserBals[cashUserIds.indexOf(message.author.id)] < 0) {
        return;
    }

    if (message.content.toLowerCase() == "brybank" || message.content.toLowerCase().startsWith("brybank <")) {
        let profId = message.author.id;
        if (message.content.slice(8, 9) == "<") {
            profId = message.content.slice(11, 29);
        }
        let ussIndd = cashUserIds.indexOf(profId);
        let bankBal = getBankBal(profId);
        if (bankBal == 0) {
            message.channel.send(addTitle(profId) + " has no bank balance! To deposit, type \"brybank deposit <number>\"");
            return;
        }
        let epoch = Math.floor((Date.now() - cashUserDeposit[ussIndd]) / 86400000);
        let tmrwBal = Math.floor(cashUserBank[ussIndd] * Math.pow(1.10, epoch + 1));
        let tmrwGain = (tmrwBal - bankBal);
        if ((tmrwBal - cashUserBank[ussIndd]) > 10000) {
            tmrwGain = 0;
        }
        message.channel.send(new Discord.RichEmbed()
            .setColor('#FFDF00')
            .setTitle('Bry Bank')
            .setDescription(addTitle(profId) + " has a bank balance of " + bankBal)
            .addField("Stats", bankBal + " earning 10% daily interest for " + epoch + " days.\n" + (bankBal - cashUserBank[ussIndd]) + " Brycoins earned so far.\nTo withdraw, type \"brybank withdraw\"\nYou can earn a maximum of 10000 Brycoins from the bank.\nIf you wait " + readableDate(cashUserDeposit[ussIndd] + ((epoch + 1) * 86400000)) + " to withdraw you will get an additional " + tmrwGain + " Brycoins.")
        );
        return;
    }

    if (message.channel.type != "dm" && message.content.toLowerCase().startsWith("brybank")) {
        let ussIndd = cashUserIds.indexOf(message.author.id);
        let epoch = Math.floor((Date.now() - cashUserDeposit[ussIndd]) / 86400000);
        let theoBal = getBankBal(message.author.id);
        let ddarr = message.content.split(" ");
        if (ddarr[1] == "withdraw") {
            if (theoBal == 0) {
                message.channel.send("You have no bank balance!");
                return;
            }
            cashUserBals[ussIndd] += theoBal;
            cashUserBank[ussIndd] = 0;
            message.channel.send("Withdrawal successful! New balance: " + cashUserBals[ussIndd]);
            return;
        }
        if (ddarr[1] == "deposit") {
            let depNum = parseInt(ddarr[2]);
            if (ddarr[2] == "all") {
                depNum = parseInt(cashUserBals[ussIndd]);
            }
            if (depNum > 10000) {
                message.channel.send("You cannot deposit more than 10000 brycoins!");
                return;
            }
            if (theoBal != 0) {
                message.channel.send("You cannot deposit until your brybank balance is 0! Withdraw first!");
                return;
            }
            if (depNum > cashUserBals[ussIndd] || depNum < 1 || isNaN(depNum)) {
                message.channel.send("Deposit failed!");
                return;
            } else {
                cashUserBals[ussIndd] -= depNum;
                cashUserBank[ussIndd] += depNum;
                message.channel.send("Deposit successful! New bank balance: " + cashUserBank[ussIndd]);
                cashUserDeposit[ussIndd] = Date.now();
                store.set('userDeposit', cashUserDeposit);
                return;
            }
        }
        message.channel.send("Bank operation failed!");
        return;
    }

    if (message.content == "titles" || message.content == "ranks") {
        let fulll = "";
        for (var i = 0; i < allTitles.length; i++) {
            fulll += allTitles[i] + " | Cost: " + Math.round(Math.pow((i + 1), 2.1) * 200) + " BC | Gain: " + parseInt(2 + (i)) + " BC/30s, " + getHourlyReward(i) + " BC/hr\n";
            if (titlePerks[i].length > 2) {
                fulll += titlePerks[i] + "\n";
            }
        }
        fulll += "Want to buy a new title? Type \"rankup\"!\nTo switch between title genders type \"togglerank\"";
        message.channel.send(new Discord.RichEmbed()
            .setColor('#FFDF00')
            .setTitle('Title Shop')
            .setDescription(fulll)
        );
        return;
    }

    if (message.content.toLowerCase() == "rankup") {
        let indexxxx = cashUserIds.indexOf(message.author.id);
        let rankId = getRankId(message.author.id);
        let full = "";
        let nextCost = Math.round(Math.pow((rankId + 2), 2.1) * 200);
        if (cashUserInv[indexxxx] == "inv") {
            rankId = -1;
            nextCost = 200;
        }
        if (nextCost > cashUserBals[indexxxx] || rankId > (allTitles.length - 2) || isNaN(rankId)) {
            message.channel.send("Error buying next rank!");
            return;
        } else {
            cashUserBals[indexxxx] -= nextCost;
            rankId += 1;
            cashUserInv[indexxxx] = "n" + rankId;
            store.set('userInv', cashUserInv);
            store.set('userBals', cashUserBals);
            var d = new Date();
            if (d.getDay() != dayToday) {
                dayToday = d.getDay();
                confsEarned = 0;
                revealsEarned = 0;
                ranksEarned = 0;
                lastStockPrice = stockPrice;
            }
            for (var i = 0; i < cashUserInv.length; i++) {
                if (getRankId(cashUserIds[i]) >= 6 && ranksEarned < 4) {
                    cashUserBals[i] += 2000;
                }
            }
            ranksEarned++;
            message.channel.send("Success! You are now " + addTitle(message.author.id) + "\nThis transaction cost you " + nextCost + " Brycoins.");
            return;
        }
    }

    if (message.channel.type != "dm" && message.content.toLowerCase().slice(0, 3) == "rob") {
        let indexxxx = cashUserIds.indexOf(message.author.id);
        if (cashUserBals[indexxxx] < 20) {
            message.channel.send("You need at least 20 Brycoins to rob someone!")
            return;
        }
        let targetedUser = message.content.slice(7, 25);
        let targId = cashUserIds.indexOf(targetedUser);
        let targInv = cashUserInv[targId].split(",");
        if (targId == -1) {
            message.channel.send("Invalid target!");
            return;
        }
        let rankId = getRankId(targetedUser);
        let rankCost = getRankCost(rankId);
        let insuranceCost = Math.floor(rankCost * 0.75);
        if (rankId == 0) {
            rankCost = 0;
        }
        if (message.author.id == targetedUser) {
            message.channel.send("You can't rob yourself...");
            return;
        }
        if (userFaction[targId] == userFaction[indexxxx] && userFaction[targId] != -1) {
            message.channel.send("You can't rob a faction member!");
            return;
        }
        if (cashUserBals[indexxxx] < getRankCost(rankId - 5)) {
            message.channel.send("You need at least " + getRankCost(rankId - 5) + " Brycoins to rob that user!");
            return;
        }
        if (cashUserBals[targId] < insuranceCost) {
            message.channel.send(new Discord.RichEmbed()
                .setColor('#FFDF00')
                .setTitle('Failure!')
                .setDescription(addTitle(targetedUser) + " has a balance under their insurance, disallowing you to steal from them.")
            );
            return;
        }

        if (Math.random() < 0.5) {
            message.channel.send(new Discord.RichEmbed()
                .setColor('#FFDF00')
                .setTitle('Oh No!')
                .setDescription("The police caught you before you could rob anyone! They took " + Math.floor(0.3 * cashUserBals[indexxxx]) + " Brycoins - 30% of your balance - from your wallet.")
                .addField("Stats", "There is a 50% of a robbery failing due to police.")
            );
            cashUserBals[indexxxx] -= Math.floor(0.3 * cashUserBals[indexxxx]);
            store.set('userBals', cashUserBals);
            return;
        }
        if (Math.random() < (1 - (rankId / allTitles.length))) {
            var stealAmt = Math.floor(cashUserBals[targId] * 0.3);
            message.channel.send(new Discord.RichEmbed()
                .setColor('#FFDF00')
                .setTitle('Success!')
                .setDescription("You successfully robbed " + addTitle(targetedUser) + " ! You stole " + Math.floor(stealAmt) + " Brycoins - 30% of their balance - from their wallet.")
                .addField("Stats", "There is a 50% of a robbery failing due to police, and " + addTitle(targetedUser) + " had rank protection adding a " + ((rankId / allTitles.length) * 100) + "% chance of failure after you evaded the police.")
            );
            cashUserBals[targId] -= Math.floor(stealAmt);
            cashUserBals[indexxxx] += Math.floor(stealAmt);
            store.set('userBals', cashUserBals);
            return;
        } else {
            message.channel.send(new Discord.RichEmbed()
                .setColor('#FFDF00')
                .setTitle('Failure!')
                .setDescription(addTitle(targetedUser) + " managed to defend themselves and took " + Math.floor(0.3 * cashUserBals[indexxxx]) + " Brycoins - 30% of your balance - from your wallet.")
                .addField("Stats", "There is a 50% of a robbery failing due to police, and " + addTitle(targetedUser) + " had rank protection adding a " + ((rankId / allTitles.length) * 100) + "% chance of failure.")
            );
            cashUserBals[indexxxx] -= Math.floor(0.3 * cashUserBals[indexxxx]);
            cashUserBals[targId] += Math.floor(0.3 * cashUserBals[indexxxx]);
            store.set('userBals', cashUserBals);
            return;
        }
    }

    if (message.content.toLowerCase() == "disableinvites") {
        if (userFaction[cashUserIds.indexOf(message.author.id)] > -1) {
            message.channel.send("You are in a faction!");
            return;
        }
        userFaction[cashUserIds.indexOf(message.author.id)] = -2;
        message.channel.send("You are now rejecting all faction invites.");
        return;
    }

    if (message.content.toLowerCase() == "acceptinvites") {
        if (userFaction[cashUserIds.indexOf(message.author.id)] > -1) {
            message.channel.send("You are in a faction!");
            return;
        }
        userFaction[cashUserIds.indexOf(message.author.id)] = -1;
        message.channel.send("You are now accepting all faction invites.");
        return;
    }

    if (message.content.toLowerCase() == "levelup") {
        let id = userFaction[cashUserIds.indexOf(message.author.id)];
        if (id <= -1) {
            message.channel.send("You are not in a faction!");
            return;
        }
        let facMem = 0;
        for (var i = 0; i < userFaction.length; i++) {
            if (userFaction[i] == userFaction[cashUserIds.indexOf(message.author.id)]) {
                facMem++;
            }
        }
        if (factionLevel[id] >= facMem * 2) {
            message.channel.send("You need one more member to level up your faction!");
            return;
        }
        let levelPrice = 5000;
        if (factionLevel[id] > 4) {
            levelPrice = 7500;
        }
        if (factionVault[id] < levelPrice) {
            message.channel.send("You need " + levelPrice + " BC in your vault to level up!");
            return;
        }
        message.channel.send("You have levelled your faction up! You now are at level " + (factionLevel[id] + 1) + ".");
        factionVault[id] -= levelPrice;
        factionLevel[id] += 1;
        return;
    }


    if (message.channel.type != "dm" && message.content.toLowerCase().startsWith("raid")) {
        let id = userFaction[cashUserIds.indexOf(message.author.id)];
        if (id <= -1) {
            message.channel.send("You are not in a faction!");
            return;
        }

        if (message.content.length < 10) {
            let split = message.content.split(" ");
            if (isNaN(split[1]) || split[1] < 0 || split[1] > factionNames.length - 1 || factionWarchest[split[1]] < 1) {
                message.channel.send("Error raiding faction!");
                return;
            }
            let amNeeded = 5000;
        if(factionWarchest[split[1]] < 5000) {
        	amNeeded = factionWarchest[split[1]];
        }
        if (factionWarchest[id] < amNeeded) {
            message.channel.send("You need at least " + amNeeded + " Brycoins in your warchest to rob that faction!");
            return;
        }
            let probability = (factionLevel[split[1]] / 10);
            let roll = Math.random();
            if (roll > probability) {
                message.channel.send(new Discord.RichEmbed()
                    .setColor('#FFDF00')
                    .setTitle('Success!')
                    .setDescription("You successfully robbed " + factionNames[split[1]] + "! You took " + Math.floor(0.4 * factionWarchest[split[1]]) + " Brycoins - 40% of their warchest.")
                    .addField("Stats", "There is a " + (probability.toString().slice(2) + "0") + "% of a factionraid failing determined by the target faction level. You rolled " + roll)
                );
                factionWarchest[split[1]] -= Math.floor(0.4 * factionWarchest[split[1]]);
                factionWarchest[id] += Math.floor(0.4 * factionWarchest[split[1]]);
                store.set('factionWarchest', factionWarchest);
                return;
            } else {
                message.channel.send(new Discord.RichEmbed()
                    .setColor('#FFDF00')
                    .setTitle('Failure!')
                    .setDescription("You failed to rob " + factionNames[split[1]] + "! They took " + Math.floor(0.4 * factionWarchest[id]) + " Brycoins - 40% of your warchest.")
                    .addField("Stats", "There is a " + (probability.toString().slice(2) + "0") + "% of a factionraid failing determined by the target faction level. You rolled " + roll)
                );
                factionWarchest[split[1]] += Math.floor(0.4 * factionWarchest[id]);
                factionWarchest[id] -= Math.floor(0.4 * factionWarchest[id]);
                store.set('factionWarchest', factionWarchest);
                return;
            }
            message.channel.send("Failure!");
            return;
        }
        let targetedUser = message.content.slice(8, 26);
        let targId = cashUserIds.indexOf(targetedUser);
        let targInv = cashUserInv[targId].split(",");
        if (targId == -1) {
            message.channel.send("Invalid target!");
            return;
        }
        let rankId = getRankId(targetedUser);
        let rankCost = getRankCost(rankId);
        let insuranceCost = Math.floor(rankCost * 0.75);
        if (rankId == 0) {
            rankCost = 0;
        }
        if (userFaction[targId] == id) {
            message.channel.send("You can't rob a faction member!");
            return;
        }
        let amNeeded = 10000;
        if(cashUserBals[targId] < 10000) {
        	amNeeded = cashUserBals[targId];
        }
        if (factionWarchest[id] < amNeeded) {
            message.channel.send("You need at least " + amNeeded + " Brycoins in your warchest to rob that user!");
            return;
        }
        if (factionWarchest[id] > 10000) {
            message.channel.send("You have unclaimed warchest earnings! Withdraw " + (factionWarchest[id] - 10000));
            return;
        }
        if (cashUserBals[targId] < insuranceCost) {
            message.channel.send(new Discord.RichEmbed()
                .setColor('#FFDF00')
                .setTitle('Failure!')
                .setDescription(addTitle(targetedUser) + " has a balance under their insurance, disallowing you to steal from them.")
            );
            return;
        }
        let probab = 0.5 - (factionLevel[id] * 0.02);
        if (Math.random() < probab) {
            message.channel.send(new Discord.RichEmbed()
                .setColor('#FFDF00')
                .setTitle('Oh No!')
                .setDescription("The police caught you before you could rob anyone! They took " + Math.floor(0.3 * factionWarchest[id]) + " Brycoins - 30% of your balance - from your warchest.")
                .addField("Stats", "There is a " + probab + "% of a robbery failing due to police.")
            );
            factionWarchest[id] -= Math.floor(0.3 * factionWarchest[id]);
            store.set('factionWarchest', factionWarchest);
            return;
        }
        if (Math.random() < (1 - (rankId / allTitles.length))) {
            var stealAmt = Math.floor(cashUserBals[targId] * 0.3);
            message.channel.send(new Discord.RichEmbed()
                .setColor('#FFDF00')
                .setTitle('Success!')
                .setDescription("You successfully robbed " + addTitle(targetedUser) + " ! You stole " + Math.floor(stealAmt) + " Brycoins - 30% of their balance - from their wallet.")
                .addField("Stats", "There is a " + probab + "% of a robbery failing due to police, and " + addTitle(targetedUser) + " had rank protection adding a " + ((rankId / allTitles.length) * 100) + "% chance of failure after you evaded the police.")
            );
            cashUserBals[targId] -= Math.floor(stealAmt);
            factionWarchest[id] += Math.floor(stealAmt);
            store.set('userBals', cashUserBals);
            store.set('factionWarchest', factionWarchest);
            return;
        } else {
            message.channel.send(new Discord.RichEmbed()
                .setColor('#FFDF00')
                .setTitle('Failure!')
                .setDescription(addTitle(targetedUser) + " managed to defend themselves and took " + Math.floor(0.3 * factionWarchest[id]) + " Brycoins - 30% of your balance - from your wallet.")
                .addField("Stats", "There is a " + probab + "% of a robbery failing due to police, and " + addTitle(targetedUser) + " had rank protection adding a " + ((rankId / allTitles.length) * 100) + "% chance of failure.")
            );
            factionWarchest[id] -= Math.floor(0.3 * factionWarchest[id]);
            cashUserBals[targId] += Math.floor(0.3 * factionWarchest[id]);
            store.set('userBals', cashUserBals);
            store.set('factionWarchest', factionWarchest);
            return;
        }
    }

    if (message.content == "earnstats") {
        var d = new Date();
        if (d.getDay() != dayToday) {
            dayToday = d.getDay();
            confsEarned = 0;
            revealsEarned = 0;
            ranksEarned = 0;
            lastStockPrice = stockPrice;
        }
        let rankMoney = (ranksEarned * 2000);
        let confMoney = (confsEarned * 50);
        let revealMoney = (revealsEarned * 150);
        if (ranksEarned < 4) {
            //n
        } else {
            rankMoney = 8000;
        }
        if (revealsEarned < 24) {
            //n
        } else {
            revealMoney = 3600;
        }
        if (confsEarned < 150) {
            //n
        } else {
            confMoney = 7500;
        }
        message.channel.send(new Discord.RichEmbed()
            .setColor('#FFDF00')
            .setTitle('Earn Stats')
            .setDescription(ranksEarned + " users ranked up today, granting those with rank Governor+ " + rankMoney + "/8000 BC.\n" + confsEarned + " confessions were sent today, granting those with rank Earl+ " + confMoney + "/7500 BC.\n" + revealsEarned + " roulette confessions were revealed today, granting those with rank Knight+ " + revealMoney + "/3600 BC.")
        );
        return;
    }


    if (message.content == "togglerank") {
        let indexxxx = cashUserIds.indexOf(message.author.id);
        if (cashUserInv[indexxxx] == "inv") {
            message.channel.send("Success! You are now " + addTitle(message.author.id));
            return;
        }
        rankId = cashUserInv[indexxxx].slice(1);
        if (cashUserInv[indexxxx].slice(0, 1) == "f") {
            cashUserInv[indexxxx] = "n" + rankId;
            store.set('userInv', cashUserInv);
            message.channel.send("Success! You are now " + addTitle(message.author.id));
            return;
        } else {
            cashUserInv[indexxxx] = "f" + rankId;
            store.set('userInv', cashUserInv);
            message.channel.send("Success! You are now " + addTitle(message.author.id));
            return;
        }
        message.channel.send("Success! You are now " + addTitle(message.author.id));
        return;
    }

    if (message.channel.type != "dm" && message.content.startsWith("transfer")) {
        let recipient = message.content.slice(12, 30);
        let numb = parseInt(message.content.slice(32));
        let recipIndex = cashUserIds.indexOf(recipient);
        let senderIndex = cashUserIds.indexOf(message.author.id);
        if (recipIndex == -1 || isNaN(numb) || senderIndex == -1) {
            message.channel.send("Error with transfer!")
            return;
        }
        if (numb > cashUserBals[senderIndex] || numb < 0) {
            message.channel.send("You do not have the necessary brycoins!");
            return;
        }
        cashUserBals[senderIndex] = cashUserBals[senderIndex] - numb;
        cashUserBals[recipIndex] = cashUserBals[recipIndex] + numb;
        message.channel.send("Transfer successful!");
        return;
    }

    if (message.content.toLowerCase() == "bryshop") {
        /*
        let allListings = "";
        for (var i = 0; i < cashShopListings.length; i++) {
            allListings += cashShopListings[i] + "\n Cost: " + cashShopCosts[i] + " Brycoins - ID:" + i + "\n";
        }
        message.channel.send(new Discord.RichEmbed()
            .setColor('#FFDF00')
            .setTitle('Bry Shop!')
            .setDescription(allListings)
        );
        */
        message.channel.send("Bryshop is closed temporarily!");
        return;
    }

    if (message.content.toLowerCase().startsWith("gamble")) {
        let wager = parseInt(message.content.slice(7));
        let userInd = cashUserIds.indexOf(message.author.id);
        if (wager > cashUserBals[userInd] || isNaN(wager) || wager < 10) {
            message.channel.send("Bet failed! You need to gamble more than 10 Brycoins!");
            return;
        }
        randomDisplay = Math.random();
        if (randomDisplay < 0.48) {
            cashUserBals[userInd] += wager;
            message.channel.send(new Discord.RichEmbed()
                .setColor('#00FF00')
                .setTitle('You Win!')
                .setDescription(addTitle(message.author.id) + ' - You won!\n' + wager + ' Brycoins were credited to your account')
                .addField('Odds', 'You had a 48% chance of winning your initial bet and rolled ' + randomDisplay.toString().slice(0, 7))
            );
            store.set('userBals', cashUserBals);
            if (wager >= topGamblesWager[0]) {
                topGamblesWager.unshift(wager);
                topGamblesInfo.unshift(addTitle(message.author.id) + " - Won");
                topGamblesWager.pop();
                topGamblesInfo.pop();
                store.set('gambInfo', topGamblesInfo);
                store.set('gambWager', topGamblesWager);
            } else if (wager > topGamblesWager[topGamblesWager.length - 1]) {
                for (var i = 1; i < topGamblesWager.length; i++) {
                    if (wager < topGamblesWager[i - 1] && wager >= topGamblesWager[i]) {
                        topGamblesWager.splice(i, 0, wager);
                        topGamblesInfo.splice(i, 0, addTitle(message.author.id) + " - Won");
                        topGamblesWager.pop();
                        topGamblesInfo.pop();
                    }
                }
            }
        } else {
            cashUserBals[userInd] -= wager;
            message.channel.send(new Discord.RichEmbed()
                .setColor('#ff0000')
                .setTitle('You Lose!')
                .setDescription(addTitle(message.author.id) + ' - You lost!\n' + wager + ' Brycoins were removed from your account')
                .addField('Odds', 'You had a 48% chance of winning your initial bet and rolled ' + randomDisplay.toString().slice(0, 7))
            );
            store.set('userBals', cashUserBals);
            if (wager >= topGamblesWager[0]) {
                topGamblesWager.unshift(wager);
                topGamblesInfo.unshift(addTitle(message.author.id) + " - Lost");
                topGamblesWager.pop();
                topGamblesInfo.pop();
                store.set('gambInfo', topGamblesInfo);
                store.set('gambWager', topGamblesWager);
            } else if (wager > topGamblesWager[topGamblesWager.length - 1]) {
                for (var i = 1; i < topGamblesWager.length; i++) {
                    if (wager < topGamblesWager[i - 1] && wager >= topGamblesWager[i]) {
                        topGamblesWager.splice(i, 0, wager);
                        topGamblesInfo.splice(i, 0, addTitle(message.author.id) + " - Lost");
                        topGamblesWager.pop();
                        topGamblesInfo.pop();
                    }
                }
            }
        }
        return;
    }

    if (message.content.toLowerCase().startsWith("inventory")) {
        /*
        let targetUserId = message.author.id;
        let sluice = message.content.slice(13, 31);
        if (sluice.length > 2) {
            targetUserId = sluice;
        }
        let indd = cashUserIds.indexOf(targetUserId);
        if (indd == -1) {
            message.channel.send("The specified user does not have an inventory!");
            return;
        }
        let userInv = cashUserInv[indd].split(",");
        let dispInv = "";
        for (var i = 0; i < userInv.length; i++) {
            if (userInv[i].includes("inv")) {
                //do nothing
            } else {
                dispInv += ("\n" + cashShopListings[parseInt(userInv[i])]);
            }

        }

        message.channel.send(new Discord.RichEmbed()
            .setColor('#FFDF00')
            .setTitle('Inventory')
            .setDescription(addTitle(targetUserId) + dispInv)
        );
        */
        message.channel.send("Inventory disabled! Check your balance instead!");
        return;
    }


    var b2s = Array.from(cashUserBals);
    if (lastTaxed != 0 && (Date.now() - lastTaxed) <= 86400000) {
        //do nothing
    } else {
        b2s.sort(function(a, b) {
            return b - a
        });
        let fulltxt = "Tax rate: 8% of top 5 user wallets, 5% of remaining top 5 user wallets\n";
        let countss = 0;
        let totalTax = 0;
        while (countss < 10) {
            let taxRate = 0.08;
            if (countss > 4) {
                taxRate = 0.05
            }
            var ussInd = cashUserBals.indexOf(b2s[countss]);
            let taxAmt = Math.floor(taxRate * cashUserBals[ussInd]);
            cashUserBals[ussInd] -= taxAmt;
            totalTax += taxAmt;
            countss++;
            fulltxt += (addTitle(cashUserIds[ussInd]) + " was taxed " + taxAmt + " BC!\n")
        }
        let taxEachRec = Math.floor(totalTax / (cashUserBals.length - 1));
        for (var i = 1; i < cashUserBals.length; i++) {
            cashUserBals[i] += taxEachRec;
        }
        lastTaxed = Date.now();
        fulltxt += "A total of " + totalTax + " BC was collected, and split amongst " + (cashUserBals.length - 1) + " users, each receiving " + taxEachRec + " BC."
        client.channels.get("675350296142282752").send(new Discord.RichEmbed()
            .setColor('#FFDF00')
            .setTitle('Taxes')
            .setDescription(fulltxt)
        );
    }
    if (message.content.toLowerCase() == "leaderboard") {
        //var b2s = cashUserBals;
        b2s.sort(function(a, b) {
            return b - a
        });
        let fulltxt = "";
        for (i = 0; i < 20; i++) {
            var ussInd = cashUserBals.indexOf(b2s[i]);
            //const User = Client.fetchUser(cashUserIds[i]);
            fulltxt += addTitle(cashUserIds[ussInd]) + " - " + b2s[i] + " BC, " + getBankBal(cashUserIds[ussInd]) + " Bank BC ";
            if (b2s[i] > Math.floor(getRankCost(getRankId(cashUserIds[ussInd])) * 0.75)) {
                fulltxt += "⚠️\n";
            } else {
                fulltxt += "\n";
            }
        }
        fulltxt += "Want to see the gambling leaderboard? Type \"topgambles\"\n⚠️ indicates that the user is above their insured amount";
        message.channel.send(new Discord.RichEmbed()
            .setColor('#FFDF00')
            .setTitle('Leaderboard')
            .setDescription(fulltxt)
        );
        return;
    }

    if (message.content.toLowerCase() == "topgambles") {
        fulltext = "";
        for (var i = 0; i < topGamblesWager.length; i++) {
            fulltext += topGamblesWager[i] + " BC - " + topGamblesInfo[i] + "\n";
        }
        message.channel.send(new Discord.RichEmbed()
            .setColor('#FFDF00')
            .setTitle('Gambling Leaderboard')
            .setDescription(fulltext)
        );
        return;
    }

    if (message.content.toLowerCase().startsWith("createfaction")) {
        if (userFaction[cashUserIds.indexOf(message.author.id)] > -1) {
            message.channel.send("You are already in a faction!");
            return;
        }
        if (getRankId(message.author.id) <= 3) {
            message.channel.send("Users must be at least rank Journeyman to join a faction!");
            return;
        }
        if (message.content.slice(14).length < 4 || factionNames.indexOf(message.content.slice(14)) != -1) {
            message.channel.send("Invalid faction name! Must be greater than 4 characters and not yet exist");
            return;
        }
        let userInd = cashUserIds.indexOf(message.author.id);
        if (cashUserBals[userInd] < 5000) {
            message.channel.send("You need 5000 BC to create a faction!");
            return;
        }
        cashUserBals[userInd] -= 5000;
        factionNames.push(message.content.slice(14));
        factionVault.push(0);
        factionLevel.push(1);
        factionWarchest.push(0);
        factionOwner.push(message.author.id);
        userFaction[cashUserIds.indexOf(message.author.id)] = factionVault.length - 1;
        message.channel.send("Congrats " + addTitle(message.author.id) + " - you are now the leader of " + message.content.slice(14) + "!\nThis transaction cost you 5000 BC.");
        store.set('userFaction', userFaction);
        store.set('factionNames', factionNames);
        store.set('factionVault', factionVault);
        store.set('factionLevel', factionLevel);
        store.set('factionOwner', factionOwner);
        store.set('factionWarchest', factionWarchest);
        return;
    }

    if (message.content.toLowerCase().startsWith("disbandfaction")) {
        let id = userFaction[cashUserIds.indexOf(message.author.id)];
        if (id <= -1) {
            message.channel.send("You are not in a faction!");
            return;
        }
        if (factionOwner[id] != message.author.id) {
            message.channel.send("You are not the owner of this faction!");
            return;
        }
        if (factionVault[id] != 0) {
            message.channel.send("You must empty your faction's vault before disbanding!");
            return;
        }
        let facMem = 0;
        for (var i = 0; i < userFaction.length; i++) {
            if (userFaction[i] == userFaction[cashUserIds.indexOf(message.author.id)]) {
                facMem++;
            }
        }
        if (facMem > 1) {
            message.channel.send("You must kick all other members before disbanding!");
            return;
        }
        for (var i = 0; i < userFaction.length; i++) {
            if (userFaction[i] == id) {
                userFaction[i] == -1;
            }
        }
        message.channel.send("Your faction has been disbanded.");
        factionNames[id] = "deleted";
        userFaction[cashUserIds.indexOf(message.author.id)] = -1;
        store.set('userFaction', userFaction);
        store.set('factionNames', factionNames);
        store.set('factionVault', factionVault);
        store.set('factionLevel', factionLevel);
        store.set('factionOwner', factionOwner);
        store.set('factionWarchest', factionWarchest);
        return;
    }

    if (message.content.toLowerCase().startsWith("invite")) {
        let sluice = message.content.slice(10, 28);
        let targInd = cashUserIds.indexOf(sluice);
        if (targInd == -1 || userFaction[targInd] != -1 || userFaction[cashUserIds.indexOf(message.author.id)] <= -1) {
            message.channel.send("This user could not be invited!");
            return;
        }
        if (getRankId(sluice) <= 3) {
            message.channel.send("Users must be at least rank Journeyman to join a faction!");
            return;
        }
        let facMem = 0;
        for (var i = 0; i < userFaction.length; i++) {
            if (userFaction[i] == userFaction[cashUserIds.indexOf(message.author.id)]) {
                facMem++;
            }
        }
        if (facMem >= 5) {
            message.channel.send("Your faction is at its maximum capacity!");
            return;
        }
        userFaction[targInd] = userFaction[cashUserIds.indexOf(message.author.id)];
        message.channel.send("Success! " + addTitle(sluice) + " is now a member of " + factionNames[userFaction[targInd]]);
        store.set('userFaction', userFaction);
        store.set('factionNames', factionNames);
        store.set('factionVault', factionVault);
        store.set('factionLevel', factionLevel);
        store.set('factionOwner', factionOwner);
        store.set('factionWarchest', factionWarchest);
        return;

    }

    if (message.content.toLowerCase().startsWith("kick")) {
        let sluice = message.content.slice(8, 26);
        let targInd = cashUserIds.indexOf(sluice);
        if (targInd == -1 || userFaction[targInd] <= -1 || userFaction[cashUserIds.indexOf(message.author.id)] <= -1) {
            message.channel.send("This user could not be kicked!");
            return;
        }
        userFaction[targInd] = -1;
        message.channel.send(addTitle(sluice) + " has been kicked!");
        store.set('userFaction', userFaction);
        store.set('factionNames', factionNames);
        store.set('factionVault', factionVault);
        store.set('factionLevel', factionLevel);
        store.set('factionOwner', factionOwner);
        store.set('factionWarchest', factionWarchest);
        return;
    }

    if (message.content.toLowerCase() == "leavefaction") {
        let targInd = cashUserIds.indexOf(message.author.id);
        if (factionOwner[userFaction[targInd]] == message.author.id) {
            message.channel.send("You can't leave as a leader! Disband your faction instead!");
            return;
        }
        if (targInd == -1 || userFaction[targInd] <= -1) {
            message.channel.send("Error leaving faction!");
            return;
        }
        userFaction[targInd] = -1;
        message.channel.send(addTitle(message.author.id) + " has left the faction!");
        store.set('userFaction', userFaction);
        store.set('factionNames', factionNames);
        store.set('factionVault', factionVault);
        store.set('factionLevel', factionLevel);
        store.set('factionOwner', factionOwner);
        store.set('factionWarchest', factionWarchest);
        return;
    }

    if (message.content.toLowerCase().startsWith("changefactionname")) {
        if (message.content.slice(18).length < 4 || factionNames.indexOf(message.content.slice(18)) != -1) {
            message.channel.send("Invalid faction name! Must be greater than 4 characters and not yet exist");
            return;
        }
        factionNames[userFaction[cashUserIds.indexOf(message.author.id)]] = message.content.slice(18);
        message.channel.send("Congrats! Your faction is now called " + factionNames[userFaction[cashUserIds.indexOf(message.author.id)]]);
        return;
    }


    if (message.content.toLowerCase() == "listfactions" || message.content.toLowerCase() == "factionlist") {
        let fulltext = "";
        for (var i = 0; i < factionNames.length; i++) {
            if (factionNames[i] == "deleted") {

            } else {
                fulltext += factionNames[i] + " - Level " + factionLevel[i] + " - ID " + i + " - " + factionVault[i] + " BC\n";
            }

        }
        fulltext += "For specific faction info type \"factioninfo ID\"";
        message.channel.send(new Discord.RichEmbed()
            .setColor('#FFDF00')
            .setTitle('Active Factions')
            .setDescription(fulltext)
        );
        store.set('userFaction', userFaction);
        store.set('factionNames', factionNames);
        store.set('factionVault', factionVault);
        store.set('factionLevel', factionLevel);
        store.set('factionOwner', factionOwner);
        store.set('factionWarchest', factionWarchest);
        return;
    }

    if (message.content.toLowerCase().startsWith("factioninfo")) {
        var id = parseInt(message.content.slice(12));
        let self = false;
        if (message.content.toLowerCase() == "factioninfo") {
            self = true;
        }
        if (id > (factionNames.length - 1) || isNaN(id)) {
            if (self == false) {
                message.channel.send("Faction does not exist!");
                return;
            }
        }
        if (self == true && userFaction[cashUserIds.indexOf(message.author.id)] <= -1) {
            message.channel.send("You are not in a faction!");
            return;
        }
        if (self == true) {
            id = userFaction[cashUserIds.indexOf(message.author.id)];
        }
        let memberListText = "\n";
        for (var i = 0; i < userFaction.length; i++) {
            if (id == userFaction[i]) {
                if (cashUserIds[i] == factionOwner[id]) {

                } else {
                    memberListText += addTitle(cashUserIds[i]) + "\n";
                }

            }
        }
        let maxDep = (factionLevel[id] - 2) * 10000;
        if (maxDep < 10000) {
            maxDep = 10000;
        }
        if(maxDep > 50000) {
        	maxDep = 50000;
        }
        message.channel.send(new Discord.RichEmbed()
            .setColor('#FFDF00')
            .setTitle(factionNames[id])
            .setDescription('Vault: ' + factionVault[id] + "/" + maxDep + " BC\nWarchest: " + factionWarchest[id] + "/10000 BC\nLevel " + factionLevel[id] + "\nMembers:\n" + addTitle(factionOwner[id]) + " \(Owner\)" + memberListText)
        );
        store.set('userFaction', userFaction);
        store.set('factionNames', factionNames);
        store.set('factionVault', factionVault);
        store.set('factionLevel', factionLevel);
        store.set('factionOwner', factionOwner);
        store.set('factionWarchest', factionWarchest);
        return;
    }

    if (message.content.toLowerCase().startsWith("vaultdeposit")) {
        if (userFaction[cashUserIds.indexOf(message.author.id)] <= -1) {
            message.channel.send("You are not in a faction!");
            return;
        }
        var depAmt = parseInt(message.content.slice(13));
        let userInd = cashUserIds.indexOf(message.author.id);
        if (depAmt > cashUserBals[userInd] || depAmt < 1 || isNaN(depAmt) || userInd == -1) {
            message.channel.send("Vault deposit failed!");
            return;
        }
        let maxDep = (factionLevel[userFaction[userInd]] - 2) * 10000;
        if (maxDep < 10000) {
            maxDep = 10000;
        }
        if(maxDep > 50000) {
        	maxDep = 50000;
        }
        if ((factionVault[userFaction[userInd]] + depAmt) > maxDep) {
            message.channel.send("Vault deposit failed! Your faction's vault can hold a maximum of " + maxDep);
            return;
        }
        cashUserBals[userInd] -= depAmt;
        factionVault[userFaction[userInd]] += depAmt;
        message.channel.send("Deposit successful! New vault balance: " + factionVault[userFaction[userInd]]);
        store.set('userFaction', userFaction);
        store.set('factionNames', factionNames);
        store.set('factionVault', factionVault);
        store.set('factionLevel', factionLevel);
        store.set('factionOwner', factionOwner);
        store.set('factionWarchest', factionWarchest);
        return;

    }

    if (message.content.toLowerCase().startsWith("warchestdeposit")) {
        if (userFaction[cashUserIds.indexOf(message.author.id)] <= -1) {
            message.channel.send("You are not in a faction!");
            return;
        }

        var depAmt = parseInt(message.content.slice(16));
        let userInd = cashUserIds.indexOf(message.author.id);
        if (depAmt > cashUserBals[userInd] || depAmt < 1 || isNaN(depAmt) || userInd == -1) {
            message.channel.send("Warchest deposit failed!");
            return;
        }
        if (factionLevel[userFaction[userInd]] < 2) {
            message.channel.send("Warchest deposit failed! You need at least level 2!");
            return;
        }
        if ((factionWarchest[userFaction[userInd]] + depAmt) > 10000) {
            message.channel.send("Warchest deposit failed! Your faction's warchest can hold a maximum of " + 10000);
            return;
        }
        cashUserBals[userInd] -= depAmt;
        factionWarchest[userFaction[userInd]] += depAmt;
        message.channel.send("Deposit successful! New warchest balance: " + factionWarchest[userFaction[userInd]]);
        store.set('userFaction', userFaction);
        store.set('factionNames', factionNames);
        store.set('factionVault', factionVault);
        store.set('factionLevel', factionLevel);
        store.set('factionOwner', factionOwner);
        store.set('factionWarchest', factionWarchest);
        return;

    }

    if (message.content.toLowerCase().startsWith("vaultwithdraw")) {
        if (userFaction[cashUserIds.indexOf(message.author.id)] <= -1) {
            message.channel.send("You are not in a faction!");
            return;
        }
        var drawAmt = parseInt(message.content.slice(14));
        let userInd = cashUserIds.indexOf(message.author.id);
        if (drawAmt > factionVault[userFaction[userInd]] || drawAmt < 1 || isNaN(drawAmt) || userInd == -1) {
            message.channel.send("Vault withdraw failed!");
            return;
        }
        cashUserBals[userInd] += drawAmt;
        factionVault[userFaction[userInd]] -= drawAmt;
        message.channel.send("Withdraw successful! New vault balance: " + factionVault[userFaction[userInd]]);
        store.set('userFaction', userFaction);
        store.set('factionNames', factionNames);
        store.set('factionVault', factionVault);
        store.set('factionLevel', factionLevel);
        store.set('factionOwner', factionOwner);
        store.set('factionWarchest', factionWarchest);
        return;

    }

    if (message.content.toLowerCase().startsWith("warchestwithdraw")) {
        if (userFaction[cashUserIds.indexOf(message.author.id)] <= -1) {
            message.channel.send("You are not in a faction!");
            return;
        }
        var drawAmt = parseInt(message.content.slice(17));
        let userInd = cashUserIds.indexOf(message.author.id);
        if (drawAmt > factionWarchest[userFaction[userInd]] || drawAmt < 1 || isNaN(drawAmt) || userInd == -1) {
            message.channel.send("Warchest withdraw failed!");
            return;
        }
        cashUserBals[userInd] += drawAmt;
        factionWarchest[userFaction[userInd]] -= drawAmt;
        message.channel.send("Withdraw successful! New warchest balance: " + factionWarchest[userFaction[userInd]]);
        store.set('userFaction', userFaction);
        store.set('factionNames', factionNames);
        store.set('factionVault', factionVault);
        store.set('factionLevel', factionLevel);
        store.set('factionOwner', factionOwner);
        store.set('factionWarchest', factionWarchest);
        return;

    }

    instantChannel = "675350296142282752";
    serious = false;
    verifyNum = -1;
    if (message.content.toLowerCase().slice(0, 8) == "!serious") {
        instantChannel = "735897976861360248";
        serious = true;
    }
    if (message.channel.id == "735897976861360248") {
        if (message.content.slice(0, 4) == "vote") {
            message.channel.send("This command must be performed in #bry-confessions!");
            return;
        }
    }
    var hashedId = hashId(message.author.id);
    /*
    if (banList.bans.indexOf(hashedId) >= 0 && message.channel.type == "dm") {
            return;
    }
    */
    explo = false;
    if (message.content.slice(0, 17) == "!explodingmessage") {
        explo = true;
    }

    var veri = message.content.split(" ");
    var spliceArea = message.content.indexOf(" ");
    if (message.content.slice(0, 7) == "verify|" && message.channel.type == "dm") {

        var veriNumArr = veri[0].split("|");
        var veriNum = parseInt(veriNumArr[1]);
        var veriConfIndex = repPostNum.indexOf(veriNum);
        if (repPostUser[veriConfIndex] == hashedId) {
            verifyNum = veriNumArr[1];
        } else {
            message.channel.send("Verification failure!");
            return;
        }
    }
    isRoulette = false;
    if (message.content.slice(0, 9) == "!roulette") {
        isRoulette = true;
    }
    if (message.content.startsWith("!setemoji")) {
        if (starUsers.indexOf(message.author.id) == -1) {
            message.channel.send("You do not have a perk!");
        } else {
            //console.log(message.content.slice(10,12));
            userEmojis[starUsers.indexOf(message.author.id)] = message.content.slice(10, 12);
            store.set('userEmojis', userEmojis);
            //console.log(store.get('userEmojis'));
            message.channel.send("Emoji set! Please note that only true emojis will work.");
        }
        return;
    }
    if (message.content.includes("brypic")) {
        var picarr = message.content.split(" ");
        var brynum = parseInt(picarr[1])

        if (picarr.length == 2) {
            if (picarr[1].includes("latest")) {
                message.channel.send("Brypic #" + (config.brypics.length));
                message.channel.send(config.brypics[config.brypics.length - 1]);
            } else if (brynum >= 1 && brynum <= config.brypics.length) {
                message.channel.send("Brypic #" + brynum);
                message.channel.send(config.brypics[brynum - 1]);
            } else {
                message.channel.send("Invalid input!");
            }

        } else if (message.content == "brypic") {
            var brypic = Math.floor(Math.random() * config.brypics.length);
            message.channel.send("Brypic #" + (brypic + 1));
            message.channel.send(config.brypics[brypic]);
        } else {
            message.channel.send("Invalid input!");
        }
        return;
    }

    if (message.content.toLowerCase() == "bryhelp") {
        message.channel.send(new Discord.RichEmbed()
            .setColor('#ffff00')
            .setTitle('Bry Confessions Help')
            .setDescription('DM the bot to submit a new confession. Confessions will be anonymously posted to #bry-confessions.\nThere is a 5-minutes cooldown for all users by default, but users that have been reported or are spamming may receive longer cooldowns.\nIf you would like to report a confession, type \"report <confession number>\" and confessions with more than 3 reports will impose a cooldown on the posting user.\nWant to make a poll? DM the bot \"createpoll|<option1>|<option2>|<title (optional)>|anonpoll (optional)|duration (in minutes, optional)\"\nTo write a serious confession (no reaction, seperate channel) begin your confession with \"!serious\"\nTo verify you wrote a previous confession begin your DM to the bot with \"verify|<confession number>\"\nTo write a message that disappears after 45s add \"!explodingmessage\" before your confession\nTo play roulette, with a 20% chance of message reveal, type \"!roulette\" before your confession')
        );
        return;
    }
    if (message.content.toLowerCase() == "bryrules") {
        message.channel.send(new Discord.RichEmbed()
            .setColor('#ffff00')
            .setTitle('Bry Confessions Rules')
            .setDescription('Any content that can be perceived as hateful, harmful, dangerous or otherwise highly distasteful can result in a temporary or permanent ban.\nRepetitive spam may result in a 24hour cooldown or possibly a ban if behavior continues.\nUsing alt accounts to farm or gain an unfair advantage in Brycoin may lead to a ban.')
        );
        return;
    }
    if (message.content.toLowerCase() == "brystatus") {
        var banNum = 0;
        for (var i = 0; i < bannedIds.length; i++) {
            if (bannedExpiry[i] != -1) {
                banNum++;
            }
        }
        message.channel.send(new Discord.RichEmbed()
            .setColor('#0000FF')
            .setTitle('Bry Confessions Status')
            .setDescription('Bot has been online for ' + readableDate(startTime) + '.\nThere are currently ' + banNum + ' banned users.\n' + starUsers.length + ' users have perks!\nOut of all roulette confessions, ' + rouletteHit + ' have been revealed and ' + rouletteSave + ' have not.')
        );
        return;
    }
    if (message.content.toLowerCase() == "viewbans") {
        var totalBans = 0;
        for (var i = 0; i < bannedIds.length; i++) {
            if (bannedExpiry[i] != -1) {
                message.channel.send("Confession #" + bannedNum[i] + " - Ban expires in " + readableDate(bannedExpiry[i]));
                totalBans++;
            }
        }
        if (totalBans == 0) {
            message.channel.send("There are no bans!");
        } else {
            message.channel.send("Total active bans: " + totalBans);
        }
        return;
    }
    if (message.content == "neil") {
        message.channel.send(retArr(config.neil));
        return;
    }
    if (message.content == "ben") {
        message.channel.send(retArr(config.ben));
        return;
    }
    if (message.content == "anthony") {
        message.channel.send(retArr(config.anthony));
        return;
    }
    if (message.content == "vincent") {
        message.channel.send(retArr(config.vincent));
        return;
    }
    if (message.content == "memoli") {
        message.channel.send(retArr(config.memoli));
        return;
    }
    if (message.content == "franklin") {
        message.channel.send(retArr(config.franklin));
        return;
    }
    if (message.content == "pal") {
        message.channel.send(retArr(config.pal));
        return;
    }
    if (message.content == "brymeme") {
        message.channel.send(retArr(config.brymeme));
        return;
    }
    if (message.content == "john") {
        message.channel.send(retArr(config.john));
        return;
    }
    if (message.content == "willy") {
        message.channel.send(retArr(config.willy));
        return;
    }
    if (message.content == "angela") {
        message.channel.send(retArr(config.angela));
        return;
    }
    if (message.content == "pastconf") {
        var dex = Math.floor(Math.random() * config.pastconfs.length);
        var pConfSplit = config.pastconfs[dex].split("BBSEP");
        if (pConfSplit.length == 2) {
            message.channel.send(new Discord.RichEmbed()
                .setColor('#88c0d0')
                .setTitle(pConfSplit[0])
                .setDescription(pConfSplit[1])
            );
            return;
        } else {
            message.channel.send(new Discord.RichEmbed()
                .setColor('#88c0d0')
                .setTitle(pConfSplit[0])
                .setDescription(pConfSplit[1])
                .addField('Word of rngesus', pConfSplit[2])
            );
        }

    }
    if (message.content.includes("bryquote")) {
        var picarr = message.content.split(" ");
        var brynum = parseInt(picarr[1])

        if (picarr.length == 2) {
            if (picarr[1].includes("latest")) {
                message.channel.send("Bryquote #" + (config.bryquotes.length));
                message.channel.send(config.bryquotes[config.bryquotes.length - 1]);
            } else if (brynum >= 1 && brynum <= config.bryquotes.length) {
                message.channel.send("Bryquote #" + brynum);
                message.channel.send(config.bryquotes[brynum - 1]);
            } else {
                message.channel.send("Invalid input!");
            }

        } else if (message.content == "bryquote") {
            var brypic = Math.floor(Math.random() * config.bryquotes.length);
            message.channel.send("Bryquote #" + (brypic + 1));
            message.channel.send(config.bryquotes[brypic]);
        } else {
            message.channel.send("Invalid input!");
        }
        return;

    }
    if (message.content.toLowerCase() == "pollstatus") {
        if (currentPoll == false) {
            message.channel.send("There is no poll currently running!");
            return;
        }
        client.channels.get(instantChannel).send("Title: " + currentPollTitle + "\nOption 1: " + currentPollOpt1 + "\nOption 2: " + currentPollOpt2 + "\nAnonymous: " + anonyPoll + "\nEnds in: " + readableDate(pollEndTime) + "\n" + (option1 + option2) + " people have voted");
        return;
    }
    if (message.content.toLowerCase() == "createpoll" || message.content.toLowerCase() == "pollhelp") {
        message.channel.send("DM the bot \"createpoll|<option1>|<option2>|<title (optional)>|anonpoll (optional)|duration (in minutes, optional)\"");
        return;
    }
    if (message.content.toLowerCase() == "ship") {
        message.channel.send("Bry declares that " + generateShip() + " is the new hip ship in town.");
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

    if (message.channel.type != "dm" && message.content.toLowerCase().slice(0, 6).includes("accept")) {
        let nnum = parseInt(message.content.slice(7));
        //let appealIndex = bannedNum.indexOf(nnum);
        let bannedUserIndex = bannedNum.indexOf(nnum);
        let votesNeed = 5;
        if (appealNums == 0) {
            message.channel.send("Appeal vote error!");
            return;
        }
        if ((bannedExpiry[bannedUserIndex] - Date.now()) < 86400000) {
            votesNeed = 2;
        } else if ((bannedExpiry[bannedUserIndex] - Date.now()) < 604800000) {
            votesNeed = 4;
        } else {
            votesNeed = 7;
        }

        for (i = 0; i < (appealVoters.length / 18); i++) {
            var uId = parseInt(appealVoters.slice(i * 18, i * 18 + 18));
            if (message.author.id == uId) {
                message.channel.send("You have already supported the appeal for confession #" + nnum + "!");
                return;
            }
        }

        if (appealVol <= votesNeed) {
            message.channel.send("You have voted to accept the appeal for #" + nnum + "! " + (votesNeed - appealVol) + " additional acceptances are needed to free the author of #" + nnum + ".");
            appealVoters = appealVoters + message.author.id;
            appealVol++;
            return;
        }
        if (appealVol[appealIndex] == votesNeed) {
            message.channel.send("You have voted to accept the appeal for #" + nnum + "! This user's ban has now been removed.");
            bannedExpiry[bannedUserIndex] = -1;
            appealNums = 0;
            appealVol = 0;
            appealVoters = "111111111111111111";
            return;
        }
        message.channel.send("Error accepting appeal!");
        return;
    }

    if (message.channel.type != "dm" && message.content.toLowerCase().slice(0, 6).includes("report")) {
        args = message.content.slice(7);
        let reported = parseInt(args);
        let repUsrId = message.author.id.toString();
        //console.log("received report for conf "+reported);
        //console.log(repPostReporters);
        const reportsNeeded = 1;
        if (repPostNum.indexOf(reported) > -1) {
            let reportIndex = repPostNum.indexOf(reported);
            if (Date.now() - repPostTime[reportIndex] > 86400000) {
                message.channel.send("This confession is too old to report!");
                return;
            }

            for (i = 0; i < (repPostReppers[reportIndex].length / 18); i++) {
                userInd = parseInt(repPostReppers[reportIndex].slice(i * 18, i * 18 + 18));
                if (userInd == repUsrId) {
                    message.channel.send("You have already reported confession #" + repPostNum[reportIndex] + "!");
                    return;
                }
            }



            if (repPostVol[reportIndex] >= 100) {
                var reportedUserIndex = bannedIds.indexOf(repPostUser[reportIndex]);
                var dayBan = (repPostVol[reportIndex] - 100) + 2;
                if (isNaN(dayBan)) {
                    message.channel.send("Error! Could not report!");
                    return;
                }
                repPostVol[reportIndex]++;
                message.channel.send("Your report for confession #" + repPostNum[reportIndex] + " has been counted. The user who sent the confession now has a " + dayBan + " day ban! Each additional report will add another day to the ban.");
                bannedExpiry[reportedUserIndex] = (Date.now() + (86400000 * dayBan))
                store.set('banUserExpiry', bannedExpiry);
                repPostReppers[reportIndex] = repPostReppers[reportIndex] + repUsrId;
                return;
            }
            if (repPostVol[reportIndex] >= reportsNeeded) {
                var reportedUserIndex = bannedIds.indexOf(repPostUser[reportIndex]);
                if (reportedUserIndex > -1 && bannedExpiry[reportedUserIndex] != -1) {
                    //blanc       
                } else if (bannedExpiry[reportedUserIndex] == -1) {
                    bannedExpiry[reportedUserIndex] = (Date.now() + 86400000);
                    store.set('banUserExpiry', bannedExpiry);
                    bannedNum[reportedUserIndex] = repPostNum[reportIndex];
                    store.set('bannedNum', bannedNum);
                    bannedAppealed[reportedUserIndex] = false;
                    store.set('bannedAppealed', bannedAppealed);
                } else {
                    bannedIds.push(repPostUser[reportIndex]);
                    store.set('banUserIds', bannedIds);
                    bannedExpiry.push(Date.now() + 86400000);
                    store.set('banUserExpiry', bannedExpiry);
                    bannedNum.push(repPostNum[reportIndex]);
                    store.set('bannedNum', bannedNum);
                    bannedAppealed.push(false);
                    store.set('bannedAppealed', bannedAppealed);
                }
                repPostVol[reportIndex] = 100;
                message.channel.send("Your report for confession #" + repPostNum[reportIndex] + " has been counted. The user who sent the confession has been banned for 24 hours. Each addition report will add another day to the ban.");
                repPostReppers[reportIndex] = repPostReppers[reportIndex] + repUsrId;
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

    var userIndex = postIds.indexOf(hashedId);
    var cooldown = 20000;
    // 

    if (message.content.includes("!appeal")) {
        var banListId = bannedIds.indexOf(hashedId);
        if (appealNums != 0) {
            message.channel.send("There is already an ongoing appeal!");
            return;
        }
        if (bannedExpiry[banListId] == -1 || banListId == -1) {
            message.channel.send("You are not banned!");
            return;
        }
        if (bannedAppealed[banListId] == true) {
            message.channel.send("You have already used up your appeal!");
            return;
        }

        client.channels.get(instantChannel).send(new Discord.RichEmbed()
            .setColor('#008080')
            .setTitle('Appeal for Confession #' + bannedNum[banListId])
            .setDescription('Reason for appeal: ' + message.content.slice(8))
            .addField('Do you support this appeal?', 'Type \"accept ' + bannedNum[banListId] + '\" to support this appeal!\n')
        );
        appealVoters = "111111111111111111";
        appealVol = 0;
        appealNums = bannedNum[banListId];
        bannedAppealed[banListId] = true;
        store.set('bannedAppealed', bannedAppealed);
        message.react("✅");
        return;
    }

    if (bannedIds.indexOf(hashedId) == -1 || bannedExpiry[bannedIds.indexOf(hashedId)] == -1) {
        cooldown = 20000;
    } else if (Date.now() >= bannedExpiry[bannedIds.indexOf(hashedId)]) {
        bannedExpiry[bannedIds.indexOf(hashedId)] = -1;
        store.set('banUserExpiry', bannedExpiry);
        cooldown = 20000;
    } else if (bannedIds.indexOf(hashedId) > -1 && Date.now() <= bannedExpiry[bannedIds.indexOf(hashedId)]) {
        cooldown = (bannedExpiry[bannedIds.indexOf(hashedId)] - (Date.now()));
        client.users.get(message.author.id).send("You are banned! You cannot send a message for the next " + readableDate(bannedExpiry[bannedIds.indexOf(hashedId)]) + "\nWant to appeal your ban? Use \"!appeal <your appeal reason here>\"");
        return;
    }

    if (cNum % 1000 == 0) {
        client.channels.get(instantChannel).send(new Discord.RichEmbed()
            .setColor('#ffa500')
            .setTitle('CONFESSION #' + cNum)
            .setDescription('Congratulations to ' + addTitle(message.author.id) + ' for sending confession #' + cNum + '!!!!')
        );
        cNum++;
        store.set('cNum', cNum);
        starUsers.push(message.author.id);
        /*fs.appendFile('starusers.txt', '-' + message.author.id, function(err) {
            if (err) throw err;
            console.log('Star user logged');
        });*/
        store.set('starUsers', starUsers);
        userEmojis.push("✨");
        store.set('userEmojis', userEmojis);
        /*
        fs.appendFile('useremojis.txt', '-✨', function(err) {
            if (err) throw err;
            console.log('User emoji logged');
        });
        */
        return;
    }

    if (cNum % 500 == 0) {
        client.channels.get(instantChannel).send(new Discord.RichEmbed()
            .setColor('#ffa500')
            .setTitle('CONFESSION #' + cNum)
            .setDescription('Congratulations to ' + addTitle(message.author.id) + ' for sending confession #' + cNum + '!!!! They have received a 5000 BC award!')
        );
        cashUserBals[cashUserIds.indexOf(message.author.id)] += 5000;
        cNum++;
        return;

    }

    if (cNum % 100 == 0) {
        client.channels.get(instantChannel).send(new Discord.RichEmbed()
            .setColor('#ffa500')
            .setTitle('CONFESSION #' + cNum)
            .setDescription('Congratulations to ' + addTitle(message.author.id) + ' for sending confession #' + cNum + '!!!! They have received a 1000 BC award!')
        );
        cashUserBals[cashUserIds.indexOf(message.author.id)] += 1000;
        cNum++;
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
                if (parseInt(optionsArray[optionsArray.length - 1]) >= 2 && parseInt(optionsArray[optionsArray.length - 1]) <= 45 && isNaN(parseInt(optionsArray[optionsArray.length - 1])) == false) {
                    pollMinutes = parseInt(optionsArray[optionsArray.length - 1]);
                    pollTime = pollMinutes * 60000;
                    optionsArray.pop();
                } else if (isNaN(parseInt(optionsArray[optionsArray.length - 1])) == false) {
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


                        /*
                                                fs.appendFile('messagelogs.txt', '\n' + hashedId + '-' + message.content, function(err) {
                                                    if (err) throw err;
                                                    console.log('Poll logged');
                                                });
                                                */
                        client.channels.get(instantChannel).send(new Discord.RichEmbed()
                            .setColor('#800080')
                            .setTitle('Anonymous Poll')
                            .setDescription('A: ' + optionsArray[0] + '\nB: ' + optionsArray[1])
                            .addField('ANONYMOUS POLL', 'Bot will only accept votes via DM! Send \"vote a\" or \"vote b\" to cast your vote!\nPoll runs for ' + pollMinutes + ' minutes.\nType \"pollstatus\" to check on the poll!')
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
                        /*
                                                fs.appendFile('messagelogs.txt', '\n' + hashedId + '-' + message.content, function(err) {
                                                    if (err) throw err;
                                                    console.log('Poll logged');
                                                });*/
                        client.channels.get(instantChannel).send(new Discord.RichEmbed()
                            .setColor('#800080')
                            .setTitle('Anonymous Poll - ' + optionsArray[2])
                            .setDescription('A: ' + optionsArray[0] + '\nB: ' + optionsArray[1])
                            .addField('ANONYMOUS POLL', 'Bot will only accept votes via DM! Send \"vote a\" or \"vote b\" to cast your vote!\nPoll runs for ' + pollMinutes + ' minutes.\nType \"pollstatus\" to check on the poll!')
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
                    /*
                                        fs.appendFile('messagelogs.txt', '\n' + hashedId + '-' + message.content, function(err) {
                                            if (err) throw err;
                                            console.log('Poll logged');
                                        });*/
                    client.channels.get(instantChannel).send(new Discord.RichEmbed()
                        .setColor('#FFA500')
                        .setTitle('Poll - ' + optionsArray[2])
                        .setDescription('A: ' + optionsArray[0] + '\nB: ' + optionsArray[1])
                        .addField('Vote now!', 'Type \"vote a\" or \"vote b\" to cast your vote!\nPoll runs for ' + pollMinutes + ' minutes.\nType \"pollstatus\" to check on the poll!')
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
                    /*
                                        fs.appendFile('messagelogs.txt', '\n' + hashedId + '-' + message.content, function(err) {
                                            if (err) throw err;
                                            console.log('Poll logged');
                                        });*/
                    client.channels.get(instantChannel).send(new Discord.RichEmbed()
                        .setColor('#FFA500')
                        .setTitle('Poll')
                        .setDescription('A: ' + optionsArray[0] + '\nB: ' + optionsArray[1])
                        .addField('Vote now!', 'Type \"vote a\" or \"vote b\" to cast your vote!\nPoll runs for ' + pollMinutes + ' minutes.\nType \"pollstatus\" to check on the poll!')
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

        //console.log(userIndex);
        //console.log("Array is at "+userIndex);
        if ((Date.now() - postTimes[userIndex]) <= cooldown && userIndex != -1) {
            client.users.get(message.author.id).send("Cooldown! You cannot send a message for the next " + readableDate(cooldown + postTimes[userIndex]));
            return;
        }

        //message.content = message.content.replace("!instant", "");

        if (message.attachments.size > 0) {
            var attach = (message.attachments).array();
            client.channels.get(instantChannel).send('Confession #' + cNum);
            client.channels.get(instantChannel).send(attach[0].url);
            //return;
        } else if (message.content.slice(message.content.length - 3) == "png" || message.content.slice(message.content.length - 3) == "jpg" || message.content.slice(message.content.length - 3) == "gif" || message.content.slice(message.content.length - 4) == "jpeg" || message.content.includes("youtube.com") || message.content.includes("youtu.be") || message.content.includes("imgur.com") || message.content.includes("twitter.com") || message.content.includes("tenor.com")) {
            client.channels.get(instantChannel).send('Confession #' + cNum);
            client.channels.get(instantChannel).send(message.content);
        } else if (serious) {
            client.channels.get(instantChannel).send(new Discord.RichEmbed()
                .setColor('#800080')
                .setTitle('Confession #' + cNum)
                .setDescription(message.content.slice(9))
                //.addField('Word of rngesus', addReaction())
            );
        } else if (explo) {
            client.channels.get(instantChannel).send(new Discord.RichEmbed()
                .setColor('#FF0000')
                .setTitle('Exploding Message')
                .setDescription(message.content.slice(17))
            ).then(sentMessage => {
                setTimeout(function() {
                    sentMessage.edit(new Discord.RichEmbed()
                        .setColor('#FF0000')
                        .setTitle('Exploding Message')
                        .setDescription('*Deleted*')
                    );
                }, 45000)
            });
            /*
                        fs.appendFile('messagelogs.txt', '\n' + cNum + '-' + hashedId + '-' + message.content, function(err) {
                            if (err) throw err;
                            console.log('Exploding message logged');
                        });
            */
            return;
        } else if (isRoulette) {
            var rand = Math.random();
            if (rand < 0.2) {
                client.channels.get(instantChannel).send(new Discord.RichEmbed()
                    .setColor('#FF0000')
                    .setTitle('Bryconf Roulette #' + cNum)
                    .setDescription(message.content.slice(10))
                    .addField('ROULETTE', '😱 The author of this confession was ' + addTitle(message.author.id) + '!!!\n20% chance')
                );
                for (var i = 0; i < cashUserInv.length; i++) {
                    if (getRankId(cashUserIds[i]) >= 13) {
                        var d = new Date();
                        if (d.getDay() != dayToday) {
                            dayToday = d.getDay();
                            confsEarned = 0;
                            revealsEarned = 0;
                            ranksEarned = 0;
                            lastStockPrice = stockPrice;
                        }
                        if (revealsEarned < 24) {
                            cashUserBals[i] += 150;
                        }

                    }
                }
                revealsEarned++;
                rouletteHit++;
                store.set('rouletteHits', rouletteHit);
            } else {
                client.channels.get(instantChannel).send(new Discord.RichEmbed()
                    .setColor('#bfff00')
                    .setTitle('Bryconf Roulette #' + cNum)
                    .setDescription(message.content.slice(10))
                    .addField('ROULETTE', '😌 The author of this confession will stay anonymous!\n80% chance')
                );
                rouletteSave++;
                store.set('rouletteSaves', rouletteSave);
            }
        } else if (verifyNum > -1) {
            client.channels.get(instantChannel).send(new Discord.RichEmbed()
                .setColor('#87ceeb')
                .setTitle('Verified Confession #' + cNum)
                .setDescription(message.content.slice(spliceArea))
                .addField('Verified!', "✅ This user also wrote confession #" + verifyNum)
            );
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
            postTimes[userIndex] = Date.now();
        } else {
            postIds.push(hashedId);
            postTimes.push(Date.now());
            //postWarn.push(false);
        }
        repPostNum.push(cNum);
        repPostVol.push(0);
        repPostUser.push(hashedId);
        repPostReppers.push("111111111111111111");
        repPostTime.push(Date.now());
        //repPostReporters.push(cNum);

        message.react("✅");
        /*
                if (message.attachments.size > 0) {
                    fs.appendFile('messagelogs.txt', '\n' + cNum + '-' + hashedId + '-' + attach[0].url, function(err) {
                        if (err) throw err;
                        console.log('Confession logged');
                    });
                } else {


                    fs.appendFile('messagelogs.txt', '\n' + cNum + '-' + hashedId + '-' + message.content, function(err) {
                        if (err) throw err;
                        console.log('Confession logged');
                    });

                }
                */

        cNum++;
        for (var i = 0; i < cashUserInv.length; i++) {
            if (getRankId(cashUserIds[i]) >= 9) {
                var d = new Date();
                if (d.getDay() != dayToday) {
                    dayToday = d.getDay();
                    confsEarned = 0;
                    revealsEarned = 0;
                    ranksEarned = 0;
                    lastStockPrice = stockPrice;
                }
                if (confsEarned < 150) {
                    cashUserBals[i] += 50;
                }

            }
        }
        confsEarned++;
        store.set('cNum', cNum);
        return;
    }
});


client.login(auth.token);