#!/usr/bin/env node

const chalk = require("chalk");
const boxen = require("boxen");
var yahooFinance = require('yahoo-finance');
var _ = require('lodash');
const yargs = require("yargs");

const boxenOptions = {
 padding: 1,
 margin: 1,
 bold: true,
 borderStyle: "doubleSingle",
 borderColor: "green",
 backgroundColor: "#555555"
};

const options = yargs
 .usage("Usage: -s <symbol1 symbol2>")
 .option("s", { alias: "symbols", describe: "Your symbols", type: "array", demandOption: true })
 .argv;

const symbols = options.symbols;

yahooFinance.quote({
  symbols: symbols,
  modules: [ 'price' ]
}, function (err, quotes) {
  if (err) { console.log('Error while doing request, check your params') }
  let data = new Array();
  _.each(quotes, function (quote, symbol) {
    if (quote.price.regularMarketPrice) {
      const greeting = `${chalk.white.bold.underline(symbol)}: ${chalk.white.bold(quote.price.regularMarketPrice)} ${(quote.price.regularMarketChange).toFixed(2)} (${(quote.price.regularMarketChangePercent * 100).toFixed(2)}%)`;
      if (greeting) {
        data.push(greeting);
      }
    }
  });
  const msgBox = boxen(data.join('\n'), boxenOptions);
  console.log(msgBox);
});

