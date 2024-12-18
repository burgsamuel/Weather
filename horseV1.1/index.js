




const totalTips = document.getElementById('total-tips') 
const menuDiv = document.getElementById('menu-div');
const headingTitle = document.getElementById('heading-title');
const parentelement = document.getElementById('main-data-div');
const totalTipsSpan = document.getElementById('Total-horse-span');
const alreadyRacedSpan = document.getElementById('alreadyRaced-span');
parentelement.innerHTML = "";

let ranDivState = false;


async function showCompletedRaces () {

    // Function for button to hide or show completed races
    let updatedata = await data;

    if (ranDivState === true) {   
        ranDivState = false;
    } else {
        ranDivState = true;
    }
    parentelement.innerText = '';
    createMainDivs(updatedata);
}



//////////////////////////////////////////////////////////////////////////
//////                  Data fetching Functions                     //////
////////////////////////////////////////////////////////////////////////// 

    
async function collectdata () {

    // calls api for the data and sorts into race time 

    response = await fetch('/horsedata');
    data = await response.json();

    workingData = await data;
    
    try{
        data = data[0].sort((a, b) => a.raceTime - b.raceTime)
    }
    catch (e) {
        console.log(e)
        workingData = collectdata()
    }

    updateHeaderTime(data);
    createMainDivs(data);
    
    return data;
}



//////////////////////////////////////////////////////////////////////////
//////                   Data Sorting Functions                     //////
////////////////////////////////////////////////////////////////////////// 


async function sortByRace () {
    // this function sorts the data by actual race time 
    data = await workingData;
    data = data[0].sort((a, b) => a.raceTime - b.raceTime)
    parentelement.innerText = '';
    createMainDivs(data);

}


async function sortByScore () {
    // this function sorts the data by Score
    data = await workingData;
    data = data[0].sort((a, b) => a.score - b.score)
    parentelement.innerText = '';
    createMainDivs(data);

}


async function sortByTrack () {
    // this function sorts the data by race location
    data = await workingData;
    
    data = data[0].sort((a, b) => {
    const nameA = a.race.toUpperCase();
    const nameB = b.race.toUpperCase();
    if (nameA < nameB) {
        return -1;
    }
    if (nameA > nameB) {
        return 1;
    }
    return 0;
        });

    parentelement.innerText = '';
    createMainDivs(data);

}



//////////////////////////////////////////////////////////////////////////
//////                  Updating time main page                     //////
////////////////////////////////////////////////////////////////////////// 

function updateHeaderTime(data) {
    // Data is sent from server includes the time the the stats where updated.
    const timeElement = document.getElementById('time-update-span');
    timeElement.innerText = '';

    const timeIn = parseInt(data[0].timeStored);
    const timeSet = new Date(timeIn * 1000);
    timeElement.innerText = `${timeSet.toLocaleString()}`;
}




//////////////////////////////////////////////////////////////////////////
//////                  Build elements onto page                    //////
////////////////////////////////////////////////////////////////////////// 


