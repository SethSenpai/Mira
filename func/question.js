//question or rng functions go here //8ball command giant switchcase
//8ball command giant switchcase	
	
exports.Eightball = function(message, mybot, funcFile){
	
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
		console.log(funcFile.getDateTime() + " 8ball with reply: ".cyan + ball + " Name: ".cyan + message.author.name);
	}
}