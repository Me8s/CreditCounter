const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = "-"
var fs = require('fs')
var userData = JSON.parse(fs.readFileSync('Storage/userData.json'))
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {
    if (message.channel.type == "dm") return
    console.log(message.content)
    const args = message.content.slice(prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();
    function addpoints(points) {
        if (!userData[message.author.id]) {
            userData[message.author.id] = {
                coins: 0
            }
        }
        userData[message.author.id].coins = Number(userData[message.author.id].coins) + Number(points)
        fs.writeFile('Storage/userData.json', JSON.stringify(userData), (err) => {
            if (err) console.error(err);
        });
        message.channel.send("Added **" + points + "** Credits to your balance. Enjoy.")
    }
    if (message.content.startsWith(`${prefix}ping`)) {
        message.reply('Pong!');
    }
    if (message.content.startsWith(`${prefix}addcredits`) || message.content.startsWith(`${prefix}redcredits`) || message.content.startsWith(`${prefix}setcredits`)) {
        try {
            if (message.member.roles.cache.has('758615852592398347')) {
                let selectedUser = message.mentions.users.first();
                let points = message.content.slice(35);
                if (message.content === "-addcredits") {
                    message.channel.send("WHAT R U THINKING WRONG FORMAT")
                } else {
                    if (!userData[selectedUser.id]) {
                        userData[selectedUser.id] = {
                            coins: 0
                        }
                    }
                    if (message.content.startsWith(`${prefix}addcredits`)) {
                        userData[selectedUser.id].coins = Number(userData[selectedUser.id].coins) + Number(points)
                        var action = "Added"
                    } else if(message.content.startsWith(`${prefix}redcredits`)) {
                        userData[selectedUser.id].coins = Number(userData[selectedUser.id].coins) - Number(points)
                        var action = "Reduced"
                    } else {
                        userData[selectedUser.id].coins = Number(points)
                        var action = "Set"
                    }
                    fs.writeFile('Storage/userData.json', JSON.stringify(userData), (err) => {
                        if (err) console.error(err);
                    });
                    message.channel.send(`${action} **` + points + `** Credits to ${selectedUser.tag}'s balance.`)
                    selectedUser.send(`${action} **` + points + "** Credits to your balance.")
                }
            }
            else {
                message.channel.send('You don\'t have the permission to do that!')
            }
        } catch {
            message.channel.send("Incorrect Syntax!")
        }
    }
    if (message.content.startsWith(`${prefix}bal`) || message.content.startsWith(`${prefix}credits`)) {
        try {
            let selectedUser = message.mentions.users.first();
            if (!userData[selectedUser.id]) {
                userData[selectedUser.id] = {
                    coins: 0
                }
            }
            const coinAmount = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle('**User\'s Balance**')
                .setDescription(`${selectedUser.tag} has **${userData[selectedUser.id].coins}** credits.`)
            message.channel.send(coinAmount)
        } catch {
            if (!userData[message.author.id]) {
                addpoints(0)
            }
            const coinAmount = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle('**User\'s Balance**')
                .setDescription('You have **' + userData[message.author.id].coins + '** credits.')
            message.channel.send(coinAmount)
        }
    }
});

client.login('ODA5MzQ5NDQ0OTk4MjY2ODkw.YCTzaA.-W0agZBlBALrS1Zn1XaTc2vTn-0');