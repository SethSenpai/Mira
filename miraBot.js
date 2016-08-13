// PEOPLE THAT GAVE ME MONEY SO I COULD BUILD A BETTER BOT
// Official Jonathan
// Ruiqi Mao, !pet


//REQUIRED PACKAGES
var Discord = require("discord.js");
var readline = require('readline');
var jsonfile = require('jsonfile');
var consolecolors = require('consolecolors');

//FUNCTION FILES
var funcFile = require('./func/remoteFunctions.js');
var dan = require('./func/dan.js');
var meme = require('./func/memes.js');
var roll = require('./func/roll.js');
var mood = require('./func/mood.js');
var pet = require('./func/pet.js');
var quest = require('./func/question.js');
var consl = require('./func/console.js');

//JSON PATH STRINGS
var jsonCount = 'data/count.json';
var jsonWhite = 'data/hentaiWhitelist.json';
var jsonBlack = 'data/moeBlacklist.json';
var jsonResponse = 'data/response.json';
var jsonLogin = 'data/login.json';

//conts
const loginObj = require('./data/login.json');

//GLOBAL VARIABLES
var mybot = new Discord.Client();
var rl = readline.createInterface(process.stdin, process.stdout);
var whitelistObj;
var blacklistObj;
var blackArrayId = [];
var whiteArrayId = [];
var helpTextString;
var creatorID;


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//ON BOT LOAD/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
mybot.on("ready", function(){
	console.log(funcFile.getDateTime() + " I just woke up!" .green);
	mybot.setStatus("online","in Dimension W");
	loadJsonData();
	updateHelpText();
	mood.startTimers();
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//BOT COMMANDLINE ACCESS//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
rl.setPrompt('>');

rl.on('line', function(line) {
	
	//hackaround so the bot reloads its whitelist and blacklist arrays
	var reload = consl.readConsole(line, mybot, funcFile, mood, blacklistObj, whitelistObj);
	if(reload == true){
		loadJsonData();
		reload = false;
	}
	 
}).on('close', function() {
  console.log('Goodbye (≧д≦ヾ)');
  process.exit(0);
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//CHECK FOR DISCONNECT////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
mybot.on("disconnected", function(){
	console.log(funcFile.getDateTime() + " Bot disconnected".red);
	mybot.login(loginObj.email, loginObj.password);
	console.log(funcFile.getDateTime() + " Attempting login: ".yellow);
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//CHECK MESSAGES FOR COMMANDS/////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
mybot.on("message", function(message){
	
	dan.danPull(message, mybot, funcFile, whiteArrayId, blackArrayId);
	
	meme.justMemes(message, mybot , funcFile);
	
	roll.roll(message, mybot, funcFile, mood);
	
	pet.pet(message, mybot, funcFile, jsonCount, jsonfile, mood);

	quest.Eightball(message, mybot, funcFile);
	
// help command
	if(message.content === "!help")
	{
		mybot.reply(message, helpTextString);
		console.log(funcFile.getDateTime() + " Help requested ".cyan + "Name: ".cyan + message.author.name);
	}

// test crash
	if(message.content === "!emp" && message.author == creatorID)
	{
		console.log(funcFile.getDateTime() + " Crashing now!".red);
		var we = poopyfaceArray[999];
	}
	
});


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//OTHER FUNCTIONS/////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


mybot.login(loginObj.email, loginObj.password);

function loadJsonData() {
	
	//read persistent variables
	//pet count json
	jsonfile.readFile(jsonCount, function(err, obj){
		//console.dir(obj);
		if(err){console.log("error: " + err)}
		petnr = obj.petCounter;
		//console.log(petnr);
	});
	
	//whitelist json
	jsonfile.readFile(jsonWhite, function(err, obj){
		//console.dir(obj);
		if(err){console.log("error: " + err)}
		whitelistObj = obj.whitelist;
		whiteArrayId = [];
		for(i = 0; i < obj.whitelist.length; i++)
		{
				var temp = obj.whitelist[i].id;
				whiteArrayId.push(temp);
		}		
		//console.log(whiteArrayId);
	});
	
	//blacklist json
	jsonfile.readFile(jsonBlack, function(err , obj){
		if(err){console.log("error: " + err)}
		blacklistObj = obj.blacklist;
		blackArrayId = [];
		for(i=0; i < obj.blacklist.length; i++)
		{
			var temp = obj.blacklist[i].id;
			blackArrayId.push(temp);
		}
	});
	
	console.log(funcFile.getDateTime() + " loaded json data".green);
	
}

function updateHelpText() {
	
	mybot.sendMessage("189453553444585472", funcFile.getDateTime() + " I woke up!", function(err,msg){
	creatorID = msg.channel.recipient;
	helpTextString = "I have several functions that you can use: \n " +
					 "[!8ball] ask me a question. \n "+
					 "[!pet] or [!pat] to pet me for being a good robot! \n "+
					 "[!roll xdy] to have me roll some dice, example: !roll 2d6 \n "+
					 "[!hentai tag] lets me post a random lewd picture if there is not tag specified, otherwise its a lewd picture with the tag specified. \n"+
					 "[!moe tag] works the same way as its lewder counterpart but less lewd. (generally sfw) \n"+
					 "There are also some private memes hidden in my programming, maybe you will find them, maybe not. \n"+
					 "I was made by "+creatorID.mention()+", send him a message if you have further questions about me!";
	});
	
}


