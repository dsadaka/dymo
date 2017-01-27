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
    const LABEL_FIELDS = ['patient_name', 'patient_dob', 'today']
    const FORM_FIELD_IDS = ['visitor_name', 'dob_dd', 'dob_mm', 'dob_yyyy']

    // called when the document completly loaded
    function onload() {
        var labelFile = document.getElementById('labelFile');
        var inputFormArea = document.getElementById('input_form');
        var printersSelect = document.getElementById('printersSelect');
        var printButton = document.getElementById('printButton');


        // initialize controls
        printButton.disabled = true;

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

        // Initialize label fields
        function initLabelFields() {
            var today = new Date();

            label.setObjectText('today', today.mmddyyyy());
            // label.setObjectText('today_mm', (("00" + today_mm).slice(-2)));
            // label.setObjectText('today_dd', (("00" + today_dd).slice(-2)));
            // label.setObjectText('today_yyyy', today_yyyy.toString());
        }
        // For now, init form fields to values of label fields
        function initFormFields() {
            $('#visitor_specimen_id').val(label.getObjectText('specimen_id'));
            $('#visitor_name').val(label.getObjectText('patient_name'));
            // $('#visitor_dob_2i').val(label.getObjectText('dob_mm'));
            // $('#visitor_dob_3i').val(label.getObjectText('dob_dd'));
            // $('#visitor_dob_1i').val(label.getObjectText('dob_yyyy'));
        }

        // Update fields in label
        function updateLabelFields() {
            var objs = label.getObjectNames();
            label.setObjectText('patient_name', $('#visitor_name').val())
            label.setObjectText('specimen_id', $('#visitor_specimen_id').val());
            label.setObjectText('patient_dob', $('#visitor_dob_2i').val()
                                             + $('#visitor_dob_3i').val()
                                             + $('#visitor_dob_1i').val()
            );
        };


        // updates form preview when user changes a form field
        inputFormArea.onkeyup = function () {
            if (!label) {
                alert('Load label before entering data');
                return;
            }

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
                <Id>Address</Id>\
                <PaperName>30252 Address</PaperName>\
            <DrawCommands>\
            <RoundRectangle X="0" Y="0" Width="1581" Height="5040" Rx="270" Ry="270"/>\
                </DrawCommands>\
                <ObjectInfo>\
                <ShapeObject>\
                <Name>Shape</Name>\
                <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/>\
                <BackColor Alpha="0" Red="255" Green="255" Blue="255"/>\
                <LinkedObjectName></LinkedObjectName>\
                <Rotation>Rotation0</Rotation>\
                <IsMirrored>False</IsMirrored>\
                <IsVariable>False</IsVariable>\
                <ShapeType>VerticalLine</ShapeType>\
                <LineWidth>15</LineWidth>\
                <LineAlignment>Center</LineAlignment>\
                <FillColor Alpha="0" Red="255" Green="255" Blue="255"/>\
                </ShapeObject>\
                <Bounds X="3362.337" Y="95.99991" Width="15" Height="1396.8"/>\
                </ObjectInfo>\
                <ObjectInfo>\
                <ImageObject>\
                <Name>GRAPHIC</Name>\
                <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/>\
                <BackColor Alpha="0" Red="255" Green="255" Blue="255"/>\
                <LinkedObjectName></LinkedObjectName>\
                <Rotation>Rotation90</Rotation>\
                <IsMirrored>False</IsMirrored>\
                <IsVariable>False</IsVariable>\
                <Image>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</Image>\
            <ScaleMode>Uniform</ScaleMode>\
            <BorderWidth>0</BorderWidth>\
            <BorderColor Alpha="255" Red="0" Green="0" Blue="0"/>\
                <HorizontalAlignment>Center</HorizontalAlignment>\
                <VerticalAlignment>Center</VerticalAlignment>\
                </ImageObject>\
                <Bounds X="3815.413" Y="213.858" Width="333.6207" Height="1121.228"/>\
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
                <Text>K4G3KEJR</Text>\
                <Type>Code39</Type>\
                <Size>Small</Size>\
                <TextPosition>Bottom</TextPosition>\
                <TextFont Family=".SF NS Text" Size="10" Bold="False" Italic="False" Underline="False" Strikeout="False"/>\
                <CheckSumFont Family=".SF NS Text" Size="10" Bold="False" Italic="False" Underline="False" Strikeout="False"/>\
                <TextEmbedding>None</TextEmbedding>\
                <ECLevel>0</ECLevel>\
                <HorizontalAlignment>Center</HorizontalAlignment>\
                <QuietZonesPadding Left="0" Right="0" Top="0" Bottom="0"/>\
                </BarcodeObject>\
                <Bounds X="331.2" Y="100.8" Width="2760.764" Height="421.2796"/>\
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
                <String>Name</String>\
                <Attributes>\
                <Font Family="Arial" Size="13" Bold="False" Italic="False" Underline="False" Strikeout="False"/>\
                <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/>\
                </Attributes>\
                </Element>\
                </StyledText>\
                </TextObject>\
                <Bounds X="343.8704" Y="632.3666" Width="645.814" Height="227.3759"/>\
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
                <TextFitMode>ShrinkToFit</TextFitMode>\
                <UseFullFontHeight>True</UseFullFontHeight>\
                <Verticalized>False</Verticalized>\
                <StyledText>\
                <Element>\
                <String>DOB</String>\
                <Attributes>\
                <Font Family="Arial" Size="13" Bold="False" Italic="False" Underline="False" Strikeout="False"/>\
                <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/>\
                </Attributes>\
                </Element>\
                </StyledText>\
                </TextObject>\
                <Bounds X="343.8704" Y="867.1248" Width="949.7382" Height="257.2301"/>\
                </ObjectInfo>\
                <ObjectInfo>\
                <TextObject>\
                <Name>TEXT_1</Name>\
                <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/>\
                <BackColor Alpha="0" Red="255" Green="255" Blue="255"/>\
                <LinkedObjectName></LinkedObjectName>\
                <Rotation>Rotation0</Rotation>\
                <IsMirrored>False</IsMirrored>\
                <IsVariable>False</IsVariable>\
                <HorizontalAlignment>Left</HorizontalAlignment>\
                <VerticalAlignment>Top</VerticalAlignment>\
                <TextFitMode>ShrinkToFit</TextFitMode>\
                <UseFullFontHeight>True</UseFullFontHeight>\
                <Verticalized>False</Verticalized>\
                <StyledText>\
                <Element>\
                <String>Date</String>\
                <Attributes>\
                <Font Family="Arial" Size="13" Bold="False" Italic="False" Underline="False" Strikeout="False"/>\
                <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/>\
                </Attributes>\
                </Element>\
                </StyledText>\
                </TextObject>\
                <Bounds X="1727.61" Y="848.1024" Width="654.1051" Height="276.2525"/>\
                </ObjectInfo>\
                <ObjectInfo>\
                <TextObject>\
                <Name>TEXT_2</Name>\
                <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/>\
                <BackColor Alpha="0" Red="255" Green="255" Blue="255"/>\
                <LinkedObjectName></LinkedObjectName>\
                <Rotation>Rotation0</Rotation>\
                <IsMirrored>False</IsMirrored>\
                <IsVariable>False</IsVariable>\
                <HorizontalAlignment>Left</HorizontalAlignment>\
                <VerticalAlignment>Top</VerticalAlignment>\
                <TextFitMode>ShrinkToFit</TextFitMode>\
                <UseFullFontHeight>True</UseFullFontHeight>\
                <Verticalized>False</Verticalized>\
                <StyledText>\
                <Element>\
                <String>Signature</String>\
                <Attributes>\
                <Font Family="Arial" Size="13" Bold="False" Italic="False" Underline="False" Strikeout="False"/>\
                <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/>\
                </Attributes>\
                </Element>\
                </StyledText>\
                </TextObject>\
                <Bounds X="331.2" Y="1233.664" Width="754.3875" Height="227.3759"/>\
                </ObjectInfo>\
                <ObjectInfo>\
                <ShapeObject>\
                <Name>lblSigLine</Name>\
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
                <Bounds X="1173.553" Y="1265.424" Width="1877.658" Height="227.3759"/>\
                </ObjectInfo>\
                <ObjectInfo>\
                <TextObject>\
                <Name>specimen_id_vert</Name>\
                <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/>\
                <BackColor Alpha="0" Red="255" Green="255" Blue="255"/>\
                <LinkedObjectName></LinkedObjectName>\
                <Rotation>Rotation90</Rotation>\
                <IsMirrored>False</IsMirrored>\
                <IsVariable>True</IsVariable>\
                <HorizontalAlignment>Left</HorizontalAlignment>\
                <VerticalAlignment>Top</VerticalAlignment>\
                <TextFitMode>ShrinkToFit</TextFitMode>\
                <UseFullFontHeight>True</UseFullFontHeight>\
                <Verticalized>False</Verticalized>\
                <StyledText>\
                <Element>\
                <String>K4G3KEJR</String>\
                <Attributes>\
                <Font Family=".SF NS Text" Size="13" Bold="False" Italic="False" Underline="False" Strikeout="False"/>\
                <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/>\
                </Attributes>\
                </Element>\
                </StyledText>\
                </TextObject>\
                <Bounds X="4615.12" Y="187.9303" Width="285.7585" Height="1112.435"/>\
                </ObjectInfo>\
                <ObjectInfo>\
                <TextObject>\
                <Name>patient_dob</Name>\
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
                <String>06/09/1959</String>\
                <Attributes>\
                <Font Family="Arial" Size="13" Bold="True" Italic="False" Underline="False" Strikeout="False"/>\
                <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/>\
                </Attributes>\
                </Element>\
                </StyledText>\
                </TextObject>\
                <Bounds X="848.4667" Y="873.1467" Width="937.3353" Height="227.3759"/>\
                </ObjectInfo>\
                <ObjectInfo>\
                <TextObject>\
                <Name>today</Name>\
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
                <String>01/26/2017</String>\
                <Attributes>\
                <Font Family="Arial" Size="13" Bold="True" Italic="False" Underline="False" Strikeout="False"/>\
                <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/>\
                </Attributes>\
                </Element>\
                </StyledText>\
                </TextObject>\
                <Bounds X="2202.636" Y="879.4987" Width="885.6839" Height="227.5749"/>\
                </ObjectInfo>\
                <ObjectInfo>\
                <TextObject>\
                <Name>patient_name</Name>\
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
                <String>Dan Sadaka</String>\
            <Attributes>\
            <Font Family="Arial" Size="13" Bold="True" Italic="False" Underline="False" Strikeout="False"/>\
                <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/>\
                </Attributes>\
                </Element>\
                </StyledText>\
                </TextObject>\
                <Bounds X="860.1007" Y="590.2447" Width="1789.868" Height="269.4978"/>\
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
            // TODO use jQuery API to load label
            //$.get("Address.label", function(labelXml)
            //{

            label = dymo.label.framework.openLabelXml(getAddressLabelXml());

            // TODO check that label has correct field names
            // if (label.getAddressObjectCount() == 0) {
            //     alert("Selected label does not have an address object on it. Select another label");
            //     return;
            // }

            initLabelFields();
            initFormFields();
            updatePreview();
            printButton.disabled = false;
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

    Date.prototype.mmddyyyy = function() {
        var yyyy = this.getFullYear().toString();
        var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
        var dd  = this.getDate().toString();
        return (mm[1]?mm:"0"+mm[0]) + "/" + (dd[1]?dd:"0"+dd[0]) + "/" + yyyy; // padding
    };

}());