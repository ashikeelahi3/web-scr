const cheerio = require("cheerio");
const axios = require("axios");
const fs = require("fs");

const yearlyMatchLink = (year) => `https://www.espncricinfo.com/records/year/team-match-results/${year}-${year}/one-day-internationals-2`;

async function collectDataYearly(URL){
  try {
    const response = await axios.get(URL);
    const $ = cheerio.load(response.data);
    const rows = $("tbody tr");        // main table 
    rows.each((index, element) => {
      let aLLText = $(element).find("td"); // row
      
      let odiId, team1, team2, winnerTeam, matchDate, matchURL;
      aLLText.each((index, element) => {
        switch (index) {
          case 0:
            team1 = $(element).find("span > a > span").text();
            break;
          case 1:
            team2 = $(element).find("span > a > span").text();
            break;
          case 2:
            winnerTeam = $(element).find("span").text();
            break;
          case 5:
            matchDate = $(element).find("span").text();
            break;
          case 6:
            let a =  $(element).find("a");
            odiId = a.text().split("#")[1].trim();
            let url = a.attr("href");
            matchURL = `https://www.espncricinfo.com${url}`;
            break;
          }
        });

        // data to JSON
        const jsonData = fs.readFileSync('./data/allData.json', 'utf-8')
        const existingData = JSON.parse(jsonData)
        existingData.push({odiId, team1, team2, winnerTeam, matchDate, matchURL})
        fs.writeFileSync('./data/allData.json', JSON.stringify(existingData, null, 2));
        
    })
  } catch (error) {
    console.error(error);
  }
}



module.exports = {yearlyMatchLink, collectDataYearly}