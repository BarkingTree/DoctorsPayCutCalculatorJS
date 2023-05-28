function CalculateDoctorPay(year, basePay, grade, hoursWorked, nroc, antisocial2016, antisocial2002, weekendsWorked, manualBanding) {
    let pay = []
    function PayNewContract() {
    // Constants
    let antiocialEnhancementPerHour = 0.00925
    let additionalHourEnhancement = 0.025
    let nrocMultiplier = 0.08
    let ltft = false

    // Weekly Allowance
    let weekAllowance = [0]
        if (year >= 2019) {
            weekAllowance = [0, 3, 4, 5, 6, 7.5, 10, 15]
        } 
        else if (year <= 2018 && year >= 2017) {
        weekAllowance = [0, 3, 4, 4, 6, 7.5, 7.5, 10]
        }
    
    // LTFT Check
    if (hoursWorked < 40) {
        ltft = true
    }
    let weekendMultiplier = 0
    let resultsArray = []

    // Caluclate Pay if < 40 Hours Per Week

    if (ltft == true) {
        let percentageWorked = hoursWorked / 40
        let oneHourPay = basePay / 40
        let ltftPay = Math.round(oneHourPay * hoursWorked)
        let ltftAllowance = 1000
        let nrocPay = 0
        switch (weekendsWorked) {
            case weekendsWorked === '<1:8': 
                weekendMultiplier = weekAllowance[0]
            case weekendsWorked === '<1:7 - 1:8':
                weekendMultiplier = weekAllowance[1]
            case weekendsWorked === '<1:6 - 1:7': 
                weekendMultiplier = weekAllowance[2]
            case weekendsWorked === '<1:5 - 1:6': 
                weekendMultiplier = weekAllowance[3]
            case weekendsWorked === '<1:4 - 1:5': 
                weekendMultiplier = weekAllowance[4]
            case weekendsWorked === '<1:3 - 1:4': 
                weekendMultiplier = weekAllowance[5]
            case weekendsWorked === '<1:2 - 1:3': 
                weekendMultiplier = weekAllowance[6]
            case weekendsWorked === '1:2':
                weekendMultiplier = weekAllowance[7]
            default: 
                weekendMultiplier = weekAllowance[0]
        }
        if (nroc == true) {
            nrocPay = (nrocMultiplier * basePay) * percentageWorked
        }
        else {
            nrocPay = 0
        }
        
        let antisocialPay = Math.round(basePay * (antisocial2016 * antiocialEnhancementPerHour))
        let weekendPay = Math.round((basePay * (weekendMultiplier / 100 )) * percentageWorked)
        let totalPay = Math.round(ltftPay + antisocialPay + weekendPay + nrocPay + ltftAllowance)

        resultsArray = [{'Total Pay': totalPay, 'Base Pay': basePay, 'Antisocial Hour': antisocialPay, 'Weekend Pay': weekendPay, 'NROC Pay': nrocPay, 'LTFT Allowance': ltftAllowance}]
        return resultsArray
    }

    else if (ltft == false) {
        let oneHourPay = basePay / 40
        let nrocPay = 0
        // Caluclate Pay if > 40 Hours Per Week
        
        if (weekendsWorked === '<1:8') {
            weekendMultiplier = weekAllowance[0]
        }
        if (weekendsWorked === '<1:7 - 1:8') {
            weekendMultiplier = weekAllowance[1]
        }
        if (weekendsWorked === '<1:6 - 1:7') {
            weekendMultiplier = weekAllowance[2]
        }
        if (weekendsWorked === '<1:5 - 1:6') {
            weekendMultiplier = weekAllowance[3]
        }
        if (weekendsWorked === '<1:4 - 1:5') {
            weekendMultiplier = weekAllowance[4]
        }
        if (weekendsWorked === '<1:3 - 1:4') {
            weekendMultiplier = weekAllowance[5]
        }
        if (weekendsWorked === '<1:2 - 1:3') {
            weekendMultiplier = weekAllowance[6]
        }
        if (weekendsWorked === '1:2') {
            weekendMultiplier = weekAllowance[7]
        }
        
        if (nroc == true) {
            nrocPay = Math.round(nrocMultiplier * basePay)
        }
        else {
            nrocPay = 0
        }
        let antisocialPay = Math.round(basePay * (antisocial2016 * antiocialEnhancementPerHour))
        let additionalHoursPay = Math.round(basePay * ((hoursWorked - 40) * additionalHourEnhancement))
        let weekendPay = Math.round(basePay * (weekendMultiplier / 100))
        let totalPay = Math.round(basePay + additionalHoursPay + antisocialPay + weekendPay + nrocPay)
        let resultsArray = [{'Total Pay': totalPay, 'Base Pay': basePay, 'Antisocial Hours': antisocialPay, 'Additional Hours': additionalHoursPay, 'Weekend Pay': weekendPay, 'NROC Pay': nrocPay}]
        return resultsArray
        }
    }
    function PayOldContract() {
    let resultsArray = []
    let percentAntiSocialHours = antisocial2002 / hoursWorked
    let banding = 0 
    let bandingString = ""
    let worksOneinSixWeekends = false
    let worksOneInFourWeekends = false
    let baseSalaryBanding = 1
    let ltft = false
    let manualBinding = false
    let manuallySelectedBinding = '1B'

    // LTFT Check
    if (hoursWorked < 40) {
        ltft = true
    }

    // Manual Binding 
    if (manualBanding =='Automatic') {
        manualBinding = false
    }
    else {
        manualBinding = true
        manuallySelectedBinding = manualBanding
    }

    // Caluclate Pay if < 40 Hours Per Week
    if (ltft === true) {
        worksOneinSixWeekends = false
        baseSalaryBanding = 0 
        let percentageWorked = (hoursWorked / 40) * 100
        if (percentageWorked >= 50 || percentageWorked <= 59) {
            baseSalaryBanding = 0.5 }
        if (percentageWorked >= 60 || percentageWorked <= 69) {
            baseSalaryBanding = 0.6 }
        if (percentageWorked >= 70 || percentageWorked <= 79) {
            baseSalaryBanding = 0.7 }
        if (percentageWorked >= 80 || percentageWorked <= 89) {
            baseSalaryBanding = 0.8 }
        if (percentageWorked >= 90 || percentageWorked <= 99) {
            baseSalaryBanding = 0.9 }         
        switch (weekendsWorked) {
            case weekendsWorked === '<1:8': 
                worksOneinSixWeekends = false
            case weekendsWorked === '<1:7 - 1:8':
                worksOneinSixWeekends = false
            case weekendsWorked === '<1:6 - 1:7': 
                worksOneinSixWeekends = false
            case weekendsWorked === '<1:5 - 1:6': 
                worksOneinSixWeekends = true
            case weekendsWorked === '<1:4 - 1:5': 
                worksOneinSixWeekends = true
            case weekendsWorked === '<1:3 - 1:4': 
                worksOneinSixWeekends = true
            case weekendsWorked === '<1:2 - 1:3': 
                worksOneinSixWeekends = true
            case weekendsWorked === '1:2':
                worksOneinSixWeekends = true
            default: 
                worksOneinSixWeekends = false
        }
    
        if (worksOneinSixWeekends || percentAntiSocialHours > 0.33) {
            // Band FA
            banding = 1.5
            bandingString = 'FA'
        }
        else if (percentAntiSocialHours > 0.15) {
            // Band FB 
            banding = 1.4
            bandingString = 'FB'
        }
        else if (percentAntiSocialHours > 0) { 
            // Banding FC
            banding = 1.2
            bandingString = 'FC'
        }
        else if (percentAntiSocialHours == 0) {
            // Unbanded
            banding = 1
            bandingString = 'Unbanded'
        }
        
        // Override if Manually Selecting Binding
        if (manualBinding == true) {
            if (manuallySelectedBinding == 'A') { 
                banding = 1.5
                bandingString = 'FA'
            }
            else if (manuallySelectedBinding == 'B') {
                banding = 1.4
                bandingString = 'FB'
            }
            else if (manuallySelectedBinding == 'C') {
                banding = 1.2
                bandingString = 'FC'
            }
            else if (manuallySelectedBinding == 'Unbanded'){
                banding = 1
                bandingString = 'Unbanded'
            }
        }
        let bandedBasePay = Math.round(basePay * baseSalaryBanding)
        let totalPay = Math.round(bandedBasePay * banding)
        resultsArray = [{'TotalPay': totalPay, 'Base Pay': Math.round(basePay), 'Banding': banding, 'Banding Description': bandingString}]
        return resultsArray

    }
    if (ltft == false) {
        switch (weekendsWorked) {
            case weekendsWorked === '<1:8': 
                worksOneInFourWeekends = false
            case weekendsWorked === '<1:7 - 1:8':
                worksOneInFourWeekends = false
            case weekendsWorked === '<1:6 - 1:7': 
                worksOneInFourWeekends = false
            case weekendsWorked === '<1:5 - 1:6': 
                worksOneInFourWeekends = false
            case weekendsWorked === '<1:4 - 1:5': 
                worksOneInFourWeekends = false
            case weekendsWorked === '<1:3 - 1:4': 
                worksOneInFourWeekends = true
            case weekendsWorked === '<1:2 - 1:3': 
                worksOneInFourWeekends = true
            case weekendsWorked === '1:2':
                worksOneInFourWeekends = true
            default: 
                worksOneInFourWeekends = false
        }
        if (worksOneInFourWeekends || percentAntiSocialHours > 0.33) { 
                // Band 1A
                banding = 1.5
                bandingString = '1A'
        }
        else if (percentAntiSocialHours > 0.25) {
                // Band 1B 
                banding = 1.4
                bandingString = '1B'
        }
        else if (hoursWorked > 40) {
                // Band 1C. Likely to require rework
                banding = 1.2
                bandingString = '1C'
        }
        else if (hoursWorked == 40 ) {
                // Unbanded only applies to those completing 40 Hour weeks.
                banding = 1
                bandingString = 'Unbanded'
        }
       
        if (manualBinding == true) {
            if (manuallySelectedBinding == 'A'){ 
                banding = 1.5
                bandingString = '1A'
            }
            else if (manuallySelectedBinding == 'B'){
                banding = 1.4
                bandingString = '1B'
            }
            else if (manuallySelectedBinding == 'C') {
                banding = 1.2
                bandingString = '1C'
            }
            else if (manuallySelectedBinding == 'Unbanded') {
                banding = 1
                bandingString = 'Unbanded'
            }
        }

        let totalPayRaw = Math.round(basePay * banding)
        let totalPayRounded = Math.round(totalPayRaw)
        resultsArray = [{'Total Pay': totalPayRounded, 'Base Pay': Math.round(basePay), 'Banding': banding, 'Banding Description': bandingString}]
    return resultsArray
    }
}
    // Contract to Use - England Specific
    if (year >= 2017) {
        pay = PayNewContract()
    } 
    else if (year <= 2016) {
        pay = PayOldContract()
    }
    return pay
}

function PayPerYear(jsonData, grade, hoursWorked, nroc, antisocial2016, antisocial2002, weekendsWorked, manualBanding) {
    let results = []

    for (const iterator of jsonData) {
        results.push({Date: iterator['Date'], Pay: CalculateDoctorPay(iterator['Date'], iterator[grade], grade, hoursWorked, nroc, antisocial2016, antisocial2002, weekendsWorked, manualBanding)})
    }
    return results
}
export { PayPerYear }