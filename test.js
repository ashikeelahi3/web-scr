const { matchFullDetails } = require("./custom_functions/match_full_details")

let data = {
  odiId: "4498",
  team1: "Nepal",
  team2: "Scotland",
  winnerTeam: "Scotland",
  matchDate: "Dec 8, 2022",
  matchURL: "https://www.espncricinfo.com/series/world-cup-league-2-2019-2023-1196667/nepal-vs-scotland-120th-match-1341980/full-scorecard"
}


matchFullDetails(data)