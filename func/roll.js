//rolling in the deep
//roll dice command

exports.roll = function (message, mybot, funcFile, mood) {
	
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
							mybot.reply(message,"``" + mood.getResponse("roll",rngres) + roll + ". Totalling: " + rolltotal + "``");
							console.log(funcFile.getDateTime() + " Rolled ".cyan + roll + ". For a total of ".cyan + rolltotal +"!".cyan);
						}
						else
						{
						var rngres = Math.floor((Math.random()*2));
						mybot.reply(message,"``" + mood.getResponse("roll",rngres) + roll + ". With modifier "+pmmod+mod+". Totalling: " + rolltotal + "``");
						//mybot.reply(message, "``I rolled " + roll + ". With modifier "+pmmod+mod+". For a total of " + rolltotal +"! ヾ(´▽｀;)ゝ``");
						console.log(funcFile.getDateTime() + " Rolled ".cyan + roll + ". With modifier ".cyan+pmmod+mod+". For a total of ".cyan + rolltotal +"!".cyan);
						}
						mood.addMood(0.5 , 0.5 , "roll")
					}
				
			}
			else
			{
				mybot.reply(message, "``There was an error in your !roll command, please try again. The syntax is !roll [x]d[y][+/-][mod] （’へ’）``");
			}
	}
}