// mood functions
// mood variables, lower is more depressing normal should be around 80
var mLE = 95;
var mSH = 95;
var mdLE = 0;
var mdSH = 0;
var lastFunc = "empty"
var normTimer;
var normDeltaTimer;

const responseObj = require('./../data/response.json');


exports.startTimers = function () {
	normTimer = setInterval(normaliseMood,10000);
	normDeltaTimer = setInterval(normaliseDeltaMood, 50000)
}

exports.showMood = function(){
	console.log("LE: ".cyan + mLE + " SH: ".cyan + mSH + " dLE: ".cyan + mdLE + " dSH: ".cyan + mdSH + " func: ".cyan + lastFunc);
}

exports.getResponse = function(func,depth) {
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

exports.addMood = function(weightLE,weightSH,funcString){
	
	//check if delta should be shifted
	if (funcString == lastFunc){
	mdLE = mdLE + parseFloat(weightLE);
	mdSH = mdSH + parseFloat(weightSH);
	}
	else{
		lastFunc = funcString;
		mdLE = 0;
		mdSH = 0;
		if(mLE < 70){mLE = 70;}
		if(mSH < 70){mSH = 70;}
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
	if(mLE < 94){
		mLE++;
	}
	if(mLE > 96){
		mLE--;
	}
	
	if(mSH < 94){
		mSH++;
	}
	if(mSH > 96){
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

