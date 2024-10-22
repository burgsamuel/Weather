// Header varibles
const timeSpan = document.getElementById('time-span');
const dateSpan = document.getElementById('date-span');
const locationSpan = document.getElementById('location-span');
const stationSpan = document.getElementById('station-id-span');

// Body Variables
const tempSpan = document.getElementById('tempSpan');
const humiditySpan = document.getElementById('humiditySpan');
const pressureSpan = document.getElementById('pressureSpan');
const raintotalSpan = document.getElementById('raintotalSpan');
const windspeedSpan = document.getElementById('windspeedSpan');
const winddirSpan = document.getElementById('winddirSpan');


collectTempData();
collectPressureData();
dataFetch()
setInterval(() => {
    dataFetch()
    collectTempData();
    collectPressureData();
}, 600000)


async function dataFetch() {
    const response = await fetch('/weather');
    const responsedata = await response.json();    
    const dateTime = responsedata[1].split(' ');
    
    // header update
    timeSpan.innerText = dateTime[1];
    dateSpan.innerText = dateTime[0];
    locationSpan.innerText = responsedata[2];
    stationSpan.innerText = responsedata[0];

    // body update
    tempSpan.innerText = responsedata[7];
    humiditySpan.innerText = responsedata[6];
    pressureSpan.innerText = responsedata[12];
    raintotalSpan.innerText = responsedata[14];
    windspeedSpan.innerText = responsedata[11];
    winddirSpan.innerText = responsedata[6];
}



const ctx = document.getElementById('myChart');
ctx.height = 150;

let tempLabels = [];

const dataTemp = {
    labels: tempLabels,
    datasets: [{
        label: 'Temperature',
        borderWidth: 2,
        color: 'white',
        borderColor: 'lightblue',
        backgroundColor: 'rgba(0,0,0,0)',
        pointRadius: 0,
        lineTension: .4,
        data: [],
    }]
}


const tempconfig = {
    type: 'line',
    data: dataTemp,
    options: {
        scales: {
            x: {
                display:false, //Removes grid Lines
                ticks: {
                    display: false // removes a labels
                }
            },
        y: {
            // beginAtZero: true,
            // display: false,
        }
        }
    }
};


const tempchart = new Chart(ctx, tempconfig);


async function collectTempData() {
    let response = await fetch('/tempChart');
    let data = await response.json();
    
    tempLabels = [];
    let tempData = [];

    for (let i = 0; i < data.length; i++) {
        tempLabels.unshift(data[i][0]);
        tempData.unshift(parseFloat(data[i][1]))
    }

    tempchart.data.labels = tempLabels;
    tempchart.data.datasets.forEach((dataset) => {
        dataset.data = data;
    });

    tempchart.update();
}




const ctx1 = document.getElementById('myChart1');
ctx1.height = 150;

let pressureLabels = [];

const datapressure = {
    labels: pressureLabels,
    datasets: [{
        label: 'Pressure',
        borderWidth: 2,
        color: 'white',
        borderColor: 'lightblue',
        backgroundColor: 'rgba(0,0,0,0)',
        pointRadius: 0,
        lineTension: .4,
        data: [],
    }]
}


const pressureconfig = {
    type: 'line',
    data: datapressure,
    options: {
        scales: {
            x: {
                display:false, //Removes grid Lines
                ticks: {
                    display: false // removes a labels
                }
            },
        y: {
            // beginAtZero: true,
            // display: false,
        }
        }
    }
};

const pressurechart = new Chart(ctx1, pressureconfig);


async function collectPressureData() {
    let response = await fetch('/pressureChart');
    let data = await response.json();

    pressureLabels = [];
    let newData = [];

    for (let i = 0; i < data.length; i++) {
        pressureLabels.unshift(data[i][0]);
        newData.unshift(parseFloat(data[i][1]))
    }

    pressurechart.data.labels = pressureLabels;
    pressurechart.data.datasets.forEach((dataset) => {
        dataset.data = data;
    });

    pressurechart.update();

}


