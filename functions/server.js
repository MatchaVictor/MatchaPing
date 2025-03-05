// functions/server.js
const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');

const app = express();
app.use(cors());

const botToken = process.env.DISCORD_BOT_TOKEN; // Get token from environment variable
const userId = '434790190809350165';

const client = new Client({ intents: [GatewayIntentBits.GuildPresences, GatewayIntentBits.Guilds] });

let activityStatus = 'Loading...';

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

    client.on('presenceUpdate', (oldPresence, newPresence) => {
        if (newPresence.userId === userId) {
            if (newPresence.activities.length > 0) {
                activityStatus = newPresence.activities[0].name;
            } else {
                activityStatus = 'No Activity';
            }
        }
    });
});

client.login(botToken);

app.get('/.netlify/functions/server/activity', (req, res) => {
    res.json({ activity: activityStatus });
});

module.exports.handler = serverless(app);
