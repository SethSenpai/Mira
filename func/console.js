//console side commands
var funcFile = require('./remoteFunctions.js');

//channel and server arrays used in join, leave, chlist, say and broadcast
var channelArray = [];
var serverArray = [];

//jsonfile required for easy async read write to json files
var jsonfile = require('jsonfile');

//file location for whitelist and blacklist
var jsonWhite = 'data/hentaiWhitelist.json';
var jsonBlack = 'data/moeBlacklist.json';

exports.readConsole = function(line, mybot, mood, blacklistObj, whitelistObj){
	
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
		mood.showMood();
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
				return true;
		}
		if(command[1] == "remove")
		{
			blacklistObj.splice(command[2],1);
			var obj = {"blacklist":blacklistObj};
			jsonfile.writeFile(jsonBlack, obj, function(err){
				console.error(err);
			});
			
			loadJsonData();
			return true;
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
				return true;
		}
		if(command[1]=="remove")
		{
			whitelistObj.splice(command[2],1);
			var obj = {"whitelist":whitelistObj};		
				jsonfile.writeFile(jsonWhite, obj, function (err) {
				console.error(err); 
				});
				
				loadJsonData();
				return true;
		}
		
	}
}

function loadJsonData() {
	
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