// PEOPLE THAT GAVE ME MONEY SO I COULD BUILD A BETTER BOT
// Official Jonathan
// Ruiqi Mao, !pet


//REQUIRED PACKAGES
var Discord = require("discord.js");
var Danbooru = require('danbooru');
var readline = require('readline');
var jsonfile = require('jsonfile');
var consolecolors = require('consolecolors');
var funcFile = require('./remoteFunctions.js');

//JSON PATH STRINGS
var jsonCount = 'data/count.json';
var jsonWhite = 'data/hentaiWhitelist.json';
var jsonBlack = 'data/moeBlacklist.json';
var jsonResponse = 'data/response.json';
var jsonLogin = 'data/login.json';

//conts
const loginObj = require('./data/login.json');
const responseObj = require('./data/response.json');

//GLOBAL VARIABLES
var mybot = new Discord.Client();
var authedBooru = new Danbooru({login: loginObj.login, api_key: loginObj.API});
var rl = readline.createInterface(process.stdin, process.stdout);
var petnr = 0;
var whitelistObj;
var blacklistObj;
var blackArrayId = [];
var whiteArrayId = [];
var channelArray = [];
var serverArray = [];
var helpTextString = "I have several functions that you can use: \n " +
					 "[!8ball] ask me a question. \n "+
					 "[!pet] or [!pat] to pet me for being a good robot! \n "+
					 "[!roll xdy] to have me roll some dice, example: !roll 2d6 \n "+
					 "[!hentai tag] lets me post a random lewd picture if there is not tag specified, otherwise its a lewd picture with the tag specified. \n"+
					 "[!moe tag] works the same way as its lewder counterpart but less lewd. (generally sfw) \n"
					
