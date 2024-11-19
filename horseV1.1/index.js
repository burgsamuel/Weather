



const totalTips = document.getElementById('total-tips') 
const menuDiv = document.getElementById('menu-div');
const headingTitle = document.getElementById('heading-title');
const parentelement = document.getElementById('main-data-div');
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


function updateHeaderTime(data) {
    // Data is sent from server includes the time the the stats where updated.
    const timeElement = document.getElementById('time-update-span');
    timeElement.innerText = '';

    const timeIn = parseInt(data[0].timeStored);
    const timeSet = new Date(timeIn * 1000);
    timeElement.innerText = `${timeSet.toLocaleString()}`;
}




function createMainDivs(data) {

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

        const raceClass = document.createElement('p');
        raceClass.className = 'race-prize-class';
        if (data[i].raceDetails) {
            raceClass.innerText = data[i].raceDetails.prizeMoney;
        }
        raceNameDiv.appendChild(raceClass);

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

        const trackLength = document.createElement('p');
        trackLength.className = 'track-length-class';
        if (data[i].raceDetails) {
            trackLength.innerText = data[i].raceDetails.raceLength;
        }
        conditionsDiv.appendChild(trackLength);

        const trackCondition = document.createElement('p');
        trackCondition.className = 'track-condition-p';
        trackCondition.innerText = `${data[i].conditions.condition}`;
        conditionsDiv.appendChild(trackCondition);

        const trackWeather = document.createElement('p');
        trackWeather.className = 'track-weather-p';
        trackWeather.innerText = data[i].conditions.weather;
        conditionsDiv.appendChild(trackWeather);

        const trackTemp = document.createElement('p');
        trackTemp.className = 'track-temp-p';
        trackTemp.innerText = `${data[i].conditions.temp}°C`;
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

        // Odds 
        const horseOdds = document.createElement('p');
        horseOdds.className = 'horse-odds-class';
        if (data[i].raceDetails){
            horseOdds.innerText = `${data[i].raceDetails.odds}`;
        } else {
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
            jockeyWeight.innerText = `${data[i].raceDetails.jockeyWeight}`;
        }
        scoreDiv.appendChild(jockeyWeight);


        // Score Given
        const scoreElement = document.createElement('p');
        scoreElement.className = 'score-class'
        scoreElement.innerText = `Score: ${data[i].score}`;

        switch (true) {
            case currentTime > raceTime:
                InnerDivElement.style.opacity = '.7';
                if (ranDivState === false) {
                    InnerDivElement.style.display = 'none';
                    document.getElementById('already-ran-button').innerText = '🐎 Show  Already  Raced';
                } else {
                    InnerDivElement.style.display = 'flex';
                    document.getElementById('already-ran-button').innerText = '🐎 Hide  Already  Raced';
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
                break;

                case data[i].score > 0 && data[i].score <= 10:
            InnerDivElement.style.backgroundColor = '#b6e2eb';
            InnerDivElement.style.color = 'black';  
                break;

            default:
            InnerDivElement.style.display = 'none';
        
        }

        scoreDiv.appendChild(scoreElement);


        // Race position 
        const raceDiv = document.createElement('div');
        raceDiv.className = 'race-position';
        const racePositionP = document.createElement('p');
        racePositionP.className = 'race-position-p'
        racePositionP.innerText = `Finish Position: ${data[i].finishPosition}`;
        if (parseInt(data[i].finishPosition) <= 3) {
            racePositionP.style.color = 'yellow';
            InnerDivElement.style.backgroundColor = 'darkgreen';
        } else {
            racePositionP.style.color = 'grey';
        }
        InnerDivElement.appendChild(raceDiv);
        raceDiv.appendChild(racePositionP);

    }


}




let menuExpandstate = false;
const instructions = document.createElement('p');
instructions.className = 'instructions-p';
instructions.innerText = ' Welcome to our daily tips';
instructions.style.display = 'none';


function menuExpand () {
    if (!menuExpandstate) {
        menuDiv.style.height = '700px';
        headingTitle.style.display = 'none';
        instructions.style.display = 'flex';
        menuDiv.appendChild(instructions);
        menuExpandstate = true;
    }
    else {
        menuDiv.style.height = '45px';
        headingTitle.style.display = 'flex';
        instructions.style.display = 'none';
        menuExpandstate = false;
    }

}

const intructions = document.createElement('div');
intructions.className = 'instructions-p';
instructions.innerHTML = '<h3>Welcome to our daily tips</h3> <p>Start sorting by <strong>race, score, or track. </strong></p><p>You will notice there is a score in the bottom right hand side on each tile.</p>';
instructions.innerHTML += '<p>For the best chance look for the lowest <br>🏇 SCORE 🏇<br> The tiles are also colour coded depending on score.<br> <i>lighter colours as the score gets lower.</i></p>';
instructions.innerHTML += '<h3>👍 The lower the score the better 👌</h3>';
instructions.innerHTML += '<p>As races are completed they will drop off the list. To see races already completed today click the "Show Already Raced" button.</p>';
instructions.innerHTML += '<p>Do not forget to click on a tile to see that races current track conditions and weather.</p>';


async function regularUpdate () {
// used to update data every x mins
let updatedata = await data;
parentelement.innerText = '';
createMainDivs(updatedata);
}


setInterval(() => {
    regularUpdate();
},300000);

let workingData = collectdata();
while (!workingData) {
    setInterval(() => {
        workingData = collectdata;
    }, 500);
}
