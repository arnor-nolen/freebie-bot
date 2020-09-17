import Snoowrap from "snoowrap";
import Discord from "discord.js";
import {
  DISCORD_BOT_TOKEN,
  CLIENT_ID,
  CLIENT_SECRET,
  REDDIT_PASS,
  REDDIT_USER,
} from "./settings";

const scrapeSubreddit = async () => {
  const r = new Snoowrap({
    userAgent: "freebie-bot",
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    username: REDDIT_USER,
    password: REDDIT_PASS,
  });

  const subreddit = await r.getSubreddit("GameDeals");
  const topPosts = await subreddit.getHot({ limit: 25 });

  let data = [];

  topPosts.forEach((post) => {
    data.push({
      link: post.url,
      text: post.title,
      score: post.score,
    });
  });

  const filter = /free/i;

  return data.filter((x) => filter.test(x.text));
};

const sendToDiscord = (data) => {
  const client = new Discord.Client();

  client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);

    // Get all guilds
    const guilds = cilent.guilds;
    guilds.forEach((x) => {
      // Find channel named freebie-bot
      const channel = guild.channels.cache.find(
        (channel) => channel.name === "freebie-bot"
      );

      // Post the data
      data.forEach((x) => {
        channel.send(
          x.text + "\nReddit score: " + x.score + "\n<" + x.link + ">"
        );
      });
    });
  });

  client.on("message", (msg) => {
    if (msg.content === "ping") {
      msg.reply("pong");
    }
  });

  client.login(DISCORD_BOT_TOKEN).then();
};

scrapeSubreddit().then(sendToDiscord);
