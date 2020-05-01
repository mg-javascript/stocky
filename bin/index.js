#!/usr/bin/env node

const boxen = require("boxen");
const chalk = require("chalk");
const yargs = require("yargs");
const text_wrapper_lib = require('text-wrapper');
const wrapper = text_wrapper_lib.wrapper;
var yahooFinance = require('yahoo-finance');
var _ = require('lodash');

const colors = ['red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white', 'gray']

const selColor = colors[Math.floor(Math.random() * colors.length)];


const options = yargs
 .usage("Usage: -s <symbol1 symbol2>")
 .option("s", { alias: "symbols", describe: "Your symbols", type: "array", demandOption: true })
 .option("c", { alias: "color", describe: "Border color", type: "string", demandOption: false })
 .option("i", { alias: "info", describe: "Company info", type: "boolean", demandOption: false })
 .argv;

const symbols = options.symbols;
const argsColor = options.color;
const showInfo = options.info;

const symbolsBoxenOptions = {
  padding: 1,
  margin: 1,
  bold: true,
  borderStyle: "doubleSingle",
  borderColor: argsColor ? argsColor : selColor
};

const infoBoxenOtions = {
  padding: 1,
  margin: 1,
  bold: false,
  borderStyle: "classic",
  borderColor: argsColor ? argsColor : selColor
};

yahooFinance.quote({
  symbols: symbols,
  modules: [ 'price', 'summaryProfile' ]
}, function (err, quotes) {
  if (err) { console.log('Error while doing request, check your params') }
  let data = new Array();
  let info = new Array();
  _.each(quotes, function (quote, symbol) {
    if (quote.price.regularMarketPrice) {
      const greeting = `${chalk.white.bold.underline(symbol)}: ${chalk.white.bold(quote.price.regularMarketPrice)} ${(quote.price.regularMarketChange).toFixed(2)} (${(quote.price.regularMarketChangePercent * 100).toFixed(2)}%)`;
      const companyInfo = `${chalk.white.bold.underline(symbol)}: ${quote.summaryProfile.longBusinessSummary}`;
      if (greeting) {
        data.push(greeting);
      }
      if (showInfo && companyInfo) {
        info.push(companyInfo);
        info.push('\n\n');
      }
    }
  });

  const symbolsBox = boxen(data.join('\n'), symbolsBoxenOptions);
  
  console.log(symbolsBox);

  if(showInfo) {
    const infoBox = boxen(wrapper(info.join('\n')), infoBoxenOtions);
    console.log(infoBox);
  }

});

