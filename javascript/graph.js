import { PayPerYear } from "./jsDoctorContract.js"

let grade = 'FY1'
document.getElementById('graph-grade').addEventListener("change", function() {
    grade = document.getElementById('graph-grade').value
    UpdateGraphGrade()
})

// On Initial Load Perform 
document.addEventListener("DOMContentLoaded", function() {
    // Update Graph on page loading
    GenerateGraphData(grade).then(graphData => {
        GraphUpdate(myChart, graphData, false)
        GraphUpdate(myChartCash, graphData, true)
    })
    })

function UpdateGraphGrade() {
    // Get Interactive Page Elements Values
let doctorSelector = document.getElementById('graph-grade').value
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

    GenerateGraphData(grade, doctorSelector, hoursWorked, nrocStatus, antisocialHours2016, antisocialHours2002, weekendsWorked, banding).then(graphData => {
        GraphUpdate(myChart, graphData, false)
        GraphUpdate(myChartCash, graphData, true)
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
async function GenerateGraphData(grade, doctorSelector, hoursWorked, nrocStatus, antisocialHours2016, antisocialHours2002, weekendsWorked, banding) {

    let rpiData = []
    let cpihData = []
    let jnrDocPayData = []
    let mpPayData = []
    let jnrDocAvgPayData = []
    let averagePayData = []

    let mpPayDataCash = []
    let jnrDocAvgPayDataCash = []
    let averagePayDataCash = []


    let jsonDataRpi = await fetchJSONURL("https://api.ons.gov.uk/timeseries/chaw/dataset/mm23/data")
    let jsonDatacCpih = await fetchJSONURL("https://api.ons.gov.uk/timeseries/L522/dataset/mm23/data")
    let jsonDataJnrDoctorPay = await fetchJSON('englandDoctorPay')
    let jsonDataJnrAvgDoctorPay = await fetchJSON('englandDoctorAveragePay')
    let jsonDataMpPay = await fetchJSON('mpPay')
    let jsonDataAveragePay = await fetchJSON('avgWeeklyEarnings')

    let adjustedPay = PayPerYear(jsonDataJnrDoctorPay, doctorSelector, hoursWorked, nrocStatus, antisocialHours2016, antisocialHours2002, weekendsWorked, banding)

    //RPI
    let rpiYears = jsonDataRpi['years']
    let indexAdjustmentRPI = 21

    for (const iterator of rpiYears) {
            let startingValue = rpiYears[indexAdjustmentRPI].value
            let rebased = (100 / startingValue) * iterator.value
            if (iterator.date > 2007) {
                rpiData.push({x: iterator.date, y: rebased});
            }
        
        }

    // CPIH
    let cpihYears = jsonDatacCpih['years']
    let indexAdjustmentCPIH = 20
    for (const iterator of cpihYears) {
            let startingValue = cpihYears[indexAdjustmentCPIH].value
            let rebased = (100 / startingValue) * iterator.value
            if (iterator.date > 2007) {
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
    for (const iterator of Object.keys(jnrDocAvgYears)) {
    let rebased = (100 / parseInt(jnrDocAvgYears['2008'])) * jnrDocAvgYears[iterator]

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

    // Jnr Doc Average Earnings -- Cash
    for (const iterator of Object.keys(jnrDocAvgYears)) {
      jnrDocAvgPayDataCash.push({x: iterator, y: parseInt(jnrDocAvgYears[iterator])})
    }

    // MP Pay -- Cash
    for (const iterator of jsonDataMpPay) {
        mpPayDataCash.push({x: iterator.date, y: iterator.pay});
    }

    // Average Weekly Earnings -- Cash
    for (const iterator of jsonDataAveragePay) {
        averagePayDataCash.push({x: iterator.date, y: iterator.pay * 52.1429});
    }

    return {
        'rpi': rpiData,
        'cpih': cpihData,
        'mpPay' : mpPayData,
        'avgYearlyEarnings': averagePayData,
        'jnrDocAvgPay': jnrDocAvgPayData,
        'mpPayCash' : mpPayDataCash,
        'avgYearlyEarningsCash': averagePayDataCash,
        'jnrDocAvgPayCash': jnrDocAvgPayDataCash
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
        label: 'RPI Index [ONS]',
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        data: [],
    }, 
    {
        label: 'CPIH Index [ONS]',
        backgroundColor: 'rgb(52, 116, 235)',
        borderColor: 'rgb(52, 116, 235)',
        data: [],
    }, 
    {
        label: 'MP Pay',
        backgroundColor: 'rgb(186, 103, 199)',
        borderColor: 'rgb(186, 103, 199)',
        data: [],
    },
    {
        label: 'Average Yearly Earnings [ONS]',
        backgroundColor: 'rgb(252, 202, 3)',
        borderColor: 'rgb(252, 202, 3)',
        data: [],
    },
    {
        label: 'Doctor Average Pay',
        backgroundColor: 'rgb(103, 191, 199)',
        borderColor: 'rgb(103, 191, 199)',
        data: [],
    }
]
};


const dataCash = {
    labels: labels,
    datasets: [
    {
        label: 'MP Pay',
        backgroundColor: 'rgb(186, 103, 199)',
        borderColor: 'rgb(186, 103, 199)',
        data: [],
    },
    {
        label: 'Average Yearly Earnings [ONS]',
        backgroundColor: 'rgb(252, 202, 3)',
        borderColor: 'rgb(252, 202, 3)',
        data: [],
    },
    {
        label: 'Doctor Average Pay',
        backgroundColor: 'rgb(103, 191, 199)',
        borderColor: 'rgb(103, 191, 199)',
        data: [],
    }
]
};

// Config
const config = {
    type: 'line',
    data, 
    options: {
        maintainAspectRatio: true,
        resizeable: true,
        aspectRatio: 2, 
            scales: {
             x: {
               grid: {
                 display: false
               }
             },
             y: {
               grid: {
                 display: true
               }
             }
           },
           plugins: {
            legend: {
                "display": true,
                "position": "bottom",
                "align": "centre"
              },
              title: {
                display: false,
                text: 'Change since 2008 (Rebased)'
            }
            }
    }
};

// Render Charts
const myChart = new Chart(
    document.getElementById('payChart'),
    config
);

const configCash = {
    type: 'line',
    data : dataCash, 
    options: {
        maintainAspectRatio: true,
        resizeable: true,
        aspectRatio: 2, 
            scales: {
             x: {
               grid: {
                 display: false
               }
             },
             y: {
               grid: {
                 display: true
               }
             }
           },
           plugins: {
            legend: {
                "display": true,
                "position": "bottom",
                "align": "centre"
              },
              title: {
                display: false,
                text: 'Change since 2008 (Cash)'
            }
            }
    }
};

// Render Chart
const myChartCash = new Chart(
    document.getElementById('payChart-cash'),
    configCash
);

// Update Chart Function
function GraphUpdate(chart, parsedData, cash) {
    
   
    let index = 0 
    if (cash == false) {
    let dataOptions = ['rpi', 'cpih', 'mpPay', 'avgYearlyEarnings', 'jnrDocAvgPay']
    chart.data.datasets.forEach(dataset => {
        dataset.data = parsedData[dataOptions[index]]
        index ++    
        
    });
    } else if (cash == true) {
    let dataOptions = ['mpPayCash', 'avgYearlyEarningsCash', 'jnrDocAvgPayCash']
    console.log(chart.data.datasets)
    chart.data.datasets.forEach(dataset => {
   
    dataset.data = parsedData[dataOptions[index]]
    index ++    
    });
    }

    chart.options.response = true;
    chart.update();
}




