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
const store = require('data-store')('persistent');
//md5
const md5 = require('md5');
//write to file
const fs = require('fs');
const client = new Discord.Client();
//let cNum = parseInt(fs.readFileSync("confnum.txt", "utf8"));

let cNum = store.get('cNum');
let starUsers = store.get('starUsers');
let userEmojis = store.get('userEmojis');
let cashUserIds = store.get('userIds');
let cashUserBals = store.get('userBals');
let cashUserInv = store.get('userInv');
let cashUserBank = store.get('userBank');
let cashUserDeposit = store.get('userDeposit');
const cashShopListings = store.get('shopListings');
const cashShopCosts = store.get('shopCosts');
const secret = store.get('secretKey');
const auth = require("./auth.json");

let bannedIds = store.get('banUserIds');
let bannedExpiry = store.get('banUserExpiry');
let bannedNum = store.get('bannedNum');
let bannedAppealed = store.get('bannedAppealed');
//const banList = require("./banlist.json"); //this should never be uploaded publicly
const config = require("./config.json");


//const logChannel = "675193177656918039";
let instantChannel = store.get('instChan');
//const slowChannels = ["675201659558690875", "675350296142282752", "675381993642393641"];

let postIds = [];
let postTimes = [];
//let postWarn = [];

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
let rouletteHit = store.get('rouletteHits');
let rouletteSave = store.get('rouletteSaves');
let allTitles = ["🗑️ Bum",
    "🧱 Commoner",
    "🎖️ Ensign",
    "⚓ Captain",
    "💰 Governor/💰 Governess",
    "🛡️ Viceroy",
    "🔢 Count/🔢 Countess",
    "🥪 Earl",
    "🔮 Magistrate",
    "🐔 Chanticleer",
    "⚔️ Knight",
    "🥄 Aristocrat",
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
    let userInv = cashUserInv[indexxxx].split(",");
    let full = "";
    let g = false;
    let rankId = 0;

    if (userInv[0] == "inv") {
        return "🥔 Peasant <@" + id + ">";
    }
    if (userInv[0].slice(0, 1) == "f") {
        g = true;
        rankId = parseInt(userInv[0].slice(1));
    } else {
        g = false;
        rankId = parseInt(userInv[0].slice(1));
    }

    if (isNaN(rankId)) {
        return "<@" + id + ">";
    }

    if (userInv[0] == "inv" || rankId == isNaN(rankId)) {
        return "🗑️ Bum <@" + id + ">";
    } else {
        let title = allTitles[rankId].split("/");
        if (g == false || title.length == 1) {
            return title[0] + " <@" + id + ">";
        } else {
            return title[1] + " <@" + id + ">";
        }
    }
    return "<@" + id + ">";
}

