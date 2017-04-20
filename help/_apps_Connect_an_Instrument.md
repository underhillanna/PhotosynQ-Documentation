### Connect an Instrument
You can use Bluetooth or USB to connect your Instrument with your device. Depending on the instrument and device, some connection options may not be available.

**Before connecting your MultispeQ to the Android or Desktop App you need to turn on the MultispeQ by pressing and holding the power button for 5 seconds**

![Connect an Instrument](../images/help/_apps_power_button.jpg)

#### Android - Bluetooth
1. Go to the **My Projects** page within the app.
2. Select the instrument icon on the top right of the page.
3. A list of available Bluetooth instruments will appear. 
4. Below the Instrument name will be its ID. This should match the MAC address on your instrument (screen A, below)
	- If your instrument does not appear, click on **SCAN DEVICES**
	- You may have to click **SCAN DEVICES** multiple times before your instrument appears.
5. Select on the appropriate instrument.
6. A pop-up will appear asking to pair the device by entering the instrument PIN. **The PIN is 1234 and is the same for every MultispeQ.**
7. After pairing the MultispeQ, you will be taken back to the Device list. Select your MultispeQ from the list, if the screen B (below) appears your device is connected.

![Android - Bluetooth](../images/help/_apps_connecting_MultispeQ_Android.jpg)

#### Desktop - USB
1. Select **<i class="fa fa-cogs"></i> Settings** from the left menu bar.
2. Choose the **Device** tab from the dialog.
3. Pick the port the Instrument is connected to from the dropdown menu:
	- Windows: **COM{number}**
	- Mac OS: **usbmodem{number}**
	- Linux: **ACM{number}**
4. Connect the device by clicking on **Connect**.

#### Desktop - Bluetooth
1. Make sure you have your Instrument connected to your Device through your OS preferences. The code for pairing is **1234**.
2. Select **<i class="fa fa-cogs"></i> Settings** from the left menu bar.
3. Choose the **Device** tab from the dialog.
4. Pick the port the Instrument is connected to from the dropdown menu:
	- Windows: **COM{number}**
	- Mac OS: **Devicename_{number}**
	- Linux: **Not available**
5. Connect the device by clicking on **Connect**.

### Troubleshooting
If you are having trouble connecting to your instrument, please go through this checklist first:

- [x] Make sure your instrument is fully charged (at least 6h, or over night).
- [x] Make sure you have turned on the instrument by pressing and holding the power button for 5 seconds. **The device will automatically shut off after 3 hours of inactivity**
- [x] If you were using the instrument with another mobile device, you will need to press and hold the power button for 5 seconds to disconnect it from the previous device and make it available to a new device.
- [x] If you are using Windows 8 or lower, make sure you have the [serial driver](https://www.pjrc.com/teensy/td_download.html) installed.
