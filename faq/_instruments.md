#### What Instruments can be used with PhotosynQ?
In theory **any** instrument can be connected to PhotosynQ. **But** the output needs to follow the PhotosynQ [format](https://photosynq.org/rdoc/Api/V3/DataController.html). To get started use PhotosynQ enabled instruments like the **MultispeQ**.

***

### MultispeQ

#### How do I connect the MultispeQ?
You can connect the Instrument either trough micro-USB or via Bluetooth.

***

#### How long is the delay among the intensity of the PAR detection outside and the replication of the PAR intensity inside the measurement chamber?
The replication of the light intensity is essentially instantaneous. The users can set up Protocols so that the illumination is set just prior to leaf clamping, so that there should be minimal perturbations (v1.0).

***

#### Is there any increase in air temperature inside the measurement chamber due to the electronic apparatus?
This probably depends on the duration and conditions of the measurement. We did observe increases in temperature, but the main cause was absorption of light by the black case of the beta version and should be resolved in the new version of the MultispeQ.

***

#### Would it be necessary to have a specific calibration for using the Instrument with C4 plants?
**No.** The signals the device measures apply equally to C3 and C4 plants.

***

#### It would be interesting to know the maximum PAR supplied by the MultispeQ.
**v1.0:** Not tested yet. 
**beta:** For brief pulses, (a few seconds) the device can produce light intensities of about ~16,500 µmol photons m<sup>-2</sup> s<sup>-1</sup>. The sustainable light intensity is about 2,500 µmol photons m<sup>-2</sup> s<sup>-1</sup>.

***

#### Is it possible to calibrate the sensors?
**Yes.** There are built in procedures for calibrating all parameters. In addition, we supply cards for the users to calibrate SPAD. Currently, the only parameter that requires an external equipment for calibration is the PAR meter, but we are developing an inexpensive, deployable PAR calibration tool to allow users to calibrate PAR more easily.

***

#### Does the MultispeQ assess leaf temperature?
**v1.0:** *Yes.* The new device uses has a calibrated IR-sensor to measure leaf temperature.
**beta:** *No.* The beta device does not have a sensor for leaf temperature.

***

#### How long do the batteries last? Are the batteries rechargeable? If so, how is this process? How long to recharge?
**v1.0:** The new Instrument has a build in 5500 mAh LiPo battery that can be charged through the micro-USB port.
**beta:** The beta Instrument was sent out with 6 rechargeable AAA batteries. The case can be opened and the batteries can be taken out to be charged.
The time until the battery is fully charged depends on the charger, but as a rule of thumb, they are fully charged if kept in the charger overnight.

***

#### How to reference the MultispeQ - beta?
The validation of the device was published in the journal **[Royal Society of Open Science](http://rsos.royalsocietypublishing.org)**

Kuhlgert, S., Austic, G., Zegarac, R. Osei-Bonsu, I.,Hoh, D., Chilvers, M. I., et al. (2016). **MultispeQ Beta: a tool for large-scale plant phenotyping connected to the open PhotosynQ network.** *R. Soc. Open Sci.* 3, 160592. [doi:10.1098/rsos.160592].

[doi:10.1098/rsos.160592]: https://dx.doi.org/10.1098/rsos.160592