//memes go here
exports.justMemes = function(message, mybot , funcFile){
	//ping command	
	if(message.content === "pin")
	{
		mybot.sendMessage(message, "``pon ( ´ ▽ ` )ﾉ``");
		console.log(funcFile.getDateTime() + " pinged in: ".cyan + message.channel.name + " Name: ".cyan + message.author.name);
		//mybot.sendMessage("140488117005058048", "extra line")
	}
	
//zeal
	if(message.content == "!zeal")
	{
		mybot.sendMessage(message, "``No, Zeal is not a chef. He just eats out a lot. (that rich bastard) On a serious note, just no time to go home and cook.``");
		console.log(funcFile.getDateTime() + " zeal questioned. Name: ".cyan + message.author.name);
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
	
//??? neger command
	if(message.content === "???")
	{
		mybot.sendMessage(message, "http://i.imgur.com/zIEfIed.jpg")
		console.log(funcFile.getDateTime() + " Black guys questioned ".cyan + "Name: ".cyan + message.author.name);
	}
	
}