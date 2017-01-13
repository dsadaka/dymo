//----------------------------------------------------------------------------
//
//  $Id: PreviewAndPrintLabel.js 11419 2010-04-07 21:18:22Z vbuzuev $ 
//
// Project -------------------------------------------------------------------
//
//  DYMO Label Framework
//
// Content -------------------------------------------------------------------
//
//  DYMO Label Framework JavaScript Library Samples: Preview and Print label
//
//----------------------------------------------------------------------------
//
//  Copyright (c), 2010, Sanford, L.P. All Rights Reserved.
//
//----------------------------------------------------------------------------


(function () {
    // stores loaded label info
    var label;
    const LABEL_FIELDS = ['name', 'dob_dd', 'dob_mm', 'dob_yyyy']
    const FORM_FIELD_IDS = ['visitor_name', 'dob_dd', 'dob_mm', 'dob_yyyy']

    // called when the document completly loaded
    function onload() {
        var labelFile = document.getElementById('labelFile');
        // var addressTextArea = document.getElementById('addressTextArea');
        var inputFormArea = document.getElementById('input_form');
        var printersSelect = document.getElementById('printersSelect');
        var printButton = document.getElementById('printButton');


        // initialize controls
        printButton.disabled = true;
        // addressTextArea.disabled = true;

        // Generates label preview and updates corresponend <img> element
        // Note: this does not work in IE 6 & 7 because they don't support data urls
        // if you want previews in IE 6 & 7 you have to do it on the server side
        function updatePreview() {
            if (!label)
                return;

            var pngData = label.render();

            var labelImage = document.getElementById('labelImage');
            labelImage.src = "data:image/png;base64," + pngData;
        }

        // loads all supported printers into a combo box 
        function loadPrinters() {
            var printers = dymo.label.framework.getPrinters();
            if (printers.length == 0) {
                alert("No DYMO printers are installed. Install DYMO printers.");
                return;
            }

            for (var i = 0; i < printers.length; i++) {
                var printer = printers[i];
                if (printer.printerType == "LabelWriterPrinter") {
                    var printerName = printer.name;

                    var option = document.createElement('option');
                    option.value = printerName;
                    option.appendChild(document.createTextNode(printerName));
                    printersSelect.appendChild(option);
                }
            }
        }

        // returns current address on the label 
        function getAddress() {
            if (!label || label.getAddressObjectCount() == 0)
                return "";

            return label.getAddressText(0);
        }

        // Initialize label fields
        function initLabelFields() {
            var today = new Date();
            var today_dd = today.getDate();
            var today_mm = today.getMonth()+1;
            var today_yyyy = today.getFullYear();
            label.setObjectText('today_mm', padL(today_mm.toString(),1));
            label.setObjectText('today_dd', padL(today_dd.toString(),1));
            label.setObjectText('today_yyyy', today_yyyy.toString());
        }
        // For now, init form fields to values of label fields
        function initFormFields() {
            $('#visitor_specimen_id').val(label.getObjectText('specimen_id'));
            $('#visitor_name').val(label.getObjectText('name'));
            // $('#visitor_dob_2i').val(label.getObjectText('dob_mm'));
            // $('#visitor_dob_3i').val(label.getObjectText('dob_dd'));
            // $('#visitor_dob_1i').val(label.getObjectText('dob_yyyy'));
        }

        // Update fields in label
        function updateLabelFields() {
            var objs = label.getObjectNames();
            label.setObjectText('name', $('#visitor_name').val())
            label.setObjectText('specimen_id', $('#visitor_specimen_id').val());
            label.setObjectText('dob_mm', padL($('#visitor_dob_2i').val(),1));
            label.setObjectText('dob_dd', padL($('#visitor_dob_3i').val(),1));
            label.setObjectText('dob_yyyy', ("0000" + $('#visitor_dob_1i').val()).slice(-4));
        };

        // set current address on the label 
        function setAddress(address) {
            if (!label || label.getAddressObjectCount() == 0)
                return;

            return label.setAddressText(0, address);
        }


        // updates address on the label when user types in textarea field
        // addressTextArea.onkeyup = function () {
        inputFormArea.onkeyup = function () {
            if (!label) {
                alert('Load label before entering address data');
                return;
            }

            // setAddress(addressTextArea.value);
            updateLabelFields();
            updatePreview();
        }

        // prints the label
        printButton.onclick = function () {
            try {
                if (!label) {
                    alert("Load label before printing");
                    return;
                }

                //alert(printersSelect.value);
                label.print(printersSelect.value);
                //label.print("unknown printer");
            }
            catch (e) {
                alert(e.message || e);
            }
        }
        function getAddressLabelXml() {

            var labelXml = '<?xml version="1.0" encoding="utf-8"?>\
                <DieCutLabel Version="8.0" Units="twips">\
                <PaperOrientation>Landscape</PaperOrientation>\
                <Id>Small30336</Id>\
                <PaperName>30336 1 in x 2-1/8 in</PaperName>\
            <DrawCommands>\
            <RoundRectangle X="0" Y="0" Width="1440" Height="3060" Rx="180" Ry="180"/>\
                </DrawCommands>\
                <ObjectInfo>\
                <TextObject>\
                <Name>date_text</Name>\
                <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/>\
                <BackColor Alpha="0" Red="255" Green="255" Blue="255"/>\
                <LinkedObjectName></LinkedObjectName>\
                <Rotation>Rotation0</Rotation>\
                <IsMirrored>False</IsMirrored>\
                <IsVariable>False</IsVariable>\
                <HorizontalAlignment>Center</HorizontalAlignment>\
                <VerticalAlignment>Bottom</VerticalAlignment>\
                <TextFitMode>None</TextFitMode>\
                <UseFullFontHeight>True</UseFullFontHeight>\
                <Verticalized>False</Verticalized>\
                <StyledText>\
                <Element>\
                <String>DOB: ___/___/____  Date: __/__/___</String>\
            <Attributes>\
            <Font Family="Arial" Size="8" Bold="False" Italic="False" Underline="False" Strikeout="False"/>\
                <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/>\
                </Attributes>\
                </Element>\
                </StyledText>\
                </TextObject>\
                <Bounds X="129.5999" Y="1141.291" Width="2846.4" Height="160"/>\
                </ObjectInfo>\
                <ObjectInfo>\
                <BarcodeObject>\
                <Name>specimen_id</Name>\
                <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/>\
                <BackColor Alpha="255" Red="255" Green="255" Blue="255"/>\
                <LinkedObjectName></LinkedObjectName>\
                <Rotation>Rotation0</Rotation>\
                <IsMirrored>False</IsMirrored>\
                <IsVariable>True</IsVariable>\
                <Text>K3G3KEJR</Text>\
                <Type>Code39CS</Type>\
                <Size>Small</Size>\
                <TextPosition>Bottom</TextPosition>\
                <TextFont Family=".SF NS Text" Size="9" Bold="False" Italic="False" Underline="False" Strikeout="False"/>\
                <CheckSumFont Family=".SF NS Text" Size="10" Bold="False" Italic="False" Underline="False" Strikeout="False"/>\
                <TextEmbedding>None</TextEmbedding>\
                <ECLevel>0</ECLevel>\
                <HorizontalAlignment>Center</HorizontalAlignment>\
                <QuietZonesPadding Left="0" Right="0" Top="0" Bottom="0"/>\
                </BarcodeObject>\
                <Bounds X="209.5999" Y="105.3734" Width="2540" Height="360"/>\
                </ObjectInfo>\
                <ObjectInfo>\
                <TextObject>\
                <Name>name</Name>\
                <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/>\
                <BackColor Alpha="0" Red="255" Green="255" Blue="255"/>\
                <LinkedObjectName></LinkedObjectName>\
                <Rotation>Rotation0</Rotation>\
                <IsMirrored>False</IsMirrored>\
                <IsVariable>True</IsVariable>\
                <HorizontalAlignment>Left</HorizontalAlignment>\
                <VerticalAlignment>Top</VerticalAlignment>\
                <TextFitMode>ShrinkToFit</TextFitMode>\
                <UseFullFontHeight>True</UseFullFontHeight>\
                <Verticalized>False</Verticalized>\
                <StyledText>\
                <Element>\
                <String>Dan the Man</String>\
            <Attributes>\
            <Font Family="Arial" Size="9" Bold="False" Italic="False" Underline="False" Strikeout="False"/>\
                <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/>\
                </Attributes>\
                </Element>\
                </StyledText>\
                </TextObject>\
                <Bounds X="1033.065" Y="535.6141" Width="1871.647" Height="263.9215"/>\
                </ObjectInfo>\
                <ObjectInfo>\
                <TextObject>\
                <Name>dob_mm</Name>\
                <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/>\
                <BackColor Alpha="0" Red="255" Green="255" Blue="255"/>\
                <LinkedObjectName></LinkedObjectName>\
                <Rotation>Rotation0</Rotation>\
                <IsMirrored>False</IsMirrored>\
                <IsVariable>True</IsVariable>\
                <HorizontalAlignment>Left</HorizontalAlignment>\
                <VerticalAlignment>Top</VerticalAlignment>\
                <TextFitMode>ShrinkToFit</TextFitMode>\
                <UseFullFontHeight>True</UseFullFontHeight>\
                <Verticalized>False</Verticalized>\
                <StyledText>\
                <Element>\
                <String>06</String>\
                <Attributes>\
                <Font Family="Helvetica" Size="13" Bold="False" Italic="False" Underline="False" Strikeout="False"/>\
                <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/>\
                </Attributes>\
                </Element>\
                </StyledText>\
                </TextObject>\
                <Bounds X="699.0085" Y="1120.798" Width="330.9703" Height="219.6484"/>\
                </ObjectInfo>\
                <ObjectInfo>\
                <TextObject>\
                <Name>dob_dd</Name>\
                <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/>\
                <BackColor Alpha="0" Red="255" Green="255" Blue="255"/>\
                <LinkedObjectName></LinkedObjectName>\
                <Rotation>Rotation0</Rotation>\
                <IsMirrored>False</IsMirrored>\
                <IsVariable>True</IsVariable>\
                <HorizontalAlignment>Left</HorizontalAlignment>\
                <VerticalAlignment>Bottom</VerticalAlignment>\
                <TextFitMode>ShrinkToFit</TextFitMode>\
                <UseFullFontHeight>True</UseFullFontHeight>\
                <Verticalized>False</Verticalized>\
                <StyledText>\
                <Element>\
                <String>09</String>\
                <Attributes>\
                <Font Family="Helvetica" Size="13" Bold="False" Italic="False" Underline="False" Strikeout="False"/>\
                <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/>\
                </Attributes>\
                </Element>\
                </StyledText>\
                </TextObject>\
                <Bounds X="1008.821" Y="1021.582" Width="263.9215" Height="263.9215"/>\
                </ObjectInfo>\
                <ObjectInfo>\
                <TextObject>\
                <Name>dob_yyyy</Name>\
                <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/>\
                <BackColor Alpha="0" Red="255" Green="255" Blue="255"/>\
                <LinkedObjectName></LinkedObjectName>\
                <Rotation>Rotation0</Rotation>\
                <IsMirrored>False</IsMirrored>\
                <IsVariable>True</IsVariable>\
                <HorizontalAlignment>Left</HorizontalAlignment>\
                <VerticalAlignment>Bottom</VerticalAlignment>\
                <TextFitMode>None</TextFitMode>\
                <UseFullFontHeight>True</UseFullFontHeight>\
                <Verticalized>False</Verticalized>\
                <StyledText>\
                <Element>\
                <String>1959</String>\
                <Attributes>\
                <Font Family="Helvetica" Size="8" Bold="False" Italic="False" Underline="False" Strikeout="False"/>\
                <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/>\
                </Attributes>\
                </Element>\
                </StyledText>\
                </TextObject>\
                <Bounds X="1272.805" Y="1031.504" Width="433.0073" Height="263.9215"/>\
                </ObjectInfo>\
                <ObjectInfo>\
                <TextObject>\
                <Name>lblName</Name>\
                <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/>\
                <BackColor Alpha="0" Red="255" Green="255" Blue="255"/>\
                <LinkedObjectName></LinkedObjectName>\
                <Rotation>Rotation0</Rotation>\
                <IsMirrored>False</IsMirrored>\
                <IsVariable>True</IsVariable>\
                <HorizontalAlignment>Left</HorizontalAlignment>\
                <VerticalAlignment>Top</VerticalAlignment>\
                <TextFitMode>ShrinkToFit</TextFitMode>\
                <UseFullFontHeight>True</UseFullFontHeight>\
                <Verticalized>False</Verticalized>\
                <StyledText>\
                <Element>\
                <String>Name:</String>\
            <Attributes>\
            <Font Family=".SF NS Text" Size="8" Bold="False" Italic="False" Underline="False" Strikeout="False"/>\
                <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/>\
                </Attributes>\
                </Element>\
                </StyledText>\
                </TextObject>\
                <Bounds X="206.6921" Y="515.3525" Width="599.3627" Height="263.9215"/>\
                </ObjectInfo>\
                <ObjectInfo>\
                <TextObject>\
                <Name>TEXT</Name>\
                <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/>\
                <BackColor Alpha="0" Red="255" Green="255" Blue="255"/>\
                <LinkedObjectName></LinkedObjectName>\
                <Rotation>Rotation0</Rotation>\
                <IsMirrored>False</IsMirrored>\
                <IsVariable>False</IsVariable>\
                <HorizontalAlignment>Left</HorizontalAlignment>\
                <VerticalAlignment>Top</VerticalAlignment>\
                <TextFitMode>None</TextFitMode>\
                <UseFullFontHeight>True</UseFullFontHeight>\
                <Verticalized>False</Verticalized>\
                <StyledText>\
                <Element>\
                <String>Signature:</String>\
            <Attributes>\
            <Font Family=".SF NS Text" Size="8" Bold="False" Italic="False" Underline="False" Strikeout="False"/>\
                <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/>\
                </Attributes>\
                </Element>\
                </StyledText>\
                </TextObject>\
                <Bounds X="187.365" Y="840.8025" Width="988.5121" Height="263.9215"/>\
                </ObjectInfo>\
                <ObjectInfo>\
                <ShapeObject>\
                <Name>sig_border</Name>\
                <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/>\
                <BackColor Alpha="0" Red="255" Green="255" Blue="255"/>\
                <LinkedObjectName></LinkedObjectName>\
                <Rotation>Rotation0</Rotation>\
                <IsMirrored>False</IsMirrored>\
                <IsVariable>False</IsVariable>\
                <ShapeType>HorizontalLine</ShapeType>\
                <LineWidth>20</LineWidth>\
                <LineAlignment>LeftOrTop</LineAlignment>\
                <FillColor Alpha="0" Red="0" Green="0" Blue="0"/>\
                </ShapeObject>\
                <Bounds X="1056.663" Y="884.5472" Width="1767.992" Height="263.9215"/>\
                </ObjectInfo>\
                <ObjectInfo>\
                <TextObject>\
                <Name>today_mm</Name>\
                <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/>\
                <BackColor Alpha="0" Red="255" Green="255" Blue="255"/>\
                <LinkedObjectName></LinkedObjectName>\
                <Rotation>Rotation0</Rotation>\
                <IsMirrored>False</IsMirrored>\
                <IsVariable>True</IsVariable>\
                <HorizontalAlignment>Left</HorizontalAlignment>\
                <VerticalAlignment>Top</VerticalAlignment>\
                <TextFitMode>ShrinkToFit</TextFitMode>\
                <UseFullFontHeight>True</UseFullFontHeight>\
                <Verticalized>False</Verticalized>\
                <StyledText>\
                <Element>\
                <String>01</String>\
                <Attributes>\
                <Font Family="Helvetica" Size="13" Bold="False" Italic="False" Underline="False" Strikeout="False"/>\
                <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/>\
                </Attributes>\
                </Element>\
                </StyledText>\
                </TextObject>\
                <Bounds X="2138.584" Y="1094.479" Width="263.9215" Height="263.9215"/>\
                </ObjectInfo>\
                <ObjectInfo>\
                <TextObject>\
                <Name>today_dd</Name>\
                <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/>\
                <BackColor Alpha="0" Red="255" Green="255" Blue="255"/>\
                <LinkedObjectName></LinkedObjectName>\
                <Rotation>Rotation0</Rotation>\
                <IsMirrored>False</IsMirrored>\
                <IsVariable>True</IsVariable>\
                <HorizontalAlignment>Left</HorizontalAlignment>\
                <VerticalAlignment>Top</VerticalAlignment>\
                <TextFitMode>ShrinkToFit</TextFitMode>\
                <UseFullFontHeight>True</UseFullFontHeight>\
                <Verticalized>False</Verticalized>\
                <StyledText>\
                <Element>\
                <String>12</String>\
                <Attributes>\
                <Font Family="Helvetica" Size="13" Bold="False" Italic="False" Underline="False" Strikeout="False"/>\
                <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/>\
                </Attributes>\
                </Element>\
                </StyledText>\
                </TextObject>\
                <Bounds X="2355.941" Y="1094.479" Width="263.9215" Height="263.9215"/>\
                </ObjectInfo>\
                <ObjectInfo>\
                <TextObject>\
                <Name>today_yyyy</Name>\
                <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/>\
                <BackColor Alpha="0" Red="255" Green="255" Blue="255"/>\
                <LinkedObjectName></LinkedObjectName>\
                <Rotation>Rotation0</Rotation>\
                <IsMirrored>False</IsMirrored>\
                <IsVariable>True</IsVariable>\
                <HorizontalAlignment>Right</HorizontalAlignment>\
                <VerticalAlignment>Bottom</VerticalAlignment>\
                <TextFitMode>ShrinkToFit</TextFitMode>\
                <UseFullFontHeight>True</UseFullFontHeight>\
                <Verticalized>False</Verticalized>\
                <StyledText>\
                <Element>\
                <String>2016</String>\
                <Attributes>\
                <Font Family="Helvetica" Size="13" Bold="False" Italic="False" Underline="False" Strikeout="False"/>\
                <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/>\
                </Attributes>\
                </Element>\
                </StyledText>\
                </TextObject>\
                <Bounds X="2539.037" Y="1000.001" Width="436.9633" Height="291.5796"/>\
                </ObjectInfo>\
                </DieCutLabel>\
                '
            // var labelXml = '<?xml version="1.0" encoding="utf-8"?>\
            //                 <DieCutLabel Version="8.0" Units="twips">\
	         //                    <PaperOrientation>Landscape</PaperOrientation>\
	         //                    <Id>Address</Id>\
	         //                    <PaperName>30252 Address</PaperName>\
	         //                    <DrawCommands>\
		     //                        <RoundRectangle X="0" Y="0" Width="1581" Height="5040" Rx="270" Ry="270" />\
	         //                    </DrawCommands>\
	         //                    <ObjectInfo>\
		     //                        <AddressObject>\
			 //                            <Name>Address</Name>\
			 //                            <ForeColor Alpha="255" Red="0" Green="0" Blue="0" />\
			 //                            <BackColor Alpha="0" Red="255" Green="255" Blue="255" />\
			 //                            <LinkedObjectName></LinkedObjectName>\
			 //                            <Rotation>Rotation0</Rotation>\
			 //                            <IsMirrored>False</IsMirrored>\
			 //                            <IsVariable>True</IsVariable>\
			 //                            <HorizontalAlignment>Left</HorizontalAlignment>\
			 //                            <VerticalAlignment>Middle</VerticalAlignment>\
			 //                            <TextFitMode>ShrinkToFit</TextFitMode>\
			 //                            <UseFullFontHeight>True</UseFullFontHeight>\
			 //                            <Verticalized>False</Verticalized>\
			 //                            <StyledText>\
				//                             <Element>\
				// 	                            <String>DYMO\
            //                             828 San Pablo Ave Ste 101\
            //                             Albany, CA 94706-1678</String>\
            //                                 <Attributes>\
            //                                     <Font Family="Arial" Size="12" Bold="False" Italic="False" Underline="False" Strikeout="False" />\
            //                                     <ForeColor Alpha="255" Red="0" Green="0" Blue="0" />\
            //                                 </Attributes>\
            //                             </Element>\
            //                         </StyledText>\
            //                         <ShowBarcodeFor9DigitZipOnly>False</ShowBarcodeFor9DigitZipOnly>\
            //                         <BarcodePosition>AboveAddress</BarcodePosition>\
            //                         <LineFonts>\
            //                             <Font Family="Arial" Size="12" Bold="False" Italic="False" Underline="False" Strikeout="False" />\
            //                             <Font Family="Arial" Size="12" Bold="False" Italic="False" Underline="False" Strikeout="False" />\
            //                             <Font Family="Arial" Size="12" Bold="False" Italic="False" Underline="False" Strikeout="False" />\
            //                         </LineFonts>\
            //                     </AddressObject>\
            //                     <Bounds X="332" Y="150" Width="4455" Height="1260" />\
            //                 </ObjectInfo>\
            //             </DieCutLabel>';
            return labelXml;
        }
        function loadLabelFromWeb() {
            // use jQuery API to load label
            //$.get("Address.label", function(labelXml)
            //{
            label = dymo.label.framework.openLabelXml(getAddressLabelXml());
            // check that label has an address object
            // if (label.getAddressObjectCount() == 0) {
            //     alert("Selected label does not have an address object on it. Select another label");
            //     return;
            // }

            // addressTextArea.value = getAddress();
            initLabelFields();
            initFormFields();
            updatePreview();
            // alert('Objects:' + objs)
            printButton.disabled = false;
            // addressTextArea.disabled = false;
            //}, "text");
        }

        loadLabelFromWeb();

        // load printers list on startup
        loadPrinters();
    };

    function padL(str,n) {
        return ("0".repeat(n) + str.slice(-n));
    }

    function initTests()
	{
		if(dymo.label.framework.init)
		{
			//dymo.label.framework.trace = true;
			dymo.label.framework.init(onload);
		} else {
			onload();
		}
	}

	// register onload event
	if (window.addEventListener)
		window.addEventListener("load", initTests, false);
	else if (window.attachEvent)
		window.attachEvent("onload", initTests);
	else
		window.onload = initTests;

}());