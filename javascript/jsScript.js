import { PayPerYear } from "./jsDoctorContract.js"


// On Initial Load Perform 
document.addEventListener("DOMContentLoaded", function() {
    
    })

// On Doctor Form Submit
document.getElementById("submit-button").addEventListener("click", doctorFormSubmit)

function doctorFormSubmit() {

    // Interactive Page Elements
let doctorSelector = document.getElementById('grade').value
let hoursWorked = document.getElementById('hours-worked').value
let antisocialHours2016 = document.getElementById('antisocial-hours-worked-2016').value
let antisocialHours2002 = document.getElementById('antisocial-hours-worked-2002').value
let weekendsWorked = document.getElementById('weekends-worked').value
let nrocPay = document.getElementById('nroc')
let banding = document.getElementById('manual-banding').value
let year = document.getElementById('year').value
    let nrocStatus = false
    if (nrocPay.checked == true) {
        nrocStatus = true
    }

    CreatePayData(doctorSelector, hoursWorked, nrocStatus, antisocialHours2016, antisocialHours2002, weekendsWorked, banding).then(data => {
        UpdatePayTable(data, year)
    })
}

    
async function FetchJSON(name) {
    let url = `../assets/data/${name}.json`;
    const response = await fetch(url)
    const jsonData = await response.json()
    return jsonData
}
async function FetchJSONURL(url) {
    const response = await fetch(url)
    const jsonData = await response.json()
    return jsonData
}
async function CreatePayData(doctorSelector, hoursWorked, nrocStatus, antisocialHours2016, antisocialHours2002, weekendsWorked, banding) {
    console.log(doctorSelector)
    let rpiData = []
    let cpihData = []
    let jnrDocPayData = []
    let mpPayData = []
    let jnrDocPayDataInflation = []

    let jsonDataRpi = await FetchJSONURL("https://api.ons.gov.uk/timeseries/chaw/dataset/mm23/data")
    let jsonDatacCpih = await FetchJSONURL("https://api.ons.gov.uk/timeseries/L522/dataset/mm23/data")
    let jsonDataJnrDoctorPay = await FetchJSON('englandDoctorPay')
    let jsonDataMpPay = await FetchJSON('mpPay')

    let adjustedPay = PayPerYear(jsonDataJnrDoctorPay, doctorSelector, hoursWorked, nrocStatus, antisocialHours2016, antisocialHours2002, weekendsWorked, banding)

    //RPI
    let rpiYears = jsonDataRpi['years']
    let indexAdjustmentRPI = 21

    for (const iterator of rpiYears) {
            if (iterator.date > 2007) {
                rpiData.push({Date: iterator.date, Value: iterator.value});
            }
        }

    // CPIH
    let cpihYears = jsonDatacCpih['years']
    let indexAdjustmentCPIH = 20
    for (const iterator of cpihYears) {
            if (iterator.date > 2007) {
            cpihData.push({Date: iterator.date, Value: iterator.value});
            }
        }   

    // Jnr Doc
    let jnrPay = PayPerYear(jsonDataJnrDoctorPay, doctorSelector, hoursWorked, nrocStatus, antisocialHours2016, antisocialHours2002, weekendsWorked, banding)
    

    // MP Pay
    for (const iterator of jsonDataMpPay) {
            mpPayData.push({Date: iterator.date, Value: iterator.pay});
    }

    return {
        'rpi': rpiData,
        'cpih': cpihData,
        'jnrDocPay': jnrPay,
        'mpPay' : mpPayData
    }
}
function UpdatePayTable(data, year) {
    let dateIndex = year - 2008
    let header = document.getElementById('pay-header')
    let table = document.getElementById('pay-table')
    let numberOfRows = table.rows.length
    console.log(data.jnrDocPay[dateIndex])
    let listOfRows = Object.keys(data.jnrDocPay[dateIndex].Pay[0]).reverse()
    
    for (let i = 1; i <= numberOfRows; i++) {
        if (i < numberOfRows) {
        table.deleteRow(1)
        }
    }
 
    for (const iterator of listOfRows) {
        let row = table.insertRow(1)
        let firstCell = row.insertCell(0)
        let secondCell = row.insertCell(1)
        firstCell.textContent = iterator
        secondCell.textContent = `${data.jnrDocPay[dateIndex].Pay[0][iterator].toLocaleString('en-UK')}`
    }
    header.innerText = `Pay Data ${year}`
}