function createMainDivs(data) {

    let alreadyRaced = 0;
    let totalTips = data.length;
    let totalScratched = 0;

    // Loop over data that has been split, and extract each piece to add to div
    for (let i = 0; i< data.length; i++) {
    
       // Create seperate divs for each element
        const InnerDivElement = document.createElement('div');
        InnerDivElement.className = 'inner-div';
        InnerDivElement.onclick = () => {
            if (conditionsDiv.style.display == 'none'){
                conditionsDiv.style.display = 'flex';
            } else {
                conditionsDiv.style.display = 'none'
            }

        };

        // Update total horses
        // totalTips.innerText = ` ${length.data} horses`;

        parentelement.appendChild(InnerDivElement); 

        // Set header div up for race number and time
        const raceNameDiv = document.createElement('div');
        raceNameDiv.className = 'raceNameDiv';
        InnerDivElement.appendChild(raceNameDiv);

        // Race Location and Number
        const raceElement = document.createElement('p');
        raceElement.className = 'race-name-class';
        raceElement.innerText = data[i].race;
        raceNameDiv.appendChild(raceElement);

        const gateNumber = document.createElement('p');
        gateNumber.className = 'gate-class';
        if (data[i].raceDetails) {
            gateNumber.innerText = data[i].raceDetails.gateNumber;
        }
        raceNameDiv.appendChild(gateNumber);

        // Time of the race
        const currentTime = new Date();

        const timeOfRace = document.createElement('p');
        timeOfRace.className = 'race-time';
        const raceTime = new Date(data[i].raceTime * 1000);
        let raceTimex = raceTime.toLocaleString([], {
            hour:"2-digit",
            minute:"2-digit",
            hour12: true
        });
        if (parseInt(raceTimex[0]) === 0) {
            timeOfRace.innerText = raceTimex.slice(1)
            raceNameDiv.append(timeOfRace);
               
        }
        else {
            timeOfRace.innerText = raceTimex
            raceNameDiv.append(timeOfRace);
        }

        // div for track and weather conditions

        const conditionsDiv = document.createElement('div');
        conditionsDiv.className = 'conditions-div';
        conditionsDiv.style.display = 'none';
        InnerDivElement.appendChild(conditionsDiv);

        const lastFinishes = document.createElement('p');
        lastFinishes.className = 'track-length-class';

        if (data[i].raceDetails) {
            lastFinishes.innerText = data[i].raceDetails.lastFinishes;
        }
        conditionsDiv.appendChild(lastFinishes);

        const trackCondition = document.createElement('p');
        trackCondition.className = 'track-condition-p';
        try {
            trackCondition.innerText = `${data[i].conditions.condition}`;
        }
        catch (e) {
            trackCondition.innerText = `-`;      
        }
        conditionsDiv.appendChild(trackCondition);

        const trackWeather = document.createElement('p');
        trackWeather.className = 'track-weather-p';
        try {
            trackWeather.innerText = data[i].conditions.weather;
        }
        catch (e) {
            trackWeather.innerText = '-';
        }
        conditionsDiv.appendChild(trackWeather);

        const trackTemp = document.createElement('p');
        trackTemp.className = 'track-temp-p';
        try{
            trackTemp.innerText = `${data[i].conditions.temp}°C`;
        }
        catch (e) {
            trackTemp.innerText = `-°C`;
        }
        conditionsDiv.appendChild(trackTemp);


        // Div Set up for trainer info
        const nameDivElement = document.createElement('div');
        nameDivElement.id = 'name-trainer-div'
        InnerDivElement.appendChild(nameDivElement);

        // Trainer name
        const trainerName = document.createElement('p');
        trainerName.className = 'trainer-name-class';
        trainerName.innerText = `T: ${data[i].trainerName}`;
        nameDivElement.appendChild(trainerName);

        // Horse Name
        const horseName = document.createElement('p');
        horseName.className = 'horse-name-class';
        horseName.innerText = `🏇 ${data[i].horse}`;
        nameDivElement.appendChild(horseName);


        //////////////////////////////////////////////////////////////////////////
        //////                  Adding Odds To Page                      //////
        ////////////////////////////////////////////////////////////////////////// 


        // Odds 
        const horseOdds = document.createElement('p');
        horseOdds.className = 'horse-odds-class';
        if (data[i].raceDetails){
            if (data[i].raceDetails.ABN) {
                totalScratched += 1;
                InnerDivElement.remove();
            } else {
                horseOdds.innerText = `W: $${data[i].raceDetails.winPrice} `;
                horseOdds.innerText += `P: $${data[i].raceDetails.placePrice}`;
            }
        } 
        else {
            horseOdds.innerText = `$ - `;
        }
        try {
            if (data[i].raceDetails.Scratched) {
                totalScratched += 1;
                InnerDivElement.remove();
            }
        } catch (error) {
            horseOdds.innerText = `$ - `;
        }

        nameDivElement.appendChild(horseOdds);


        // Trainer and Score Div
        const scoreDiv = document.createElement('div');
        scoreDiv.className = "score-div";
        InnerDivElement.appendChild(scoreDiv);

        // Jockey Colours as an image
        const jockeyBibImage = document.createElement('img');
        jockeyBibImage.className = 'bib-image-class';
        jockeyBibImage.src = data[i].bibLink;
        jockeyBibImage.alt = "Bib Image";
        scoreDiv.appendChild(jockeyBibImage);  

        // Jockey Name 
        const jockeyName = document.createElement('p');
        const jockeyWeight = document.createElement('p');
        jockeyName.className = 'jockey-name-class';
        jockeyWeight.className = 'jockey-weight-class';
        jockeyName.innerText = data[i].jockeyName;
        scoreDiv.appendChild(jockeyName);
        if(data[i].raceDetails){
            jockeyWeight.innerText = `${data[i].raceDetails.weight}`;
        }
        
        scoreDiv.appendChild(jockeyWeight);


        
        //////////////////////////////////////////////////////////////////////////
        //////                  Adding Results To Page                      //////
        ////////////////////////////////////////////////////////////////////////// 


        const raceDiv = document.createElement('div');
        raceDiv.className = 'race-position';
        const racePositionP = document.createElement('p');
        racePositionP.className = 'race-position-p'

        if (data[i].finishPosition == undefined){
            racePositionP.innerText = `-`;
        } else {
            racePositionP.innerText = `Finish Position: ${data[i].finishPosition}`;
        }

        if (currentTime < raceTime) {
            raceDiv.style.display = 'none'; // Hiding uncollected results
        }

        InnerDivElement.appendChild(raceDiv);
        raceDiv.appendChild(racePositionP);



        ///////////////////////////////////////////////////////////////////////////
        //////                  Scores added and colours                    //////
        ////////////////////////////////////////////////////////////////////////// 
        

        const scoreElement = document.createElement('p');
        scoreElement.className = 'score-class'
        scoreElement.innerText = `Score: ${data[i].score}`;

        switch (true) {
            case currentTime > raceTime:
                InnerDivElement.style.opacity = '.7';

                if (ranDivState === false) {
                    InnerDivElement.style.display = 'none';
                    alreadyRaced += 1;
                    document.getElementById('already-ran-button').innerText = `🐎 Show  Already  Raced - ${alreadyRaced}`;
                    
                } else {
                    InnerDivElement.style.display = 'flex';  
                    if (raceTime > currentTime) {
                        InnerDivElement.style.display = 'none';
                    }else {
                        raceDiv.style.display = 'flex';
                    }
                    document.getElementById('already-ran-button').innerText = `🐎 Hide  Already  Raced`;
                    alreadyRacedSpan.innerText = alreadyRaced;
                }

            case data[i].score > 50:
            InnerDivElement.style.backgroundColor = '#132b39';
            InnerDivElement.style.color = '#cdd9e3';
                break;
            
            case data[i].score > 25 && data[i].score <= 50:
            InnerDivElement.style.backgroundColor = '#275063';
            InnerDivElement.style.color = '#cdd9e3';  
                break;

            case data[i].score > 10 && data[i].score <= 25:
            InnerDivElement.style.backgroundColor = '#287592';
            InnerDivElement.style.color = '#cdd9e3';  
            horseOdds.style.color = 'lightgrey';
                break;

                case data[i].score > 0 && data[i].score <= 10:
            InnerDivElement.style.backgroundColor = '#b6e2eb';
            InnerDivElement.style.color = 'black';  
            horseOdds.style.color = 'black';
                break;

            default:
            InnerDivElement.style.display = 'none';
        
        }

        if (parseInt(data[i].finishPosition) == 1) {
            racePositionP.style.color = 'black';
            InnerDivElement.style.backgroundColor = '#FFE6A9';
            InnerDivElement.style.color = 'black';
            horseOdds.style.color = 'black';
        } 
        if (parseInt(data[i].finishPosition) > 1 && parseInt(data[i].finishPosition) <=3){
            racePositionP.style.color = 'white';
            InnerDivElement.style.backgroundColor = '#B1C29E';
            InnerDivElement.style.color = 'black';
            horseOdds.style.color = 'black';
        }

        scoreDiv.appendChild(scoreElement);

        try {
            if (data[i].raceDetails.ABN) {
                InnerDivElement.style.backgroundColor = 'black';
                InnerDivElement.style.opacity = '0.6';
            }
        }
        catch (error) {

        }
        alreadyRacedSpan.innerText = alreadyRaced;
        totalTipsSpan.innerText = totalTips - totalScratched;

    }


}




//////////////////////////////////////////////////////////////////////////
//////                Running Functions and updates                 //////
////////////////////////////////////////////////////////////////////////// 


async function regularUpdate () {
// used to update data every x mins
let updatedata = await data;
parentelement.innerText = '';
createMainDivs(updatedata);
}


setInterval(() => {
    regularUpdate();
},300000);


setInterval(() => {
    collectdata();
},600000);


collectdata();
