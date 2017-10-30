// Load up the discord.js library. Else throw an error.
try {
	var Discord = require("discord.js");
} catch (e){
	console.log(e.stack);
	console.log(process.version);
	console.log("Please run 'npm install' and ensure it passes with no errors!");
	process.exit();
}
// Log what node version the bot is using and what discord.js verion its using.
console.log("Starting Pal...\nNode version: " + process.version + "\nDiscord.js version: " + Discord.version);

// Defining the Discord Client as "client".
const client = new Discord.Client();

// Make sure the bot is using Secure HTTP.
const http = require('https');

let fs = require('fs') // file manager


// Here we load the config.json file that contains our token and our prefix values.
const config = require("./config.json");

// Loading "Missigno" hook for #console in pal-bot discord.
const hook = new Discord.WebhookClient(config.hook_id, config.hook_token);

// Loading "Venter" hook used for +vent.
const vent = new Discord.WebhookClient(config.vent_id, config.vent_token);

// API.AI's Cleverbot
const dialogflow = require('apiai');
const dialogflowApp = dialogflow(config.cbotapi);

const got = require("got");

PNG = require('pngjs').PNG;
var Jimp = require("jimp");


// Here we define maintenance. (0 = off | 1 = on)
const maintenance = 0;

const users = client.users.size;

// Random games
const games = ['with Dr. Freeman', 'Half Life 3', config.prefix + 'help', 'please send ' + config.prefix + 'help', 'with a baguette', 'with you ;)', 'with [slem], he is cool', 'with some code','with like 2 people idfk man','i am not funny','🤔 🔫  '];
setInterval(function(){
	const rangame = games[Math.floor(Math.random() * games.length)];
	client.user.setGame(rangame);
}, 60000);


// The events under here will run if the bot starts, and logs in, successfully.
client.on("ready", () => {
	console.log("-------------");
	console.log("Logged in!");
	hook.send("Logged in!");
	hook.send("Starting Pal-Bot:\nNode version: " + process.version + "\nDiscord.js version: " + Discord.version);
	console.log("-------------");
	console.log(`Ready to serve in ${client.channels.size} channels on ${client.guilds.size} servers, for a total of ${client.users.size} users.`);
	hook.send(`Ready to serve in ${client.channels.size} channels on ${client.guilds.size} servers, for a total of ${client.users.size} users.`);
	console.log("-------------");
	// The events under here will run if the bot starts, logs in successfully and maintenance is set to "ON".
	if (maintenance === 1) {
		// Setting bot's game and status.
		client.user.setGame(`Under maintenance.`);
		client.user.setStatus("idle");
		// Logging changes.
		console.log("Maintenance set to 'ON'. This means the status has been set to idle and presence set to 'Under maintenance'.");
	  hook.send("Maintenance set to 'ON'. This means the status has been set to idle and presence set to 'Under maintenance'.");
	  console.log("-------------");
	}else {
		// Setting bot's game and status.
		setTimeout(function(){
		    const rangame = games[Math.floor(Math.random() * games.length)];
		    client.user.setGame(rangame);
		}, 60000)
		client.user.setStatus("online");
		// Logging changes.
		console.log("Bot's status and game set.");
		hook.send(`Bot's status and game set.`);
		console.log("-------------");
}
});

// This will run only if the bot has dissconnected, for whatever reason.
client.on("disconnected", function () {
	// Logging changes.
	console.error("Disconnected!");
	hook.send("Disconnected!");
  	// This should exit node.js with an error.
	process.exit(1);
});

