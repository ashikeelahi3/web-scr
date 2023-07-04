const fs = require('fs')
const j2cp = require("json2csv").Parser;
const parser = new j2cp()

let jsonData = fs.readFileSync('./data/allData.json', 'utf-8')
const matchList = JSON.parse(jsonData)

jsonData = fs.readFileSync('./data/allMatchDetails.json', 'utf-8')
const matchFullList = JSON.parse(jsonData)

matchList.sort((a, b) => b.odiId - a.odiId);
fs.writeFileSync('./data/allData.json', JSON.stringify(matchList, null, 2));

matchFullList.sort((a, b) => b.odiId - a.odiId)
fs.writeFileSync('./data/allMatchDetails.json', JSON.stringify(matchFullList, null, 2))
fs.writeFileSync(`./data/allData.csv`, parser.parse(matchFullList))

