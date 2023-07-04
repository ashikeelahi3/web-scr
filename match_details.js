const fs = require("fs");
const { matchFullDetails } = require("./custom_functions/match_full_details");


const jsonData = fs.readFileSync("./data/allData.json");
const allMatchList = JSON.parse(jsonData);

fs.writeFileSync("./data/allMatchDetails.json", JSON.stringify([], null, 2));

allMatchList.forEach((match, index) => {
  setTimeout(() => {
    if(match.winnerTeam != "no result") {
      matchFullDetails(match);
    }
  }, index * 150);
});