client.on("ready", () => {
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
    client.user.setActivity("Type \"bryhelp\" or \"bryrules\" for more info");
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

    if (message.channel.type != "dm") {
        let moneyIndex = cashUserIds.indexOf(message.author.id);
        let userInv = cashUserInv[moneyIndex].split(",");
        let rankId = 0;
        if (userInv[0] == "inv") {
            rankId = 0;
        } else if (userInv[0].slice(0, 1) == "f") {
            rankId = parseInt(userInv[0].slice(1));
        } else {
            rankId = parseInt(userInv[0].slice(1));
        }
        let vv = true;
        let rateUserIndex = rateUserId.indexOf(message.author.id);
        let rankCost = Math.round(Math.pow((rankId + 1), 1.9) * 200);
        if (cashUserBals[moneyIndex] == null) {
            cashUserBals[moneyIndex] = 1;
        }
        if ((cashUserBals[moneyIndex]) > (rankCost * 2)) {
            message.channel.send("Hey " + addTitle(message.author.id) + " - Your current balance is above the maximum your rank can safely keep, which is " + (rankCost * 2) + "! Rank up now to keep earning Brycoins and stay safe from robbers!");
        }
        if (rateUserIndex == -1) {
            rateUserId.push(message.author.id);
            rateUserTime.push(Date.now());
            rateUserRefresh.push(Date.now());
        } else {
            if ((Date.now() - rateUserRefresh[rateUserIndex]) > 3600000) {
                message.channel.send("Hey " + addTitle(message.author.id) + " - Your hourly 65 Brycoin bonus has been deposited into your account!");
                cashUserBals[moneyIndex] = cashUserBals[moneyIndex] + 65;
                store.set('userIds', cashUserIds);
                store.set('userBals', cashUserBals);
                rateUserRefresh[rateUserIndex] = Date.now();
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
                    message.channel.send(addTitle(message.author.id) + " got a mini prize! This has a 1% chance of happening per message 😱\nYou gained 200 brycoins!");
                    cashUserBals[moneyIndex] = cashUserBals[moneyIndex] + 200;
                    store.set('userIds', cashUserIds);
                    store.set('userBals', cashUserBals);
                    return;
                }

                rateUserTime[rateUserIndex] = Date.now();
            }

        }

        if (moneyIndex == -1) {
            cashUserIds.push(message.author.id);
            cashUserBals.push(1);
            cashUserInv.push("inv");
            cashUserBank.push(0);
            cashUserDeposit.push(0);
        } else {
            if (vv) {
                cashUserBals[moneyIndex] += 2;
            }

        }
        store.set('userIds', cashUserIds);
        store.set('userBals', cashUserBals);
        store.set('userInv', cashUserInv);
    }

    if (message.channel.type != "dm" && message.content == "titles") {
        let fulll = "";
        for (var i = 0; i < allTitles.length; i++) {
            fulll += allTitles[i] + " | Cost: " + Math.round(Math.pow((i + 1), 1.9) * 200) + " Brycoins\n";
        }
        fulll += "Want to buy a new title? Type \"rankup\"!\nTo switch between title genders type \"togglerank\"";
        message.channel.send(new Discord.RichEmbed()
            .setColor('#FFDF00')
            .setTitle('Title Shop')
            .setDescription(fulll)
        );
        return;
    }

    if (message.content == "rankup") {
        let indexxxx = cashUserIds.indexOf(message.author.id);
        let userInv = cashUserInv[indexxxx].split(",");
        let full = "";
        let rankId = parseInt(userInv[0]);
        if (userInv[0] == "inv") {
            rankId = -1;
        } else if (userInv[0].slice(0, 1) == "f") {
            rankId = parseInt(userInv[0].slice(1));
        } else {
            rankId = parseInt(userInv[0].slice(1));
        }
        let nextCost = Math.round(Math.pow((rankId + 2), 1.9) * 200);
        if (nextCost > cashUserBals[indexxxx] || rankId > (allTitles.length - 2) || isNaN(rankId)) {
            message.channel.send("Error buying next rank!");
            return;
        } else {
            cashUserBals[indexxxx] -= nextCost;
            rankId += 1;
            userInv[0] = "n" + rankId;
            cashUserInv[indexxxx] = userInv.toString();
            store.set('userInv', cashUserInv);
            store.set('userBals', cashUserBals);
            message.channel.send("Success! You are now " + addTitle(message.author.id) + "\nThis transaction cost you " + nextCost);
            return;
        }

    }


    if (message.channel.type != "dm" && message.content.slice(0, 3) == "rob") {
        console.log(message.content);
        let indexxxx = cashUserIds.indexOf(message.author.id);
        let targetedUser = message.content.slice(7, 25);
        let targId = cashUserIds.indexOf(targetedUser);
        let targInv = cashUserInv[targId].split(",");
        if (targId == -1) {
            message.channel.send("Invalid target!");
            return;
        }
        let rankId = 0;
        if (targInv[0] == "inv") {
            rankId = 0;
        } else if (targInv[0].slice(0, 1) == "f") {
            rankId = parseInt(targInv[0].slice(1));
        } else {
            rankId = parseInt(targInv[0].slice(1));
        }
        let rankCost = Math.round(Math.pow((rankId + 1), 1.9) * 200);
        if (rankId == 0) {
            rankCost = 0;
        }
        if (cashUserBals[targId] < rankCost) {
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
                .setDescription("The police caught you before you could rob anyone! They took " + Math.floor(0.3 * cashUserBals[indexxxx]) + " from your wallet.")
                .addField("Stats", "There is a 50% of a robbery failing due to police.")
            );
            cashUserBals[indexxxx] -= Math.floor(0.3 * cashUserBals[indexxxx]);
            store.set('userBals', cashUserBals);
            return;
        }
        if (Math.random() < (1 - (rankId / allTitles.length))) {
            var stealAmt = Math.floor(cashUserBals[targId] * 0.25);
            message.channel.send(new Discord.RichEmbed()
                .setColor('#FFDF00')
                .setTitle('Success!')
                .setDescription("You successfully robbed " + addTitle(targetedUser) + " ! You stole " + Math.floor(stealAmt) + " from their wallet.")
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
                .setDescription(addTitle(targetedUser) + " managed to defend themselves and took " + Math.floor(0.3 * cashUserBals[indexxxx]) + " from your wallet.")
                .addField("Stats", "There is a 50% of a robbery failing due to police, and " + addTitle(targetedUser) + " had rank protection adding a " + ((rankId / allTitles.length) * 100) + "% chance of failure.")
            );
            cashUserBals[indexxxx] -= Math.floor(0.3 * cashUserBals[indexxxx]);
            cashUserBals[targId] += Math.floor(0.3 * cashUserBals[indexxxx]);
            store.set('userBals', cashUserBals);
            return;
        }
    }


    if (message.channel.type != "dm" && message.content == "togglerank") {
        let indexxxx = cashUserIds.indexOf(message.author.id);
        let userInv = cashUserInv[indexxxx].split(",");
        if (userInv[0] == "inv") {
            message.channel.send("Success! You are now " + addTitle(message.author.id));
            return;
        }
        rankId = userInv[0].slice(1);
        if (userInv[0].slice(0, 1) == "f") {
            userInv[0] = "n" + rankId;
            cashUserInv[indexxxx] = userInv.toString();
            store.set('userInv', cashUserInv);
            message.channel.send("Success! You are now " + addTitle(message.author.id));
            return;
        } else {
            userInv[0] = "f" + rankId;
            cashUserInv[indexxxx] = userInv.toString();
            store.set('userInv', cashUserInv);
            message.channel.send("Success! You are now " + addTitle(message.author.id));
            return;
        }
        message.channel.send("Success! You are now " + addTitle(message.author.id));
        return;
    }

    if (message.channel.type != "dm" && message.content == "brybank") {

        let ussIndd = cashUserIds.indexOf(message.author.id);
        if (cashUserBank[ussIndd] == 0) {
            message.channel.send("You have no bank balance! To deposit, type \"brybank deposit <number>\"");
            return;
        }
        let epoch = Math.floor((Date.now() - cashUserDeposit[ussIndd]) / 86400000);
        let theoBal = Math.floor(cashUserBank[ussIndd] * Math.pow(1.05, epoch));
        if ((theoBal - cashUserBank[ussIndd]) > 10000) {
            theoBal = cashUserBank[ussIndd] + 10000;
        }
        message.channel.send(new Discord.RichEmbed()
            .setColor('#FFDF00')
            .setTitle('Bry Bank')
            .setDescription("Your current bank balance: " + theoBal)
            .addField("Stats", "You have been earning 5% daily interest for " + epoch + " days.\nYou have earned " + (theoBal - cashUserBank[ussIndd]) + " Brycoins so far.\nTo withdraw, type \"brybank withdraw\"\nYou can earn a maximum of 10000 Brycoins from the bank.")
        );
        return;
    }

    if (message.channel.type != "dm" && message.content.startsWith("brybank")) {
        let ussIndd = cashUserIds.indexOf(message.author.id);
        let epoch = Math.floor((Date.now() - cashUserDeposit[ussIndd]) / 86400000);
        let theoBal = Math.floor(cashUserBank[ussIndd] * Math.pow(1.05, epoch));
        let ddarr = message.content.split(" ");
        if ((theoBal - cashUserBank[ussIndd]) > 10000) {
            theoBal = cashUserBank[ussIndd] + 10000;
        }
        if (ddarr[1] == "withdraw") {
            if (cashUserBank[ussIndd] == 0) {
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
            if (depNum > 10000) {
                message.channel.send("You cannot deposit more than 10000 brycoins!");
                return;
            }
            if (cashUserBals[ussIndd] > 20000) {
                message.channel.send("You have too many brycoins to use the bank! Try spending some coins or getting income another way!");
                return;
            }
            if (cashUserBank[ussIndd] != 0) {
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
                return;
            }
        }
        message.channel.send("Bank operation failed!");
        return;
    }

    if (message.channel.type != "dm" && message.content.startsWith("buy")) {
        let itemInd = parseInt(message.content.slice(4));
        let buyerInd = cashUserIds.indexOf(message.author.id);
        if (buyerInd == -1 || isNaN(itemInd) || itemInd < 0 || itemInd >= cashShopListings.length) {
            message.channel.send("Could not buy item!");
            return;
        }
        if (cashUserBals[buyerInd] < cashShopCosts[itemInd]) {
            message.channel.send("You do not have enough brycoins to buy this!");
            return;
        } else if ((cashUserBals[buyerInd] - cashShopCosts[itemInd]) >= 0) {
            cashUserBals[buyerInd] = (cashUserBals[buyerInd] - cashShopCosts[itemInd]);
            cashUserInv[buyerInd] += "," + itemInd;
            store.set('userInv', cashUserInv);
            message.channel.send("Purchase successful! Please check your inventory to see your new items.");
            return;

        }
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
        let allListings = "";
        for (var i = 0; i < cashShopListings.length; i++) {
            allListings += cashShopListings[i] + "\n Cost: " + cashShopCosts[i] + " Brycoins - ID:" + i + "\n";
        }
        message.channel.send(new Discord.RichEmbed()
            .setColor('#FFDF00')
            .setTitle('Bry Shop!')
            .setDescription(allListings)
        );
        return;
    }

    if (message.content.toLowerCase().startsWith("gamble")) {
        let wager = parseInt(message.content.slice(7));
        let userInd = cashUserIds.indexOf(message.author.id);
        if (wager > cashUserBals[userInd] || isNaN(wager) || wager < 0) {
            message.channel.send("Bet failed!");
            return;
        }
        if (Math.random() < 0.48) {
            cashUserBals[userInd] += wager;
            message.channel.send(new Discord.RichEmbed()
                .setColor('#00FF00')
                .setTitle('You Win!')
                .setDescription(addTitle(message.author.id) + ' - You won!\n' + wager + ' Brycoins were credited to your account')
                .addField('Odds', 'You had a 48% chance of winning your initial bet')
            );
            store.set('userBals', cashUserBals);
        } else {
            cashUserBals[userInd] -= wager;
            message.channel.send(new Discord.RichEmbed()
                .setColor('#ff0000')
                .setTitle('You Lose!')
                .setDescription(addTitle(message.author.id) + ' - You lost!\n' + wager + ' Brycoins were removed from your account')
                .addField('Odds', 'You had a 48% chance of winning your initial bet')
            );
            store.set('userBals', cashUserBals);
        }
        return;
    }

    if (message.content.toLowerCase().startsWith("inventory")) {
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
        return;
    }

    if (message.content.toLowerCase().startsWith("balance")) {

        let targetUserId = message.author.id;
        let sluice = message.content.slice(11, 29);
        if (sluice.length > 2) {
            targetUserId = sluice;
        }
        let indd = cashUserIds.indexOf(targetUserId);
        if (indd == -1) {
            message.channel.send("The specified user does not have a balance!");
            return;
        }
        let targInv = cashUserInv[indd].split(",");

        let rankId = 0;
        if (targInv[0] == "inv") {
            rankId = 0;
        } else if (targInv[0].slice(0, 1) == "f") {
            rankId = parseInt(targInv[0].slice(1));
        } else {
            rankId = parseInt(targInv[0].slice(1));
        }
        let rankCost = Math.round(Math.pow((rankId + 1), 1.9) * 200);
        if (rankId == 0) {
            rankCost = 0;
        }

        message.channel.send(new Discord.RichEmbed()
            .setColor('#FFDF00')
            .setTitle('Balance')
            .setDescription(addTitle(targetUserId) + '\n' + cashUserBals[indd] + ' Brycoins in Wallet\n' + cashUserBank[indd] + ' Brycoins in Brybank\nThis user is insured for ' + rankCost + ' Brycoins.')
        );
        return;
    }
    var b2s = Array.from(cashUserBals);
    if (message.content.toLowerCase() == "leaderboard") {
        //var b2s = cashUserBals;
        b2s.sort(function(a, b) {
            return b - a
        });
        let fulltxt = "";
        for (i = 0; i < 20; i++) {
            var ussInd = cashUserBals.indexOf(b2s[i]);
            //const User = Client.fetchUser(cashUserIds[i]);
            fulltxt += addTitle(cashUserIds[ussInd]) + " - " + b2s[i] + " BC, " + cashUserBank[ussInd] + " Bank BC\n";
        }
        message.channel.send(new Discord.RichEmbed()
            .setColor('#FFDF00')
            .setTitle('Leaderboard')
            .setDescription(fulltxt)
        );
        return;
    }




    if (starUsers.indexOf(message.author.id) > -1 && message.channel.type != "dm") {
        try {
            message.react(userEmojis[starUsers.indexOf(message.author.id)]);
        } catch (err) {
            console.log("User react failed");
        }

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
            .setDescription('Any content that can be perceived as hateful, harmful, dangerous or otherwise highly distasteful can result in a temporary or permanent ban.\nRepetitive spam may result in a 24hour cooldown or possibly a ban if behavior continues.')
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
    if (message.content.includes("angela")) {
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



                        fs.appendFile('messagelogs.txt', '\n' + hashedId + '-' + message.content, function(err) {
                            if (err) throw err;
                            console.log('Poll logged');
                        });
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

                        fs.appendFile('messagelogs.txt', '\n' + hashedId + '-' + message.content, function(err) {
                            if (err) throw err;
                            console.log('Poll logged');
                        });
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

                    fs.appendFile('messagelogs.txt', '\n' + hashedId + '-' + message.content, function(err) {
                        if (err) throw err;
                        console.log('Poll logged');
                    });
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

                    fs.appendFile('messagelogs.txt', '\n' + hashedId + '-' + message.content, function(err) {
                        if (err) throw err;
                        console.log('Poll logged');
                    });
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

            fs.appendFile('messagelogs.txt', '\n' + cNum + '-' + hashedId + '-' + message.content, function(err) {
                if (err) throw err;
                console.log('Exploding message logged');
            });

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
                .setColor('#13fc03')
                .setTitle('Confession #' + cNum)
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

        cNum++;
        store.set('cNum', cNum);
        return;
    }
});


client.login(auth.token);