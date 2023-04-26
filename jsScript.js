import { payNewContract } from "./jsDoctorContract"

let grade = 'FY1'


// Initial Load
document.addEventListener("DOMContentLoaded", function() {
    // Update Graph on page loading
    parseJSON(grade).then(graphData => {
        graphUpdate(myChart, graphData)
    })
    })

// Doctor Selector Form
let doctorSelector = document.forms['doctor-grade-form'].grade
doctorSelector.onchange = function() {
    grade = this.value
    parseJSON(grade).then(graphData => {
        graphUpdate(myChart, graphData)
        console.log(payNewContract(graphData.jnrDocPay, 2018, grade, 44, false, 12))
    })
}
    
async function fetchJSON(name) {
    let url = `../assets/data/${name}.json`;
    const response = await fetch(url)
    const jsonData = await response.json()
    return jsonData
    }

async function parseJSON(grade) {
    // Adjust doctor pay for hours 
    function adjustDoctorPayForHours(grade, jsonDataJnrDoctorPay, year) {
        
    }

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
        let startingValue = jsonDataRpi[0].value
            let rebased = (100 / startingValue) * iterator.value
            rpiData.push({x: iterator.date, y: rebased});
        
        
        }
    // CPIH
    for (const iterator of jsonDatacCpih) {
        let startingValue = jsonDatacCpih[0].value
            let rebased = (100 / startingValue) * iterator.value
            cpihData.push({x: iterator.date, y: rebased});
        
        }   
    // Jnr Doc
    for (const iterator of jsonDataJnrDoctorPay) {
            let rebased = (100 / jsonDataJnrDoctorPay[0][grade]) * iterator[grade]
            jnrDocPayData.push({x: String(iterator.Date), y: rebased});
        
    }
    // MP Pay
    for (const iterator of jsonDataMpPay) {
       
        let startingValue = jsonDataMpPay[0].pay 
            let rebased = (100 / startingValue) * iterator.pay
            mpPayData.push({x: iterator.date, y: rebased});
            console.log(startingValue)
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
        dataset.data = parsedData[dataOptions[index]]
        index ++
        
    });
    chart.options.maintainAspectRatio = false;
    chart.options.response = true;
    chart.update();
}