var creatorID;
//mood variables, lower is more depressing normal should be around 80
var mLE = 80;
var mSH = 80;
var mdLE = 0;
var mdSH = 0;
var lastFunc = "empty"
var normTimer;
var normDeltaTimer;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//ON BOT LOAD/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
mybot.on("ready", function(){
	console.log(funcFile.getDateTime() + " I just woke up!" .green);
	mybot.setStatus("online","in Dimension W");
	loadJsonData();
	updateHelpText();
	normTimer = setInterval(normaliseMood,10000);
	normDeltaTimer = setInterval(normaliseDeltaMood, 50000)
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//BOT COMMANDLINE ACCESS//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
rl.setPrompt('>');

rl.on('line', function(line) {
	
	//command line talking
	if(line.indexOf("say ") >= 0 )
	{
		var command = line.split(" ");
		var channelid = channelArray[command[1]].id;
		var messagetext = "";
		for(i = 2; i < command.length; i++)
		{
		messagetext = messagetext.concat(command[i]);
		messagetext = messagetext.concat(" ");
		}
		mybot.sendMessage(channelid, messagetext);
	}
	
	//json reload command
	if(line.indexOf("reloadJson") >= 0 )
	{
		loadJsonData();	
	}
	
	//show mood command
	if(line.indexOf("showMood") >= 0 )
	{
		console.log("LE: ".cyan + mLE + " SH: ".cyan + mSH + " dLE: ".cyan + mdLE + " dSH: ".cyan + mdSH + " func: ".cyan + lastFunc);
	}
	
	//check timer status
	if(line.indexOf("checkTimer") >= 0 )
	{
		if(normTimer){
			console.log("Timer On".cyan);
		}
		else
		{
			console.log("Timer Off".cyan);
		}
	}
	
	//stop timer
	if(line.indexOf("stopTimer") >= 0)
	{
		clearInterval(normTimer);
		normTimer = false;
	}
	
	//mood add
	if(line.indexOf("addMood ") >= 0)
	{
		var command = line.split(" ");
		addMood(command[1],command[2],command[3]);
	}
	
	//command line broadcast
	if(line.indexOf("broadcast ") >= 0 )
	{
		var command = line.split(" ");
		var messagetext = "";
		for(i = 1; i < command.length; i++)
		{
		messagetext = messagetext.concat(command[i]);
		messagetext = messagetext.concat(" ");
		}
		for(i = 0; i < channelArray.length; i++)
		{
			mybot.sendMessage(channelArray[i].id, messagetext);
		}
	}
	
	//command line join server
	if(line.indexOf("join ") >= 0 )
	{
		var command = line.split(" ");
		mybot.joinServer(command[1], function(err,svr)
		{
			if(svr)
			{
				console.log(funcFile.getDateTime() + " joined server".green);
			}
			if(err)
			{
				console.log(funcFile.getDateTime() + " could not join server".red);
			}
		});
		
	}
	
	//command line leave server
	if(line.indexOf("leave ") >= 0)
	{
		var command = line.split(" ");
		var srId = serverArray[command[1]].id;
		mybot.leaveServer(srId, function(err,svr)
		{
			if(svr)
			{
				console.log(funcFile.getDateTime() + " left server".green);
			}
			if(err)
			{
				console.log(funcFile.getDateTime() + " error in leaving the server".red);
			}
			
		});
		
		
	}
	
	//get server list
	if(line.indexOf("srlist") >= 0 )
	{
		serverArray = [];
		for(i = 0; i < mybot.servers.length; i++)
		{
				var temp = new Object();
				temp["nr"] = i;
				temp["name"] = mybot.servers[i].name;
				temp["id"] = mybot.servers[i].id;
				serverArray.push(temp);
		}
		console.log(serverArray);
		
	}
	
	//show text chat access
	if(line.indexOf("chlist") >= 0 )
	{
		var command = line.split(" ");
		channelArray = [];
		var k = 0;
		for(i = 0; i < mybot.channels.length; i++)
		{
			if(mybot.channels[i].type == "text")
			{
				var temp = new Object();
				temp["nr"] = k;
				k++;
				temp["name"] = mybot.channels[i].name;
				temp["server"] = mybot.channels[i].server.name;
				temp["id"] = mybot.channels[i].id;
				channelArray.push(temp);
			}
		}
		
		if(command[1] == '-id'){
			var newList = [];
			k = 0;
			for(i = 0; i < mybot.channels.length; i++)
			{
				if(mybot.channels[i].type == "text")
				{
					var temp = new Object();
					temp["nr"] = k;
					k++;
					temp["name"] = mybot.channels[i].name;
					temp["server"] = mybot.channels[i].server.name;

					newList.push(temp);
				}
			}
			console.log(newList);
		}
		else if(command[1] == "-sr"){
			var newList = [];
			k = 0;
			for(i = 0; i < mybot.channels.length; i++)
			{
				if(mybot.channels[i].type == "text")
				{
					var temp = new Object();
					temp["nr"] = k;
					k++;
					temp["name"] = mybot.channels[i].name;
					temp["id"] = mybot.channels[i].id;

					newList.push(temp);
				}
			}
			console.log(newList);
		}
		else{
			console.log(channelArray);
		}
	}
	//blacklist command
	if(line.indexOf("blacklist ") >=0)
	{
		var command = line.split(" ");
		if(command[1] == "add")
		{
			var temp = new Object();
				temp["name"] = channelArray[command[2]].name;
				temp["id"] = channelArray[command[2]].id;
				blacklistObj.push(temp);
				var obj = {"blacklist":blacklistObj};
				jsonfile.writeFile(jsonBlack, obj, function(err){
					console.error(err);
				});
				
				loadJsonData();
		}
		if(command[1] == "remove")
		{
			blacklistObj.splice(command[2],1);
			var obj = {"blacklist":blacklistObj};
			jsonfile.writeFile(jsonBlack, obj, function(err){
				console.error(err);
			});
			
			loadJsonData();
			
		}
		
	}
	
	//whitelist command
	if(line.indexOf("whitelist ") >= 0)
	{
		var command = line.split(" ");
		if(command[1]=="add")
		{
			var temp = new Object();
				temp["name"] = channelArray[command[2]].name;
				temp["id"] = channelArray[command[2]].id;
				whitelistObj.push(temp);
				var obj = {"whitelist":whitelistObj};		
				jsonfile.writeFile(jsonWhite, obj, function (err) {
				console.error(err); 
				});
				
				loadJsonData();
		}
		if(command[1]=="remove")
		{
			whitelistObj.splice(command[2],1);
			var obj = {"whitelist":whitelistObj};		
				jsonfile.writeFile(jsonWhite, obj, function (err) {
				console.error(err); 
				});
				
				loadJsonData();
		}
		
	}

	 
	  //rl.setPrompt(prefix, prefix.length);
	  //rl.prompt();
}).on('close', function() {
  console.log('Goodbye (≧д≦ヾ)');
  process.exit(0);
});
//rl.setPrompt(prefix, prefix.length);
//rl.prompt();

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//CHECK FOR DISCONNECT////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
mybot.on("disconnected", function(){
	console.log(funcFile.getDateTime() + " Bot disconnected".red);
	mybot.login(loginObj.email, loginObj.password);
	channelArray = [];
	console.log(funcFile.getDateTime() + " Attempting login: ".yellow);
	helpTextString = "I have several functions that you can use: \n " +
					 "[!8ball] ask me a question. \n "+
					 "[!pet] or [!pat] to pet me for being a good robot! \n "+
					 "[!roll xdy] to have me roll some dice, example: !roll 2d6 \n "+
					 "[!hentai tag] lets me post a random lewd picture if there is not tag specified, otherwise its a lewd picture with the tag specified. \n"+
					 "[!moe tag] works the same way as its lewder counterpart but less lewd. (generally sfw) \n"
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//CHECK MESSAGES FOR COMMANDS/////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
mybot.on("message", function(message){
//ping command	
	if(message.content === "pin")
	{
		mybot.sendMessage(message, "``pon ( ´ ▽ ` )ﾉ``");
		console.log(funcFile.getDateTime() + " pinged in: ".cyan + message.channel.name + " Name: ".cyan + message.author.name);
		//mybot.sendMessage("140488117005058048", "extra line")
	}

//fundraiser
	if(message.content == "!fundraiser")
	{
		mybot.sendMessage(message, "https://sethsenpai.github.io/fundRaiser/");
		console.log(funcFile.getDateTime() + " Fundraiser Name: ".cyan + message.author.name);
	}	
	
//hilko
	if(message.content == "!hilko")
	{
		mybot.sendMessage(message, "http://static4.koken.vtm.be/sites/koken.vtm.be/files/styles/vmmaplayer_big/public/recipe/image/kaasfondue_2.jpg?itok=Fz-TX-HM");
		console.log(funcFile.getDateTime() + " Where is hilko? Name: ".cyan + message.author.name);
	}
	
//erik
	if(message.content == "!erik")
	{
		mybot.sendMessage(message, "http://i.imgur.com/Zx62WLL.png");
		console.log(funcFile.getDateTime() + " Where is erik? Name: ".cyan + message.author.name);
	}
	
//garlic
	if(message.content == "!garlic" || message.content == "!Garlic")
	{
		mybot.sendMessage(message, "http://i.imgur.com/Gz6nUbn.jpg");
		console.log(funcFile.getDateTime() + " Garlic Bread memes? Name: ".cyan + message.author.name);
	}

//8ball command giant switchcase	
	if(message.content.indexOf(" !8ball") >= 0 || message.content.indexOf(" !8ball ") >= 0 || message.content.indexOf("!8ball ") >= 0)
	{
		var ball = Math.floor((Math.random() * 20) + 1);
		
		switch(ball){
			
			case 1:
				mybot.reply(message, "It is certain");
			break;
			
			case 2:
				mybot.reply(message, "It is decidedly so");
			break;
			
			case 3:
				mybot.reply(message, "Without a doubt");
			break;
			
			case 4:
				mybot.reply(message, "Yes, definitely");
			break;
			
			case 5:
				mybot.reply(message, "You may rely on it");
			break;
			
			case 6:
				mybot.reply(message, "As I see it, yes");
			break;
			
			case 7:
				mybot.reply(message, "Most likely");
			break;
			
			case 8:
				mybot.reply(message, "Outlook good");
			break;
			
			case 9:
				mybot.reply(message, "Yes");
			break;
			
			case 10:
				mybot.reply(message, "Signs point to yes");
			break;
			
			case 11:
				mybot.reply(message, "Reply hazy try again");
			break;
			
			case 12:
				mybot.reply(message, "Ask again later");
			break;
			
			case 13:
				mybot.reply(message, "Better not tell you now");
			break;
			
			case 14:
				mybot.reply(message, "Cannot predict now");
			break;
			
			case 15:
				mybot.reply(message, "Concentrate and ask again");
			break;
			
			case 16:
				mybot.reply(message, "Don't count on it");
			break;
			
			case 17:
				mybot.reply(message, "My reply is no");
			break;
			
			case 18:
				mybot.reply(message, "My sources say no");
			break;
			
			case 19:
				mybot.reply(message, "Outlook not so good");
			break;
			
			case 20:
				mybot.reply(message, "Very doubtful");
			break;

			default :
				mybot.reply(message, "Vraag het niet aan mij, ik ben met pensioen.");
			break;
			
		}
		console.log(funcFile.getDateTime() + " 8ball with reply: ".cyan + ball + "Name: ".cyan + message.author.name);
	}

//pet command
	if(message.content === "!pet" || message.content === "!pat")
	{
		petnr ++;
		if(petnr == 1){mybot.sendMessage(message, "``KYAAA, I have been patted " + petnr + " time o(≧∇≦o)``");}
		else{
			if(Math.floor((Math.random() * 100)) > 50){
			mybot.sendMessage(message, "``" + getResponse('pet',0) + petnr + " times``");
			}
			else{
			mybot.sendMessage(message, "``" + getResponse('pet',1) + petnr + "th time``");	
			}
			
			addMood(1,2,'pet');
			}
		
		var rndnr = Math.floor((Math.random() * 100) + 1);
		if(rndnr == 42 || rndnr == 73){mybot.sendMessage(message,"http://i.imgur.com/4XYDGi0.gif")}
		if(rndnr == 22 || rndnr == 87){mybot.sendMessage(message,"http://i.imgur.com/rVxx789.gif")}
		
		console.log(funcFile.getDateTime() + " petted ".cyan + petnr +"x with rng nr: ".cyan + rndnr + " Name: ".cyan + message.author.name);
		
		var obj = {"petCounter":petnr};
		
		jsonfile.writeFile(jsonCount, obj, function (err) {
		//console.error(err); 
		})
	}
	
//pout
	//get daryll to give you images
	
//xd corrector
	/*if(message.content.indexOf(" xd ") >= 0 || message.content.indexOf(" xd") >= message.content.length - 3 || message.content.indexOf("xd ") >= 0 )
	{
		mybot.sendMessage(message, "xdHead");
		console.log(funcFile.getDateTime() + " xd corrected");
	}*/
	
//roll dice command
	if(message.content.indexOf("!roll ") >= 0 && message.content.indexOf("!roll ") <= 0)
	{			
			console.log(funcFile.getDateTime() + " dice requested".cyan + " Name: ".cyan + message.author.name);
			var diecontainer = message.content.substring(6);
			var dienumbers = diecontainer.split("d");
			if (dienumbers.length > 1 && isNaN(parseInt(dienumbers[0])) == false)
			{
				var amount = Math.abs(parseInt(dienumbers[0])) || 1;
				var dienmod = [];
				var pmmod;
				var die;
				var mod;
				//console.log(dienumbers);
				//console.log(amount);
				if(dienumbers[1].indexOf("+") >= 0)
					{
						dienmod = dienumbers[1].split("+");
						pmmod = "+";
						die = parseInt(dienmod[0]);
						mod = parseInt(dienmod[1]);
					}
				else if(dienumbers[1].indexOf("-") >= 0)
					{
						dienmod = dienumbers[1].split("-");
						pmmod = "-";
						die = parseInt(dienmod[0]);
						mod = parseInt(dienmod[1]);
					}
				else
					{
						pmmod = " ";
						diemod = dienumbers[1];
						die = parseInt(diemod);
					}
					
					
					
				if(amount > 100)
					{
						mybot.reply(message, "``I don't have that many dice ల(｀°Δ°)``");
						console.log(funcFile.getDateTime() + " Error too many dice".cyan);
					}
				else if(isNaN(die) == true)
 					{
						mybot.reply(message, "``There was an error in your !roll command, please try again. The syntax is !roll [x]d[y][+/-][mod] （’へ’）``");
						console.log(funcFile.getDateTime() + " Error no dice specified".cyan);
					}
				else if(isNaN(mod) == true && pmmod !== " ")
 					{
						mybot.reply(message, "``There was an error in your !roll command, please try again. The syntax is !roll [x]d[y][+/-][mod] （’へ’）``");
						console.log(funcFile.getDateTime() + " Error no mod specified but +/- was triggered".cyan);
					}
					else
					{
					var roll = [];
					for(i = 0; i < amount; i++ ){
							roll.push(Math.floor((Math.random() * die) + 1));
						}
						function getSum(total, num) {
						return total + num;
						}
						var rolltotal = roll.reduce(getSum);
						if (pmmod === "+"){rolltotal = rolltotal + mod;}
						if (pmmod === "-"){rolltotal = rolltotal - mod;}
						if (pmmod === " ")
						{
							rolltotal = rolltotal;
							var rngres = Math.floor((Math.random()*2));
							mybot.reply(message,"``" + getResponse("roll",rngres) + roll + ". Totalling: " + rolltotal + "``");
							console.log(funcFile.getDateTime() + " Rolled ".cyan + roll + ". For a total of ".cyan + rolltotal +"!".cyan);
						}
						else
						{
						var rngres = Math.floor((Math.random()*2));
						mybot.reply(message,"``" + getResponse("roll",rngres) + roll + ". With modifier "+pmmod+mod+". Totalling: " + rolltotal + "``");
						//mybot.reply(message, "``I rolled " + roll + ". With modifier "+pmmod+mod+". For a total of " + rolltotal +"! ヾ(´▽｀;)ゝ``");
						console.log(funcFile.getDateTime() + " Rolled ".cyan + roll + ". With modifier ".cyan+pmmod+mod+". For a total of ".cyan + rolltotal +"!".cyan);
						}
						addMood(0.5 , 0.5 , "roll")
					}
				
			}
			else
			{
				mybot.reply(message, "``There was an error in your !roll command, please try again. The syntax is !roll [x]d[y][+/-][mod] （’へ’）``");
			}
	}

//hentai command

	if(message.content.indexOf("!hentai ") >= 0 && message.content.indexOf("!hentai ") <= 0)
	{
		//whitelist check
		if(whiteArrayId.indexOf(message.channel.id) > -1 || message.author == message.channel.recipient)
		{
		
			console.log(funcFile.getDateTime() + " Hentai requested ".cyan + "Name: ".cyan + message.author.name);
			mybot.sendMessage(message, "``Looking for your fetish ヾ(｡･ω･)ｼ``", function(errm, msg)
			{
				var tags = message.content.substring(8);
				console.log(funcFile.getDateTime() + " Tag: ".cyan + tags);
				if(tags == "Reese" || tags == "reese"){mybot.updateMessage(msg, "``Wow thats lewd! (灬♥ω♥灬)`` http://i.imgur.com/mHQePkd.jpg"); }
				else
				{
					authedBooru.search('rating:explicit ' + tags,{limit: 500}, function(err, data) 
					{
						if(err)
						{
							console.log(funcFile.getDateTime() + " Caught error in tags.".cyan);
							mybot.updateMessage(msg, "``Something went wrong! Did you use at maximum 5 tags and no newlines? (≧д≦ヾ)``")
						}
						else
						{
							
							var post = data.random();
							if(post == undefined)
							{
								console.log(funcFile.getDateTime() + " Tag not found".cyan);
								mybot.updateMessage(msg, "``Could not find your fetish. (´•ω•̥`)``");
							}
							else
							{
								console.log(funcFile.getDateTime() + " url: ".cyan + post.file_url);
								if(post.file_url == undefined)
								{
									console.log("unuseable post reshuffling....".cyan);
									post = data.random();
									console.log(funcFile.getDateTime() + " url: ".cyan + post.file_url);
									//mybot.sendMessage(message, "http://danbooru.donmai.us"+post.file_url);
									mybot.updateMessage(msg, "``I found something, pervert (;¬_¬)`` http://danbooru.donmai.us"+post.file_url);
								}
								else
								{
									//mybot.sendMessage(message, "http://danbooru.donmai.us"+post.file_url);
									mybot.updateMessage(msg, "``I found something, pervert (;¬_¬)`` http://danbooru.donmai.us"+post.file_url);
								}
							}
						}
					});
				}
			});
		}
		else
		{
			mybot.sendMessage(message, "``Someone disabled that command in this chat-channel. (´•ω•̥`)``");
		}
		
	}
	
	if(message.content === "!hentai")
	{
		//whitelist check
		if(whiteArrayId.indexOf(message.channel.id) > -1 || message.author == message.channel.recipient)
		{
			mybot.sendMessage(message, "``Looking for something lewd ヾ(｡･ω･)ｼ``", function(errm, msg)
			{
				console.log(funcFile.getDateTime() + " Hentai requested ".cyan + "Name: ".cyan + message.author.name);
				authedBooru.search('rating:explicit',{limit: 5000}, function(err, data) 
				{
					if(err) throw err;
					var post = data.random();
					console.log(funcFile.getDateTime() + " url: ".cyan + post.file_url);
					if(post.file_url == undefined)
					{
						console.log("unuseable post reshuffling....");
						post = data.random();
						console.log(funcFile.getDateTime() + " url: ".cyan + post.file_url);
						mybot.updateMessage(msg, "``I found something lewd ヾ(´▽｀;)ゝ`` http://danbooru.donmai.us"+post.file_url);
					}
					else
					{
						mybot.updateMessage(msg, "``I found something lewd ヾ(´▽｀;)ゝ`` http://danbooru.donmai.us"+post.file_url);
					}
				});
			});
		}
		else
		{
			mybot.sendMessage(message, "``Someone disabled that command in this chat-channel. (´•ω•̥`)``");
		}
		
	}
	
//moe command

	if(message.content.indexOf("!moe ") >= 0 && message.content.indexOf("!moe ") <= 0)
	{
		//blacklist
		if(blackArrayId.indexOf(message.channel.id) < 0)
		{
			mybot.sendMessage(message, "``Looking for that cute thing that you told me ヾ(｡･ω･)ｼ``", function(errm, msg)
			{
				console.log(funcFile.getDateTime() + " Moe requested ".cyan + "Name: ".cyan + message.author.name);
				var tags = message.content.substring(4);
				console.log(funcFile.getDateTime() + " Tag: ".cyan + tags);
				if(tags == " seth" || tags == " Seth"){mybot.updateMessage(msg,"``Look at this cutie ヾ(´▽｀;)ゝ`` http://i.imgur.com/kQcKFuh.jpg");}
				else if(tags == " frankie" || tags == " Frankie"){mybot.updateMessage(msg,"``Look at this cutie ヾ(´▽｀;)ゝ`` http://i.imgur.com/GG9AwbQ.jpg");}
				else if(tags == " sass" || tags == " Sass"){mybot.updateMessage(msg,"``Look at this cutie ヾ(´▽｀;)ゝ`` https://i.imgur.com/BWYYUUj.png");}
				else if(tags == " jonathan" || tags == " Jonathan"){mybot.updateMessage(msg,"``Look at this cutie ヾ(´▽｀;)ゝ`` http://i.imgur.com/hTJSTta.jpg");}
				else if(tags == " ruiqi" || tags == " Ruiqi"){mybot.updateMessage(msg,"``Look at this cutie ヾ(´▽｀;)ゝ`` http://i.imgur.com/12PS5Lw.png");}
				else
				{
					authedBooru.search('rating:safe ' + tags,{limit: 500}, function(err, data) 
					{
						if(err)
						{
							console.log(funcFile.getDateTime() + " Caught error in tags.".cyan);
							mybot.updateMessage(msg, "``Something went wrong! Did you use at maximum 5 tags and no newlines? (≧д≦ヾ)``");
						}
						else
						{
							var post = data.random();
							if(post == undefined)
							{
								console.log(funcFile.getDateTime() + " Tag not found".cyan);
								mybot.updateMessage(msg, "``I could not find something cute with the tags:" + tags + " (´•ω•̥`)``");
							}
							else
							{
								console.log(funcFile.getDateTime() + " url: ".cyan + post.file_url);
								if(post.file_url == undefined)
								{
									console.log("unuseable post reshuffling....".cyan);
									post = data.random();
									console.log(funcFile.getDateTime() + " url: ".cyan + post.file_url);
									mybot.updateMessage(msg, "``I found your cute thing ヾ(´▽｀;)ゝ`` http://danbooru.donmai.us"+post.file_url);
								}
								else
								{
									mybot.updateMessage(msg, "``I found your cute thing ヾ(´▽｀;)ゝ`` http://danbooru.donmai.us"+post.file_url);
								}
							}
						}
					});
				}
			});
		}
		else
		{
			mybot.sendMessage(message, "``Someone disabled that command in this chat-channel. (´•ω•̥`)``");
		}
		
	}
	
	if(message.content === "!moe")
	{
		//blacklist
		if(blackArrayId.indexOf(message.channel.id) < 0)
		{
			mybot.sendMessage(message, "``Looking for something cute ヾ(｡･ω･)ｼ``", function(errm, msg)
			{
				console.log(funcFile.getDateTime() + " Moe requested ".cyan + "Name: ".cyan + message.author.name);
				authedBooru.search('rating:safe -comic',{limit: 5000}, function(err, data) 
				{
					if(err) throw err;
					var post = data.random();
					console.log(funcFile.getDateTime() + " url: ".cyan + post.file_url);
					if(post.file_url == undefined)
					{
						console.log("unuseable post reshuffling....".cyan);
						post = data.random();
						console.log(funcFile.getDateTime() + " url: ".cyan + post.file_url);
						mybot.updateMessage(msg, "``I found something cute! ヾ(´▽｀;)ゝ`` http://danbooru.donmai.us"+post.file_url);
					}
					else
					{
						mybot.updateMessage(msg, "``I found something cute! ヾ(´▽｀;)ゝ`` http://danbooru.donmai.us"+post.file_url);
					}
				});
			});
		}
		else
		{
			mybot.sendMessage(message, "``Someone disabled that command in this chat-channel. (´•ω•̥`)``");
		}	
		
	}
	
//??? neger command
	if(message.content === "???")
	{
		mybot.sendMessage(message, "http://i.imgur.com/zIEfIed.jpg")
		console.log(funcFile.getDateTime() + " Black guys questioned ".cyan + "Name: ".cyan + message.author.name);
	}

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
	
// test segemented command
	if(message.content === "!srt" && message.author == creatorID)
	{
		getResponse("roll", 2);
		
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
	helpTextString = helpTextString + "I was made by "+creatorID.mention()+", send him a message if you have further questions about me!";
	});
	
}

function getResponse(func,depth) {
	//object to store the strings with corresponding numbers
	var refObj = {
					'excited' : 0,
					'slow' : 1,
					'happy' : 2,
					'sad' : 3
		
					}
	
	//exclamation variables needed
	var exRn = 3;
	var exRnS = "sad";
	var Rn = depth;
	
	//emote variables needed
	var emRn = 1;
	var emRnS = "slow";
	
	//define command index
	var funcnr = null;
	switch(func){
		case "roll":
			funcnr = 0;
		break;
		
		case "moe":
			funcnr = 1;
		break;
		
		case "hentai":
			funcnr = 2;
		break;	
		
		case "pet":
			funcnr = 3;
		break;	
	}
	
	//function variables needed
	var fnRn = 1;
	var fnRnS = "slow";
	
	//calculate mood numbers
	var rng = Math.floor((Math.random() * 100));
	var sLE;
	var sSH;
	//determine if slow of excited
	if(rng > mLE){
		sLE = "slow";
		//console.log("slow");
	}
	else{
		sLE = "excited";
		//console.log("excited");
	}
	//determine if happy or sad
	rng = Math.floor((Math.random() * 100));
	if(rng > mSH){
		sSH = "sad";
		//console.log("sad");
	}
	else{
		sSH = "happy";
		//console.log("happy");
	}
	//determine for each part of the sentence what emotion to use
	//starting with the exclamation
	rng = Math.floor((Math.random() * 100));
	if(rng < 50){
		exRnS = sLE;
	}
	else{
		exRnS = sSH;
	}
	exRn = refObj[exRnS];
	console.log("excl: " + exRnS);
	//actual sentence
	rng = Math.floor((Math.random() * 100));
	if(rng < 50){
		fnRnS = sLE;
	}
	else{
		fnRnS = sSH;
	}
	fnRn = refObj[fnRnS];
	console.log("sent: " + fnRnS);
	//emote
	rng = Math.floor((Math.random() * 100));
	if(rng < 50){
		emRnS = sLE;
	}
	else{
		emRnS = sSH;
	}
	emRn = refObj[emRnS];	
	console.log("emote: " + emRnS);
	
	
	var totalString = responseObj['response'][2]['emote'][emRn][emRnS][Rn].string + " " + responseObj['response'][0]['excl'][exRn][exRnS][Rn].string;
	totalString = totalString + responseObj['response'][1]['sent'][funcnr][func][fnRn][fnRnS][Rn].string;
	//console.log(totalString);
	return totalString;
}

function addMood(weightLE,weightSH,funcString){
	
	//check if delta should be shifted
	if (funcString == lastFunc){
	mdLE = mdLE + parseFloat(weightLE);
	mdSH = mdSH + parseFloat(weightSH);
	}
	else{
		lastFunc = funcString;
		mdLE = 0;
		mdSH = 0;
		if(mLE < 50){mLE = 50;}
		if(mSH < 50){mSH = 50;}
	}
	
	//formula to add to the mood numbers
	var sCLE = -1*(Math.pow(Math.E,(mdLE-10)))+1.1;
	var sCSH = -1*(Math.pow(Math.E,(mdSH-10)))+1.1;

	mLE = mLE + sCLE;
	mSH = mSH + sCSH;
	
	//keep numbers in bounds
	if(mLE > 100){mLE = 100;}
	if(mLE < 0){mLE = 0;}
	if(mSH > 100){mSH = 100;}
	if(mSH < 0){mSH = 0;}
	
}

function normaliseMood(){
	if(mLE < 79){
		mLE++;
	}
	if(mLE > 81){
		mLE--;
	}
	
	if(mSH < 79){
		mSH++;
	}
	if(mSH > 81){
		mSH--;
	}
	//console.log("normalising mood " + mLE +" "+ mSH);
}

function normaliseDeltaMood(){
		
	if(mdLE < 0){
		mdLE = 0;
	}
	if(mdLE > 0){
		mdLE--;
	}
	
	if(mdSH < 0){
		mdSH = 0;
	}
	if(mdSH > 0){
		mdSH--;
	}
	//console.log("normalising delta mood " + mdLE +" "+ mdSH);
}
