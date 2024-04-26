function joinTValues() {
    setTimeout(function () {
        let PLACEHOLDER = 'xxyy33zz';
        //eventual result value after a join
        let combinedString = []

        const getVal = (n, index) => {
            n = parseInt(n)
            let el = loader.engine.document.getElementById(n) ?? false
            if (!el || !el.visible || !el.properties) {
                return null
            }
            if (index) {
                return el.properties?.value?.index
            }
            let resVal;
            let valueObj = el.properties.value
            let has = el.hasProperty('value.value')
            let hasVals = el.hasProperty('value.values')
            if (valueObj.dateString) {
                let str = valueObj.dateString
                if (str.length === 10 && str[4] === '-' && str[7] === '-') {
                    resVal = str.slice(5, 7) + '/' + str.slice(-2) + '/' + str.slice(0, 4)
                } else {
                    resVal = valueObj.dateString
                }
            } else if (has) {
                resVal = valueObj.value
            } else if (hasVals) {
                resVal = valueObj.values.filter(Boolean).join()
            } else {
                resVal = Object.values(valueObj).filter(Boolean).join()
            }
            if (el) {
                return el.properties ? resVal : null
            }
        }

        let callType = getVal(108809675)
        let personSpeaking = getVal(108809678)
        let patientSpeaking = personSpeaking === 'Patient'
        let authorizedPersonName = getVal(108809679)
        let patientName = getVal(108814948) + ' ' + getVal(108814949)
        let speaker = patientSpeaking ? patientName : authorizedPersonName
        combinedString.push(`${callType} call for patient consent, spoke to ${personSpeaking} ${speaker}`)
        if (!patientSpeaking) {
            combinedString.push(`Patient Name : ${patientName}`)
        }
        if (patientSpeaking && callType === 'Outbound') {
            combinedString.push('ADVISED CALLER: Call may be recorded')
        }
        if (getVal(108809798) === "Yes") {
            combinedString.push(`Patient added authorized user: ${getVal(108809799) ?? ''} ${getVal(108809800) ?? ''}`)
        }


        //function to replace the 'xxyy33zz' placeholders in the string values with form input
        const strReplace = (str, replacement) => {
            return str.replace('xxyy33zz', replacement)
        }

        const phoneNumber = () => {
            let array = [108809802, 108809803, 108809804, 108809805, 108809806]
            let inputs = array.map((num) => getVal(num))
            confirmNumInd = getVal(108809804, true)
            if (confirmNumInd === 0 && inputs[0]) {
                let resStr = `Preferred phone number is: ${inputs[0]}${inputs[1] ? '-' + inputs[1] : ''}`
                combinedString.push(resStr)
            }
            if (inputs[3]) {
                combinedString.push(`added mobile number: ${inputs[3]}`)
            }
            if (inputs[4]) {
                combinedString.push(`added landline number: ${inputs[4]}`)
            }
        }

        let email = () => {
            let ind = getVal(108809808, true)
            if (ind === 2) {
                combinedString.push('Patient declines email')
                return
            }
            let emailVal = getVal(108809809) ?? getVal(108809807)
            if (emailVal) {
                combinedString.push(`Confirmed email address: ${emailVal}`)
            }
        }

        const shipping = () => {
            let shippingAddress = "";   // TODO - Don't know the ID
            combinedString.push(`Confirmed shipping address as: ${shippingAddress}`)
        }

        const provider = () => {
            let treatingHCP = "";   // TODO - Don't know the ID
            combinedString.push(`Confirmed treating HCP is ${treatingHCP}`)
        }

        const idsToNoteLines = (ids, labels) => {
            let labelCnt = labels.length;
            let idCnt = ids.length;

            for (let i = 0; i < idCnt; i ++) {
                let value = getVal(ids[i]);

                if (labelCnt > i && value !== "" && value !== null)
                    combinedString.push(labels[i].replace(PLACEHOLDER, value));
            }
        }

        let insurance = () => {
            let primLabels = [`Primary Insurance: ${PLACEHOLDER}`, `Primary Policy #: ${PLACEHOLDER}`, `Group Number : ${PLACEHOLDER}`, `Relationship to Policyholder : ${PLACEHOLDER}`, `Policyholder Name : ${PLACEHOLDER}`, `Policyholder Date of Birth : ${PLACEHOLDER}`]

            let secLabels = [`Secondary Insurance: ${PLACEHOLDER}`, `Secondary Policy #: ${PLACEHOLDER}`, `Group Number : ${PLACEHOLDER}`, `Relationship to Policyholder : ${PLACEHOLDER}`, `Policyholder Name : ${PLACEHOLDER}`, `Policyholder Date of Birth : ${PLACEHOLDER}`]
            if (getVal(108809705, true) === 0) {
                idsToNoteLines([108809703, 108809704], primLabels)
            } else {
                let ids = [108809706, 108809707, 108809708, 108809709, 108809710, 108809711]
                idsToNoteLines(ids, primLabels)
            }
            if (getVal(108600845, true) === 0) {
                let ids = [108809712, 108809713]
                idsToNoteLines(ids, secLabels)
            } else {
                let ids = [108809715, 108809716, 108809717, 108809718, 108809719, 108809720]
                idsToNoteLines(ids, secLabels)
            }
        }

        let cdgAndInsulin = () => {
            let insulinCgmLabels = [`Preferred Insulin Pump Brand: ${PLACEHOLDER}`, `Model: ${PLACEHOLDER}`, `Model: ${PLACEHOLDER}`, `Model: ${PLACEHOLDER}`, `Preferred CGM Model: ${PLACEHOLDER}`]
            let ids = [108809691, 108809692, 108809693, 108809694, 108809697]
            idsToNoteLines(ids, insulinCgmLabels)
        }


        phoneNumber()
        email()
        shipping()
        provider()
        insurance()
        cdgAndInsulin()
        idsToNoteLines([108809730, 108809829, 108809831], [`${PLACEHOLDER}`, `Advised Patient of Next Steps : ${PLACEHOLDER}`])



        //splitting by row for clarity

        let joinedArr = combinedString.join("\r\n")
        console.log(joinedArr)
        loader.engine.document.getElementById(108809834).setValue(({
            "value":
                joinedArr
        }));

    }, 1000);
}

window.onchange = joinTValues;