function payNewContract(jsonDataJnrDoctorPay, year, grade, hoursWorked, nroc, antisocial2016, weekendsWorked = '<1:8') {
    // Constants
    let antiocialEnhancementPerHour = 0.00925
    let additionalHourEnhancement = 0.025
    let nrocMultiplier = 0.08
    let ltft = False

    // Setup
    let weekAllowance = jsonDataJnrDoctorPay[year]['WeekendAllowance']
    let basePay = jsonDataJnrDoctorPay[year][grade]
    let resultsArray = []

    // Caluclate Pay if < 40 Hours Per Week

    if (ltft == True) {
        let percentageWorked = hoursWorked / 40
        let oneHourPay = basePay / 40
        let ltftPay = Math.round(oneHourPay * hoursWorkedLocal)
        let ltftAllowance = 1000
        let nrocPay = 0
        let additionalHoursPay = 0
        let weekendMultiplier = 0
        switch (weekendsWorked) {
            case weekendsWorked == '<1:8': 
                weekendMultiplier = weekAllowance[0]
            case weekendsWorked == '<1:7 - 1:8':
                weekendMultiplier = weekAllowance[1]
            case weekendsWorked == '<1:6 - 1:7': 
                weekendMultiplier = weekAllowance[2]
            case weekendsWorked == '<1:5 - 1:6': 
                weekendMultiplier = weekAllowance[3]
            case weekendsWorked == '<1:4 - 1:5': 
                weekendMultiplier = weekAllowance[4]
            case weekendsWorked == '<1:3 - 1:4': 
                weekendMultiplier = weekAllowance[5]
            case weekendsWorked == '<1:2 - 1:3': 
                weekendMultiplier = weekAllowance[6]
            case weekendsWorked == '1:2':
                weekendMultiplier = weekAllowance[7]
            default: 
                weekendMultiplier = weekAllowance[0]
        }
        if (nroc = true) {
            nrocPay = (nrocMultiplier * basePay) * percentageWorked
        }
        else {
            nrocPay = 0
        }
        
        let antisocialPay = basePay * (antisocial2016 * antiocialEnhancementPerHour) 
        let weekendPay = (basePay * (weekendMultiplier / 100 )) * percentageWorked    
        let totalPayRaw = ltftPay + antisocialPay + weekendPay + nrocPay + ltftAllowance
        let totalPayRounded = Math.round(totalPayRaw)
        let resultsArray = [totalPayRounded, ltftPay, antisocialPay, additionalHoursPay, weekendPay, nrocPay, ltftAllowance]
        return resultsArray
    }
    // else if (ltft == False) {
    //     // Caluclate Pay if > 40 Hours Per Week
    //     # Unable to Use Match due to Streamlit Requiring Python 3.9 or Older. Review if Streamlit adds support for Python 3.10
    //     if weekendsWorked == '<1:8': 
    //         weekendMultiplier = weekAllowance[0]
    //     if weekendsWorked == '<1:7 - 1:8':
    //         weekendMultiplier = weekAllowance[1]
    //     if weekendsWorked == '<1:6 - 1:7': 
    //         weekendMultiplier = weekAllowance[2]
    //     if weekendsWorked == '<1:5 - 1:6': 
    //         weekendMultiplier = weekAllowance[3]
    //     if weekendsWorked == '<1:4 - 1:5': 
    //         weekendMultiplier = weekAllowance[4]
    //     if weekendsWorked == '<1:3 - 1:4': 
    //         weekendMultiplier = weekAllowance[5]
    //     if weekendsWorked == '<1:2 - 1:3': 
    //         weekendMultiplier = weekAllowance[6]
    //     if weekendsWorked == '1:2':
    //         weekendMultiplier = weekAllowance[7]
    //     if nroc: 
    //         nrocPay = nrocMultiplier * basePay
    //     else:
    //         nrocPay = 0
    //     antisocialPay = basePay * (antisocialHoursLocal * antiocialEnhancementPerHour) 
    //     additionalHoursPay = basePay * ((hoursWorkedLocal - 40) * additionalHourEnhancement)
    //     weekendPay = basePay * (weekendMultiplier / 100)
    //     totalPayRaw = basePay + additionalHoursPay + antisocialPay + weekendPay + nrocPay
    //     totalPayRounded = round(totalPayRaw)
    //     resultsArray = [totalPayRounded, basePay, antisocialPay, additionalHoursPay, weekendPay, nrocPay, 0]
    //     return resultsArray
    // }
}

export function payNewContract() {
    
}
