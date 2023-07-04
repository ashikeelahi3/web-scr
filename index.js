const cheerio = require("cheerio");
const axios = require('axios')
const fs = require('fs')
const j2cp = require("json2csv").Parser;
const parser = new j2cp()
const { yearlyMatchLink, collectDataYearly } = require('./custom_functions/yearly_data');

fs.writeFileSync("./data/allData.json", JSON.stringify([], null, 2));



for(let year = 2022; year >= 2000; year--) {
  let URL = yearlyMatchLink(year)
  collectDataYearly(URL);
}