// Load up the discord.js library.
try {
	var Discord = require("discord.js");
} catch (e){
	console.log(e.stack);
	console.log(process.version);
	console.log("Please run npm install and ensure it passes with no errors!");
	process.exit();
}
console.log("Starting Pal\nNode version: " + process.version + "\nDiscord.js version: " + Discord.version);

// Defining the Discord Client as "client".
const client = new Discord.Client();

// Here we load the config.json file that contains our token and our prefix values.
const config = require("./config.json");

// Loading "Missigno" hook for #console in pal-bot discord.
const hook = new Discord.WebhookClient(config.hook_id, config.hook_token);

// Loading "Venter" hook
const vent = new Discord.WebhookClient(config.vent_id, config.vent_token);
const sad = new Discord.WebhookClient(config.sad_id, config.sad_token);
const admin = new Discord.WebhookClient(config.admin_id, config.admin_token);

// Here we define maintenance. (0 = off | 1 = on)
const maintenance = 0

// The events under here will run if the bot starts, and logs in, successfully.
client.on("ready", () => {
  console.log("-------------");
  console.log("Logged in!");
  hook.send(`Logged in!`);
  hook.send("Starting Pal-Bot:\nNode version: " + process.version + "\nDiscord.js version: " + Discord.version);
  console.log("-------------");
  console.log(`Ready to serve in ${client.channels.size} channels on ${client.guilds.size} servers, for a total of ${client.users.size} users.`);
	hook.send(`Ready to serve in ${client.channels.size} channels on ${client.guilds.size} servers, for a total of ${client.users.size} users.`);
  console.log("-------------");

  // The events under here will run if the bot starts, logs in successfully and maintenance is set to "ON".
  if (maintenance == 1) {
    // Setting bot's game and status.
    client.user.setGame(`Under maintenance.`);
    client.user.setStatus("idle");

    // Logging changes.
    console.log("Maintenance set to 'ON'. This means the status has been set to idle and presence set to 'Under maintenance'.");
		hook.send("Maintenance set to 'ON'. This means the status has been set to idle and presence set to 'Under maintenance'.");
    console.log("-------------");
  }else {
  // Setting bot's game and status.
  client.user.setGame(`Online! | +help`);
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

    // If the bot is being pinged, reply with "Hello?".
    if(message.isMentioned(client.user)) message.channel.send('Hello?');

    // Ignore other bots. This also makes your bot ignore itself and not get into a "botception".
    if(message.author.bot) return;

    // Ignore any message that does not start with our prefix, set in the configuration file.
    if(message.content.indexOf(config.prefix) !== 0) return;

    console.log("Recived " + message.content + " from " + message.author + ". Treating it as a command.");
	  hook.send("Recived " + message.content + ". Treating it as a command.");
    console.log("-------------");

    // Here we separate our "command" name, and our "arguments" for the command.
    // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
    // command = say
    // args = ["Is", "this", "the", "real", "life?"]
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);

    // Make recived command all lower case.
    const command = args.shift().toLowerCase();

		const upmin = client.uptime / 60;
		const uphou = upmin /60;

		/*
    Command: servers
    */
		if(command === "bot-info") {
			message.channel.send(
				"\n" +
				"\n On " + client.guilds.size + " servers." +
				"\n Serving " + client.users.size + " users." +
				"\n Uptime (minutes): " + upmin  + " minutes." +
				"\n Uptime (hours): " + uphou  + " hours."
			)
		}




    /*
    Command: ping
    */
    if(command === "ping") {
        // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
        // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip).
        const m = await message.channel.send("Ping?");
        m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
    }

		/*
    Command: vent
    */
    if(command === "vent"){
        // makes the bot say something and delete the message. As an example, it's open to anyone to use.
        // To get the "message" itself we join the `args` back into a string with spaces:
        const sayMessage = args.join(" ");
        // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
        message.delete().catch(O_o=>{});
        // And we get the bot to say the thing:
        vent.send(sayMessage +" - Anonymous");
    }

		/*
    Command: rant
    */
    if(command === "rant"){
        const sayMessage = args.join(" ");
        // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
        message.delete().catch(O_o=>{});
        // And we get the bot to say the thing:
        sad.send(sayMessage +" - Anonymous");
        admin.send("Recived:  ' " + sayMessage +" ' From:"+ message.author);
    }

    if(command === "maintenance-1"){
        if(message.author.id !== config.ownerID){
            message.react("👎");
        }else {
            hook.send("Bot set under maintenance!");
            client.user.setGame(`Under maintenance.`);
            client.user.setStatus("idle");
        }
    }

    if(command === "maintenance-0"){
        if(message.author.id !== config.ownerID){
            message.react("👎");
        }else {
            hook.send("Bot set online");
            client.user.setGame(`Online! | +help`);
            client.user.setStatus("online");
        }
    }

		/*
		Command: update
		*/
  if(command === "update"){
    if(message.author.id !== config.ownerID){
      message.react("👎");
    }else {
    message.channel.send("Fetching updates...").then(function(sentmessage){
			console.log("Bot updating...");
			var spawn = require('child_process').spawn;
			var log = function(err,stdout,stderr){
				if(stdout){console.log(stdout);}
				if(stderr){console.log(stderr);}
			};
			var fetch = spawn('git', ['fetch']);
			fetch.stdout.on('data',function(data){
				console.log(data.toString());
			});
			fetch.on("close",function(code){
				var reset = spawn('git', ['reset','--hard','origin/master']);
				reset.stdout.on('data',function(data){
					console.log(data.toString());
				});
				reset.on("close",function(code){
					var npm = spawn('npm', ['install']);
					npm.stdout.on('data',function(data){
						console.log(data.toString());
					});
					npm.on("close",function(code){
						console.log("Shutting down...");
						sentmessage.edit("I will be right back!").then(function(){
							client.destroy().then(function(){
                sentmessage.edit("I will be right back!");
								process.exit();
							});
						});
					});
				});
			});
		});
    }
  }

    /*
    Command: git
    */
    if(command === "git"){
        message.channel.send({
      embed: {
        title: "GitHub Repo",
        description: "--------------------------------------------------------",
        color: 6814447,

        footer: {
          icon_url : client.user.avatarURL,
          text: "© [slem]"
        },
        author: {
          name: client.user.username,
          icon_url: client.user.avatarURL
        },
        fields: [
                {
                    name : "Repo link:",
                    value : "https://github.com/sleme/pal-bot",
                    inline: true
                },
          {
            name : "Latest release:",
            value : "1.0.0",
                    inline: true
          }
        ]
      }
    })
  }

  /*
  Command: server
  */
	if(command === "server"){
		message.author.send("You can join this bots discord server using this server invite link: https://discord.gg/k6qSHQs")
	}

    /*
    Command: bot-invite
    */
    if(command === "bot-invite") {
        message.react('👌');
		message.author.send("Bot invite link: https://discordapp.com/oauth2/authorize?&client_id=" + config.client_id + "&scope=bot&permissions=470019135");
    }

    /*
    Command: invite
    Description: Sends the first invite link which never expires.
    */
    if(command === "invite"){
        try {
            message.react('👌');
            const invites = await message.guild.fetchInvites();
            message.author.send(invites.filter(invite => !invite.maxAge).first().toString());
        } catch(err){
            message.delete();
            message.author.send("No invite link found! Create one yourself in Discord.")
        }
    }

    /*
    Command: count-discord-member (can be changed in the next time)
    Description: Counting the members of the discord server where the command was called.
    */
    if(command === "count-discord-member"){
        message.channel.send("On this discord server there are " + message.guild.memberCount + " members including yourself.");
    }

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
    */
    if(command === "help"){
        message.react('👌');
        message.channel.send("Check your private messages! :wink:");
        message.author.send(
          "\n" + "**Available Commands:**" +
          "\n" + config.prefix + " ``ping`` // Calculates ping." +
          "\n" + config.prefix + " ``invite`` // Gives you an invite link to this discord server." +
          "\n" + config.prefix + " ``count-discord-member`` // Counting the discord member of the server where the command was executed."+
          "\n" + config.prefix + " ``bot-invite`` // Gives you a bot invite link." +
          "\n" + config.prefix + " ``say`` // Repeats what you say." +
          "\n" + config.prefix + " ``purge`` // This command removes all messages from all users in the channel, up to 100. " +
          "\n" + config.prefix + " ``me`` // Gives you a list of info about you. " +
          "\n" + config.prefix + " ``server`` // Gives an invite to the bot's discord. " +
          "\n" + config.prefix + " ``vent 'your vent here' `` // Uploads a vent to the vent server, vent server can be found here https://discord.gg/EBTkQHg " +
          "\n" + "You can also join this bots discord server for more help using https://discord.gg/k6qSHQs"
        );
    }

  /*
  Command: say
  */
  if(command === "say") {
    // makes the bot say something and delete the message. As an example, it's open to anyone to use.
    // To get the "message" itself we join the `args` back into a string with spaces:
    const sayMessage = args.join(" ");
    // Then delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
    message.delete().catch(O_o=>{});
    // And we get the bot to say the thing:
    message.channel.send(sayMessage);
  }

    /*
    Command: me
    */
    if(command === "me"){
      message.react('👌');
      console.log("Reacted sending message now...");
      message.channel.send({
          embed: {
            title: "User's info",
            description: "--------------------------------------------------------",
            color: 6814447,

            footer: {
              icon_url : client.user.avatarURL,
              text: "© [slem]"
            },
            thumbnail: {
              url: message.author.avatarURL
            },
            author: {
              name: message.author.username,
              icon_url: message.author.avatarURL
            },
            fields: [
                    {
                        name : "Username:",
                        value : message.author.username,
                        inline: true
                    },
              {
                name : "ID:",
                value : message.author.id,
                        inline: true
              },
              {
                name : "Account creation date:",
                value : message.author.createdAt
              },
              {
                name: "Profile picture link:",
                value : message.author.displayAvatarURL
              }
            ]
          }
      });
    }

	/*
	Hook Test
	*/
	if(command === "hookme") {
		if(message.author.id !== config.ownerID || config.benID){
			message.react("👎");
		}else {
			message.react('👌');
			const sayMessage = args.join(" ");
			// Send a message using the webhook
			hook.send(sayMessage);
		}
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
