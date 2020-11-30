require("dotenv").config();

// Reddit credentials
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDDIT_USER = process.env.REDDIT_USER;
const REDDIT_PASS = process.env.REDDIT_PASS;

// Discord credentials
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

// Amount of time between requests (often requests might get you banned!)
const SLEEP_PERIOD = 60 * 1000; // Time in ms

// Delay before sending the post to the channel.
// Allows to wait for the post to be moderated on Reddit.
const MODERATION_PERIOD = 60 * 60 * 1000; // Time in ms

module.exports = {
  CLIENT_ID,
  CLIENT_SECRET,
  REDDIT_USER,
  REDDIT_PASS,
  DISCORD_BOT_TOKEN,
  MODERATION_PERIOD,
  SLEEP_PERIOD,
};
