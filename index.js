import dotenv from "dotenv";
import Snoowrap from "snoowrap";
import Discord from "discord.js";

dotenv.config();

const scrapeSubreddit = async () => {
  const r = new Snoowrap({
    userAgent: "freebie-bot",
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    username: process.env.REDDIT_USER,
    password: process.env.REDDIT_PASS,
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

  data = data.filter((x) => filter.test(x.text));

  return data;
};

scrapeSubreddit().then((data) => {
  console.log(data);
  const client = new Discord.Client();

  client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
    const channel = client.channels.cache.get("755888395326324737");

    data.forEach((x) => {
      channel.send(
        x.text + "\nReddit score: " + x.score + "\n<" + x.link + ">"
      );
    });
  });

  client.on("message", (msg) => {
    if (msg.content === "ping") {
      msg.reply("pong");
    }
  });

  client.login(process.env.DISCORD_BOT_TOKEN).then(() => {});
});
