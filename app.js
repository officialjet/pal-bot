// Load up the discord.js library
const Discord = require("discord.js");

// This is your client. Some people call it `bot`, some people call it `self`,
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const client = new Discord.Client();

// Create a new webhook
const hook = new Discord.WebhookClient('352562055745896459', 'Z4xOVJz0uauFeH-1cUiNBT8mv7ilBa1umsNNb7XQZgqwivBKBPvgaWwJ7m8yKIDMQx6W');

// Here we load the config.json file that contains our token and our prefix values.
const config = require("./config.json");
// config.token contains the bot's token
// config.prefix contains the message prefix.

const mainetance = 1

// BOT STARTED UP HERE!!!!!!!!!!!
client.on("ready", () => {



// If you got here it means you logged in.
  console.log("-------------");
  console.log("Logged in!");
	hook.send(`Logged in!`)
  console.log("-------------");

  // This event will run if the bot starts, and logs in, successfully.
  console.log(`Ready to serve in ${client.channels.size} channels on ${client.guilds.size} servers, for a total of ${client.users.size} users.`);
	hook.send(`Ready to serve in ${client.channels.size} channels on ${client.guilds.size} servers, for a total of ${client.users.size} users.`);
  console.log("-------------");

  if (mainetance == 1) {
    client.user.setPresence({ game: { name: 'Under mainetance.', type: 0 } });
    client.user.setStatus("idle");
    console.log("Variable mainetance is set to 1. This means the status has been set to idle and presence set to 'Under mainetance'.");
		hook.send("Variable mainetance is set to 1. This means the status has been set to idle and presence set to 'Under mainetance'.");
    console.log("-------------");
  }else {

  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
  client.user.setGame(`on ${client.guilds.size} servers`);
  client.user.setPresence({ game: { name: `+help | on ${client.guilds.size} servers`, type: 0 } });
  client.user.setStatus("online");
  console.log("Bot's status and game set.");
	hook.send(`Bot's status and game set.`)
  console.log("-------------");
}

});

client.on("disconnected", function () {
	console.error("Disconnected!");
	hook.send("Disconnected!");
	process.exit(1); //exit node.js with an error
});

client.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`New server joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
	hook.send(`New server joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  // client.user.setGame(`on ${client.guilds.size} servers`);
});

client.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
	hook.send(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  // client.user.setGame(`on ${client.guilds.size} servers`);
});


client.on("message", async message => {
  // This event will run on every single message received, from any channel or DM.

	if(message.isMentioned(client.user)) message.channel.send('Hello?');


  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if(message.author.bot) return;

  // Also good practice to ignore any message that does not start with our prefix,
  // which is set in the configuration file.
  if(message.content.indexOf(config.prefix) !== 0) return;


  console.log("Recived " + message.content + " from " + message.author + ". Treating it as a command.");
	hook.send("Recived " + message.content + " from " + message.author + ". Treating it as a command.");
  console.log("-------------");


  // Here we separate our "command" name, and our "arguments" for the command.
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();



  // Let's go with a few common example commands! Feel free to delete or change those.

  if(command === "ping") {
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }

	if(command === "server"){
		message.author.send("You can join this bots discord server using https://discord.gg/k6qSHQs")
	}

  if(command === "invite") {
      message.react('👌');
			message.author.send("Bot invite link: https://discordapp.com/oauth2/authorize?&client_id=" + AuthDetails.client_id + "&scope=bot&permissions=470019135");
}
// Help command manually made at the moment.
if(command === "help"){
  message.react('👌');
  message.channel.send("Check your private messages! :wink:");
  message.author.send("**Available Commands:**");
  message.author.send(config.prefix + " ``ping`` // Calculates ping.");
  message.author.send(config.prefix + " ``invite`` // Gives you an bot invite link.");
  message.author.send(config.prefix + " ``say`` // Repeats what you say.");
  message.author.send(config.prefix + " ``purge`` // This command removes all messages from all users in the channel, up to 100. ");
	message.author.send(config.prefix + " ``me`` // Gives you a list of info about you. ");
	message.author.send(config.prefix + " ``server`` // Gives an invite to the bot's discord. ");
	message.author.send("You can also join this bots discord server for more help using https://discord.gg/k6qSHQs")
}

  if(command === "say") {
    // makes the bot say something and delete the message. As an example, it's open to anyone to use.
    // To get the "message" itself we join the `args` back into a string with spaces:
    const sayMessage = args.join(" ");
    // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
    message.delete().catch(O_o=>{});
    // And we get the bot to say the thing:
    message.channel.send(sayMessage);
  }

if(command === "me"){
  message.react('👌');
	console.log("Reacted sending message now...");
	message.channel.send(
		{
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
console.log("Message sent.");
console.log("-------------");
}


	if(command === "info"){
		message.react('👌');
		message.author.send({
  "embed": {
    "description": "**Pal is a bot for discord that does various things!**",
    "color": 9484764,
    "footer": {
      "icon_url": "https://cdn.discordapp.com/app-icons/300955174225051650/0cff84632c70375f738cad76f449f65c.png",
      "text": "© [slem]  |  build on discord.js"
    },
    "author": {
      "name": "Pal",
      "icon_url": "https://cdn.discordapp.com/app-icons/300955174225051650/0cff84632c70375f738cad76f449f65c.png"
    },
    "fields": [
      {
        "name": "**Some things i can do:**",
        "value": "------------------------------"
      },
      {
        "name": "**+ invite**",
        "value": "Gives you an bot invite link."
      },
      {
        "name": "**+ ping**",
        "value": "Calculates ping."
      },
      {
        "name": "**+ say**",
        "value": "Repeats what you say."
      },
      {
        "name": "**+ help**",
        "value": "Provides help."
      },
      {
        "name": "**+ info**",
        "value": "------------------------------"
      }



    ]
  }
})
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

/*/
  if(command === "kick") {
    // This command must be limited to mods and admins. In this example we just hardcode the role names.
    // Please read on Array.some() to understand this bit:
    // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/some?
    if(!message.member.roles.some(r=>["Administrator", "Moderator", "Admin", "Mod"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");

    // Let's first check if we have a member and if we can kick them!
    // message.mentions.members is a collection of people that have been mentioned, as GuildMembers.
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.kickable)
      return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");

    // slice(1) removes the first part, which here should be the user mention!
    let reason = args.slice(1).join(' ');
    if(!reason)
      return message.reply("Please indicate a reason for the kick!");

    // Now, time for a swift kick in the nuts!
    await member.kick(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
    message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);
  }
  /*/

/*/
  if(command === "ban") {
    // Most of this command is identical to kick, except that here we'll only let admins do it.
    // In the real world mods could ban too, but this is just an example, right? ;)
    if(!message.member.roles.some(r=>["Administrator"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");

    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.bannable)
      return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");

    let reason = args.slice(1).join(' ');
    if(!reason)
      return message.reply("Please indicate a reason for the ban!");

    await member.ban(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
    message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
  }
/*/
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

// Checking if you are using a token to log in.
if(config.bot_token){
console.log("-------------");
console.log("Trying to log in with token...");
client.login(config.bot_token);
} else {
console.log("Bot token not found in auth.json! Remember you cant log in with credentials anymore.");
}
