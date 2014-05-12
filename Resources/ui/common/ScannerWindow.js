function ScannerWindow(title) {
	var self = Ti.UI.createWindow({
		title:'QR Scan',
		backgroundColor:'white'
	});
var tab = title.containingTab;
	
var Barcode = require('ti.barcode');
Barcode.allowRotation = true;
Barcode.displayedMessage = '';
Barcode.useLED = false;


var scrollView = Ti.UI.createScrollView({
    contentWidth: 'auto',
    contentHeight: 'auto',
    top: 0,
    showVerticalScrollIndicator: true,
    layout: 'vertical'
});

/**
 * Create a chrome for the barcode scanner.
 */
var overlay = Ti.UI.createView({
    backgroundColor: 'transparent',
    top: 0, right: 0, bottom: 0, left: 0
});
// var switchButton = Ti.UI.createButton({
    // title: Barcode.useFrontCamera ? 'Back Camera' : 'Front Camera',
    // textAlign: 'center',
    // color: '#000', backgroundColor: '#fff', style: 0,
    // font: { fontWeight: 'bold', fontSize: 16 },
    // borderColor: '#000', borderRadius: 10, borderWidth: 1,
    // opacity: 0.5,
    // width: 220, height: 30,
    // bottom: 10
// });
// switchButton.addEventListener('click', function () {
    // Barcode.useFrontCamera = !Barcode.useFrontCamera;
    // switchButton.title = Barcode.useFrontCamera ? 'Back Camera' : 'Front Camera';
// });
// overlay.add(switchButton);

var toggleLEDButton = Ti.UI.createButton({
    title: Barcode.useLED ? 'LED is On' : 'LED is Off',
    textAlign: 'center',
    color: '#000', backgroundColor: '#fff', style: 0,
    font: { fontWeight: 'bold', fontSize: 16 },
    borderColor: '#000', borderRadius: 10, borderWidth: 1,
    opacity: 1,
    width: 220, height: 30,
    bottom: 40
});
toggleLEDButton.addEventListener('click', function () {
    Barcode.useLED = !Barcode.useLED;
    toggleLEDButton.title = Barcode.useLED ? 'LED is On' : 'LED is Off';
});
overlay.add(toggleLEDButton);

var cancelButton = Ti.UI.createButton({
    title: 'Cancel', textAlign: 'center',
    color: '#000', backgroundColor: '#fff', style: 0,
    font: { fontWeight: 'bold', fontSize: 16 },
    borderColor: '#000', borderRadius: 10, borderWidth: 1,
    opacity: 1,
    width: 220, height: 30,
    top: 20
});
cancelButton.addEventListener('click', function () {
    Barcode.cancel();
});
overlay.add(cancelButton);

/**
 * Create a button that will trigger the barcode scanner.
 */
var scanCode = Ti.UI.createButton({
    title: 'Scan Code',
    width: 200,
    height: 60,
    top: 20
});
scanCode.addEventListener('click', function () {
    reset();
    // Note: while the simulator will NOT show a camera stream in the simulator, you may still call "Barcode.capture"
    // to test your barcode scanning overlay.
    Barcode.capture({
        animate: false,
        overlay: overlay,
        showCancel: false,
        showRectangle: true,
        keepOpen: false/*,
        acceptedFormats: [
            Barcode.FORMAT_QR_CODE
        ]*/
    });
});
scrollView.add(scanCode);

/**
 * Create a button that will show the gallery picker.
 */
var scanImage = Ti.UI.createButton({
    title: 'Scan Image from Gallery',
    width: 200, height: 60, top: 20
});
scanImage.addEventListener('click', function () {
    reset();
    Ti.Media.openPhotoGallery({
        success: function (evt) {
            Barcode.parse({
                image: evt.media/*,
                acceptedFormats: [
                    Barcode.FORMAT_QR_CODE
                ]*/
            });
        }
    });
});
scrollView.add(scanImage);

/**
 * Now listen for various events from the Barcode module. This is the module's way of communicating with us.
 */
var scannedBarcodes = {}, scannedBarcodesCount = 0;
function reset() {
    scannedBarcodes = {};
    scannedBarcodesCount = 0;
    cancelButton.title = 'Cancel';

    scanResult.text = ' ';
    scanContentType.text = ' ';
    //scanParsed.text = ' ';
}
Barcode.addEventListener('error', function (e) {
    scanContentType.text = ' ';
    //scanParsed.text = ' ';
    scanResult.text = e.message;
});
Barcode.addEventListener('cancel', function (e) {
    Ti.API.info('Cancel received');
});
Barcode.addEventListener('success', function (e) {
    Ti.API.info('Success called with barcode: ' + e.result);
    if (!scannedBarcodes['' + e.result]) {
        scannedBarcodes[e.result] = true;
        scannedBarcodesCount += 1;
        cancelButton.title = 'Finished (' + scannedBarcodesCount + ' Scanned)';

        scanResult.text += e.result + ' ';
        scanContentType.text += parseContentType(e.contentType) + ' ';
        //scanParsed.text += parseResult(e) + ' ';
    }
});

/**
 * Finally, we'll add a couple labels to the window. When the user scans a barcode, we'll stick information about it in
 * to these labels.
 */
scrollView.add(Ti.UI.createLabel({
    text: 'Click on the result for viewing info',
    top: 10,
    height: Ti.UI.SIZE || 'auto', width: Ti.UI.SIZE || 'auto'
}));

scrollView.add(Ti.UI.createLabel({
    text: 'Result: ', textAlign: 'left',
    top: 10, left: 10,
    color: 'black',
    height: Ti.UI.SIZE || 'auto'
}));
var scanResult = Ti.UI.createLabel({
    text: ' ', textAlign: 'left',
    top: 10, left: 10,
    color: 'black',
    height: Ti.UI.SIZE || 'auto'
});
scanResult.addEventListener('click', function()
	{
		// set properties on the window object, then open.  we will print them out in the new window
		var W2 = require('ui/common/controls/parseresult'),
			w2 = new W2();
			w2.title = 'Places';			
		w2.myFunc = function()
		{
			return scanResult.text;
		};
		tab.open(w2,{animated:true});	
	});
	
scrollView.add(scanResult);

scrollView.add(Ti.UI.createLabel({
    text: 'Content Type: ',
    top: 10, left: 10,
    textAlign: 'left',
    color: 'black',
    height: Ti.UI.SIZE || 'auto'
}));
var scanContentType = Ti.UI.createLabel({
    text: ' ', textAlign: 'left',
    top: 10, left: 10,
    color: 'black',
    height: Ti.UI.SIZE || 'auto'
});
scrollView.add(scanContentType);

// scrollView.add(Ti.UI.createLabel({
    // text: 'Parsed: ', textAlign: 'left',
    // top: 10, left: 10,
    // color: 'black',
    // height: Ti.UI.SIZE || 'auto'
// }));
// var scanParsed = Titanium.UI.createLabel({
    // text: ' ', textAlign: 'left',
    // top: 10, left: 10,
    // color: 'black',
    // height: Ti.UI.SIZE || 'auto'
// });
	// scrollView.add(scanParsed);


function parseContentType(contentType) {
    switch (contentType) {
        case Barcode.URL:
            return 'URL';
        case Barcode.SMS:
            return 'SMS';
        case Barcode.TELEPHONE:
            return 'TELEPHONE';
        case Barcode.TEXT:
            return 'TEXT';
        case Barcode.CALENDAR:
            return 'CALENDAR';
        case Barcode.GEOLOCATION:
            return 'GEOLOCATION';
        case Barcode.EMAIL:
            return 'EMAIL';
        case Barcode.CONTACT:
            return 'CONTACT';
        case Barcode.BOOKMARK:
            return 'BOOKMARK';
        case Barcode.WIFI:
            return 'WIFI';
        default:
            return 'UNKNOWN';
    }
}

// function parseResult(event) {
    // var msg = '';
    // switch (event.contentType) {
        // case Barcode.URL:
            // msg = 'URL = ' + event.result;
            // break;
        // case Barcode.SMS:
            // msg = 'SMS = ' + JSON.stringify(event.data);
            // break;
        // case Barcode.TELEPHONE:
            // msg = 'Telephone = ' + event.data.phonenumber;
            // break;
        // case Barcode.TEXT:
        	// msg = 'Text = ' + event.result;
            // break;
        // case Barcode.CALENDAR:
            // msg = 'Calendar = ' + JSON.stringify(event.data);
            // break;
        // case Barcode.GEOLOCATION:
            // msg = 'Latitude = ' + event.data.latitude + '\nLongitude = ' + event.data.longitude;
            // break;
        // case Barcode.EMAIL:
            // msg = 'Email = ' + event.data.email + '\nSubject = ' + event.data.subject + '\nMessage = ' + event.data.message;
            // break;
        // case Barcode.CONTACT:
            // msg = 'Contact = ' + JSON.stringify(event.data);
            // break;
        // case Barcode.BOOKMARK:
            // msg = 'Bookmark = ' + JSON.stringify(event.data);
            // break;
        // case Barcode.WIFI:
            // return 'WIFI = ' + JSON.stringify(event.data);
        // default:
            // msg = 'unknown content type';
            // break;
    // }
    // return msg;
//    
// }


 	
self.add(scrollView);
 return self;
 };

module.exports = ScannerWindow;