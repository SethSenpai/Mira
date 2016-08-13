var Danbooru = require('danbooru');
const loginObj = require('./../data/login.json');
var authedBooru = new Danbooru({login: loginObj.login, api_key: loginObj.API});


//hentai command
exports.danPull = function(message, mybot, funcFile, whiteArrayId, blackArrayId)
{
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
}