// This event triggers only when the bot joins a guild.
client.on("guildCreate", guild => {
	// Logging changes.
  	console.log(`New server joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
	hook.send(`New server joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
});

// This event triggers only when the bot is removed from a guild.
client.on("guildDelete", guild => {
	// Logging changes.
  	console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
	hook.send(`I have been removed from: ${guild.name} (id: ${guild.id})`);
});


// This event will run on every single message received, from any channel or DM.
client.on("message", async(message) => {
	// Ignore other bots. This also makes your bot ignore itself and not get into a "botception".
	if(message.author.bot) return;

	// Here we separate our "command" name, and our "arguments" for the command.
	// e.g. if we have the message "+say Is this the real life?" , we'll get the following:
	// command = say
	// args = ["Is", "this", "the", "real", "life?"]
	let args = message.content.slice(config.prefix.length).trim().split(/ +/g);

	let content = message.content.toLowerCase();

	// Message used for api.ai, this removes the bots id to make the bot work better.
	const messagea = message.content.replace(/<@300955174225051650>/g,'');

	// Make recived command all lower case.
	const command = args.shift().toLowerCase();

	if(message.isMentioned(client.user)){
		var request = dialogflowApp.textRequest(messagea, {
			sessionId: '<unique session id>'
		});

		request.on('response', function(response) {
			message.channel.send(response.result.fulfillment.speech);
		});
		request.on('error', function(error) {
			console.log(error);
		});
		request.end();
	}

	if(message.channel.type === "dm"){
	    console.log("Discord -> Bot -> Direct Message: DM by " + message.author.tag + " (" + message.author.id + " | Content: " + message.content + ")");

	    if(content === "hello"){
	        message.react("👋");
	        message.channel.send("Yo, what´s up!" +
		    "\nLater, I´ll be able to answer questions and to do some good things which I don´t know what it will be but I know it will be good (I hope)." +
		    "\nBut you can check out the repository here and maybe contribute to it to help us developing and evolving myself: https://github.com/sleme/pal-bot/");
		message.channel.send({
		    embed: {
			title: "Repository on GitHub:",
			color: 3447003,
			description: "Bot on version 1.2.0",
			fields: [
			    {
			        name: "Link:",
				value: "https://github.com/sleme/pal-bot/"
			    }
			]
		    }
		});
		message.channel.send("On my discord server, you can get some news about the development state of this bot and where we need help: https://discord.gg/fz7q53e" +
		    "\nOr just write an issue in the repository which I already sent to you!");
	    }
	    if(content === "help"){
	        message.react("👌");
	        message.channel.send("Ok, here you go:");
		message.channel.send({
		    embed: {
			title: "Bot commands you can use in a direct message conservation:",
			color: 3447003,
			description: "(You dont need to use any prefix or other special character before the command!)",
			fields: [
			    {
				name: "version",
				value: "Sends you just the version of this bot"
			    },
			    {
				name: "'Coming Soon'",
				value: "Sends you a list of features which will come very soon!"
			    }
			]
		    }
		});
	    }
	    if(content === "version"){
	        message.react("🆗");
	        message.channel.send("I am currently in version 1.2.0. You can check the changelog of this version here: https://github.com/sleme/pal-bot/releases/tag/1.2.0");
	    }
	    if(content === "coming soon"){
	        message.react("💬");
	        message.channel.send("Here is a list of features and enhancements I´ll get in the near future:");
		message.channel.send({
		    embed: {
			title: "List of features and enhancements in the near future",
			color: 3447003,
			fields: [
			    {
				name: "- Adding more direct message commands",
				value: "I´ll be able to make a better conservation with you with more DM commands"
			    },
			    {
				name: "- Enhance already existing direct message commands",
				value: "The DM commands I already have will be enhanced with more special stuff"
			    },
			    {
				name: "- Enhance direct message communication with the bot with AI",
				value: "With an AI-powered communication system, I´ll be able to give you more intelligent answers (maybe)"
			    },
			    {
				name: "- Adding more and enhance discord server related commands",
				value: "There are some commands planned for the bot which you can use on your discord server. " +
				"Currently there is nothing which we have fully planned but to know what we´re going to add, you should use this DM command often beacuse we´re going to refresh this list regularly. " +
				"If you have some features in mind we should add or anything we can enhance, just write an issue to our repository. Just write the " + config.prefix + "github ``issue`` command in a discord " +
				"server or just write 'hello' to this bot to get a link to the repository. Pull requests to the repository are appreciated! :) "
			    }
			]
		    }
		});
	    }
	}

	// Ignore any message that does not start with our prefix, set in the configuration file.
	if(message.content.indexOf(config.prefix) !== 0) return;

	// Logging every sent command.
	console.log("Recived " + message.content + " from " + message.author + ". Treating it as a command.");
  	// hook.send("Recived " + message.content + ". Treating it as a command.");
	console.log("-------------");

	/*
	Command: list-servers
	Description: Provides a list of names of servers the bot is on. Only for debug.
	*/
	if(command === "list-servers") {
	    if(message.author.id !== config.ownerID){
		message.react("👎");
	    }else {
		    const guilds = client.guilds.array();
		    for(let guild in guilds) {
			    hook.send("```" + guilds[guild]["name"] + "```");
		    }
	    }
	}


	/*
	Command: bot-info
	Description: Provides info about the bot.
	*/
	if(command === "bot-info") {
	    // const upmin = client.uptime / 60;
	    // const uphour = upmin /60;
	    message.channel.send({
		embed: {
		    title: "Bot-Info",
		    description: "Stats of the bot, just for nerds.",
		    color: 16777215,
		    footer: {
			    text: "© [slem]"
		    },
		    author: {
			    name: client.user.username,
			    icon_url: client.user.avatarURL
		    },
		    fields: [
			{
			    name: "Servers online in:",
			    value:  client.guilds.size,
			    inline: true
			},
			{
			    name: "Users serving",
			    value: client.users.size,
			    inline: true
			},
			{
			    name: "Uptime in milliseconds:",
			    value: client.uptime,
			}
		    ]
		}
	    });


	}

	/*
	Command: invert
	Description: Inverts user's pfp.
	*/

	if(command === "invert"){
		var url = message.author.avatarURL;
		Jimp.read(url).then(function (image) {
			image.resize(1024, 1024, Jimp.RESIZE_BEZIER)
			image.invert();
			let outputfile = "./output/" + Math.random().toString(36).substr(2, 5) + "sad." + image.getExtension(); // create a random name for the output file
			image.write(outputfile, function() {
				// upload file
				message.channel.send({
			"files": [outputfile]
	}).then(function() {
				// delete file
				fs.unlink(outputfile);
				console.log("SUCCESS: " + message.author.username);
				message.channel.stopTyping()
			});
		});
	}).catch(function (err) {
		console.error(err);
	})
	function onBuffer(err, buffer) {
		if (err) throw err;
		console.log(buffer);
	}
}

function doRandomSizeBlack(){
	var rand = [Jimp.FONT_SANS_64_BLACK]
	return rand[Math.floor(Math.random()*rand.length)];
}

function doRandomSizeWhite(){
	var rand = [Jimp.FONT_SANS_64_WHITE]
	return rand[Math.floor(Math.random()*rand.length)];
}


/*
Command: sad-black
Description: Adds custom black text to image and turns it gray
*/


if (command === "sad-black"){
	if(!args[0]){
		message.channel.send("Please provide text");
		return;
	}
	message.channel.startTyping();
	let url = message.author.avatarURL;
	Jimp.read(url).then(function (image) {
		Jimp.loadFont(doRandomSizeBlack()).then(function (font) { // load font from .fnt file
			// print a message on an image
			//image.print(font, 2, 2, args.join(" "), Jimp.ALIGN_FONT_CENTER); // print a message on an image with text wrapped at width
			image.resize(1024, 1024, Jimp.RESIZE_BEZIER)
					 .greyscale()
					 .print(font, 20, 960, args.join(" "), Jimp.ALIGN_FONT_CENTER).getBuffer(Jimp.MIME_JPEG, onBuffer);
			let outputfile = "./output/" + Math.random().toString(36).substr(2, 5) + "sad." + image.getExtension(); // create a random name for the output file
			image.write(outputfile, function() {
				// upload file
				message.channel.send({
			"files": [outputfile]
		}).then(function() {
				    // delete file
				    fs.unlink(outputfile);
				    console.log("SUCCESS: " + message.author.username);
				    message.channel.stopTyping()
				});
			});
		});
	}).catch(function (err) {
		console.error(err);
	});
	function onBuffer(err, buffer) {
	    if (err) throw err;
	    console.log(buffer);
	}
}

/*
Command: sad-white
Description: Adds custom white text to image and turns it gray
*/



	if (command === "sad-white"){
		if(!args[0]){
			message.channel.send("Please provide text")
			return;
		}
		message.channel.startTyping()
		var url = message.author.avatarURL;
		Jimp.read(url).then(function (image) {
			Jimp.loadFont(doRandomSizeWhite()).then(function (font) { // load font from .fnt file
				// print a message on an image
				//image.print(font, 2, 2, args.join(" "), Jimp.ALIGN_FONT_CENTER); // print a message on an image with text wrapped at width
				image.resize(1024, 1024, Jimp.RESIZE_BEZIER)
						 .greyscale()
				     .print(font, 20, 960, args.join(" "), Jimp.ALIGN_FONT_CENTER).getBuffer(Jimp.MIME_JPEG, onBuffer)
				let outputfile = "./output/" + Math.random().toString(36).substr(2, 5) + "sad." + image.getExtension(); // create a random name for the output file
				image.write(outputfile, function() {
					// upload file
					message.channel.send({
					"files": [outputfile]
				    }).then(function() {
					// delete file
					fs.unlink(outputfile);
					console.log("SUCCESS: " + message.author.username);
					message.channel.stopTyping();
				    });
				});
		});
	}).catch(function (err) {
		console.error(err);
	})
	function onBuffer(err, buffer) {
		if (err) throw err;
		console.log(buffer);
	}
}

	/*
	Command: ping
	Description: Helps check if bot is alive, returns ping of bot.
	*/
	if(command === "ping") {
		const pings = ['the moon', 'europe', 'oceania', 'Trump', 'a baguette', 'pizza', 'the netherlands','September 11th, 2001','digital ocean','the BBC','my mother','Mr. Meeseeks',"pewdipie's firewatch stream",'uncensored hentai. :warning: `not found`','Julian Assange','african food supplies, jk'];
		const ranQuote = pings[Math.floor(Math.random() * pings.length)];
		// Calculates ping between sending a message and editing it, giving a nice round-trip latency.
		// The second ping is an average latency between the bot and the websocket server (one-way, not round-trip).
		const m = await message.channel.send("One second...");
		m.edit("It took ` " + (m.createdTimestamp - message.createdTimestamp) + " ms ` to ping " + ranQuote + "\nAlso, the API latency is `" + Math.round(client.ping) + " ms`");
	}

	/*
	Command: vent
	Description: Sends an anonymous message to a webhook in a log server.
	*/
	if(command === "vent"){
		// makes the bot say something and delete the message. As an example, it's open to anyone to use.
	  // To get the "message" itself we join the `args` back into a string with spaces:
		const rant = args.join(" ");
		// Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
		message.delete().catch(O_o=>{});
		// And we get the bot to say the thing:
		vent.send(rant +" - Anonymous");
		message.author.send("Message sent to #vent successfully.")
	}

	/*
	Command: maintenance-1
	Description: Sets the bot under mainetance
	*/
	if(command === "maintenance-1"){
		if(message.author.id !== config.ownerID){
			message.react("👎");
	    }else {
				hook.send("Bot set under maintenance!");
				client.user.setGame(`Under maintenance.`);
				client.user.setStatus("idle");
			}
		}

	/*
	Command: maintenance-0
	Description: Removes the bot from being under mainetance
	*/
	if(command === "maintenance-0"){
		if(message.author.id !== config.ownerID){
		message.react("👎");
	}else {
		hook.send("Bot set online");
		// Setting bot's game and status.
		setTimeout(function(){
			const rangame = games[Math.floor(Math.random() * games.length)];
			client.user.setGame(rangame);
		}, 60000);
		client.user.setStatus("online");
	}
}

  /*
	Command: update
	Description: Should update the bot from the github repo.
	*/
	if(command === "update"){
	    if(message.author.id !== config.ownerID){
		message.react("👎");
	    }else {
		message.channel.send("Fetching updates...").then(function(sentMsg){
			console.log("Bot updating...");
			var spawn = require('child_process').spawn;
			var log = function(err,stdout,stderr){
				if(stdout){console.log(stdout);}
				if(stderr){console.log(stderr);}
			};

			var fetch = spawn('git', ['fetch']);
			fetch.stdout.on('data',function(data){
				console.log(data.toString());
				console.log("Fetch Defined");
			});

			fetch.on("close",function(code){
				var reset = spawn('git', ['reset','--hard','origin/master']);
				reset.stdout.on('data',function(data){
					console.log(data.toString());
					console.log("Fetch Close Executed");
				});

				reset.on("close",function(code){
					var npm = spawn('npm', ['install']);
					npm.stdout.on('data',function(data){
						console.log(data.toString());
						console.log("reset.on Executed");
					});

					npm.on("close",function(code){
						console.log("Bot restarting...");
						sentMsg.edit("Restarting...").then(function(){
							client.destroy().then(function(){
								process.exit();
							});
						});
					});
				});
			});
		});
	    }
	}

	if (command === "clap"){
		const randomizeCase = word => word.split('').map(c => Math.random() > 0.5 ? c.toUpperCase() : c.toLowerCase()).join(':clap:');
		if(!args[0]){
			message.channel.send('Please provide some text to clapify');
		}
		message.channel.send(args.map(randomizeCase).join(':clap:'));
	}




	if (command === "weather"){
		const makeURL = (city) => `https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22${encodeURIComponent(city)}%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys`;
		const celsius = (fahrenheit) => Math.round(((fahrenheit - 32) * 5) / 9);
		const kph = (mph) => Math.round(mph * 1.61);

		const spacer = {
			name: '\u200b',
			value: '\u200b',
		};

		if(!args[0]){
		    message.react("👎");
		    message.channel.send("Please provide a city.");
		}

		const city = args.join(' ');
		const res = await got(makeURL(city), { json: true });

		if (!res || !res.body || !res.body.query || !res.body.query.results || !res.body.query.results.channel) {
					    message.react("👎");
		    message.channel.send('Failed to load weather info!');
		}

		const weatherInfo = res.body.query.results.channel;
		const forecast = weatherInfo.item.forecast[0];

		const description = `The current temperature in ${weatherInfo.location.city} is ${weatherInfo.item.condition.temp}°F / ${celsius(weatherInfo.item.condition.temp)}°C`;

		const embed = {
		    "title": weatherInfo.item.title,
		    "description": "",
		    color: 3447003,

		    "footer": {
			"icon_url": client.user.avatarURL,
			"text": "© [slem] / Yahoo! Weather"
		    },
		    "author": {
			"name": "Weather",
			"icon_url": "https://lh6.ggpht.com/AQgEWq9WMSMD1MPd2RDqS6HJCzq8nu-iRFW3PvKqTb1IglzRh5DChrruWlcJmvoQ_zo=w300"
		    },
		    "fields": [
			spacer,
			{
			    "name": ":cloud: Condition",
			    "value": weatherInfo.item.condition.text,
			    "inline": true
			},
			{
			    "name": ":sweat_drops: Humidity",
			    "value": weatherInfo.atmosphere.humidity + "%",
			    "inline": true
			},
			{
			    "name": ":wind_blowing_face: Wind",
			    "value": `*${weatherInfo.wind.speed}mph* / *${kph(weatherInfo.wind.speed)}kph* ; direction: *${weatherInfo.wind.direction}°*`
			},
			{
			    "name": `Forecast for today is: ${forecast.text}`,
			    "value": `\n Highest temperature is ${forecast.high}°F / ${celsius(forecast.high)}°C \n Lowest temperature is ${forecast.low}°F / ${celsius(forecast.low)}°C`
			},
			spacer,
			{
			    "name": ':sunny: Sunrise',
			    "value": weatherInfo.astronomy.sunrise,
			    "inline": true
			},
			{
			    "name": ':full_moon: Sunset',
			    "value": weatherInfo.astronomy.sunset,
			    "inline": true
			},
			spacer
		    ]
		};

		message.channel.send({embed});
	}

	/*
	Command: server
	*/
	if(command === "server"){
		message.delete();
		message.author.send("You can join this bots discord server using this server invite link: https://discord.gg/k6qSHQs")
	}

	/*
	Command: bot-invite
  */
	if(command === "bot-invite") {
		message.delete();
		message.author.send("Bot invite link: https://discordapp.com/oauth2/authorize?&client_id=" + config.client_id + "&scope=bot&permissions=536980545");
	}

	/*
	Command: invite
	Description: Sends the first invite link which never expires.
	*/
	if(command === "invite"){
		try {
			message.delete();
			const invites = await message.guild.fetchInvites();
			message.author.send(":mailbox: You can invite your friend to this discord with this invite link 👉 " + invites.filter(invite => !invite.maxAge).first().toString());
		} catch(e){
			message.delete();
			message.channel.createInvite({maxAge: 0});
			const invites = await message.guild.fetchInvites();
			message.author.send("I created an invite link for you! 👍 Send this to your friends to invite them! 👉 " + invites.filter(invite => !invite.maxAge).first().toString())
		}
	}

	/*
	Command: count-discord-member (can be changed in the next time)
	Description: Counting the members of the discord server where the command was called.
	*/
	if(command === "server-members"){
	    	let memberAmount = message.guild.memberCount;
	  	let memberAmountString = memberAmount.toString();
	  	let lengthNumber = memberAmount.toString().length;
	  	let msgChannel = message;

		// Output the "10" emoji when the discord has exact 10 members
		if(memberAmount%10 === 0){
			message.react("🔟");
		}else{
			this.loop(0, lengthNumber, memberAmountString, msgChannel);
		}
		message.channel.send("On this discord server there are **" + memberAmount + "** members including yourself.");
	}

	/*
	Command: wiki
	Description: Get information from Wikipedia. Example: +wiki GitHub or +wiki Rocket League
	*/
	if(command === "wiki"){
		if(!args[0]){
			message.react("👎");
			message.reply("you forgot to send us something to get data.``" + config.prefix + "wiki [argument] | Example " + config.prefix + "wiki Rocket League``");
		} else{
			let searchValue = args.toString().replace(/,/g, " ");
			let url = "https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&titles=" + searchValue;
			this.getWikipediaSummary(url, message, searchValue);
		}
	}

    	/*
	Command: github
	Description: Get information about the repository and contributors.
	*/
    	if(command === "github"){
	    if(!args[0]){
		message.reply("here you can find the repository from this bot: https://github.com/sleme/pal-bot/");
		message.channel.send({
		    embed: {
			title: "Latest stable release:",
			color: 3447003,
			description: "1.2.0"
		    }
		});
	    } else{
		if(args[0] === "contributors"){
		    got({
			host: "api.github.com",
			path: "/repos/sleme/pal-bot/contributors",
			headers: {'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.38 Safari/537.36'}
		    }).then(res => {
			let contributors = JSON.parse(res.body);

			let contData = [];

			for(let i = 0; i < contributors.length; i++){
			    console.log(contributors[i].login);
			    contData.push({name: "Contributor", value: contributors[i].login + " | " + contributors[i].html_url});
			}

			message.channel.send({
			    embed: {
				color: 3447003,
				title: "GitHub -> Contributors",
				fields: contData,
				timestamp: new Date()
			    }
			});

		    }).catch(error => {
			console.log(error.response.body);
		    });
		}else if(args[0] === "help"){
		    message.channel.send({
			embed: {
			    color: 3447003,
			    title: "GitHub -> Bot commands",
			    fields: [
			        {
				    name: config.prefix + "github",
				    value: "Sends to you a link to the repository of this bot."
				},
				{
				    name: config.prefix + "github contributors",
				    value: "Gives you a list of all contributors in the repository"
				},
				{
				    name: config.prefix + "github issue",
				    value: "Sends you a link where you can write an issue."
				},
				{
				    name: config.prefix + "github contribute",
				    value: "Returns information about to contribute in the repo of this bot."
				}
			    ],
			    timestamp: new Date()
			}
		    });
		}else if(args[0] === "issue"){
		    message.channel.send({
			embed: {
			    color: 3447003,
			    title: "GitHub -> Issues",
			    fields: [
				{
				    name: "You´ve found a bug or have some suggestions for the bot?",
				    value: "Write it to our repository: https://github.com/sleme/pal-bot/issues/new"
				}
			    ],
			    timestamp: new Date()
			}
		    });
		}else if(args[0] === "contribute"){
		    message.channel.send({
			embed: {
			    color: 3447003,
			    title: "GitHub -> Contribute",
			    description: "You want to contribute in our project? Check out our repo by typing " + config.prefix + "github to get a lookup of the project and to see what we´re planning and what we´re currently working on.",
			    timestamp: new Date()
			}
		    });
		}else{
		    message.channel.send({
			embed: {
			    color: 3447003,
			    title: "GitHub Bot Commands",
			    description: "You´ve sent a command which I can´t handle. Here you see a full list of the github commands.",
			    fields: [
				{
				    name: config.prefix + "github",
				    value: "Sends to you a link to the repository of this bot."
				},
				{
				    name: config.prefix + "github contributors",
				    value: "Gives you a list of all contributors in the repository"
				},
				{
				    name: config.prefix + "github issue",
				    value: "Sends you a link where you can write an issue."
				}
			    ],
			    timestamp: new Date()
			}
		    });
		}
	    }
	}

	/*
	Command: user
	Description: Lookup user data
	*/
	if(command === "user") {
		// Made a try-catch because if someone is funny and tries to get data from a user which he cannot mention but still tries lmao.
		try {
			const member = message.guild.member(message.mentions.members.first());

			let userCreatedDate = this.getDate(new Date(member.user.createdTimestamp));
			let guildJoinDate = this.getDate(new Date(member.joinedTimestamp));
			let roles = member.roles.map((a) => {
				return a;
			});

			let userLookupEmbed = new Discord.RichEmbed()
			    .setAuthor("Username: " + member.user.username, member.user.avatarURL)
			    .setDescription(member.user.toString() + ' (' + member.user.tag + ')')
			    .addField("Account created at:", userCreatedDate)
			    .addField("Joined this server at:", guildJoinDate)
			    .addField("Roles:", roles)
			    .addField("ID:", member.user.id)
			    .setFooter(member.user.username, member.user.avatarURL)
			    .setTimestamp()
			    .setColor("AQUA");

			message.channel.send({embed: userLookupEmbed});
		}catch(e){
			message.channel.send({embed: {
				title: "No user found in this guild with the name " + args[0]
			}});
		}
	}

	/*
	Command: kill
	Description: Turns off the bot, can only be used by [slem]
	*/
	if(command === "kill") {
		if(message.author.id !== config.ownerID){
			message.react("👎");
		}else {
			message.react('👌');
			// Send a message using the webhook
			hook.send("Killing bot...").then(function(){
				client.destroy().then(function(){
					process.exit();
				})
			})
		}
	}


	/*
	Command: help
	Description: Gives user a list of commands the bot can do.
	*/
	if(command === "help"){
	    message.delete();
	    message.author.send({
		embed: {
		    color: 3447003,
		    title: "Available commands",
		    description: "Here you have a list of all commands of the bot: ",
		    footer: {
		        text : "- by Pal (who want to help humans :) )"
		    },
		    fields: [
			{
			    name: config.prefix + "ping",
			    value: "Calculates ping."
			},
			{
			    name: config.prefix + "invite",
			    value: "Gives you an invite link to this discord server."
			},
			{
			    name: config.prefix + "server-members",
			    value: "Counting the discord member of the server where the command was executed."
			},
			{
			    name: config.prefix + "bot-invite",
			    value: "Gives you a bot invite link."
			},
			{
			    name: config.prefix + "say",
			    value: "Repeats what you say."
			},
			{
			    name: config.prefix + "purge",
			    value: "This command removes all messages from all users in the channel, up to 100. "
			},
			{
			    name: config.prefix + "user @user",
			    value: "Gives you information about the mentioned user."
			},
			{
			    name: config.prefix + "server",
			    value: "Gives an invite to the bot's discord."
			},
			{
			    name: config.prefix + "github",
			    value: "```!github [help | contributors | issue | contribute ]```\n **!github** sends you the link to the repository."
			},
			{
			    name: config.prefix + "clap",
			    value: "Clapify your text."
			},
			{
			    name: config.prefix + "weather 'city'",
			    value: "Gives you the weather info of the given city."
			},
			{
			    name: config.prefix + "vent 'your vent here'",
			    value: "Uploads a vent to the vent server, vent server can be found here https://discord.gg/EBTkQHg"
			}
		    ]
		}
	    });
	    message.author.send("**__Vent Server:__** https://discord.gg/EBTkQHg");
	    message.author.send("You can also join this bots discord server for more help using this invite link: https://discord.gg/k6qSHQs");
	}

	/*
	Command: say
	Description: Echos whatever you say in the command
	*/
	if(command === "say") {
		// Makes the bot say something and delete the message. As an example, it's open to anyone to use.
		// To get the "message" itself we join the `args` back into a string with spaces:
		const sayMessage = args.join(" ");
		// Then delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
		message.delete().catch(O_o=>{});
		// And we get the bot to say the thing:
		message.channel.send(sayMessage);
	}

	/*
	Command: purge
	*/
	if(command === "purge") {
		// This command removes all messages from all users in the channel, up to 100.
	  // get the delete count, as an actual number.
		const deleteCount = parseInt(args[0], 10);
		// Ooooh nice, combined conditions. <3
		if(!deleteCount || deleteCount < 2 || deleteCount > 100)
		return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");
		// So we get our messages, and delete them. Simple enough, right?
		const fetched = await message.channel.fetchMessages({count: deleteCount});
		message.channel.bulkDelete(fetched)
		.catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
	}
});

// This checks if bot is using a bot token to log in.
if(config.token){
	// Log whats happening.
	console.log("-------------");
	console.log("Trying to log in with token...");
	hook.send("Trying to log in with token...");
	client.login(config.token);
} else {
	// Only will happpen is error. This should only happen if the error is you dont have a bot token.
	console.log("Bot token not found! Remember you cant log in with credentials anymore.");
}

/**
 * Returns a formatted time string with a millisecond timestamp.
 *
 * @param date - Game to be set for the bot.
 * @since 1.0.1
 *
 * @public
 */
exports.getDate = function(/**Object*/date) {
	/* We can use this later

	let hours = date.getHours();
	let minutes = "0" + date.getMinutes();
	let seconds = "0" + date.getSeconds();

	*/
	let formattedTime = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
	return formattedTime;
};

/**
 * A function which is looping a timeout which return the emoji reactions when a user want to count the discord members of a server.
 *
 * @param statement - Should be 0. 0 is the first part of a string.
 * @param lengthNumber - Length of the count-discord-member string.
 * @param memberAmountString - Discord member count number as a string.
 * @param channel - Message parameter of a function when asking the bot client if the message event happened.
 * @since 1.0.1
 *
 * @public
 */
exports.loop = (/**integer*/statement, /**integer*/lengthNumber, /**integer*/memberAmountString, /**Class*/channel) => {
    let newStatement = statement + 1;
    setTimeout(function () {
	if(statement < lengthNumber){
	    exports.loop(newStatement, lengthNumber, memberAmountString, channel);
	}else{
	    return null;
	}
	let numberPart = memberAmountString[statement];
	console.log(numberPart + " -> " + statement);
	switch (numberPart) {
	    case "0":
		channel.react("0⃣");
		break;
	    case "1":
		channel.react("1⃣");
		break;
	    case "2":
		channel.react("2⃣");
		break;
	    case "3":
		channel.react("3⃣");
		break;
	    case "4":
		channel.react("4⃣");
		break;
	    case "5":
		channel.react("5⃣");
		break;
	    case "6":
		channel.react("6⃣");
		break;
	    case "7":
		channel.react("7⃣");
		break;
	    case "8":
		channel.react("8⃣");
		break;
	    case "9":
		channel.react("9⃣");
		break;
	    default:
		channel.react("⛔");
	    // default cant happen but maybe it will anyway ok
	}

    }, 500);
};
/**
 * Function which is receiving data from Wikipedia by giving a term to search in the Wikipedia Database and returns
 * short summaries.
 *
 * @param url - URL for requesting data (Wikipedia)
 * @param msg - Message class of Discord.js
 * @param argument - Argument sent by the user -> !wiki [argument]
 * @since 1.0.1
 *
 * @public
 */
exports.getWikipediaSummary = (/**String*/url, /**Class*/msg, /**String*/argument) => {

    got(url).then(res => {

	try {

	    let pageContent = JSON.parse(res.body).query.pages;
	    let keys = Object.keys(pageContent);

	    let summary;

	    if(pageContent[keys[0]].extract.split(".", 2).length <= 1){
		summary = "Click on the Link above to see the Wikipedia article about " + pageContent[keys[0]].title;
	    }else{
		// First lines of the Wikipedia article
		summary = pageContent[keys[0]].extract.toString().match(/([^\.!\?]+[\.!\?]+)|([^\.!\?]+$)/g);

		summary = summary[0] + summary[1];

		// console.log(summary);
		// console.log("-----");
		// let stringSplitting = pageContent[keys[0]].extract.toString().match(/([^\.!\?]+[\.!\?]+)|([^\.!\?]+$)/g);
		// console.log(stringSplitting[0] + stringSplitting[1]);

		// Replacing all HTML Tags included in the text
		summary = summary.replace(/<(?:.|\n)*?>/gm, "");
	    }

	    // HTTPS Request for receiving the URL of the article by giving the page ID as the value for the pageids parameter in the API request to Wikipedia
	    got("https://en.wikipedia.org/w/api.php?action=query&prop=info&format=json&inprop=url&pageids=" + pageContent[keys[0]].pageid).then(pageres => {
		try {
		    // JSON data of the page with the page id pageid
		    let pageObject = JSON.parse(pageres.body).query.pages;

		    let key = Object.keys(pageObject);

		    // Get the value of the fullurl parameter
		    let wikipediaArticleLink = pageObject[key[0]].fullurl;

		    // Sending the final result of the two requests as an embed to the channel where the command
		    // was executed.
		    msg.channel.send({
			embed: {
			    color: 3447003,
			    author: {
				icon_url: "https://upload.wikimedia.org/wikipedia/commons/6/63/Wikipedia-logo.png",
				name: "Wikipedia"
			    },
			    title: pageContent[keys[0]].title + " (wikipedia article)",
			    url: wikipediaArticleLink,
			    description: summary,
			    timestamp: new Date(),
			    footer: {
				icon_url: "https://upload.wikimedia.org/wikipedia/en/2/28/WikipediaMobileAppLogo.png",
				text: "Information by Wikipedia. wikipedia.org"
			    }
			}
		    });

		}catch(e){
		    msg.react("⛔");
		    msg.channel.send(
			"You got a very rare error here, how did you get that? Write it to our GitHub Repository\n" +
			"https://github.com/sleme/pal-bot");
		}
	    });

	}catch(e){
	    msg.react("⛔");
	    msg.channel.send(
		"Cannot get data from Wikipedia. Please check your spelling and upper and lower case. (Mostly it is upper and lower case because Wikipedia pay attention to it.)\n" +
		"```You´ve sent the value: " + argument + "```");
	}

    }).catch(error => {
	console.log(error.response.body)
    });

};
