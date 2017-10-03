### \_protocol_set_<a id="_protocol_set_"></a>
Treating protocols as integrated sets.

Protocols are separate units which produce separate data sets. Using `_protocol_set_`, multiple protocols can be chained together into one protocol.

**Note:** This is different from chaining protocols together in a project. There, the protocols are still separate units within a measurement.

**Input:** array

**Code:**

```javascript
"_protocol_set_": [{ Protocol 1 },...],
```

**Type:** protocol

**Editor:** fixed

**Devices:**

`MultispeQ 1` 

**Last Edited:** August 17, 2017

***

### adc\_show<a id="adc_show"></a>
When "adc_show" is 1, the readings taken by the ADC (analog to digital converter) on the sample and hold circuit are outputted in "data_raw" instead of the normal output.  No other output is recorded, and only the last set of adc readings is shown (all other readings are not outputted).  By default there are 19 samples, but this can be changed using "number_samples".

**Input:** number

**Values:** 0, 1

**Code:**

```javascript
"adc_show": <number>,
```

**Type:** protocol

**Editor:** fixed

**Versions:**

`1.17` `1.16` `1.14` `1.11` `1.10` `1.08` `1.07` `1.06`

**Devices:**

`MultispeQ 1` 

**Last Edited:** June 6, 2017

**Url:** <https://github.com/Photosynq/PhotosynQ-Firmware/wiki/adc_show>

***

### autogain<a id="autogain"></a>
The autogain function is added to the main section of the protocol. Multiple autogain functions can be run in a single protocol, and the indexed values should be useable throughout the experiment.

`<index>` which index to store gain settings (0-9)
`<pulsed_LED>` which pulsed LED to test (0-9)
`<detector>` which detector to use (0-3)
`<pulse_duration>` what duration to use (in microseconds) (1-200)
`<target_value>` what target value to use (0-65535, recommended: 40000-50000)

**Input:** nested array

**Code:**

```javascript
"autogain": [ [<index>, <pulsed_LED>, <detector>, <pulse_duration>, <target_value>],... ],
```

**Type:** protocol

**Editor:** fixed

**Devices:**

`MultispeQ 1` 

**Last Edited:** August 17, 2017

***

### averages<a id="averages"></a>
"averages" sets the number of times to average the protocol.  The protocol will be repeated equal to the number of averages, and the resulting data will be averaged and outputted as a single data point.  Averaging is often used to reduce noise and improve the quality of measurements.

**Input:** number

**Values:** 0 - 10000

**Code:**

```javascript
"averages": <number>,
```

**Type:** protocol

**Editor:** fixed

**Versions:**

`1.17` `1.16` `1.14` `1.11` `1.10` `1.08` `1.07` `1.06`

**Devices:**

`MultispeQ 1` 

**Last Edited:** June 6, 2017

**Url:** <https://github.com/Photosynq/PhotosynQ-Firmware/wiki/averages>

***

### averages\_delay<a id="averages_delay"></a>
"averages_delay" defines the delay between protocol averages in in milliseconds (ms).

**Input:** auto

**Values:** 0 - 9999999999

**Code:**

```javascript
"averages_delay": <number>,
```

**Type:** protocol

**Editor:** fixed

**Versions:**

`1.17` `1.16` `1.14` `1.11` `1.10` `1.08` `1.07` `1.06`

**Devices:**

`MultispeQ 1` 

**Last Edited:** June 6, 2017

**Url:** <https://github.com/Photosynq/PhotosynQ-Firmware/wiki/averages_delay>

**Dependencies:**

