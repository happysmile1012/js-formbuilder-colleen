function joinValues() {
    //mocking
    console.log("mock");
    setTimeout(function () {
        //eventual result value after a join
        let combinedString = [];
        let isValidPWO = false;
        let isValidClinicalNote = false;
        let isValidF2F = false;
        let isValidTestLogs = false;
        let isValidLabs = false;
        let isValidOtherDoc = false;

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
            let patientName = getValue(112322885);
            let callType = getValue(112322887);
            // let callReason = getValue(112322889);    // Removed
            let advisedCaller = getValue(112322888);

            // combinedString.push(`${patientName} spoke for ${callReason}`);
        }

        /**
         * Second Line
         * Exp: Medicare – Dexcom G7 – New System – Documenta.on Follow Up - Attempt #3 – Parachute Order
         */
        const convertSecondLine = () => {
            let patientId = getValue(112322886);
            let insurance = getValue(112323005);                // Insurance
            let goTo = getValue(112323011);                     // Go To:
            let primaryInsurance = getValue(112323017);         // Patient's primary insurance
            let isCorrectInsurance = getValue(112323030);       // Is this the correct insurance
            let secondaryInsurance = getValue(112860482);       // Patient's secondary Insurance
            let isCorrectSecInsurance = getValue(112860610);    // Is this the correct secondary insurance?
            let primaryInsuranceName = getValue(112323033);     // Primary insurance name
            let secondaryInsuranceName = getValue(112860626);   // Secondary insurance name
            // let productRequested = getValue(112323036);      // Product requested
            let isProductRequest = getValue(112323038);         // Is this product request correct?
            let productRequested = getValue(112323056);         // Product requested
            let cgmProductPreferred = getValue(112377175);      // CGM Product Preferred (No - "Is this product request correct?")
            let pumpProductPreferred = getValue(112431412);     // Pump Product Preferred (No - "Is this product request correct?")
            let isFullSysOrSupply = getValue(112323059);        // Is this a full system or supplies only?
            let isThis = getValue(112323064);                   // Is this:
            let whatAttempt = getValue(112323076);              // What attempt is this?
            let isParachuteOrder = getValue(112323077);         // Review the Workflow and special handling notes on the documentation tab.  Is this a Parachute Push Order?
            let patientIs = getValue(112323375);                // Patient is:
            // let requestDocTab = getValue(112343914);     // Removed
            // let pushToParachute = getValue(112343929);   // Removed

            let note = "";
            let isComma = false;
            if (goTo !== "") {
                note = goTo;
                isComma = true;
            }

            if (primaryInsurance !== "") {
                note = note + `${isComma ? `, ` : ``}${primaryInsurance}`;
                isComma = true;
            }

            if (isCorrectInsurance !== "Yes" && primaryInsuranceName !== "") {
                note = note + `${isComma ? `, ` : ``}${primaryInsuranceName}`;
                isComma = true;
            }

            if (secondaryInsurance !== "") {
                note = note + `${isComma ? `, ` : ``}${secondaryInsurance}`;
                isComma = true;
            }

            if (isCorrectSecInsurance !== "Yes" && secondaryInsuranceName !== "") {
                note = note + `${isComma ? `, ` : ``}${secondaryInsuranceName}`;
                isComma = true;
            }

            if (isProductRequest === "Yes" ) {
                if (productRequested !== "") {
                    note = note + `${isComma ? `, ` : ``}${productRequested}`;
                    isComma = true;
                }
            } else {
                if (cgmProductPreferred !== "") {
                    note = note + `${isComma ? `, ` : ``}${cgmProductPreferred}`;
                    isComma = true;
                }

                if (pumpProductPreferred !== "") {
                    note = note + `${isComma ? `, ` : ``}${pumpProductPreferred}`;
                    isComma = true;
                }
            }

            if (isFullSysOrSupply !== "") {
                note = note + `${isComma ? `, ` : ``}${isFullSysOrSupply}`;
                isComma = true;
            }

            if (isThis !== "") {
                note = note + `${isComma ? `, ` : ``}${isThis}`;
                isComma = true;

                if (isThis === "Documentation follow up" && whatAttempt !== "") {
                    note = note + `${isComma ? `, ` : ``}Attempt #${whatAttempt}`;
                    isComma = true;
                }
            }

            if (isParachuteOrder !== "") {
                note = note + `${isComma ? `, ` : ``}${isParachuteOrder}`;
                isComma = true;
            }

            if (patientIs !== "") {
                note = note + `${isComma ? `, ` : ``}Patient is ${patientIs}`;
                isComma = true;
            }

            combinedString.push(`     `);
            combinedString.push(note);
        }

        /**
         * Third Line
         * Exp: Insurance Requires: PWO/F2F-Clinical Notes
         */
        const convertThirdLine = () => {
            let insurances = getValue(112323110);           // What documentation does the insurance checklist show is required for this order?  (Select all that apply)
            let isuranceItems = insurances.replaceAll(',', ' - ');

            combinedString.push(`     `);
            combinedString.push(`Insurance Requires: ${isuranceItems}`);
        }

        /**
         * Consent Line
         * 1. Have Consent – date taken 03/03/2024 and expires 04/02/2024
         */
        const convertConsentLine = () => {
            let isValidConsent = getValue(112323140);       // Is there valid consent?
            let consentDateTaken = getValue(112323143);     // Consent Date Taken
            let consentDateExpires = getValue(112323145);   // Consent Date Expires

            combinedString.push(`     `);
            if (isValidConsent === "Need consent") {
                combinedString.push("   1. Need consent");
            } else {
                combinedString.push(`   1. Have Consent – date taken ${consentDateTaken} and expires ${consentDateExpires}`);
            }
        }

        const convertInsuranceLines = () => {
            let havePwo = getValue(112847017);              // PWO
            let haveCN = getValue(112847019);               // Clinical Notes
            let haveF2F = getValue(112847046);              // Face to Face
            let haveTestLog = getValue(112989680);          // Test Logs
            let haveLabs = getValue(112989681);             // Labs
            let haveOtherDoc = getValue(112989699)          // Other Documentation
            let isPWOValid = getValue(112375817);           // Is the PWO valid?
            let isF2FValid = getValue(112648834);           // Is Face to Face valid?
            let isCNValid = getValue(112648846);            // Are the Clinical Notes Valid?
            let whatCorrectNeedPWO = getValue(112375819);   // What corrections are needed? - PWO
            let whatCorrectNeedCN = getValue(112648848);    // What corrections are needed? - CN
            let whatCorrectNeedF2F = getValue(112648843);   // What corrections are needed? - F2F
            let insurances = getValue(112323110);           // What documentation does the insurance checklist show is required for this order?  (Select all that apply)
            let insuranceItems = insurances.split(',');
            let insuranceCnt = insuranceItems.length;
            let isPacketApproval = getValue(112342179);     // Is this order ready for packet approval?

            for (let i = 0; i < insuranceCnt; i++) {
                combinedString.push(`     `);
                if (insuranceItems[i] === "PWO") {
                    if (whatCorrectNeedPWO !== "")
                        whatCorrectNeedPWO = `- ` + whatCorrectNeedPWO;

                    if (isPWOValid === "Need Corrected PWO") {
                        combinedString.push(`   ${i + 2}. Needs Corrected PWO ${whatCorrectNeedPWO}`);
                    } else {
                        if (isPWOValid !== "") {
                            combinedString.push(`   ${i + 2}. ${isPWOValid} ${whatCorrectNeedPWO}`);
                        } else {
                            combinedString.push(`   ${i + 2}. ${havePwo} ${whatCorrectNeedPWO}`);
                        }
                    }

                    if (havePwo === "Have PWO - Validated" || havePwo === "Have PWO - Needs Review") {
                        isValidPWO = true;
                    }
                } else if (insuranceItems[i] === "Clinical Notes") {
                    if (whatCorrectNeedCN !== "")
                        whatCorrectNeedCN = `- ` + whatCorrectNeedCN;

                    if (isCNValid === "Need Corrected Clinical Notes") {
                        combinedString.push(`   ${i + 2}. Needs Corrected Clinical Notes ${whatCorrectNeedCN}`);
                    } else {
                        if (isCNValid !== "") {
                            combinedString.push(`   ${i + 2}. ${isCNValid} ${whatCorrectNeedCN}`);
                        } else {
                            combinedString.push(`   ${i + 2}. ${haveCN} ${whatCorrectNeedCN}`);
                        }
                    }

                    if (haveCN === "Have Clinical Notes - Validated" || haveCN === "Have Clinical Notes - Needs Review") {
                        isValidClinicalNote = true;
                    }
                } else if (insuranceItems[i] === "Face to Face") {
                    if (whatCorrectNeedF2F !== "")
                        whatCorrectNeedF2F = `- ` + whatCorrectNeedF2F;

                    if (isF2FValid === "Need Corrected Face to Face") {
                        combinedString.push(`   ${i + 2}. Needs Corrected Face to Face ${whatCorrectNeedF2F}`);
                    } else {
                        if (isF2FValid !== "") {
                            combinedString.push(`   ${i + 2}. ${isF2FValid} ${whatCorrectNeedF2F}`);
                        } else {
                            combinedString.push(`   ${i + 2}. ${haveF2F} ${whatCorrectNeedF2F}`);
                        }
                    }

                    if (haveF2F === "Have Face to Face - Validated" || haveF2F === "Have Face to Face - Needs Review") {
                        isValidF2F = true;
                    }
                } else if (insuranceItems[i] === "Test Logs") {
                    combinedString.push(`   ${i + 2}. ${haveTestLog}`);

                    if (haveTestLog === "Have Logs - Validated" || haveTestLog === "Have Logs - Need Review") {
                        isValidTestLogs = true;
                    }
                } else if (insuranceItems[i] === "Labs") {
                    combinedString.push(`   ${i + 2}. ${haveLabs}`);

                    if (haveLabs === "Have Labs - Validated" || haveLabs === "Have Labs - Needs Review") {
                      isValidLabs = true;
                    }
                } else if (insuranceItems[i] === "Other Insurance Specific Documentation") {
                    combinedString.push(`   ${i + 2}. ${haveOtherDoc}`);

                    if (haveOtherDoc === "Have Other Documentation - Validated" || haveOtherDoc === "Have Other Documentation - Need Review") {
                      isValidOtherDoc = true;
                    }
                } else if (insuranceItems[i] === "Pre-Authorization") {
                    combinedString.push(`   ${i + 2}. Need Pre-Authorization`);
                }
                else
                    combinedString.push(`   ${i + 2}. Have ${insuranceItems[i]}`);
            }

            // if (isPacketApproval === "Yes") {
            combinedString.push(`     `);
            combinedString.push(`   ${insuranceCnt + 2}. Need Packet approval`);
            // }
        }

        /**
         * Pwo Line
         * 2. Have PWO
         */
        const convertPwoLine = () => {
            let isCorrectPwoScaned = getValue(112323226);       // Has a new/corrected PWO been scanned in?
            let needPwo = getValue(112323242);                  // Need PWO
            let hasPwoValid = getValue(112323265);              // Has the PWO been validated, and processing notes are in PIMS?
            let havePwo = getValue(112323282);                  // Have PWO
            let copyProcessingNote = (112323293);               // Copy processing notes here:
            // let validPwo = getValue(112323327);                 // Validate PWO
            let enhancedPwo = getValue(112323331);              // Did the HCP use the Enhanced PWO?
            let useInsulin = getValue(112323362);               // Does the PWO state the patient is using insulin?
            let haveHypoglycemic = getValue(112323371);         // Does the patient have hypoglycemic events?

            if (isCorrectPwoScaned === "Yes")
                combinedString.push(`     Has a new/corrected PWO been scanned in?: ${isCorrectPwoScaned}`);

            if (hasPwoValid === "Yes")
                combinedString.push(`     Has the PWO been validated, and processing notes are in PIMS?: ${hasPwoValid}`);

            if (havePwo === "Yes")
                combinedString.push(`     ${havePwo}`);

            if (copyProcessingNote !== "")
                combinedString.push(`     Processing Notes: ${copyProcessingNote}`);

            if (enhancedPwo === "Yes")
                combinedString.push(`     Did the HCP use the Enhanced PWO?: ${enhancedPwo}`)
            else if (enhancedPwo === "No")
                combinedString.push(`     Did the HCP use the Enhanced PWO?: ${enhancedPwo}`)

            if (useInsulin === "Yes PWO states Patient using insulin")
                combinedString.push(`     Patient is using insulin`);
            else if (useInsulin === "No") {
                if (haveHypoglycemic === "Yes – the patient has hypoglycemic episodes")
                    combinedString.push(`     The patient has hypoglycemic episodes`);
                else if (haveHypoglycemic === "No – Patient does not qualify – advised patient and cancelled workflow")
                    combinedString.push(`     Patient does not qualify – advised patient and cancelled workflow`);
            }

        }

        const convertLabLine = () => {
            let requireLab = getValue(112430828);           // Does this order require labs?
            let scanneddLab = getValue(112430830);          // Have new/corrected labs been scanned in?
            let processingNote = getValue(112430870);       // Have they been validated and a processing note is in PIMS?
            let haveLabs = getValue(112430902);             // Have labs
            let cpeptideResult = getValue(112431042);       // Are the labs scanned under C-Peptide results?
            let labScanned = getValue(112431208);           // Where are the labs scanned?
            let labScannedDate = getValue(112431213);       // What date were the labs scanned?
            let labDrawnDate = getValue(112431214);         // What dates were the labs drawn?

            let note = `     `;
            let isNoteAdded = false;

            if (requireLab !== "") {
                note = note + `Does this order require labs?  ${requireLab}`;
                isNoteAdded = true;
            }
                
            if (scanneddLab !== "") {
                note = note + `, Have new/corrected labs been scanned in?  ${scanneddLab}`;
                isNoteAdded = true;
            }
            
            if (processingNote !== "") {
                note = note + `, Have they been validated and a processing note is in PIMS?  ${processingNote}`;
                isNoteAdded = true;
            }
        
            if (haveLabs !== "") {
                note = note + `, Have labs  ${haveLabs}`;
                isNoteAdded = true;
            }
        
            if (cpeptideResult !== "") {
                note = note + `, Are the labs scanned under C-Peptide results?  ${cpeptideResult}`;
                isNoteAdded = true;
            }
        
            if (labScanned !== "") {
                note = note + `, Where are the labs scanned?  ${labScanned}`;
                isNoteAdded = true;
            }
        
            if (labScannedDate !== "") {
                note = note + `, What date were the labs scanned?  ${labScannedDate}`;
                isNoteAdded = true;
            }
        
            if (labDrawnDate !== "") {
                note = note + `, What dates were the labs drawn?  ${labDrawnDate}`;
                isNoteAdded = true;
            }

            if (isNoteAdded) {
                combinedString.push(`    `);
                combinedString.push(`    Lab Processing Notes`);
                combinedString.push(note);
            }
        }

        /**
         * Actions Taken: Confirmed verification is less than 30 days old, SS and order match, Order has been created.
         */
        const convertPacketApprovalLine = () => {
            let isPacketApproval = getValue(112342179);         // Is this order ready for packet approval?
            let isVerificationNote = getValue(112481721);       // Is the verification note less than 30 days old?
            let hasNewOrder = getValue(112481731);              // Has the New Order Processing shipment been created?
            let checkShipmentMatch = getValue(112481734);       // Check to ensure the Standard Shipment matches the shipment created
            let checkDocumentTab = getValue(112481736);         // Check the Documentation Tab in PIMS for Special Handling Instructions. Are there any Special Handling instructions listed?
            let specialHandling = getValue(112484045);          // What are the special handling instructions?
            let patientUpdatePast5Days = getValue(112481804);   // Has the patient been provided with a status update in the past 5 days?
            // let isOrderCreated = getValue(112342089);
            // let isSsCorrectOrder = getValue(112342091);
            // let docTab = getValue(112342171);
            // let preAuth = getValue(112342176);
            let spokeTo1 = getValue(112481953);                 // Spoke to:
            let outcome1 = getValue(112481954);                 // Outcome
            let spokeTo2 = getValue(112481970);                 // Spoke to:
            let outcome2 = getValue(112481972);                 // Outcome
            let actionTakens = getValue(112342184);
            let otherActionTaken = getValue(112607191);         // Other Action Taken:

            combinedString.push(`     `);

            let actionsTakenNote = "";
            let actionsTakenNoteComma = false;
            if (isVerificationNote !== "") {
                actionsTakenNote = actionsTakenNote + isVerificationNote;
                actionsTakenNoteComma = true;
            }

            if (actionTakens !== "") {
                actionsTakenNote = actionsTakenNote + `${actionsTakenNoteComma ? `, ` : ``}` + actionTakens;
                actionsTakenNoteComma = true;
            }

            if (otherActionTaken !== "") {
                actionsTakenNote = actionsTakenNote + `${actionsTakenNoteComma ? `, ` : ``}` + otherActionTaken;
                actionsTakenNoteComma = true;
            }
            
            if (isPacketApproval === "Yes - Need packet approval") {
                if (hasNewOrder !== "") {
                    actionsTakenNote = actionsTakenNote + `${actionsTakenNoteComma ? `, ` : ``}` + hasNewOrder;
                    actionsTakenNoteComma = true;
                }
    
                if (checkShipmentMatch !== "") {
                    actionsTakenNote = actionsTakenNote + `${actionsTakenNoteComma ? `, ` : ``}` + checkShipmentMatch;
                    actionsTakenNoteComma = true;
                }
    
                if (checkDocumentTab !== "") {
                    actionsTakenNote = actionsTakenNote + `${actionsTakenNoteComma ? `, ` : ``}` + checkDocumentTab;
                    actionsTakenNoteComma = true;
                }
    
                if (specialHandling !== "") {
                    actionsTakenNote = actionsTakenNote + `${actionsTakenNoteComma ? `, ` : ``}` + specialHandling;
                    actionsTakenNoteComma = true;
                }
    
                if (patientUpdatePast5Days !== "") {
                    actionsTakenNote = actionsTakenNote + `${actionsTakenNoteComma ? `, ` : ``}` + patientUpdatePast5Days;
                    actionsTakenNoteComma = true;
                }
    
                if (spokeTo1 !== "") {
                    actionsTakenNote = actionsTakenNote + `${actionsTakenNoteComma ? `, ` : ``}` + `Spoke to: ${spokeTo1}`;
                    actionsTakenNoteComma = true;
                }
    
                if (outcome1 !== "") {
                    actionsTakenNote = actionsTakenNote + `${actionsTakenNoteComma ? `, ` : ``}` + `Outcome: ${outcome1}`;
                    actionsTakenNoteComma = true;
                }
            }
    
            if (spokeTo2 !== "") {
                actionsTakenNote = actionsTakenNote + `${actionsTakenNoteComma ? `, ` : ``}` + `Spoke to: ${spokeTo2}`;
                actionsTakenNoteComma = true;
            }

            if (outcome2 !== "") {
                actionsTakenNote = actionsTakenNote + `${actionsTakenNoteComma ? `, ` : ``}` + `Outcome: ${outcome2}`;
                actionsTakenNoteComma = true;
            }

            if (actionsTakenNote !== "") {
                combinedString.push(`     Actions Taken: ${actionsTakenNote}`);
            }
        }

        const convertPWOProcessingNote = () => {

            let havePwo = getValue(112847017);              // PWO
            let copyProcessingNote = getValue(112323293);               // Copy PWO processing notes here:
            let hasPwoValid = getValue(112323265);              // Has the PWO been validated, and processing notes are in PIMS?
            let enhancedPwo = getValue(112323331);              // Did the HCP use the Enhanced PWO?
            let isPwoScanned = getValue(112323454);
            let pwoScannedDate = getValue(112323455);
            let pwoWhatBrand = getValue(112323458);
            let pwoStartDate = getValue(112323597);             // What is the start date of the PWO?
            let isDiagnosisCode = getValue(112323599);          // What is the diagnosis code?
            let diagnosisCode1 = getValue(112375535);           // Diagnosis Code
            let siteChange = getValue(112323602);               // Are site change instructions per manufacturer’s directions”?
            let treatingDoctorSignedPwo = getValue(112323619);  // Who is the treating Doctor that signed the PWO?
            let datePwoSigned = getValue(112323620);            // What is the date the PWO was signed?
            
            combinedString.push(`     `);
            combinedString.push(`     PWO Processing Note:`);
            if (havePwo === "Have PWO - Validated") {
                if (copyProcessingNote !== "") {
                    combinedString.push(`     ${copyProcessingNote}`);
                }
            } else {
                combinedString.push(`     PWO scanned under ${isPwoScanned}. (${pwoScannedDate}) – PWO for (${pwoWhatBrand}), supplies: Start (${pwoStartDate}), ${isDiagnosisCode}, ${diagnosisCode1}, site change: ${siteChange} (${treatingDoctorSignedPwo}) signed (${datePwoSigned})`);
            }
        }

        const convertClinicalNote = () => {
            let haveCN = getValue(112847019);                           // Clinical Notes
            let hasClinicalScannedIn = getValue(112645326);             // Has new/corrected Clinical Notes been scanned in?
            let hasClinicalValidated = getValue(112645327);             // Has the Clinical Notes been validated and processing notes are in PIMS?
            let haveClinicalNotes = getValue(112645328);                // Have Clinical Notes
            let copyProcessingNotes = getValue(112645329);              // Copy processing notes here:
            let newClinicalNoteScanned = getValue(112323725);           // Are there new Clinical Notes Scanned for this order?
            let scannedClinicalNote = getValue(112323750);              // Where are the clinical notes scanned?
            let datePIMS = getValue(112323782);                         // What date was is scanned into PIMS?
            let visitDate = getValue(112323785);                        // What is the visit date on the clinical notes?
            let isDiagnosisCode = getValue(112323786);                  // What is the diagnosis code?
            let diagnosisCode = getValue(112375880);                    // Diagnosis Code
            let siteChangeInstruction = getValue(112430683);            // What are the site change instructions?
            let usingInsulin = getValue(112323807);                     // Do the Clinical Notes state the patient is using insulin?
            let onPage = getValue(112323837);                           // On page:
            let hypoglycemicEvent = getValue(112323854);                // Does the patient have hypoglycemic events?
            let testFreq2Mth = getValue(113035642);                     // Patient Testing Frequency for the past 2 months
            let injectFreq6Mth = getValue(113035644);                   // Patient Injection Frequency for the past 6 months
            let clinicalNotes = getValue(112323923);                    // Clinical Notes are:
            let signedByElectronical = getValue(112323926);             // Electronically signed by:
            let onPage1 = getValue(112323944);                          // On page:
            let isAttestation = getValue(112483915);                    // Is there an attestation?
            let attestationScanned = getValue(112323945);               // Attestation Scanned
            let onPage2 = getValue(112483916);                          // On Page:
            let isComma = false;

            let note = `     `;

            combinedString.push(`     `);
            combinedString.push(`     Clinical Processing Notes:`);

            if (haveCN === "Have Clinical Notes - Validated") {
                if (copyProcessingNotes) {
                    note = note + `${isComma ? `, ` : ``}${copyProcessingNotes}`;
                    isComma = true;
                }
            } else {
                // if (newClinicalNoteScanned !== "Yes")
                //     return;
    
                if (hasClinicalScannedIn) {
                    note = note + `Has new/corrected Clinical Notes been scanned in? ${hasClinicalScannedIn}`;
                    isComma = true;
                }
                if (hasClinicalValidated) {
                    note = note + `${isComma ? `, ` : ``}Has the Clinical Notes been validated and processing notes are in PIMS? ${hasClinicalValidated}`;
                    isComma = true;
                }
                if (haveClinicalNotes) {
                    note = note + `${isComma ? `, ` : ``}${haveClinicalNotes}`;
                    isComma = true;
                }
    
                if (scannedClinicalNote !== "") {
                    note = note + `${isComma ? `, ` : ``}Clinical notes scanned? ${scannedClinicalNote}`;
                    isComma = true;
                }
    
                if (datePIMS !== "") {
                    note = note + `${isComma ? `, ` : ``}Office notes scanned under Clinical Notes (${datePIMS})`;
                    isComma = true;
                }
    
                if (visitDate !== "") {
                    note = note + ` for (${visitDate}) visit:`;
                }
    
                if (isDiagnosisCode !== "" || diagnosisCode !== "") {
                    note = note + ` show (${isDiagnosisCode} ${diagnosisCode})`;
                }

                if (testFreq2Mth !== "" && injectFreq6Mth !== "") {
                    note = note + `${isComma ? `, ` : ``}Testing (${testFreq2Mth}) for at least 2 months on page (${onPage1}) and (${injectFreq6Mth}) for 6 months on page (${onPage2}).`;
                    isComma = true;
                }
    
                // if (usingInsulin !== "") {
                //     note = note + `${isComma ? `, ` : ``}${usingInsulin}`;
                //     isComma = true;
                // }
    
                if (clinicalNotes !== "") {
                    if (clinicalNotes === "Electronically signed") {
                      note = note + ` Electronic signature (${signedByElectronical}/${onPage1}).`;
                    }
                }
    
                if (isAttestation === "Yes") {
                    note = note + ` OR Attestation Scanned (${attestationScanned}/${onPage2})`;
                }
            }

            combinedString.push(note);
        }

        const convertF2FLine = () => {
            // let hasF2FScannedIn = getValue(112641343);      // Has new/corrected Face to Face been scanned in?
            // let hasF2FValidated = getValue(112641345);      // Has the Face to Face been validated and processing notes are in PIMS?
            let haveF2F = getValue(112847046);              // Face to Face
            let haveF2FNotes = getValue(112641482);              // Have Face to Face
            let copyProcessingNote = getValue(112642137);   // Copy processing notes here:
            let face2faceDocument = getValue(112375836);    // Are you reviewing clinical notes or face to face document?
            let validF2F = getValue(112323639);             // Do you have valid Face to Face Records?
            let scannedF2F = getValue(112323656);           // Where is the Face to Face scanned?
            let datePIMS = getValue(112323672);             // What date was is scanned into PIMS?
            let visitDateF2F = getValue(112323673);         // What is the visit date on the Face to Face?
            let diagnosisCode = getValue(112323674);        // What is the diagnosis code?
            let diagnosisCodeNum = getValue(112375545);     // "Diagnosis Code            
            let isPatientInsulin = getValue(112323683);     
            let usePatientInsulin = getValue(112323684);    // Does the Face to Face state the patient is using insulin?
            let onPage1 = getValue(112323692);              // On page:
            let hypoglycemic = getValue(112323695);         // Does the patient have hypoglycemic events?
            let onPage2 = getValue(112324474);              // On page:
            let isFace2Face = getValue(112323699);          // Face to Face is:
            let signedByFace2Face = getValue(112323704);    // Face to Face Electronically Signed by:
            let signedOnFace2Face = getValue(112323705);    // Face to Face Electronically Signed on Page:
            // let whatCorrtNeeded = getValue(112648843);      // What corrections are needed?
            // let scanAttestation = getValue(112323724);      // Attestation Scanned

            let isComma = false;
            let note = "";

            combinedString.push(`     `);
            combinedString.push(`     Face to Face Processing Notes`);
            
            if (haveF2F === "Have Face to Face - Validated") {
                if (copyProcessingNote) {
                    note = note + `${isComma ? `, ` : ``}${copyProcessingNote}`;
                    isComma = true;
                }
            } else {
                note = `F2F Note: Office notes scanned under Clinical Notes ${visitDateF2F !== "" ? `(${visitDateF2F})` : ``}`;
                
                if (haveF2FNotes) {
                    note = note + `, ${haveF2FNotes}`;
                }
    
                if (copyProcessingNote) {
                    note = note + `, ${copyProcessingNote}`;
                }
    
                if (validF2F !== "") {
                    // note = note + `, ${validF2F}`;
                }
    
                if (scannedF2F !== "") {
                    // note = note + `, Face2Face scanned on ${scannedF2F}`;
                }
    
                if (datePIMS !== "") {
                    note = note + `, PIMS scanned Date: ${datePIMS}`;
                }
    
                if (diagnosisCode !== "" || diagnosisCodeNum !== "") {
                    note = note + `, Diagnosis Code: ${diagnosisCode} ${diagnosisCodeNum}`;
                }
    
                if (usePatientInsulin !== "") {
                    note = note + `, ${usePatientInsulin}`;
                }
    
                if (hypoglycemic !== "") {
                    note = note + `, Does the patient have hypoglycemic events? ${hypoglycemic}`;
                }
    
                // if (isFace2Face !== "") {
                //     note = note + `, Face2Face is Electronically Signed`;
                // }
    
                if (signedByFace2Face !== "") {
                    note = note + `, Signed by: ${signedByFace2Face}`;
                }
    
                if (signedOnFace2Face !== "") {
                    note = note + `, Signed on Page: ${signedOnFace2Face}`;
                }
    
                // if (isF2FValid !== "") {
                //     note = note + `, Is Face to Face valid? ${isF2FValid}`;
                // }
    
                // if (whatCorrtNeeded !== "") {
                //     note = note + `, What corrections are needed? ${whatCorrtNeeded}`;
                // }
    
                // if (scanAttestation !== "")
                //     combinedString.push(`     Attestation Scanned on ${scanAttestation}`);
            }
            
            combinedString.push(`     ${note}`);
        }

        const convertExtraLine = () => {
            let cPeptideResult = getValue(112431216);       // What is the C-Peptide result?
            let cPeptideRange = getValue(112431219);        // What is the C-Peptide Range?
            let cPeptideRangeLow = getValue(112991048);     // C-Peptide Range (Low)
            let cPeptideRangeHigh = getValue(112991049);    // C-Peptide Range (High)
            let calcCPeptideResult = getValue(112990091);   // C-Peptide result
            let doLabpatientWas = getValue(112431237);      // Do the labs state that the patient was fasting?
            let fastingNoteonPage = getValue(112431239);    // What page is the fasting note on?
            let fastingBlood = getValue(112431241);         // What is the patient's fasting blood glucose reading?
            let fastingBlookPage = getValue(112431243);     // What page is the fasting blood glucose reading on?
            let betaCellTestResult = getValue(112431245);   // Are you including Beta Cell Test Results?
            let betaCellName = getValue(112431249);         // Name of Beta Cell Test:
            let betaCellResult = getValue(112431254);       // Result of Beta Cell Test:
            let betaCellRange = getValue(112431271);        // Range of Beta Cell Test:
            let incCreatinine = getValue(112431272);        // Are you also including Creatinine Clearance/GFR?
            let dateGFR = getValue(112431280);              // What is the date the GFR was collected?
            let testGFR = getValue(112431282);              // What is the GFR test result?
            let clinicalNotestate = getValue(112431283);    // Do the clinical notes state the patient has renal insufficiency?
            let pageRenalInsuff = getValue(112431291);      // What page is renal insufficiency mentioned on?
            let resultMention = getValue(112431360);        // You cannot use this result without mention of renal insufficiency in the clinical notes.
            // let whatCorrtNeeded = getValue(112648848);      // What corrections are needed?

            let isResultLessEq225 = getValue(112761604);    // Is the result less than or equal 225?
            let wereTheLabsDrawn = getValue(112761651);     // Were the labs drawn concurrent?
            let isThereFastingNo = getValue(112761654);     // Is there a fasting notation on the Labs?
            let labsMeetAllMedi = getValue(112761704);      // Labs meet all Medicare Guidelines
            let testNameResult = getValue(112761706);       // Test Name and Result
            let action = getValue(112761709);               // Action:
            let isResultLess110 = getValue(112761221);      // Is the result less than or equal to 110% of the lower range?
            let isResultLess200 = getValue(112761457);      // Is the result less than or equal to 200% of the lower range?
            let nocpeptide = getValue(112761524);           // No- cpeptide would not qualify. Contact HCP to request eGFR if available.
            let isThereEGFR = getValue(112761475);          // Is there a eGFR result
            let areClinicalNote = getValue(112761476);      // Are there clinical notes on file that indicate renal insufficiency?

            let isComma = false;

            combinedString.push(`     `);

            let note = `     `;
            if (cPeptideResult !== "") {
                note = note + `What is the C-Peptide result? ${cPeptideResult}`;
                isComma = true;
            }
            
            if (cPeptideRange !== "") {
                note = note + `${isComma ? ', ' : ''}What is the C-Peptide Range? ${cPeptideRange}`;
                isComma = true;
            }
            
            if (cPeptideRangeLow !== "") {
                note = note + `${isComma ? ', ' : ''}C-Peptide Range (Low): ${cPeptideRangeLow}`;
                isComma = true;
            }
            
            if (cPeptideRangeHigh !== "") {
                note = note + `${isComma ? ', ' : ''}C-Peptide Range (High): ${cPeptideRangeHigh}`;
                isComma = true;
            }
            
            if (cPeptideResult !== "" && cPeptideRangeLow !== "") {
                let cPeptideRangeLowHash = loader.engine.document.getElementById(112761221).hash;
                let cPeptideRangeHighHash = loader.engine.document.getElementById(112761457).hash;
                let cPeptideResultVal = parseFloat(cPeptideResult);
                let cPeptideRangeLowVal = parseFloat(cPeptideRangeLow);
                let calcCPeptideResultVal = (cPeptideResultVal / cPeptideRangeLowVal * 100).toFixed(2);
                let calcCPeptideResultValPercent = calcCPeptideResultVal + "%";

                loader.engine.document.getElementById(112990091).setValue(({
                    "value": calcCPeptideResultValPercent
                }));
            
                if (calcCPeptideResultValPercent !== "") {
                    note = note + `${isComma ? ', ' : ''}C-Peptide result: ${calcCPeptideResultValPercent}`;
                    isComma = true;
                }


                if (calcCPeptideResultVal <= 110) {
                  document.getElementById(cPeptideRangeLowHash + "_0").checked = true;
                  document.getElementById(cPeptideRangeLowHash + "_0").nextSibling.setAttribute("aria-checked", true);
                  document.getElementById(cPeptideRangeLowHash + "_0").parentElement.parentElement.setAttribute("data-is-checked", "1");
                  document.getElementById(cPeptideRangeLowHash + "_1").checked = false;
                  document.getElementById(cPeptideRangeLowHash + "_1").nextSibling.setAttribute("aria-checked", false);
                  document.getElementById(cPeptideRangeLowHash + "_1").parentElement.parentElement.setAttribute("data-is-checked", "0");
                  isResultLess110 = "Yes";
                  // loader.engine.document.getElementById(112761221).setValue(({
                  //     "value": "Yes"
                  // }));
                } else {
                  document.getElementById(cPeptideRangeLowHash + "_0").checked = false;
                  document.getElementById(cPeptideRangeLowHash + "_0").nextSibling.setAttribute("aria-checked", false);
                  document.getElementById(cPeptideRangeLowHash + "_0").parentElement.parentElement.setAttribute("data-is-checked", "0");
                  document.getElementById(cPeptideRangeLowHash + "_1").checked = true;
                  document.getElementById(cPeptideRangeLowHash + "_1").nextSibling.setAttribute("aria-checked", true);
                  document.getElementById(cPeptideRangeLowHash + "_1").parentElement.parentElement.setAttribute("data-is-checked", "1");
                  isResultLess110 = "No";
                  // loader.engine.document.getElementById(112761221).setValue(({
                  //     "value": "No"
                  // }));
                }

                if (calcCPeptideResultVal <= 200) {
                  document.getElementById(cPeptideRangeHighHash + "_0").checked = true;
                  document.getElementById(cPeptideRangeHighHash + "_0").nextSibling.setAttribute("aria-checked", true);
                  document.getElementById(cPeptideRangeHighHash + "_0").parentElement.parentElement.setAttribute("data-is-checked", "1");
                  document.getElementById(cPeptideRangeHighHash + "_1").checked = false;
                  document.getElementById(cPeptideRangeHighHash + "_1").nextSibling.setAttribute("aria-checked", false);
                  document.getElementById(cPeptideRangeHighHash + "_1").parentElement.parentElement.setAttribute("data-is-checked", "0");
                  isResultLess200 = "Yes";
                  // loader.engine.document.getElementById(112761457).setValue(({
                  //     "value": "Yes"
                  // }));
                } else {
                  document.getElementById(cPeptideRangeHighHash + "_0").checked = false;
                  document.getElementById(cPeptideRangeHighHash + "_0").nextSibling.setAttribute("aria-checked", false);
                  document.getElementById(cPeptideRangeHighHash + "_0").parentElement.parentElement.setAttribute("data-is-checked", "0");
                  document.getElementById(cPeptideRangeHighHash + "_1").checked = true;
                  document.getElementById(cPeptideRangeHighHash + "_1").nextSibling.setAttribute("aria-checked", true);
                  document.getElementById(cPeptideRangeHighHash + "_1").parentElement.parentElement.setAttribute("data-is-checked", "1");
                  isResultLess200 = "No";
                  // loader.engine.document.getElementById(112761457).setValue(({
                  //     "value": "No"
                  // }));
                }
            }

            if (doLabpatientWas !== "") {
                note = note + `${isComma ? ', ' : ''}Do the labs state that the patient was fasting? ${doLabpatientWas}`;
                isComma = true;
            }

            if (doLabpatientWas === "Patient was fasting") {
                if (fastingNoteonPage !== "") {
                    note = note + `${isComma ? ', ' : ''}What page is the fasting note on? ${fastingNoteonPage}`;
                    isComma = true;
                }
                
                if (fastingBlood !== "") {
                    note = note + `${isComma ? ', ' : ''}What is the patient's fasting blood glucose reading? ${fastingBlood}`;
                    isComma = true;
                }

                if (fastingBlookPage !== "") {
                    note = note + `${isComma ? ', ' : ''}What page is the fasting blood glucose reading on? ${fastingBlookPage}`;
                    isComma = true;
                }
            }
            
            if (isResultLessEq225 !== "") {
                note = note + `${isComma ? ', ' : ''}${isResultLessEq225}`;
                isComma = true;
            }
            
            if (wereTheLabsDrawn !== "") {
                note = note + `${isComma ? ', ' : ''}${wereTheLabsDrawn}`;
                isComma = true;
            }
            
            if (isThereFastingNo !== "") {
                note = note + `${isComma ? ', ' : ''}${isThereFastingNo}`;
                isComma = true;
            }
            
            if (labsMeetAllMedi !== "") {
                note = note + `${isComma ? ', ' : ''}${labsMeetAllMedi}`;
                isComma = true;
            }
            
            if (testNameResult !== "") {
                note = note + `${isComma ? ', ' : ''}${testNameResult}`;
                isComma = true;
            }
            
            if (action !== "") {
                note = note + `${isComma ? ', ' : ''}${action}`;
                isComma = true;
            }
            
            if (isResultLess110 !== "") {
                note = note + `${isComma ? ', ' : ''}Is the result less than or equal to 110% of the lower range? ${isResultLess110}`;
                isComma = true;
            }
            
            if (isResultLess200 !== "") {
                note = note + `${isComma ? ', ' : ''}Is the result less than or equal to 200% of the lower range? ${isResultLess200}`;
                isComma = true;
            }
            
            if (nocpeptide !== "") {
                note = note + `${isComma ? ', ' : ''}${nocpeptide}`;
                isComma = true;
            }
            
            if (isThereEGFR !== "") {
                note = note + `${isComma ? ', ' : ''}${isThereEGFR}`;
                isComma = true;
            }
            
            if (areClinicalNote !== "") {
                note = note + `${isComma ? ', ' : ''}${areClinicalNote}`;
                isComma = true;
            }

            if (betaCellTestResult !== "") {
                note = note + `${isComma ? ', ' : ''}Are you including Beta Cell Test Results? ${betaCellTestResult}`;
                isComma = true;
            }

            if (betaCellTestResult === "Yes") {
                if (betaCellName !== "") {
                    note = note + `${isComma ? ', ' : ''}Name of Beta Cell Test: ${betaCellName}`;
                    isComma = true;
                }
                
                if (betaCellResult !== "") {
                    note = note + `${isComma ? ', ' : ''}Result of Beta Cell Test: ${betaCellResult}`;
                    isComma = true;
                }
                
                if (betaCellRange !== "") {
                    note = note + `${isComma ? ', ' : ''}Range of Beta Cell Test: ${betaCellRange}`;
                    isComma = true;
                }
            }

            if (incCreatinine !== "") {
                note = note + `${isComma ? ', ' : ''}Are you also including Creatinine Clearance/GFR? ${incCreatinine}`;
                isComma = true;
            }
            
            if (incCreatinine === "Yes") {
                if (dateGFR !== "") {
                    note = note + `${isComma ? ', ' : ''}What is the date the GFR was collected? ${dateGFR}`;
                    isComma = true;
                }

                if (testGFR !== "") {
                    note = note + `${isComma ? ', ' : ''}What is the GFR test result? ${testGFR}`;
                    isComma = true;
                }
            }

            if (clinicalNotestate === "Yes") {
                if (pageRenalInsuff !== "") {
                    note = note + `${isComma ? ', ' : ''}What page is renal insufficiency mentioned on? ${pageRenalInsuff}`;
                    isComma = true;
                }
            } else {
                if (resultMention !== "") {
                    note = note + `${isComma ? ', ' : ''}You cannot use this result without mention of renal insufficiency in the clinical notes. ${resultMention}`;
                    isComma = true;
                }
            }

            // if (clinicalNoteValid !== "") {
            //     note = note + `${isComma ? ', ' : ''}Are the Clinical Notes Valid? ${clinicalNoteValid}`;
            //     isComma = true;
            // }

            // if (whatCorrtNeeded !== "") {
            //     note = note + `${isComma ? ', ' : ''}What corrections are needed? ${whatCorrtNeeded}`;
            //     isComma = true;
            // }

            combinedString.push(note);
        }

        // Parse fields one by one.
        const doConvertResult = () => {
            convertFirstLine();
            convertSecondLine();
            convertThirdLine();
            convertConsentLine();
            convertInsuranceLines();
            convertPacketApprovalLine();

            if (isValidPWO) {
                convertPWOProcessingNote();
            }

            if (isValidClinicalNote) {
                convertClinicalNote();
            }

            if (isValidF2F) {
                convertF2FLine();
            }

            if (isValidLabs) {
                convertLabLine();
            }
            convertExtraLine();
        }
        
        const changeConsentDateExpire = () => {
            let consentDateTaken = getValue(112323143);     // Consent Date Taken
            let consentDateExpires = getValue(112323145);   // Consent Date Expires

            if (consentDateTaken === "" && !isValidDateFormat(consentDateTaken))
                return;

            let date30DaysLater = getDate30DaysLater(consentDateTaken);
            loader.engine.document.getElementById(112323145).setValue(({
                "value": date30DaysLater
            }));
        }

        changeConsentDateExpire();
        doConvertResult();

        //splitting by row for clarity
        let joinedArr = combinedString.join("\r\n");

        console.log(joinedArr);

        loader.engine.document.getElementById(112322910).setValue(({
            "value": joinedArr
        }));

        // let tagConsentDateTaken = loader.engine.document.getElementById(112322910)
    }, 1000);
}

window.onchange = joinValues;
