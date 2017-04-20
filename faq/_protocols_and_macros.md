#### What are Protocols?
Protocols are instructions for Instruments like the **MultispeQ** on how to run a measurement.

***

#### What are Macros?
Macros are small pieces of code that help you analyze a measurement. After a measurement is done, a macro can be applied to make calculations based on the measurement results.

***

#### How do I create a Protocol?
Currently you have to use the **Desktop Application** to create a new Protocol and save it to PhotosynQ. Instructions on how to build a Protocol you can find [here](https://github.com/Photosynq/PhotosynQ-Firmware/wiki)

***

#### How do I create a Macro?
Currently you have to use the **Desktop Application** to create a new Macro and save it to PhotosynQ. Macros are written in JavaScript.

***

#### Does a Protocol need a Macro?
**No**, you don’t have to have a Macro for a Protocol. Yet most of the measurements require a Macro since they need to be analyzed further to provide useful information.

***

#### Can any Protocol run on any Instrument?
**No**, Instruments have different configurations, so Protocols might trigger the wrong lights, or request a sensor that is not available. Make sure that the Protocol is compatible with your Instrument.