+ [averages](#averages)

***

### dac\_lights<a id="dac_lights"></a>
When "dac_lights" is set to 1, "pulsed_lights_brightness" and "nonpulsed_lights_brightness" settings will be interpreted by the device as 12-bit values (0 - 4095) directly controlling the LED voltage (via the DAC), instead of microEinsteins (uE).  This is used during factory calibration.

**Note:** Setting brightness to high using raw DAC values could permanently disable LEDs, so be careful!

**Input:** number

**Values:** 0, 1

**Code:**

```javascript
"dac_lights": <number>,
```

**Type:** protocol

**Editor:** fixed

**Versions:**

`1.17` `1.16` `1.14` `1.11` `1.10` `1.08` `1.07` `1.06`

**Devices:**

`MultispeQ 1` 

**Last Edited:** June 6, 2017

**Url:** <https://github.com/Photosynq/PhotosynQ-Firmware/wiki/dac_lights>

***

### detectors<a id="detectors"></a>
"detectors" defines which detectors are being measured, and in what order.  The chosen "meas_light" supplies the light source to be measured.  The detector measurement is recorded in "data_raw" in the data received from the MultispeQ, which is then graphed for the user.  When "detectors" is set to 0, no detector is read and responses will be recorded as zero.

**Input:** nested array

**Values:** 0 - 4

**Code:**

```javascript
"detectors": [[<detector>], ... ],
```

**Type:** protocol

**Editor:** table

**Versions:**

`1.17` `1.16` `1.14` `1.11` `1.10` `1.08` `1.07` `1.06`

**Devices:**

`MultispeQ 1` 

**Last Edited:** June 6, 2017

**Url:** <https://github.com/Photosynq/PhotosynQ-Firmware/wiki/detectors>

**Dependencies:**

+ [pulses](#pulses)
+ [pulse_length](#pulse_length)
+ [pulse_distance](#pulse_distance)
+ [pulsed_lights](#pulsed_lights)
+ [pulsed_lights_brightness](#pulsed_lights_brightness)

***

### energy\_min_wake_time<a id="energy_min_wake_time"></a>
The value of time is in milliseconds, and must be between zero and 10^6 milliseconds. This setting changes the delay between shutting off the 5V (following `energy_save_timeout`) and the wake up time. The `energy_min_wake_time` is needed to prevent brown out following the initiation of energy save.

**Important:** Note that the change in `energy_min_wake_time` will remain in effect until the instrument is reset, when it will return to the default value of 10 s.

**Input:** number

**Values:** 0 - 10^6

**Code:**

```javascript
"energy_min_wake_time": <number>,
```

**Type:** protocol

**Editor:** fixed

**Devices:**

`MultispeQ 1` 

**Last Edited:** August 17, 2017

***

### energy\_save_timeout<a id="energy_save_timeout"></a>
Adjusting Energy Save Timeout Time. The value of time is in milliseconds, and must be between zero and 10^6 milliseconds. This setting changes the energy_save_timeout time to prevent interference from the requirement for a 7 second wake up time from power save mode.

**Important:** Note that the change in `energy_save_timeout` will remain in effect until the instrument is reset, when it will return to the default value of 120 s.

**Input:** number

**Values:** 0 - 10^6

**Code:**

```javascript
"energy_save_timeout": <number>,
```

**Type:** protocol

**Editor:** fixed

**Devices:**

`MultispeQ 1` 

**Last Edited:** August 17, 2017

***

### environmental<a id="environmental"></a>
`environmental` defines which additional sensor(s) to measure. The environmental calls occur at the very beginning of the measurement, prior to any pulses. Some sensors require additional information, like specifying which pin to measure, brightness, etc. In addition to sensor measurements, there are also calls to flip digital pins on/off or set a pwm which could be used to control external lights or even motors. Below is the full list of parameters available in `environmental`.

The returned sensor values from most `environmental` calls are accessible inside a protocol using Expressions ([details](https://github.com/Photosynq/PhotosynQ-Firmware/wiki/How-to-use-Expressions)). Adjusting protocols in real time based on these values can be very handy for certain types of protocols.

**Input:** nested array

**Code:**

```javascript
"environmental": [[<sensor>], ... ],
```

**Type:** protocol

**Editor:** fixed

**Versions:**

`1.17` `1.16` `1.14` `1.11` `1.10` `1.08` `1.07` `1.06`

**Devices:**

`MultispeQ 1` 

**Last Edited:** June 6, 2017

**Url:** <https://github.com/Photosynq/PhotosynQ-Firmware/wiki/environmental>

***

### environmental\_array<a id="environmental_array"></a>
"environmental_array" defines additional sensors or functionality, just like "environmental".  However, "environmental_array" returns sensor data once per pulse, as defined in "pulses".  This allows a string of sensor measurements to be used in a single macro.  The advantage is you can calculate and return in real time things like rates of change, minima and maxima, etc.  See examples for details.  **Note:**  "pulsed_lights_brightness" must NOT be set to zero for any given pulse set for the sensors set in "environmental_array" to measure.

**Input:** nested array

**Code:**

```javascript
"environmental_array": [[<number>], ... ],
```

**Type:** protocol

**Editor:** fixed

**Versions:**

`1.17` `1.16` `1.14` `1.11` `1.10` `1.08` `1.07` `1.06`

**Devices:**

`MultispeQ 1` 

**Last Edited:** June 6, 2017

**Url:** <https://github.com/Photosynq/PhotosynQ-Firmware/wiki/environmental_array>

**Dependencies:**

+ [pulses](#pulses)
+ [pulse_length](#pulse_length)
+ [pulse_distance](#pulse_distance)
+ [pulsed_lights](#pulsed_lights)
+ [pulsed_lights_brightness](#pulsed_lights_brightness)

***

### ir\_baseline<a id="ir_baseline"></a>
**Type:** protocol

**Versions:**

`1.17` `1.16` `1.14` `1.11` `1.10` `1.08` `1.07` `1.06`

**Devices:**

`MultispeQ 1` 

**Last Edited:** June 6, 2017

***

### label<a id="label"></a>
Each protocol or sub-protocol can now output a `label` that can be used to indicate something about the protocol, conditions etc.

**Input:** string

**Code:**

```javascript
"label": <string>,
```

**Type:** protocol

**Editor:** fixed

**Devices:**

`MultispeQ 1` 

**Last Edited:** August 17, 2017

***

### light\_intensity<a id="light_intensity"></a>
Instead of setting a fixed for an LED, use this parameter to acquire the ambient light intensity using the PAR sensor to recreate it inside the instrument.

**Code:**

```javascript
"light_intensity"
```

**Type:** parameter

**Devices:**

`MultispeQ 1` 

**Last Edited:** August 17, 2017

***

### max\_hold_time<a id="max_hold_time"></a>
This parameter sets the time (in ms) at which the hold commands timeout. The default value is 15000, or 15 seconds. This value applies to the following control points: `start_on_open`, `start_on_close`, `start_on_open_close`.

**Input:** number

**Code:**

```javascript
"max_hold_time": <number>,
```

**Type:** protocol

**Editor:** fixed

**Devices:**

`MultispeQ 1` 

**Last Edited:** August 17, 2017

***

### message<a id="message"></a>
"message" sends text to the user between pulse sets, and waits for a response before proceeding. Set <message type> to "0" to not send a message.  "message" should have the same length as "pulses".

**Input:** nested array

**Values:** `alert` - message with an OK button, `prompt` - message with an OK and Cancel button, `confirm` - message with an OK and Cancel button and text input box

**Code:**

```javascript
"message": [[<message type>, <message>], ... ],
```

**Type:** protocol

**Editor:** table

**Versions:**

`1.17` `1.16` `1.14` `1.11` `1.10` `1.08` `1.07` `1.06`

**Devices:**

`MultispeQ 1` 

**Last Edited:** June 6, 2017

**Url:** <https://github.com/Photosynq/PhotosynQ-Firmware/wiki/message>

**Dependencies:**

+ [pulses](#pulses)
+ [pulse_length](#pulse_length)
+ [pulse_distance](#pulse_distance)

***

### nonpulsed\_lights<a id="nonpulsed_lights"></a>
"nonpulsed_lights" defines which lights are not pulsed (always on) during a pulse set, and in what order.

**Input:** nested array

**Values:** 0 - 10

**Code:**

```javascript
"nonpulsed_lights": [[<number>], ... ],
```

**Type:** protocol

**Editor:** table

**Versions:**

`1.17` `1.16` `1.14` `1.11` `1.10` `1.08` `1.07` `1.06`

**Devices:**

`MultispeQ 1` 

**Last Edited:** June 6, 2017

**Url:** <https://github.com/Photosynq/PhotosynQ-Firmware/wiki/nonpulsed_lights>

**Dependencies:**

+ [pulses](#pulses)
+ [pulse_distance](#pulse_distance)
+ [pulse_length](#pulse_length)
+ [nonpulsed_lights_brightness](#nonpulsed_lights_brightness)

***

### nonpulsed\_lights_brightness<a id="nonpulsed_lights_brightness"></a>
"nonpulsed_lights_brightness" sets the brightness in microEinsteins (uE) of the nonpulsed lights.   Definition of microEinsteins (uE) here.

**Input:** nested array

**Values:** 0 - 15000

**Code:**

```javascript
"nonpulsed_lights_brightness": [[<number>], ... ],
```

**Type:** protocol

**Editor:** table

**Versions:**

`1.17` `1.16` `1.14` `1.11` `1.10` `1.08` `1.07` `1.06`

**Devices:**

`MultispeQ 1` 

**Last Edited:** June 6, 2017

**Url:** <https://github.com/Photosynq/PhotosynQ-Firmware/wiki/nonpulsed_lights_brightness>

**Dependencies:**

+ [pulses](#pulses)
+ [pulse_distance](#pulse_distance)
+ [pulse_length](#pulse_length)
+ [nonpulsed_lights](#nonpulsed_lights)

***

### number\_samples<a id="number_samples"></a>
"number_samples" sets the number of samples taken by the ADC (analog to digital converter) on the sample and hold circuit.  The median value of these samples is then saved as a single detector value in "data_raw".  The ADC is used to measure the detectors (1 - 4).  This value is already set to the optimum value, and most signal noise comes from other source, but in certain cases increasing the value may yield improved signal.

**Input:** number

**Values:** 1 - 500

**Code:**

```javascript
"number_samples": <number>,
```

**Type:** protocol

**Editor:** fixed

**Versions:**

`1.17` `1.16` `1.14` `1.11` `1.10` `1.08` `1.07` `1.06`

**Devices:**

`MultispeQ 1` 

**Last Edited:** June 6, 2017

**Url:** <https://github.com/Photosynq/PhotosynQ-Firmware/wiki/number_samples>

**Dependencies:**

+ [pulses](#pulses)
+ [pulse_length](#pulse_length)
+ [pulse_distance](#pulse_distance)
+ [detectors](#detectors)

***

### open\_close_start<a id="open_close_start"></a>
When "open_close_start" is set to 1, the protocol waits until the user fully opens the clamp and closes the clamp before proceeding.  Also works if the clamp starts fully open and then closes.  Open and close is detected using the Hall effect sensor on the main body and magnet on the clamp (same sensor used to determine sample thickness).  If the device is not calibrated, or calibration is off, or the clamping mechanism does not fully open or close, this function will not work.  Calibration details can be found by typing print_memory into the console - see thickness_a, thickness_b, thickness_c, thickness_min, and thickness_max for relevant calibration values.

**Input:** number

**Values:** 0, 1

**Code:**

```javascript
"open_close_start": <number>,
```

**Type:** protocol

**Editor:** fixed

**Versions:**

`1.17` `1.16` `1.14` `1.11` `1.10` `1.08` `1.07` `1.06`

**Devices:**

`MultispeQ 1` 

**Last Edited:** June 6, 2017

**Url:** <https://github.com/Photosynq/PhotosynQ-Firmware/wiki/open_close_start>

***

### par\_led_start_on_close<a id="par_led_start_on_close"></a>
The Ambient light is recreated inside the instrument on closing the clamp. During the hold time, the ambient light is resampled in ~100 ms intervals and the LED output is adjusted to match. When the hold event occurs (e.g. the clamp is closed), the final ambient intensity and LED setting are held and used in the protocol. The number for the LED is defining the LED used for matching the ambient light intensity.

**Input:** number

**Code:**

```javascript
"par_led_start_on_close": <number for LED>,
```

**Type:** protocol

**Editor:** fixed

**Devices:**

`MultispeQ 1` 

**Last Edited:** August 17, 2017

***

### par\_led_start_on_open<a id="par_led_start_on_open"></a>
The Ambient light is recreated inside the instrument on opening the clamp. During the hold time, the ambient light is resampled in ~100 ms intervals and the LED output is adjusted to match. When the hold event occurs (e.g. the clamp is closed), the final ambient intensity and LED setting are held and used in the protocol. The number for the LED is defining the LED used for matching the ambient light intensity.

**Input:** number

**Code:**

```javascript
"par_led_start_on_open": <number for LED>,
```

**Type:** protocol

**Editor:** fixed

**Devices:**

`MultispeQ 1` 

**Last Edited:** August 17, 2017

***

### par\_led_start_on_open_close<a id="par_led_start_on_open_close"></a>
The Ambient light is recreated inside the instrument on opening the clamp. During the hold time, the ambient light is resampled in ~100 ms intervals and the LED output is adjusted to match. When the hold event occurs (e.g. the clamp is closed), the final ambient intensity and LED setting are held and used in the protocol. The number for the LED is defining the LED used for matching the ambient light intensity.

**Input:** number

**Code:**

```javascript
"par_led_start_on_open_close": <number for LED>,
```

**Type:** protocol

**Editor:** fixed

**Devices:**

`MultispeQ 1` 

**Last Edited:** August 17, 2017

***

### previous\_light_intensity<a id="previous_light_intensity"></a>
Instead of setting a fixed for an LED, use this parameter to acquire the ambient light intensity using the PAR sensor to recreate it inside the instrument.

**Code:**

```javascript
"previous_light_intensity"
```

**Type:** parameter

**Devices:**

`MultispeQ 1` 

**Last Edited:** August 17, 2017

***

### protocols<a id="protocols"></a>
"protocols" sets the number of times to repeat the protocol.  Unlike "averages", this outputs data every time the protocol is repeated (instead of averaging the repeats and outputting data only once).

**Input:** number

**Values:** 0 - 999999999

**Code:**

```javascript
"protocols": <number>,
```

**Type:** protocol

**Editor:** fixed

**Versions:**

`1.17` `1.16` `1.14` `1.11` `1.10` `1.08` `1.07` `1.06`

**Devices:**

`MultispeQ 1` 

**Last Edited:** June 6, 2017

**Url:** <https://github.com/Photosynq/PhotosynQ-Firmware/wiki/protocols>

***

### protocols\_delay<a id="protocols_delay"></a>
"protocols_delay" defines the delay between protocol repeats in in milliseconds (us).

**Input:** auto

**Values:** 0 - 9999999999

**Code:**

```javascript
"protocols_delay": <number>,
```

**Type:** protocol

**Editor:** fixed

**Versions:**

`1.17` `1.16` `1.14` `1.11` `1.10` `1.08` `1.07` `1.06`

**Devices:**

`MultispeQ 1` 

**Last Edited:** June 6, 2017

**Url:** <https://github.com/Photosynq/PhotosynQ-Firmware/wiki/protocols_delay>

**Dependencies:**

+ [protocols](#protocols)

***

### pulse\_distance<a id="pulse_distance"></a>
"pulse_distance" defines the distance, in microseconds (us) between pulses.

**Input:** array

**Values:** 750 - 999999999999

**Code:**

```javascript
"pulse_distance": [<number>, ... ],
```

**Type:** protocol

**Editor:** table

**Versions:**

`1.17` `1.16` `1.14` `1.11` `1.10` `1.08` `1.07` `1.06`

**Devices:**

`MultispeQ 1` 

**Last Edited:** June 6, 2017

**Url:** <https://github.com/Photosynq/PhotosynQ-Firmware/wiki/pulse_distance>

**Dependencies:**

+ [pulses](#pulses)
+ [pulse_length](#pulse_length)
+ [pulsed_lights](#pulsed_lights)
+ [pulsed_lights_brightness](#pulsed_lights_brightness)

***

### pulse\_length<a id="pulse_length"></a>
"pulse_length" defines the length, in microseconds (us), of a pulse.

**Input:** nested array

**Values:** 1 - 150

**Code:**

```javascript
"pulse_length": [[<number>], ... ],
```

**Type:** protocol

**Editor:** table

**Versions:**

`1.17` `1.16` `1.14` `1.11` `1.10` `1.08` `1.07` `1.06`

**Devices:**

`MultispeQ 1` 

**Last Edited:** June 6, 2017

**Url:** <https://github.com/Photosynq/PhotosynQ-Firmware/wiki/pulse_length>

**Dependencies:**

+ [pulses](#pulses)
+ [pulse_distance](#pulse_distance)
+ [pulsed_lights](#pulsed_lights)
+ [pulsed_lights_brightness](#pulsed_lights_brightness)

***

### pulsed\_lights<a id="pulsed_lights"></a>
"pulsed_lights" defines which lights are pulsed, and in what order.  When set to 0, no lights are pulsed and no readings are recorded (see Example section here for details).

**Input:** nested array

**Values:** 0 - 10

**Code:**

```javascript
"pulsed_lights": [[<number>], ... ],
```

**Type:** protocol

**Editor:** table

**Versions:**

`1.17` `1.16` `1.14` `1.11` `1.10` `1.08` `1.07` `1.06`

**Devices:**

`MultispeQ 1` 

**Last Edited:** June 6, 2017

**Url:** <https://github.com/Photosynq/PhotosynQ-Firmware/wiki/pulsed_lights>

**Dependencies:**

+ [pulses](#pulses)
+ [pulse_distance](#pulse_distance)
+ [pulse_length](#pulse_length)
+ [pulsed_lights_brightness](#pulsed_lights_brightness)

***

### pulsed\_lights_brightness<a id="pulsed_lights_brightness"></a>
"pulsed_lights_brightness" sets the brightness in microEinsteins (uE) of the pulsed lights.   Definition of microEinsteins (uE) here.

**Input:** nested array

**Values:** 0 - 15000

**Code:**

```javascript
"pulsed_lights_brightness": [[<number>], ... ],
```

**Type:** protocol

**Editor:** table

**Versions:**

`1.17` `1.16` `1.14` `1.11` `1.10` `1.08` `1.07` `1.06`

**Devices:**

`MultispeQ 1` 

**Last Edited:** June 6, 2017

**Url:** <https://github.com/Photosynq/PhotosynQ-Firmware/wiki/pulsed_lights_brightness>

**Dependencies:**

+ [pulses](#pulses)
+ [pulse_distance](#pulse_distance)
+ [pulse_length](#pulse_length)
+ [pulsed_lights](#pulsed_lights)

***

### pulses<a id="pulses"></a>
"pulses" defines the number of pulse sets, and quantity of pulses per set.

**Input:** array

**Values:** 1 - 8000

**Code:**

```javascript
"pulses": [<number>, ... ],
```

**Type:** protocol

**Editor:** table

**Versions:**

`1.17` `1.16` `1.14` `1.11` `1.10` `1.08` `1.07` `1.06`

**Devices:**

`MultispeQ 1` 

**Last Edited:** June 6, 2017

**Url:** <https://github.com/Photosynq/PhotosynQ-Firmware/wiki/pulses>

**Dependencies:**

+ [pulse_distance](#pulse_distance)
+ [pulse_length](#pulse_length)
+ [pulsed_lights](#pulsed_lights)
+ [pulsed_lights_brightness](#pulsed_lights_brightness)

***

### recall<a id="recall"></a>
This command returns values from the device memory (EEPROM). This includes values saved by the user (see Examples below for details) as well as values saved during factory calibration.  For a full list of saved values which can be recalled, see expr.cpp .  Expressions may be applied to "recall" requests ([more](https://github.com/Photosynq/PhotosynQ-Firmware/wiki/How-to-use-Expressions)).

**Input:** array

**Code:**

```javascript
"recall": ["userdef[<location>]", ... ],
```

**Type:** protocol

**Editor:** fixed

**Versions:**

`1.17` `1.16` `1.14` `1.11` `1.10` `1.08` `1.07` `1.06`

**Devices:**

`MultispeQ 1` 

**Last Edited:** June 6, 2017

**Url:** <https://github.com/Photosynq/PhotosynQ-Firmware/wiki/recall>

***

### reference<a id="reference"></a>
The MultispeQ is designed to be able to nearly simultaneously measure two detectors (within ~4us), normalize and subtract the two signals from each other.  This can be useful if there is a optical, electronic (interference), or LED (heating) artifact that needs to be removed.  "reference" specifies another detector to be measured and subtracted from "detectors".

 **Note:** It is possible to add two additional detector circuits to the device, on the main body and clamp circuit boards. The devices come unpopulated by default. If added, these two additional detectors are available by settings `detectors` or `reference` to 2 (main body) or 4 (clamp). These can then also be used as reference or main detectors.

**Input:** nested array

**Values:** 1 - 4

**Code:**

```javascript
"reference": [[<detector>], ... ],
```

**Type:** protocol

**Editor:** table

**Versions:**

`1.17` `1.16` `1.14` `1.11` `1.10` `1.08` `1.07` `1.06`

**Devices:**

`MultispeQ 1` 

**Last Edited:** June 6, 2017

**Url:** <https://github.com/Photosynq/PhotosynQ-Firmware/wiki/reference>

**Dependencies:**

+ [pulses](#pulses)
+ [pulse_length](#pulse_length)
+ [pulse_distance](#pulse_distance)

***

### save<a id="save"></a>
This command saves a value to a location in the device memory (EEPROM). Expressions can be used on the saved values ([more](https://github.com/Photosynq/PhotosynQ-Firmware/wiki/How-to-use-Expressions)).

**Input:** nested array

**Code:**

```javascript
"save":[[<location, <value>], ... ]],
```

**Type:** protocol

**Editor:** fixed

**Versions:**

`1.17` `1.16` `1.14` `1.11` `1.10` `1.08` `1.07` `1.06`

**Devices:**

`MultispeQ 1` 

**Last Edited:** June 6, 2017

**Url:** <https://github.com/Photosynq/PhotosynQ-Firmware/wiki/save>

***

### save\_trace_time_scale<a id="save_trace_time_scale"></a>
Saving Time Scale Values. Setting the value to 0 will inactivate the function (preset), setting it to 1 will activate the function. If activated `data_raw_time` will be added to the measurement, containing the timing information.

**Input:** number

**Values:** 0, 1

**Code:**

```javascript
"save_trace_time_scale": <number>,
```

**Type:** protocol

**Editor:** fixed

**Devices:**

`MultispeQ 1` 

**Last Edited:** August 17, 2017

***

### set\_led_delay<a id="set_led_delay"></a>
Pre-illuminating a sample. It is often useful to pre-illuminate a sample at a given light intensity, for a given amount of time.
The following example gives two, 20 second pre-illuminations with the red LED (#2), the first at 0 uE and the second at 100 uE:

```
"set_led_delay": [
	[2, 20000,0],
	[2, 20000,100]
],
```

**Input:** nested array

**Code:**

```javascript
"set_led_delay": [ [<number LED>, <number duration in ms>, <number PAR>],... ],
```

**Type:** protocol

**Editor:** fixed

**Devices:**

`MultispeQ 1` 

**Last Edited:** August 17, 2017

***

### set\_light_intensity<a id="set_light_intensity"></a>
Instead of measuring the ambient light intensity, use `set_light_intensity` to set a fixed light intensity. Use the parameters `light_intensity` or `previous_light_intensity` to use the defined light intensity.

**Note:** Instead of defining the light intensity for each pulse set use `set_light_intensity` to only have one place to change the light intensity.

**Input:** number

**Code:**

```javascript
"set_light_intensity": <number>,
```

**Type:** protocol

**Editor:** fixed

**Devices:**

`MultispeQ 1` 

**Last Edited:** August 17, 2017

***

### start\_on_close<a id="start_on_close"></a>
If set to 0, the command will be ignored. If set to 1, will wait until the clamp is closed, then proceed with the rest of the experiment.

**Input:** number

**Values:** 0, 1

**Code:**

```javascript
"start_on_close": <number>,
```

**Type:** protocol

**Editor:** fixed

**Devices:**

`MultispeQ 1` 

**Last Edited:** August 17, 2017

***

### start\_on_open<a id="start_on_open"></a>
If set to 0, the command will be ignored. If set to 1 or higher, it will wait until the clamp is opened, then proceed with the rest of the experiment.

**Input:** number

**Values:** 0, 1

**Code:**

```javascript
"start_on_open": <number>,
```

**Type:** protocol

**Editor:** fixed

**Devices:**

`MultispeQ 1` 

**Last Edited:** August 17, 2017

***

### start\_on_open_close<a id="start_on_open_close"></a>
If set to 0, the command will be ignored. If set to 1, will wait until the clamp is opened then closed, then proceed with the rest of the experiment.

**Alias:**

+ open_close_start

**Code:**

```javascript
"start_on_open_close": <number>,
```

**Type:** protocol

**Editor:** fixed

**Devices:**

`MultispeQ 1` 

**Last Edited:** August 17, 2017

***

