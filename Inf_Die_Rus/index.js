require("dotenv").config();

const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) => ctx.reply("Suka bljat"));
bot.help((ctx) => ctx.reply("Send me a sticker"));
bot.on("sticker", (ctx) => ctx.reply("👍"));
bot.hears("hi", (ctx) => ctx.reply("Hey there"));

bot.hears("all", (ctx) => ctx.reply(getAllStats()));

let resultFetch = {};
let keyStats = {
  Tank: "tanks",
  armoured_fighting_vehicles: "armoured_fighting_vehicles",
};

Object.entries(keyStats).forEach(([key, value]) => {
  bot.hears(key, (ctx) => ctx.reply(getOneStats(value)));
});

fetch("https://russianwarship.rip/api/v1/statistics/latest")
  .then((response) => response.json())
  .then((response) => (resultFetch = response));

function getAllStats() {
  let allRusTun = "";
  const stats = resultFetch.data.stats;
  const increase = resultFetch.data.increase;
  Object.entries(stats).forEach(([key, value]) => {
    allRusTun += `${key}: ${value}(+${increase[key]})\n`;
  });
  return allRusTun;
}

function getOneStats(key) {
  const stats = resultFetch.data.stats;
  const increase = resultFetch.data.increase;
  return `${key}: ${stats[key]}(+${increase[key]})`;
}

bot.launch();
// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
