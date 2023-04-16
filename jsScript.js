
document.addEventListener("DOMContentLoaded", function() {
    // Update Graph on page loading
    parseJSON(2010).then(graphData => {
        graphUpdate(myChart, graphData)
    })
    })

 document.getElementById("FY1-button").onclick=async ()=>{
    document.getElementById('grade-btn-dropwdown').innerHTML = "FY1";
    // Update Graph on button pressed
    parseJSON(2007, 'FY1').then(graphData => {
        graphUpdate(myChart, graphData)
    })
    
    
}

document.getElementById("FY2-button").onclick=async ()=>{
    document.getElementById('grade-btn-dropwdown').innerHTML = "FY2";
    // Update Graph on button pressed
    parseJSON(2007, 'FY2').then(graphData => {
        graphUpdate(myChart, graphData)
    })
    
    
}
document.getElementById("ST1-button").onclick=async ()=>{
    document.getElementById('grade-btn-dropwdown').innerHTML = "S/CT1";
    // Update Graph on button pressed
    parseJSON(2007, 'ST1').then(graphData => {
        graphUpdate(myChart, graphData)
    })
    
    
}
    
async function fetchJSON(name) {
    let url = `../assets/data/${name}.json`;
    const response = await fetch(url)
    const jsonData = await response.json()
    return jsonData
    }

async function parseJSON(startingYear, grade) {
    let rpiData = []
    let cpihData = []
    let jnrDocPayData = []
    let mpPayData = []


    let jsonDataRpi = await fetchJSON('rpi')
    let jsonDatacCpih = await fetchJSON('cpih')
    let jsonDataJnrDoctorPay = await fetchJSON('englandDoctorPay')
    let jsonDataMpPay = await fetchJSON('mpPay')
    //RPI
    for (const iterator of jsonDataRpi) {
        let startingValue = (jsonDataRpi.length) - (2022- startingYear)
            // let rebased = (100 / jsonDataRpi[startingValue].value) * iterator.value
            rpiData.push({x: iterator.date, y: iterator.value});
        
        
        }
    // CPIH
    for (const iterator of jsonDatacCpih) {
        let startingValue = (jsonDatacCpih.length) - (2022- startingYear)

            // let rebased = (100 / jsonDatacCpih[startingValue].value) * iterator.value
            cpihData.push({x: iterator.date, y: iterator.value});
        
        }   
    // Jnr Doc
    for (const iterator of jsonDataJnrDoctorPay) {
        
            // let rebased = (100 / jsonDataJnrDoctorPay[0][grade]) * iterator[grade]
            jnrDocPayData.push({x: String(iterator.Date), y: iterator[grade]});
        
    }
    // MP Pay
    for (const iterator of jsonDataMpPay) {
        let startingValue = (jsonDataMpPay.length) - (2022- startingYear)

            // let rebased = (100 / jsonDataMpPay[startingValue].pay) * iterator.pay
            mpPayData.push({x: iterator.date, y: iterator.pay});
        
    }

    return {
        'rpi': rpiData,
        'cpih': cpihData,
        'jnrDocPay': jnrDocPayData,
        'mpPay' : mpPayData,
    }
}

// Charts.js setup
// Labels
const labels = [
];

// Datasets
const data = {
    labels: labels,
    datasets: [{
        label: 'RPI Index',
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        data: [],
    }, 
    {
        label: 'CPIH Index',
        backgroundColor: '9BD0F5',
        borderColor: '9BD0F5',
        data: [],
    }, 
    {
        label: 'Junior Doctor Pay',
        backgroundColor: '08a441',
        borderColor: '08a441',
        data: [],
    },
    {
        label: 'MP Pay',
        backgroundColor: '8719E2',
        borderColor: '8719E2',
        data: [],
    }
]
};
// Config
const config = {
    type: 'line',
    data, 
    options: {}
};
// Render
const myChart = new Chart(
    document.getElementById('payChart'),
    config
);

// Updae function
function graphUpdate(chart, parsedData) {
    index = 0 
    dataOptions = ['rpi', 'cpih', 'jnrDocPay', 'mpPay']
    chart.data.datasets.forEach(dataset => {
        console.log(dataset)
        console.log(dataOptions[index])
        dataset.data = parsedData[dataOptions[index]]
        index ++
        
    });
    chart.options.maintainAspectRatio = false;
    chart.options.response = true;
    chart.update();
}




