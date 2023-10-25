import { PayPerYear } from "./jsDoctorContract.js"


// On Initial Load Perform 
document.addEventListener("DOMContentLoaded", function() {
    doctorFormSubmit()
    const select = document.getElementById('weekends-worked')
    // Set Weekends to 1:4
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
        UpdatePayTable(data, year, doctorSelector)
    })
}

    
async function CreatePayData(doctorSelector, hoursWorked, nrocStatus, antisocialHours2016, antisocialHours2002, weekendsWorked, banding) {
    async function FetchJSON(name) {
        let url = `./assets/data/${name}.json`;
        const response = await fetch(url)
        const jsonData = await response.json()
        return jsonData
    }
    // Jnr Doc
    let jsonDataJnrDoctorPay = await FetchJSON('englandDoctorPay')
    let jnrDocPay = PayPerYear(jsonDataJnrDoctorPay, doctorSelector, hoursWorked, nrocStatus, antisocialHours2016, antisocialHours2002, weekendsWorked, banding)

    // Inflation 
    let dateIndex = year.value - 2008
    let jsonDataRpi = await FetchJSON("rpi")
    let jsonDatacCpih = await FetchJSON("cpih")

    let rpiAdjusted = Math.round(jnrDocPay[0].Pay[0]['Total Pay'] * (jsonDataRpi[dateIndex].value / jsonDataRpi[0].value))
    let cpihAdjusted = Math.round(jnrDocPay[0].Pay[0]['Total Pay'] * (jsonDatacCpih[dateIndex].value / jsonDatacCpih[0].value))

    return {
        'jnrDocPay': jnrDocPay,
        'rpiAdjusted': rpiAdjusted,
        'cpihAdjusted': cpihAdjusted
    }
}

function UpdatePayTable(data, year, grade) {

    let dateIndex = year - 2008
    let header = document.getElementById('pay-header')
    let headerOld = document.getElementById('pay-header-old')
    let adjustedHeader = document.getElementById('pay-header-inflation')
    console.log(adjustedHeader)
    let table = document.getElementById('pay-table')
    let tableOld = document.getElementById('pay-table-old')
    let tableInflation = document.getElementById('pay-table-inflation')
    let numberOfRows = table.rows.length
    let numberOfRowsOld = tableOld.rows.length
    let numberOfRowsInflation = tableInflation.rows.length
    let listOfRows = Object.keys(data.jnrDocPay[dateIndex].Pay[0]).reverse()
    let listOfRowsInflation = Object.keys(data.jnrDocPay[0].Pay[0]).reverse()
    
     // Clear Existing Tables
    for (let i = 1; i <= numberOfRows; i++) {
        if (i < numberOfRows) {
        table.deleteRow(1)
        }
    }

    for (let i = 1; i <= numberOfRowsOld; i++) {
        if (i < numberOfRowsOld) {
        tableOld.deleteRow(1)
        }
    }
    
    for (let i = 1; i <= numberOfRowsInflation; i++) {
        if (i < numberOfRowsInflation) {
        tableInflation.deleteRow(1)
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

    // Pay Old
    for (const iterator of listOfRowsInflation) {
        let row = tableOld.insertRow(1)
        let firstCell = row.insertCell(0)
        let secondCell = row.insertCell(1)
        firstCell.textContent = iterator
        secondCell.textContent = `${data.jnrDocPay[0].Pay[0][iterator].toLocaleString('en-UK')}`
    }

    // Pay adjusted for inflation 
    let rpiLoss = data.rpiAdjusted - data.jnrDocPay[0].Pay[0]['Total Pay']
    let rowRPI = tableInflation.insertRow(1)
    let firstCellRPI = rowRPI.insertCell(0)
    let secondCellRPI = rowRPI.insertCell(1)
    let thirdCellRPI = rowRPI.insertCell(2)
    firstCellRPI.textContent = `Total Pay Adjusted for RPI (2008 - ${year})`
    secondCellRPI.textContent = `${data.rpiAdjusted.toLocaleString('en-UK')}`
    thirdCellRPI.textContent = `${rpiLoss.toLocaleString('en-UK')}`

    let cpihLoss = data.cpihAdjusted - data.jnrDocPay[0].Pay[0]['Total Pay']
    let rowCPIH = tableInflation.insertRow(2)
    let firstCellCPIH = rowCPIH.insertCell(0)
    let secondCellCPIH = rowCPIH.insertCell(1)
    let thirdCellCPIH = rowCPIH.insertCell(2)
    firstCellCPIH.textContent = `Total Pay Adjusted for CPIH (2008 - ${year})`
    secondCellCPIH.textContent = `${data.cpihAdjusted.toLocaleString('en-UK')}`
    thirdCellCPIH.textContent = `${cpihLoss.toLocaleString('en-UK')}`

    header.innerText = `${grade} Pay ${year}`
    adjustedHeader.innerText = ` ${grade} 2008 Pay Adjusted for ${year} Inflation`
    headerOld.innerText = `${grade} Pay 2008`

}


