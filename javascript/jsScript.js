import { PayPerYear } from "./jsDoctorContract.js"

let grade = 'FY1'
document.getElementById('grade').addEventListener("change", function() {
    grade = document.getElementById('grade').value
    doctorFormSubmit()
})


// On Initial Load Perform 
document.addEventListener("DOMContentLoaded", function() {
    // Update Graph on page loading
    generateGraphData(grade).then(graphData => {
        graphUpdate(myChart, graphData)
    })
    })


document.getElementById("submit-button").addEventListener("click", doctorFormSubmit)
// doctorSelector.onchange = function() {
    
//     grade = this.value
//     generateGraphData(grade).then(graphData => {
//         graphUpdate(myChart, graphData)
//     })
//     fetchJSON('englandDoctorPay').then(jsonData => {
//         let pay = PayPerYear(jsonData, grade, hoursWorked, false, antisocialHours2016, antisocialHours2002, "1:2")
//     })
// }

function doctorFormSubmit() {
    // Interactive Page Elements
let doctorSelector = document.getElementById('grade').value
let hoursWorked = document.getElementById('hours-worked').value
let antisocialHours2016 = document.getElementById('antisocial-hours-worked-2016').value
let antisocialHours2002 = document.getElementById('antisocial-hours-worked-2002').value
let weekendsWorked = document.getElementById('weekends-worked').value
let nrocPay = document.getElementById('nroc')
let banding = document.getElementById('manual-banding').value

    let nrocStatus = false
    if (nrocPay.checked == true) {
        nrocStatus = true
    }

    generateGraphData(grade, doctorSelector, hoursWorked, nrocStatus, antisocialHours2016, antisocialHours2002, weekendsWorked, banding).then(graphData => {
        graphUpdate(myChart, graphData)
    })
}

    
async function fetchJSON(name) {
    let url = `../assets/data/${name}.json`;
    const response = await fetch(url)
    const jsonData = await response.json()
    return jsonData
}
async function fetchJSONURL(url) {
    const response = await fetch(url)
    const jsonData = await response.json()
    return jsonData
}
async function generateGraphData(grade, doctorSelector, hoursWorked, nrocStatus, antisocialHours2016, antisocialHours2002, weekendsWorked, banding) {

    let rpiData = []
    let cpihData = []
    let jnrDocPayData = []
    let mpPayData = []
    let jnrDocAvgPayData = []
    let averagePayData = []


    let jsonDataRpi = await fetchJSONURL("https://api.ons.gov.uk/timeseries/chaw/dataset/mm23/data")
    let jsonDatacCpih = await fetchJSONURL("https://api.ons.gov.uk/timeseries/L522/dataset/mm23/data")
    let jsonDataJnrDoctorPay = await fetchJSON('englandDoctorPay')
    let jsonDataJnrAvgDoctorPay = await fetchJSON('englandDoctorAveragePay')
    let jsonDataMpPay = await fetchJSON('mpPay')
    let jsonDataAveragePay = await fetchJSON('avgWeeklyEarnings')

    let adjustedPay = PayPerYear(jsonDataJnrDoctorPay, doctorSelector, hoursWorked, nrocStatus, antisocialHours2016, antisocialHours2002, weekendsWorked, banding)

    //RPI
    let rpiYears = jsonDataRpi['years']
    let indexAdjustmentRPI = 23

    for (const iterator of rpiYears) {
            let startingValue = rpiYears[indexAdjustmentRPI].value
            let rebased = (100 / startingValue) * iterator.value
            if (iterator.date > 2009) {
                rpiData.push({x: iterator.date, y: rebased});
            }
        
        }

    // CPIH
    let cpihYears = jsonDatacCpih['years']
    let indexAdjustmentCPIH = 22
    for (const iterator of cpihYears) {
            let startingValue = cpihYears[indexAdjustmentCPIH].value
            let rebased = (100 / startingValue) * iterator.value
            if (iterator.date > 2009) {
            cpihData.push({x: iterator.date, y: rebased});
            }
        }   
    // Jnr Doc
    for (const iterator of adjustedPay) {
            let rebased = (100 / adjustedPay[0].Pay[0].totalPay) * iterator.Pay[0].totalPay
            jnrDocPayData.push({x: String(iterator.Date), y: iterator.Pay[0].totalPay});
        
    }
    // Jnr Doc Average Earnings 
    let jnrDocAvgYears = jsonDataJnrAvgDoctorPay[grade]
    console.log(jnrDocAvgYears['2010'])
    for (const iterator of Object.keys(jnrDocAvgYears)) {
    let rebased = (100 / parseInt(jnrDocAvgYears['2010'])) * jnrDocAvgYears[iterator]

    jnrDocAvgPayData.push({x: iterator, y: rebased})
    }

    // MP Pay
    for (const iterator of jsonDataMpPay) {
            let startingValue = jsonDataMpPay[0].pay 
            let rebased = (100 / startingValue) * iterator.pay
            mpPayData.push({x: iterator.date, y: rebased});
    }

    // Average Weekly Earnings
    for (const iterator of jsonDataAveragePay) {
        let adjusted = iterator.pay * 52.1429
        let startingValue = jsonDataAveragePay[0].pay * 52.1429
        let rebased = (100 / startingValue) * adjusted
        averagePayData.push({x: iterator.date, y: rebased});
    }

    return {
        'rpi': rpiData,
        'cpih': cpihData,
        'jnrDocPay': jnrDocPayData,
        'mpPay' : mpPayData,
        'avgYearlyEarnings': averagePayData,
        'jnrDocAvgPay': jnrDocAvgPayData
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
    },
    {
        label: 'Average Yearly Earnings',
        backgroundColor: 'rgb(252, 202, 3)',
        borderColor: 'rgb(252, 202, 3)',
        data: [],
    },
    {
        label: 'Jnr Doc Average Pay',
        backgroundColor: '42f545',
        borderColor: '42f545',
        data: [],
    }
]
};
// Config
const config = {
    type: 'line',
    data, 
    options: {
        maintainAspectRatio: false,
        responsive: true
    }
};

// Render
const myChart = new Chart(
    document.getElementById('payChart'),
    config
);

// Update Chart Function
function graphUpdate(chart, parsedData) {
   console.log(parsedData.jnrDocAvgPay)
    let index = 0 
    let dataOptions = ['rpi', 'cpih', 'jnrDocPay', 'mpPay', 'avgYearlyEarnings', 'jnrDocAvgPay']
    chart.data.datasets.forEach(dataset => {
        dataset.data = parsedData[dataOptions[index]]
        index ++    
        
    });
    chart.options.maintainAspectRatio = false;
    chart.options.response = true;
    chart.update();
}




