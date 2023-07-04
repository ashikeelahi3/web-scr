const cheerio = require('cheerio')
const axios = require('axios')
const fs = require('fs')




async function matchFullDetails (match) {
  try {
    const response = await axios.get(match.matchURL)
    const $ = cheerio.load(response.data)
    const teams = $('.ds-text-title-xs > .ds-text-title-xs');
    const teamsArr = []
    teams.each((index, element) => teamsArr.push($(element).text()))  // Find which team bat first
    


    let mainCountry = nameChange(match.team1),
    hostCountry,
    opponentCountry = nameChange(match.team2),
    winnerTeam = nameChange(match.winnerTeam),
    odiMatchDate = match.matchDate,
    nameOfStadium,
    matchResult = Number(winnerTeam == mainCountry),
    tossResult,
    nameOfCaptain,
    nameOfOppCaptain,
    URL = match.matchURL,
    odiId = match.odiId



    const dsBlock = $(".ds-block"); 
    const captainList = []
    dsBlock.each((index, element) => {
      let dsText = $(element).text();
      if(dsText.indexOf("(c)") != -1) {           // find (c)
        captainList.push(dsText.split("(c)")[0].trim())
      }
      if(dsText.indexOf("tour") != -1) {           // find (tour)
        hostCountry = dsText.split('tour of')[1].trim()
      }
    })
    
    const dsFont = $(".ds-font-regular")
    dsFont.each((index, element) => {
      let dsText = $(element).text();
      // console.log(dsText)
      if(dsText.indexOf("elected") != -1) {
        if(dsText.indexOf(mainCountry) != -1) {
          tossResult = 1
        } else {
          tossResult = 0
        }
      }
    })

    let groundURL;
    const dsMinWMax = $(".ds-min-w-max")
    dsMinWMax.each((index, element) => {
      let a =  $(element).find("a");
      let url = a.attr("href")
      let urlText = url + ''; // converting into string
      if(urlText.indexOf("ground") != -1) {
        groundURL = url
        // console.log(groundURL)
        nameOfStadium = a.text()
      }
    })
    
    if(hostCountry == undefined) {
      async function hostCountryFinder(URL) {
        try {
          const response = await axios.get(URL)
          const $ = cheerio.load(response.data)
          const teams = $('.loc');
          teams.each((index, element) => {
            hostCountry = $(element).text().split(', ')[1]
            // console.log(hostCountry)
          })
        } catch (error) {
          console.error(error)
        }
      }

      await hostCountryFinder(groundURL)
    }
    

    function nameChange(shotName) {
      if(shotName.indexOf('.') != -1) {
        let team1 = teamsArr[0].split(' ');
        let team2 = teamsArr[1].split(' ');

        let shortTeam1 = [], shortTeam2 = [];

        team1.forEach(element => shortTeam1.push(element[0]))
        team2.forEach(element => shortTeam2.push(element[0]))

        let short1 = shortTeam1.join('.')
        let short2 = shortTeam2.join('.')

        if(shotName.indexOf(short1) == 0) {
          return teamsArr[0]
        } else {
          return teamsArr[1]
        }

      } else {
        return shotName;
      }
    }

    nameChange(opponentCountry)

    if(teamsArr[0] == mainCountry) {
      nameOfCaptain = captainList[0];
      nameOfOppCaptain = captainList[1]
    } else {
      nameOfCaptain = captainList[1];
      nameOfOppCaptain = captainList[0]
    }
    

    // console.log({odiId, odiMatchDate, mainCountry, tossResult, nameOfCaptain, hostCountry, nameOfStadium, opponentCountry, nameOfOppCaptain, matchResult, URL})


    // data to JSON
    const jsonData = fs.readFileSync('./data/allMatchDetails.json', 'utf-8')
    const existingData = JSON.parse(jsonData)
    existingData.push({odiId, odiMatchDate, mainCountry, tossResult, nameOfCaptain, hostCountry, nameOfStadium, opponentCountry, nameOfOppCaptain, matchResult, URL})
    fs.writeFileSync('./data/allMatchDetails.json', JSON.stringify(existingData, null, 2));

  } catch (error) {
    console.error(error)
  }

}

module.exports = {matchFullDetails}