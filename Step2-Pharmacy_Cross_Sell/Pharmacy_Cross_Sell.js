function joinValues() {
    //mocking
    console.log("mock");
    setTimeout(function () {
        //eventual result value after a join
        let combinedString = [];

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
         * Exp: Jamie.cerar spoke to patient authorized person colleen hendry for Pharmacy cross-sell.
         */
        const convertFirstLine = () => {
            let patientname = getValue(112239730);
            let speakingTo = getValue(112239767);
            let authPersonFirstName = getValue(112239768);
            let authPersonLastName = getValue(112239769);
            let callReason = getValue(112239747);

            combinedString.push(`${patientname} spoke to patient ${speakingTo} ${authPersonFirstName} ${authPersonLastName} for ${callReason}`);
        }

        /**
         * Second Line
         * Exp: PID 3640820 - Patient has Humana/Other insurance.
         */
        const convertSecondLine = () => {
            let patientId = getValue(112239732);
            let insurance = getValue(112239786);
            let otherInsName = getValue(112239804);

            if (insurance == "Humana")
                combinedString.push(`PID ${patientId} - Patient has Humana insurance.`);
            else
                combinedString.push(`PID ${patientId} - Patient has ${otherInsName} insurance.`);
        }

        /**
         * Third Line
         * Exp: Yes - Patient is taking medications and insulin.
         */
        const convertThirdLine = () => {
            let medOrInsulin = getValue(112239835);
            if (medOrInsulin !== null && medOrInsulin !== "") {
                combinedString.push(medOrInsulin);
            }
        }

        /**
         * Fourth Line
         * Exp: Patient is currently using Centerwell. 
         */
        const convertFourthLine =() => {
            let pharmacyType = getValue(112239893);
            let customPharmacy = getValue(112240109);
            let localPharmacy = getValue(112240144);

            if (pharmacyType == "Centerwell") {
                combinedString.push(`Patient is currently using Centerwell.`);
            } else if (pharmacyType == "Other") {
                combinedString.push(`Patient is currently using ${customPharmacy}.`);
            } else {
                combinedString.push(`Patient is currently using ${localPharmacy}.`);
            }
        }

        /**
         * Fifth Line
         * Exp: Yes - the patient allows CCS Medical to manage and supply their prescription items.
         */
        const convertFivthLine = () => {
            let allowCCS = getValue(112239929);
            if (allowCCS !== null && allowCCS !== "") {
                combinedString.push(allowCCS);
            }
        }

        /**
         * Sixth LIne
         * Exp:  The patient’s next doctor visit is: xx/xx/xxxx.
         */
        const convertSixthLine = () => {
            let nextDoorVisit = getValue(112240105);
            if (nextDoorVisit !== null && nextDoorVisit !== "") {
                combinedString.push(`The patient’s next doctor visit is: ${nextDoorVisit}.`);
            }
        }

        /**
         * Phone Number
         */
        const convertPhoneNumber = () => {
            let phoneNum = getValue(112240192);
            if (phoneNum !== null && phoneNum !== "") {
                combinedString.push(`Pharmacy's phone number: ${phoneNum}.`);
            }
        }

        const convertSeventhLine = () => {
            let reason = getValue(112262767); // Please list reasons the patient does not want CCS to manage their prescriptions
            if (reason !== null && reason !== "") {
                combinedString.push(`Reason: ${reason}.`);
            }
        }

        // Parse fields one by one.
        const doConvertResult = () => {
            convertFirstLine();
            convertSecondLine();
            convertThirdLine();
            convertFourthLine();
            convertFivthLine();
            convertPhoneNumber();
            convertSixthLine();
            convertSeventhLine();
        }
        // const doConvertResult = () => {
        //     let fieldCnt = fields.length;

        //     for (let i = 0; i < fieldCnt; i++) {
        //         let field = fields[i];
        //         let fieldId = parseInt(field.id);
        //         let fieldValue = getVal(fieldId);

        //         if (fieldValue !== null && fieldValue !== "") {
        //             combinedString.push(replacePlaceholder(field.label, fieldValue));
        //         }
        //     }
        // }

        doConvertResult();

        //splitting by row for clarity
        let joinedArr = combinedString.join("\r\n");

        console.log(joinedArr);

        loader.engine.document.getElementById(112240927).setValue(({
            "value": joinedArr
        }));
    }, 1000);
}

window.onchange = joinValues;
