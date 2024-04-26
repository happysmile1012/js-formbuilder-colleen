function joinValues() {
    //mocking
    console.log("mock");
    setTimeout(function () {
        //eventual result value after a join
        let combinedString = [];

        const getDate30DaysLater = (inputDate) => {
            var dateParts = inputDate.split('/');
            var date = new Date(dateParts[2], dateParts[0] - 1, dateParts[1]);
            date.setDate(date.getDate() + 30);
            
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var year = date.getFullYear();
            
            return month + '/' + day + '/' + year;
        }

        const isValidDateFormat = (dateString) => {
            var datePattern = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
            return datePattern.test(dateString);
        }

        // Get value of field id.
        const getVal = (n, index) => {
            n = parseInt(n)
            let el = loader.engine.document.getElementById(n) ?? false
            if (!el || !el.properties) {
                // if (!el || !el.visible || !el.properties) {
                return null
            }
            if (index) {
                return el.properties?.value?.index
            }
            let resVal;
            let valueObj = el.properties.value
            let has = el.hasProperty('value.value')
            let hasVals = el.hasProperty('value.values')

            if (!valueObj) {
                return null;
            } else if (valueObj.dateString) {
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

        /**
         * Check Field Value
         */
        const getValue = (id) => {
            let fieldValue = getVal(id);

            if (fieldValue !== null && fieldValue !== "") {
                return fieldValue;
            }
            return "";
        }

        /**
         * First Line
         * Exp: 
         */
        const convertFirstLine = () => {
            let emailAddr = getValue(112607236);                    // CCS Customer Service Representative Email address
            let patientId = getValue(112607237);                    // Patient ID
            let callType = getValue(112607238);                     // Call Type
            let advisedCaller = getValue(112607239);                // ADVISED CALLER
            let callReason = getValue(112607240);                   // Call Reason
            let speakingTo = getValue(112607241);                   // Speaking To
            let authPersonFirName = getValue(112607242);            // Authorized Person First Name
            let authPersonLastName = getValue(112607243);           // Authorized Person Last Name
            let csEmailConfirmed = getValue(112607245);             // CS Rep Email Confirmed
            let patientIdConfirmed = getValue(112607246);           // Patient ID Confirmed
            let hipaa = getValue(112607248);                        // HIPAA
            let plzVerifyCGM = getValue(112607249);                 // Please verify CGM Information
            let patientReceiveCGM = getValue(112607250);            // Did the patient receive their new CGM order?
            let ifPatDidReceive = getValue(112607251);              // If patient did not receive the order, review the tracking information with the patient. If not able to locate order, transfer patient to NCE extension (7)55677 to be further assisted
            let useNewCGM = getValue(112607252);                    // Are you using the new CGM?
            let offeredPatient = getValue(112607253);               // Offered the patient additional tools to help get the patient started on their CGM.
            let anyQuestions4me = getValue(112607254);              // Do you have any questions for me?
            let assistPatient = getValue(112607255);                // Assisted the patient with the following concerns
            let other1 = getValue(112610841);                       // Other
            let libreDiscussion = getValue(112607515);              // Libre Discussion Key Points:
            let dexcomG6 = getValue(112607531);                     // Dexcom G6 Discussion Key Points:
            let dexcomG7 = getValue(112607533);                     // Dexcom G7 Discussion Key Points:
            let plzCallUs = getValue(112607256);                    // If you have any questions, please call us.
            let providedFollowing = getValue(112607257);            // Provided the following:
            let callOutcome = getValue(112607258);                  // Call Outcome
            let didNotReach = getValue(112607259);                  // Did Not Reach Patient Outcome
            let other = getValue(112607260);                        // Other

            combinedString.push(`${emailAddr} spoke to patient ${speakingTo} ${authPersonFirName} ${authPersonLastName} for ${callReason}`);

            // combinedString.push(`${patientName} spoke for ${callReason}`);
            if (hipaa !== "")
                combinedString.push(hipaa);

            if (plzVerifyCGM !== "" && plzVerifyCGM !== "Please select")
                combinedString.push(plzVerifyCGM);

            if (patientReceiveCGM !== "")
                combinedString.push(patientReceiveCGM);

            if (ifPatDidReceive !== "")
                combinedString.push(ifPatDidReceive);

            if (useNewCGM !== "") {
                if (useNewCGM === "Patient is using the new CGM")
                    combinedString.push(useNewCGM);
                else {
                    combinedString.push(`${useNewCGM} and ${offeredPatient}`);
                }
            }

            if (anyQuestions4me !== "") {
                if (anyQuestions4me === "Yes") {
                    if (callOutcome.includes("Other"))
                        callOutcome.replace("Other", `${other1}`);

                    combinedString.push(`Assisted the patient with ${assistPatient}`);
                }
            }

            if (libreDiscussion !== "") {
                combinedString.push(`${libreDiscussion}`);
            }

            if (dexcomG6 !== "") {
                combinedString.push(`${dexcomG6}`);
            }

            if (dexcomG7 !== "") {
                combinedString.push(`${dexcomG7}`);
            }

            if (providedFollowing !== "") {
                combinedString.push(`${providedFollowing}`);
            }

            if (callOutcome !== "") {
                if (callOutcome.includes("Did not reach the patient"))
                    callOutcome.replace("Did not reach the patient", `${didNotReach}`);
                
                if (callOutcome.includes("Other"))
                    callOutcome.replace("Other", `${other}`);

                combinedString.push(`${callOutcome}`);
            }
        }

        // Parse fields one by one.
        const doConvertResult = () => {
            convertFirstLine();
        }
        
        doConvertResult();

        //splitting by row for clarity
        let joinedArr = combinedString.join("\r\n");

        console.log(joinedArr);

        loader.engine.document.getElementById(112607262).setValue(({
            "value": joinedArr
        }));

        // let tagConsentDateTaken = loader.engine.document.getElementById(112322910)
    }, 1000);
}

window.onchange = joinValues;
