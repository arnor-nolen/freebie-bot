const Snoowrap = require("snoowrap");
const Discord = require("discord.js");
const {
  DISCORD_BOT_TOKEN,
  CLIENT_ID,
  CLIENT_SECRET,
  REDDIT_PASS,
  REDDIT_USER,
} = require("./settings");

console.log(`Using reddit user ${REDDIT_USER}.`);

// Initialize reddit client
const redditClient = new Snoowrap({
  userAgent: "freebie-bot",
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  username: REDDIT_USER,
  password: REDDIT_PASS,
});

// Initialize discord client
const discordClient = new Discord.Client();

/**
 * Main function to get new stuff
 */
const getNewFreebies = async () => {
  const lastTime = await getLastTime();
  const data = await scrapeSubreddit(lastTime);
  sendToDiscord(data);
  const dateTime = new Date();
  const dd = (dateTime.getDate() > 10 ? "" : "0") + dateTime.getDate();
  const month = dateTime.getMonth() + 1;
  const mm = (month > 10 ? "" : "0") + month;
  const dateTimeString = `${dateTime.getFullYear()}-${mm}-${dd} ${dateTime.getHours()}:${dateTime.getMinutes()}:${dateTime.getSeconds()}`;
  console.log(`[${dateTimeString}] Sent ${data.length} new items!`);
};

// Check that we're connected
discordClient.once("ready", async () => {
  console.log(`Logged in Discord as ${discordClient.user.tag}!`);
  getNewFreebies();
  setInterval(getNewFreebies, 1 * 60 * 1000);
});

// Discord PM functions
discordClient.on("message", (msg) => {
  if (msg.content === "ping") {
    msg.reply("pong");
  }
});

/**
 * Get the data from reddit
 */
const scrapeSubreddit = async (lastTime) => {
  const subreddit = await redditClient.getSubreddit("GameDeals");
  const newPosts = await subreddit.getNew({ limit: 50 });

  const filter = /free/i;

  // Filter rules: not visited and contains regexp
  let data = newPosts.filter((x) => {
    const postDate = new Date(x.created_utc * 1000);
    const isNewPost = lastTime ? postDate > lastTime : true;
    return isNewPost && filter.test(x.title);
  });
  data = data.map((x) => ({ link: x.url, text: x.title, score: x.score }));
  return data;
};

/**
 * Find all discord channels associated with bot
 *
 */
const findChannels = () => {
  // Get all guilds
  const guilds = discordClient.guilds.cache;
  let channels = [];
  guilds.forEach((x) => {
    // Find channel named freebie-bot
    const channel = x.channels.cache.find(
      (channel) => channel.name === "freebie-bot"
    );
    if (channel) {
      channels.push(channel);
    }
  });
  return channels;
};

/**
 * Send data to discord
 */
const sendToDiscord = (data) => {
  const channels = findChannels();

  // Post the data
  channels.forEach((channel) => {
    data.forEach((x) => {
      channel.send(
        x.text + "\nReddit score: " + x.score + "\n<" + x.link + ">"
      );
    });
  });
};

/**
 * Send data to discord
 */
const getLastTime = async () => {
  const channels = findChannels();
  let promises = channels.map((x) => {
    return x.messages.fetch({ limit: 1 });
  });
  return await Promise.all(promises).then((responses) => {
    const dates = responses.reduce((acc, x) => {
      if (x) {
        x.forEach((d) => acc.push(d.createdAt));
      }
      return acc;
    }, []);
    // Find lastDate
    if (dates.length == 0) {
      return null;
    }
    return new Date(Math.max(...dates));
  });
};

discordClient.login(DISCORD_BOT_TOKEN);
