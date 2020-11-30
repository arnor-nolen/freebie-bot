# Freebie bot

Discord bot for posting information about free games from reddit posts.

Bot requires following permissions:

- Read messages
- Send messages
- Read message history

## Using the bot

1. Create a text channel named `freebie-bot`.
2. Add the bot to your server using [this link](https://discord.com/oauth2/authorize?client_id=755888875171217589&permissions=68608&scope=bot) (it has all the required privileges).
3. Make sure bot has the rights to read and write to this channel.

Now the bot will start sending messages about freebies from [/r/GameDeals](https://www.reddit.com/r/GameDeals/).

P.S. You can get the same instructions by sending `!setup` to the bot's PM.

## Rationale for manually creating a channel

In order for bot to be able to create channels, you have to allow him to **modify channels**. Some people (including myself) find it suspicious to provide such permissions, thus I decided that it's better if you create the channel yourself.

## Running your own copy

If for any reason you don't want to use my copy of the bot, you can host it yourself from the source code or using pre-built docker images from the [Docker Hub](https://hub.docker.com/r/arnornolen/freebie-bot/tags?page=1&ordering=last_updated). Please, always use the latest version!

### Instructions for self hosting

When setting up the bot from source or using docker image, you have to provide necessary environment variables, listed in the [settings file](./settings.js).
