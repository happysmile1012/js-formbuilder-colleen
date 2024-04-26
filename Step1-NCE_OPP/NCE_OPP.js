function joinValues() {
    //mocking
    console.log("mock");
    setTimeout(function () {

        //eventual result value after a join
        let combinedString = [];
        const PLACEHOLDER = "xxyy33zz";

        const fields = [
            {
                id: "111427282",
                label: `CCS Customer Service Representative Email Address: ${PLACEHOLDER}`
            },
            {
                id: "111427281",
                label: `Patient ID: ${PLACEHOLDER}`
            },
            {
                id: "111427283",
                label: `CCS Customer Service Representative Email Address Confirmed: ${PLACEHOLDER}`
            },
            {
                id: "111427284",
                label: `Patient ID Confirmed: ${PLACEHOLDER}`
            },
            {
                id: "111427285",
                label: `Call Type: ${PLACEHOLDER}`
            },
            {
                id: "111427286",
                label: `ADVISED CALLER: ${PLACEHOLDER}`
            },
            {
                id: "111427287",
                label: `Call Reason: ${PLACEHOLDER}`
            },
            {
                id: "111427288",
                label: `Speaking To: ${PLACEHOLDER}`
            },
            {
                id: "111427289",
                label: `Authorized Person Name: ${PLACEHOLDER}`
            },
            {
                id: "111427290",
                label: `Insurance: ${PLACEHOLDER}`
            },
            {
                id: "111427291",
                label: `Go To: ${PLACEHOLDER}`
            },
            {
                id: "111427292",
                label: `Please Try Again: ${PLACEHOLDER}`
            },
            {
                id: "111427296",
                label: `Please verify patient information with the patient: ${PLACEHOLDER}`
            },
            {
                id: "111427297",
                label: `Patient First Name: ${PLACEHOLDER}`
            },
            {
                id: "111427298",
                label: `Patient Last Name: ${PLACEHOLDER}`
            },
            {
                id: "111427310",
                label: `Please verify pump information: ${PLACEHOLDER}`
            },
            {
                id: "111427311",
                label: `Patient is: ${PLACEHOLDER}`
            },
            {
                id: "111427312",
                label: `Patient is: ${PLACEHOLDER}`
            },
            {
                id: "111427313",
                label: `Patient Testing Frequency: ${PLACEHOLDER}`
            },
            {
                id: "111427314",
                label: `Injection Frequency: ${PLACEHOLDER}`
            },
            {
                id: "111427343",
                label: `How many units of insulin do you inject each day?: ${PLACEHOLDER}`
            },
            {
                id: "111427344",
                label: `How long has the patient been injecting three or more times per day?: ${PLACEHOLDER}`
            },
            {
                id: "111427345",
                label: `Current Pump Model: ${PLACEHOLDER}`
            },
            {
                id: "111427346",
                label: `Pump Serial Number: ${PLACEHOLDER}`
            },
            {
                id: "111427347",
                label: `Insurance that Paid: ${PLACEHOLDER}`
            },
            {
                id: "111427348",
                label: `Date of Purchase: ${PLACEHOLDER}`
            },
            {
                id: "111427349",
                label: `Patient has experienced these malfunctions: ${PLACEHOLDER}`
            },
            {
                id: "111427350",
                label: `Other Malfunctions: ${PLACEHOLDER}`
            },
            {
                id: "111427351",
                label: `Patient is electing to get a replacement pump: ${PLACEHOLDER}`
            },
            {
                id: "111427352",
                label: `Patient is currently on a pump and has used it continuously since receiving it on this date: ${PLACEHOLDER}`
            },
            {
                id: "111427356",
                label: `Are you currently using a Medtronic Insulin Pump?: ${PLACEHOLDER}`
            },
            {
                id: "111427357",
                label: `What model of Medtronic Isulin Pump are you using?: ${PLACEHOLDER}`
            },
            {
                id: "111427358",
                label: `Do you want your Medtronic CGM to work with your Medtronic Insulin Pump?: ${PLACEHOLDER}`
            },
            {
                id: "111427359",
                label: `Do you want your Medtronic CGM to work with your cell phone?: ${PLACEHOLDER}`
            },
            {
                id: "111427360",
                label: `Are you currently using a Dexcom CGM with your insulin pump or insulin pen?: ${PLACEHOLDER}`
            },
            {
                id: "111427362",
                label: `Current Brand/Model: ${PLACEHOLDER}`
            },
            {
                id: "111427363",
                label: `Reader/Receiver Serial Number: ${PLACEHOLDER}`
            },
            {
                id: "111427364",
                label: `Insurance that paid: ${PLACEHOLDER}`
            },
            {
                id: "111427365",
                label: `Date of Purchase: ${PLACEHOLDER}`
            },
            {
                id: "111427366",
                label: `Days on Hand: ${PLACEHOLDER}`
            },
            {
                id: "111427367",
                label: `What company/pharmacy did you get your last order of supplies from?: ${PLACEHOLDER}`
            },
            {
                id: "111427368",
                label: `What was the date you received the supplies from your previous supplier?: ${PLACEHOLDER}`
            },
            {
                id: "111427369",
                label: `Have you cancelled with that company/supplier?: ${PLACEHOLDER}`
            },
            {
                id: "111427370",
                label: `Are you administering insulin?: ${PLACEHOLDER}`
            },
            {
                id: "111427371",
                label: `Do you have frequent, recurring hypoglycemic episodes?: ${PLACEHOLDER}`
            },
            {
                id: "111470363",
                label: `Are you planning to use the CGM application on your phone as your reader/receiver?: ${PLACEHOLDER}`
            },
            {
                id: "111427447",
                label: `Reviewed 90 Day physician visits with patient:: ${PLACEHOLDER}`
            },
            {
                id: "111427448",
                label: `Advised Patient of Next Steps: ${PLACEHOLDER}`
            },
            {
                id: "111427449",
                label: `Reorder Process: ${PLACEHOLDER}`
            }
        ];

        // Get value of field id.
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

        // Replace placeholder with real value.
        const replacePlaceholder = (str, replacement) => {
            return str.replace(PLACEHOLDER, replacement);
        };

        // Parse fields one by one.
        const doConvertResult = () => {
            let fieldCnt = fields.length;

            for (let i = 0; i < fieldCnt; i++) {
                let field = fields[i];
                let fieldId = parseInt(field.id);
                let fieldValue = getVal(fieldId);

                if (fieldValue !== null && fieldValue !== "") {
                    combinedString.push(replacePlaceholder(field.label, fieldValue));
                }
            }
        }

        doConvertResult();

        //splitting by row for clarity
        let joinedArr = combinedString.join("\r\n");

        console.log(joinedArr);

        loader.engine.document.getElementById(111427451).setValue(({
            "value": joinedArr
        }));
    }, 1000);
}

window.onchange = joinValues;
