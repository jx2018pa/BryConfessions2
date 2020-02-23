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
  "i dunno man, seems kinda straight to me",
  "i dunno man, seems kinda [NAME] to me",
  "and that's why i'll never be grabbed from behind",
  "kinda makes me wanna chiu chiu your ass out",
  "kinda makes me wanna [NAME] your ass out",
  "is this why [NAME] will never pin me to the wall?",
  "My mum is pissed at me, she looks at infinite campus and she is happy at first, then she sees the C+ in french.  'French is the easiest course [NAME], what happened'.  Then she yelled at me, and threw stuff at me, then she pinned me onto the bed.  She brought a balloon.  Then my dad came in and then I was kicked out while.  They locked the door.  This is what happened after.",
  "time for a threesome?",
  "this has me *thirsting* for [NAME]'s purple derple",
  "*shits affectionately*",
  "*faps affectionately*",
  "*suffocates affectionately*",
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
  "precious cinnamon roll [NAME] must protecc oooh so relatable so awkward and nervous and shy and wow look at [NAME] hair its so messy and greasy does thy shower? i bet [NAME] doesn't god [NAME]",
  "I cant wait for [NAME] age like a fine wine in a basement. god i cant wait for [NAME] to just completely turn into an absolute HOTTIE when the college happens. maybe [NAME] will grow big bountiful breasts and dicks for me,to suckle upon like a true deserving lord and god. god, and [NAME]’s feet can only get bigger and smellier from here. i can already FEEL the WRINKLES",
  "it happened again. i woke up with a stain on my pants just THINKING of [NAME]’s delicious feet. i would give ANYTHING for [NAME] to step on me and run the greasy hair all over me. i can't do this. i can't wait until college just to get a glimpse of [NAME]’s delectable toes. it feels like i'm waiting the whole 2 years and more just to see those bountiful flowers.",
  "Pee pee poo poo imma piss like a helicopter",
  "If you breakdance and pee you are essentially a pissing helicopter",
  "When i die i want to be cremated into essential oils so i can always be useless",
  "I love taking a shower it reminds me of me getting pissed on by [NAME]",
  "That’s so lit fam. I’ll dab to that and yeet a fortnite",
  "Says [NAME] as they pisses into my mouth",
  "Says [NAME] as he helicopters away with his boner",
  "Everyone gangsta until the hentai has [NAME] in it",
  "Please pringle my superior rectal artery with your distal renax.",
  "[NAME] iws so quiwky awnd wewatabwe uwu. [NAME] iws so cute with hew messy haiw😍. As[NAME] sama, i’ww make thy take pwivate wessons with me in my woom 😏. But i won’t be teaching anything owo, we’we gonna pway sowme speciaw games togethew 😁😁. Fiwst, i’ww make hew sit down own my bed (facing away fwom me uwu) awnd bwindfowd hew as i cawess hew hew diwty unwashed haiw, awnd sniff the dewicious gwease off of hew head🤤. I bet hew haiw has so much wint awnd dead skin in iwt since [NAME] doesn’t wash it😳 oh i wanna pick iwt out of hew haiw wike a monkey awnd keep sowme of the skin (not wike [NAME] needs iwt uwu).",
  "I bet [NAME] chan skin iws supew soft, if i poke hew chubby cheeks my fingews wouwd squish in awnd it’d feew soo good🤤. I bet its supew tickwish, whewn i gow tuwu cawess he squishy waist, she wouwd giggwe awnd teww me tuwu stowp uwu, but i won’t stowp. I wouwd wwap my awms awound senpai-chan’s tum tum awnd put my hands in hew soft bewwy, wubbing iwt whiwe i sniff hew gweasy haiw hngg😩😩... I’m getting exited juwst thinking abouwt iwt.😫😫.",
  "I’m gonna make suwe tuwu take cawe of [NAME]-chan’s beautifuwwy soft hands, i bet they smeww juwst wike the pages in the books thy weads😩🤤😩, but hew hands awe nothing compawed tuwu the beauty of hew chunky, unshaven wegs. Hew wittwe haiws wouwd tickwe so much as i wub my face up awnd down hew weg🤤. Aftew thawt iws the twue tweasuwe. Hew feet",
  "Oh hew beautifuw, sweaty, smewwy feet😫. I bet they put [NAME] feet tuwu shame white how juicy they awe, awways being cwamped up in [NAME]-chan’s unwashed socks🤤🤤. I bet sowme of hew toenaiws awe chipped fwom jamming thewm intwo hew tabwe awnd chaiw, i wouwdn’t mind cweaning thewm up fow hew with my mouth😩😩. ",
  "Oh i wawnt hew tuwu wub hew feet aww ovew my face, i wawnt hew tuwu pin me tuwu the gwound with thewm but i know [NAME] wouwdn’t duwu that😒. Even though thy won’t, i stiww wuv [NAME]-chan. I know my sweet [NAME] -chan won’t teww anyone abouwt ouw wittwe pwivate study session, thy’s too shy awnd sweet to😊. But if i see any of the mawe students (especiawwy thawt fuckew REEEE😡) getting cwose tuwu my [NAME]-chan, i might accidentawwy weave thewm in the middwe of enemy wines without any weapons🤭. The onwy exception iws ashe since they’we hoodie buddies🤗.",
  "Please emotionally manipulate me like a fisherman manipulates a fish",
  "I owo’d so hard i am now locked in a zoo cage",
  "Then [NAME] started sucking [NAME]'s toes",
  "but then I got distracted by [NAME]'s thick ass",
  "Then [NAME] saw [NAME] eating [NAME]'s ass",
  "But everyone was busy licking [NAME]'s dick",
  "But then [NAME] walked in wearing nothing but a t-shirt",
  "why is [NAME] so fucking hot they always wear short shorts and a t-shirt just to fucking taunt me god fucking damn it",
  "WHY WON'T [NAME] AND [NAME] JUST SMASH ALREADY JESUS FUCKING CHRIST",
  "MMMMMMMM ZHE GE [NAME]!!!!!",
  "MMMMMMMM ZHE GE [NAME] TE BIE [NAME]!!!!!!!!!",
  "please grab me by the fucking cricket",
  "outside of school they call me lil [NAME]",
  "Stream So What",
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
  "And then [NAME] stuck their fingers up [NAME]'s ass",
  "And then [NAME] made sweet, passionate love to [NAME]",
  "And then [NAME] bit off [NAME]'s foreskin",
  "Then [NAME] stuck a broomstick up [NAME]'s ass",
  "Then [NAME] died of embarassment",
  "Then [NAME] and [NAME]'s dicks interlocked",
  "Then [NAME] saw [NAME] licking [NAME]'s toes",
  "That made [NAME] slightly aroused",
  "But then everyone got distracted by the thunderous clap of [NAME]'s ass cheeks",
  "But then everyone was distracted by the loud schlopping noises coming from [NAME]'s general direction",
  //vincent-esque
  "I'm calling 911",
  "Story time bitches let me clear up my desk for uhh [NAME] x [NAME] x [NAME] drabble",
  "[NAME] faps a lot so they have big hands",
  "I want [NAME] to touch me",
  "But then [NAME] pinned me to the bed",
  "if archae live in harsh conditions does that mean they enjoy BDSM?",
  "And then [NAME] tried to run away, but I pin him to the wall",
  "Jesus fucking christ i would do anything to sniff [NAME]'s toes",
  "Then [NAME] bashed [NAME]'s skull in with a rock",
  "ello mello... do u wanna have some *fun* [NAME]? maybe do some *making codes* if yuo're into that? *you're not? cold fishh.....*",
  "haiii [NAME]!! i just sent u my 400 video nightcore playlist... my favorite video features [NAME] in a suggestive pose...",
  "So I get bored and I play Overwatch.  I see [NAME] **** with Junkrat as usual.  And then I go onto DeviantArt, and I see [NAME] x [NAME] fencing as usual.  And then I walk into [NAME] Lian's class, and I see [NAME] Lian with, with, with Tao Lao Shi.  So I walk out and hang myself.",
  "And then Mr. Davidson walks in, 'cats are cool bye', and goes on a one hour linguistics lab, which everyone is bored.  Then he gives us a test about circles and vibrations.  And after the test is finished, everyone begins to have sex.",
  "And I throw up, and then I wake up again, and I see myself in the bed again, but the bed is full of white stuff.  I flip over the person and I see the face off [NAME]' ass, and I wake up and scream.  I find myself in a pile of PurpleDerples, and they yell at me saying 'oh yeah' and making those lips noises, and it was great.  Then I time traveled to the past so I could see the dinosaurs, and I licked all the dinosaurs, and it was great.  And then the Dinos all died from STDs and whatevers that thing is.  I insert my **** into the dinos, and Derples are born.  And then meteorites fall, and a star appears.  Surprise surprise it’s [NAME].",
  "[NAME] is right in front of me, and he bites me, and I bite him beck, and I think he’s traumatised.  So [NAME] runs away screaming.",
  "we decided to duke it out using our fidget spinners.  We fight each other with our ****s.",
  "After I bit my dick, I see Pal with the bible, descending from Heaven.  Then he shoves the bible in [NAME]'s ass, saying 'my disciple, do you like it?' [NAME] yells out yes.  But then he launched a nuke saying '2sinful4me'.  But we decided to shemx anyways bam bam, pow pow, and I created humans.  And this is why you guys can’t suck ur dick or else Pal will come down from Heaven again and smack you with the Bible, and with the title 'Repent'.",
  "[NAME]'s dick, shocked by the revelation, flies into my mouth, and I spit it out.  Then I roast it, and then I dry it, and then I slow roast it, add some mushrooms, and some saute sauce, and I suck on it.  Then I cut it into pieces and I eat it like a French lady.  I cut them into tiny pieces, but then I invent a robotic penis, and they're is fine, just like how Genji has a robotic penis.  So I eat their dick with a lot of saute sauce, and I slowly chew it.  It’s soft, with a nice texture, but it’s also hard on it inside, and then I realize there’s still some semen left in it, so I poop out a baby.",
  "cummy cum cum cum in my tummy tum tum",
  "i was walking down a street and suddenly i noticed the person in front of me has their voluptious ass cheeks jiggling and suddenly i remembered my dad me that 'hips are incapable of lying' and the person in front of me looked shady af suddenly because hips don't lie",
  "my mum told me that hips dont lie so i always looked at people's truth revealing rear but everyone always critisized me for 'sexualizing everyone' and my uncle sometimes would nag me about it and sometimes those naggings would turn into me eating my uncle's ass because i knew he loved me the most when he touched me down there",
  "sometimes i dream about fusing with [NAME] and becoming god and then jizz out and die",
  "'hey emma! im so glad i caught you today. would you kindly do a favor for me? ill definitly repay you back. thanks! ok, so for the subject i think i would like you to redraw the snow fight scene! i think it was really wholesome, and i really liked it! But I have a specific request - \ni need the focal point to be [NAME]'s feet. Yes, thy feet. Please, make them dirty and sweaty, with maximum detail. I want to be able to taste each toe just by looking at the picture. I want the scene's center piece just to be the holy light of the feet, the sweat reflecting our shining future. I want the scene to be soo vidvidly detail, that I can remember the days when thy laughed, when thy bare feet was so beautiful and innocent in our laughter! i do not care if the foot is boots, or in crocs, i just only want to see thy feet immortalized forever. Thank you.",
  "'hey angela! im so glad i saw you today. would you kindly do a favor for me? ill definitly repay you back. thanks! ok, so for the art, i would like you to draw the sleepover scene. yeah, the one at halloween! i think it was really wholesome, and we all really had a funtime! I do have a request tho: \nPlease paint [NAME]'s armpits in detail please. I woke up next to that person, and all I remember were those sweaty slick, hairy armpits. I was co close, that i bit a piece off, and I felt something different. Something new. I just WANTED to deep throat that armpit, and i had an ocean of waves crush. I felt million emotions, one of them being horny. I just want those armpits throbbing down my throat, i want those hair to pull me between those arms. I need for my feelings to be RELEASED! oh god, please, i'm shaking, please just draw it, i need the once ina lifetime armpits. im shaking, and im already sweating so much. please angela, please let me see them.",
  "um so i saw my roomate buy a body pillow with [NAME]'s image printed on it and uh after two days uh it had a distinct smell of secretions and um.... its... crusty, that it could... stand in the middle of the room. and uh my roomate's notes were getting less detailed and had more pictures of uh.... [NAME] in a certain position. creative, positions. \nOne time my roomate barged into my room begging for me to sexual roleplay as that person and sometimes i hear my roomate loudly moaning that name... please, [NAME], if youre out there please have sex with my roomate. my roomate is making the entire dorm crusty, and sometimes on the bathroom handle i need to peel off a thin layer of something. please, i am begging, [NAME] please have sex with the person, pllease i am begging, plesae make my roomate cum like no tommorow.",
  "so i had a great idea for a new product that will revolutionize everything! so basically its a dolphin shaped vibrator and while it vibrates the fins can secrete lubricant",
  "ok so using this place seriously i think i just wanted to dedicate this part to my aunt. um honestly she did a lot for me, like when my parents werent avalible she would drive me home, and sometimes she would bring me to mcdonalds and buy me mcflurries. I honestly miss her so much, like she taught me chinese and actually cared me. \nOh and he would invite my uncle sometimes too! He touched me.",
  "f for effort",
  //bts fake love youtube link
  "https://www.youtube.com/watch?v=7C2z4GqqS5E",
  //loona so what link sorry
  "https://www.youtube.com/watch?v=7C2z4GqqS5E",
  //two uh "differnt" versions of world is mine
  "https://www.youtube.com/watch?v=EuJ6UR_pD5s",
  "https://www.youtube.com/watch?v=FrVYD2Ac6nM",
  "IM SO SICK OF THIS [NAME] LOVE",
  "make me chiu chiu so hard like a degenerate",
  "Everyday in the morning, I think of you. I think of your soft tender lips, the extravagant lavender shampoo you used last night. I want you to hold me, for us to dance off into the night, into the spiraling beauty that is my passion for you. I want everything to stop in this moment, for our love to be eternal and forever. I want stay by your side, admiring your shiny head forever, to lay next to you on the beach, watching the tides go in and out, and wake up by your side in the mornings just to see you sleeping and smile. [NAME], I want to be with you forever. You are my destiny, and please, darling, let me suck your toes.",
  "Meow meow. Meow meow meow meow? Meow meow meow meow. Meow meow meow? Meow meow. Meow meow meow meow! Meow meow, meow, meow meow + meow meow = meow meow. Meow meow! Meow meow. Meow!",
  "you're the ching to my chong",
  "The FitnessGram™️ Pacer Test is a multistage aerobic capacity test that progressively gets more difficult as it continues. The 20 meter pacer test will begin in 30 seconds. Line up at the start. The running speed starts slowly, but gets faster each minute after you hear this signal. Beep. A single lap should be completed each time you hear this sound. Ding. Remember to run in a straight line, and run as long as possible. The second time you fail to complete a lap before the sound, your test is over. The test will begin on the word start. On your mark, get ready, start.",
  "please stomp on me like a degenerate cricket please *god* [NAME] please make me go chiu chiu so hard as you stomp me into pieces like the piece of degeneracy i am oh god **aaaaaAAAAAAAAAA** please *daddy*",
  "[NAME] and the snow didn't connect with each other at first, a human, and a pile of water.  [NAME] was at his office, reading the story of three gods.  Thy had three basic white bitch girls to give detention to, but thy wouldn’t to go home and order szechuan sauce, then it started snowing, even though it was summer.  'A snow day', [NAME] wished, so the snow continued to snow, the three basic bitch white girls went to starbucks, but [NAME] stayed in his office, the snow accumulated it, so [NAME] decided to go out and have some fun, thy took of thy clothes, so thy could fully embrace the snow.  Yellow and white, the two mixed together, like creamy oreos.  It was a happy snow day.  Drabble, fin.",
  "Let me introduce you to the epic tale of the three gods, [NAME], [NAME], and [NAME].  [NAME], after his adventures in thy dream, found  themselves in the woods, [NAME] descended from the heavens, and started speaking.  \n'Bitch this is what you get. Repent now.' \n'No.' \n'Fuck u.' \n'Ur mum [NAME].' \n'Ohshiet.' \nso [NAME] got demoted from a supreme god to a minor god, and now thy had to compete with two other gods, [NAME], and [NAME].  [NAME] started to explore, but since this thing is in 3rd person, [NAME] became a narrator and decided to explode his penis.",
  "Suddenly, Josh Li appeared, doing math problems as usual.",
  "Suddenly, [NAME] and [NAME] were fighting in the air, in broomsticks, competing for the title of Grandmaster Weeb Mage.  [NAME] stuffed his broom stick in [NAME] ' butt, so [NAME] lost.  It was night time, and [NAME] met a person.  'Hai, my name is Purple Derple'.  Suddenly the moon appeared.  Anthony became the WEREDERPLE, a highly feared creature, but [NAME]  said 'u luv Angela XD', then Angela appeared from a summoning portal, and mauled Anthony to death so she can remain gay.",
  "[NAME] became the WEREDERPLE, a highly feared creature, but [NAME] said 'u luv [NAME] XD', then [NAME] appeared from a summoning portal, and mauled [NAME] to death so she can remain gay, jk WEREDERPLE still alive, so they kissed and went to the moon or some shit, leaving [NAME] behind, [NAME] is sad, she started to cry, too bad she can only make poison, so she kinda poisoned herself, to death, so that's 1/3 of the characters are gone now, but [NAME] resurrected everyone.  'Fuk u [NAME], ur mom does not stan parasite.",
  "Suddenly, [NAME] appeared, 'join my cult u cunt', 'no mine', [NAME] suddenly appeared.  So they engaged in a battle, by yelling chun chun and bry bry, but then they needed water, because they were dry, and then some things happened.  and suddenly they're naked and started to lick each other, thus the Bry and Chun cult merged together into the CHUNRY, ' appeared then said 'wtf is this shit lemme fix this' so [NAME] and [NAME] still hate each other, but they both extended their hands to ', simultaneously, like a video game cutscene, they said, 'join us'. they then had a threesome because lewd is still a thing in AUs, the end.",
  "[NAME] please chapter 8 me",
  "[NAME] was alone, but then there was a sound.  Widowmaker came in and began undressing. Jokes on her she was barely dressed, her soft lips touched [NAME]s, and her hands slid done his smooth body.  ‘hon hon hon’ she said, ‘mmm tasty’ said [NAME].  they kissed, and started licking, their salivia dripping out, and they pinned each other to the bed. \nThat is josh li in the corner, doing math probelms. \n[NAME] then slid his hand into widow's booty, the entire overwatch came in and nuked [NAME] because he was a threat to humanity.  \nthe end",
  "[NAME] was taking a geometry course \nthen [NAME] walked in \n’u suck shit’ \n[NAME] died in a fire",
  "[NAME], at that moment, experienced a relevation. As [NAME] started to put on his pants, [NAME] turned into a car.",
  "'I know you just want to ride this shiny glossy baby,” [NAME] said as the car. He stroked his smooth metallic body with the cardoor, and [NAME]’s pants were completely drenched for some reason. “Fine, I’ll drive you. It’s not-not like I like your- smooth car bod- or anything, b-baka.” [NAME] sputtuered. [NAME] and [NAME] drove off into the sunset, then participated in a 10 minutes race on a boring ass track honestly who the fuck plays Forza what the fuck Adi",
  "you are my spaceship because you make me want to blast off into the sun",
  "https://www.youtube.com/watch?v=q37kaXE1Fb0",
  "https://media.discordapp.net/attachments/313418010700283907/670098755860561952/unknown.png",
  "'Fucking is for humans.' - [NAME], 2020 Noble Prize Winner.",
  "'anunhaiso yeo! i am [NAME], and i am debuting under [NAME] entertainment! kansamida!",
  "'For the fractal fair project I am going to put [NAME] into [NAME] and make them produce fractals'",
  "'Pweese give me huggie wuggies **uwu~** *pounces on you* rawr X3 what's this OWO *notices ur bulge* lets have a little look *here* :)",
  "Yes daddy, ah , ah , ah yamaete, not that spot, *DADDY*, ah ah , oh no dadyd A-DaydaydADYady **AHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH** ***YAMAMATWETETETERIWHTWUE IM GONNA AHHHHHHHHHHHHHHHH***",
  "'i want to get destroyed just like how ap sciences destroys me",
  "yall interested in a dancing thong",
  "i will beat you with a [NAME]",
  "hey girl or boy because we stan gender equality are you a triangle because YOU'RE FUCKING ***[NAME]**",
  "i wish [NAME] had a 13 inch horse cooooooooooking spatula",
  "https://media.discordapp.net/attachments/675350296142282752/680993505484865687/unknown.png",
  "sex sex sex sex pee pee poo poo",
  "HEY! Vsauce **here**! Did you know, your pee pee does not come from the poo poo hole?",
  "Hey! VSAUCE **HERE**! Did you know, the f'cking [NAME]' in your [NAME]?",
  "Hello, VSAUCE **here**! Did you know, I'm [NAME]?",
  "what if the best reaction all along... was you above? 🥺🥺🥺🥺🥺",
  "why are you [NAME]",
  "konichiwa! watashino namaewa, [NAME] desu! watashiwa gak sei, arimasss! arigatokasamassss! hajime... arigato, kasamassssss",
  "quest: the hidden nut \nNut under the kitchen table while **2** parents are within **50** ft without getting caught \nRequires 2 failed perception checks and a successful stealth check. \nREWARD: 20 GP.",
  "**ILL TAKE YOUR ENTIRE STOCK**",
  "*** I WANNA BE IN YOUR POCKET \n FRONT OR BACK, IT DOESN'T MATTER",
  "QUEST: [CRAFT MINE] \nOBJECTIVE: Survive (rolling 15 or above) for **2** days on Minecraft while Franklin (use stats for **Invisible Stalker**) is online. \nREWARD: 10 gp (gold pieces) and a diamond worth 300 [NAME]s.",
  "fill your pockets with emmy",
  "the latest hotesst ship from alibaba is [NAME]cent",
  "QUEST: [GONE FISHING] \nOBJECTIVE: Deceive (rolling persuasion or performance by DM discretion) 1 **Invisible Stalker** into pining for you, playing as a different person. \nPREQUISITES: 1x Disguise Kit \nREWARD: 40 gp (gold pieces)",
  "haha what a nice merry day oopsie i just spilled my [NAME]s everywhere",
  "QUEST: [LOADED POCKETS] \nOBJECTIVE: Explore **Meinkrapht** (2 day's journey) and collect **40** Emeralds worth at least 800 sp in total.  Return gems to **Emmy** (NPC located in Westin) \nREWARD:  the double claw ban hammer (a +1 magical warhammer capable of casting **SMITE** 1x per rest)",
  "QUEST: [THE ENDER DRAG ON] \nOBJECTIVE: revive and slay the shadow dragon **En'Dair** in the Shadowfell.  Afterwards, spam the guildmaster **Poozah** to give you permission to build on the grounds of the Shadowfell. \nREWARD: the unhatched egg of the shadow dragon.",
  "in our upcoming election, we have the [NAME] and [NAME] communism duo versus the [NAME] and [NAME] religion of pal, running for presidents!",
  "[NAME]cest is wincest",
  //25 YT Vids
  "https://www.youtube.com/watch?v=pXkJVlHgSLw",
  "https://www.youtube.com/watch?v=3NJ1PwFf1nQ",
  "https://youtu.be/neb1bQTC7j0",
  "https://youtu.be/8bBziFgbYq4",
  "https://youtu.be/IXixYd1qTfk",
  "https://youtu.be/Uiv9ySk9x8s",
  "https://www.youtube.com/watch?v=trJ-TXKnj_Y",
  "the sun is also a [NAME]",
  "What is the most likely reason that [NAME] gives the narrator a 'surreptitious wink' (line 71)? \na) to establish his voliptuous nature \nb) to argue that he is gay \nc) to state that a relationship will occur between Ms. [NAME] and the narrator \nd) to introduce the next word \nThe correct answer is D.",
  "[NAME] I'm coming for your water battle.",
  "i want [NAME] to shave my pubes off",
  "i ate 4 bags of [NAME] today",
]
const names = [
  "Adi",
  "Alexander Ingare",
  "Ange",
  "Angela",
  "Angewa",
  "Anthony",
  "Antonee",
  "BTS",
  "Ben",
  "Boris K",
  "Bryant",
  "Bryfart",
  "Byrnart",
  "CHEN XIAO SONG",
  "Certain Teacher's Beard",
  "Chenjamin Ben",
  "Chun Chun",
  "Chunnathan Liar",
  "Cuwee Cwee",
  "Daddy BoKo",
  "Daddy Chen.",
  "Daddy mitch",
  "Dadi Sawigwama",
  "Dadi",
  "Daniel",
  "Donald Trump",
  "Eggplant",
  "Emma",
  "Emmom",
  "Emmy",
  "Ender Dragon",
  "Franklin",
  "Hatsune Miku",
  "Jack",
  "Jimmy Neutron",
  "Jimmy",
  "John",
  "Ke Suo Ji Bo Shi",
  "Korsunsky B",
  "Krist Offer",
  "LIAN JIE KE",
  "LIAN XIAO CHUAN",
  "LIAN YI SHEN",
  "LOONA",
  "Lemon Tree",
  "Luigi",
  "MAO LAO SHI",
  "Mario",
  "Matthew",
  "Meow",
  "Miku",
  "Miles",
  "Moon LAO SHI",
  "Mr. Micheal Callaham",
  "Neil Fucking Malur",
  "Neil Krishna Malur",
  "Neil Malur",
  "Neil",
  "Obama Obama",
  "Orangela",
  "Pal",
  "Parker",
  "Pepsi",
  "SHEN AN QI",
  "Steve Gates",
  "Steve Jobs",
  "The English Department",
  "The History Department",
  "The Math Department",
  "The Science Department",
  "Vicky Chu",
  "Victoria Chu",
  "Victoria",
  "Vincense",
  "Vincent",
  "Vincest",
  "Vingts Cinq",
  "Vinshent",
  "WHS Administration",
  "Wes",
  "Willy",
  "Zander",
  "Zander's Forest",
  ]

var pool = []

function timeConverter(UNIX_timestamp) {
  var a = new Date(UNIX_timestamp);
  time = a.toLocaleString('en-US');
  return time;
}

function addReaction() {
  //vincent day celebration
  //if (Math.random() > 0.5) {
  //  return null;
  //}

  var ret = reactions[Math.floor(Math.random() * reactions.length)];
  while(ret.includes("[NAME]")) {
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
  }, 120000);
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
  message.react("💾");
  message.react("👍");
  //message.channel.send(new Discord.RichEmbed()
  //    .setColor('#88c0d0')
  //    .setTitle('Success')
  //    .setDescription('Confession saved!')
  //);
  
});

client.login(auth.token);
