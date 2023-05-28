import { PayPerYear } from "./jsDoctorContract.js"


// On Initial Load Perform 
document.addEventListener("DOMContentLoaded", function() {
    doctorFormSubmit()
    const select = document.getElementById('weekends-worked')
    select.options[5].selected = true
    })

// On Selects Changed
document.getElementById("year").addEventListener("input", doctorFormSubmit)
document.getElementById('grade').addEventListener("change", doctorFormSubmit)
document.getElementById('hours-worked').addEventListener("input" , doctorFormSubmit)
document.getElementById('antisocial-hours-worked-2016').addEventListener("input", doctorFormSubmit)
document.getElementById('antisocial-hours-worked-2002').addEventListener("input", doctorFormSubmit)
document.getElementById('weekends-worked').addEventListener("change", doctorFormSubmit)
document.getElementById('nroc').addEventListener("change", doctorFormSubmit)
document.getElementById('manual-banding').addEventListener("change", doctorFormSubmit)

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

    
async function CreatePayData(doctorSelector, hoursWorked, nrocStatus, antisocialHours2016, antisocialHours2002, weekendsWorked, banding) {
    async function FetchJSON(name) {
        let url = `../assets/data/${name}.json`;
        const response = await fetch(url)
        const jsonData = await response.json()
        return jsonData
    }
    // Jnr Doc
    let jsonDataJnrDoctorPay = await FetchJSON('englandDoctorPay')
    let jnrDocPay = PayPerYear(jsonDataJnrDoctorPay, doctorSelector, hoursWorked, nrocStatus, antisocialHours2016, antisocialHours2002, weekendsWorked, banding)

    return {
        'jnrDocPay': jnrDocPay
    }
}

function UpdatePayTable(data, year) {

    let dateIndex = year - 2008
    let header = document.getElementById('pay-header')
    let table = document.getElementById('pay-table')
    let numberOfRows = table.rows.length
    let listOfRows = Object.keys(data.jnrDocPay[dateIndex].Pay[0]).reverse()
    
    for (let i = 1; i <= numberOfRows; i++) {
        // Clear Existing Table
        if (i < numberOfRows) {
        table.deleteRow(1)
        }
    }
    
    // Insert New Cells
    for (const iterator of listOfRows) {
        let row = table.insertRow(1)
        let firstCell = row.insertCell(0)
        let secondCell = row.insertCell(1)
        firstCell.textContent = iterator
        secondCell.textContent = `${data.jnrDocPay[dateIndex].Pay[0][iterator].toLocaleString('en-UK')}`
    }
    header.innerText = `Pay Data ${year}`
}


