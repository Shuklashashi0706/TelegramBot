import { Bot } from "grammy";
import { InlineKeyboard } from "grammy";
import { webhookCallback } from "grammy";
import express from "express";
// Create a bot using the Telegram token
const bot = new Bot(process.env.TELEGRAM_TOKEN || "");
const aboutUrlKeyboard = new InlineKeyboard().url(
   "Host your own bot for free.",
   "https://cyclic.sh/"
);

const introductionMessage = `Hello! I'm a Telegram bot.
I'm powered by Cyclic, the next-generation serverless computing platform.
<b>Commands</b>
/yo - Be greeted by me
/effect [text] - Show a keyboard to apply text effects to [text]`;
const replyWithIntro = (ctx: any) =>
   ctx.reply(introductionMessage, {
      reply_markup: aboutUrlKeyboard,
      parse_mode: "HTML",
   });

bot.command("start", replyWithIntro);

bot.command("yo", (ctx) => ctx.reply(`Yo ${ctx.from?.username}`));

bot.api.setMyCommands([
   { command: "yo", description: "Be greeted by the bot" },
   {
      command: "effect",
      description: "Apply text effects on the text. (usage: /effect [text])",
   },
]);

bot.on("message", replyWithIntro);

if (process.env.NODE_ENV === "production") {
   // Use Webhooks for the production server
   const app = express();
   app.use(express.json());
   app.use(webhookCallback(bot, "express"));

   const PORT = process.env.PORT || 3000;
   app.listen(PORT, () => {
      console.log(`Bot listening on port ${PORT}`);
   });
} else {
   // Use Long Polling for development
   bot.start();
}
