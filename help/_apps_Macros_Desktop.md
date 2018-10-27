### Desktop Macros

Macros are used to calculate parameters from a measurement. To work with Macros you can select **Macros** from the left side bar, you can select **View -> Macros** from the top menu bar or you can use the shortcut `Ctrl+4 / ⌘4`.

**My Macros** shows a list of Macros you have created. **Explore** will provide a list of all Macros currently available on the Platform. Click on the list headers to sort the list of Macros by name, creator and date.

A **single click** on a Macro from the list will bring up details about the Macro in the right side bar. Here you can also see the discussion around the macro as well as add new comments. A **double click** will directly open the Macro in the Macro Editor.

Select the search field in the top right corner `Ctrl+F / ⌘F` to enter a search query followed by the enter key to search the list of Macros. Use the `×` button inside the input field or the `ESC` key to reset the search.

#### Create a new Macro

You can create a new Macro by opening the Macro editor selecting **File -> New Macro** from the main menu. The Macro template will be automatically added to your Code Editor and you are ask to pick a measurement from your Notebook to use as your measurement template. You can select that measurement at any time selecting **Measurement** from the **Menu Bar**, but it is easier to start with a measurement provided.

#### Editing an existing Macro

You can edit a Macro simply by selecting a macro from the list of macros and open the editor by double clicking it or you can use the edit button in the right side bar to open the Macro Editor.

When you are the creator of the Macro you can either overwrite the existing Macro or you can save it as a new Macro. In case you are not the creator, you can only save the macro as a new one.

#### The Macro Editor

![1. Menu Bar, 2. Code Editor, 3. Traces and 4. Macro Output](../images/help/_apps_Desktop_Macro_Editor.png)

##### 1. Menu Bar

The **Menu Bar** holds dropdown menus, that allow you to write your Macro faster and make the underlying measurement data structure more accessible.

Use the **Measurement** button to select a measurement from your Notebook, that you want to use as a template for your Macro. You can pick a new measurement at any time. When you load an existing Macro, the measurement saved along with the macro is automatically loaded.

The **Functions** dropdown contains all the preset functions that are supplied by PhotosynQ to make calculations faster and avoid recurring programming tasks.

The **Variables** dropdown contains the variables accessible from the underlying measurement. When using a measurement with a protocol set, the variables depend on the selected set.

Some parameters you want to output are using greek characters like delta (Δ). Use the **Symbols** dropdown to add them into your parameter names (e.g. ΔAbsorbance instead of delta Absorbance ).

##### 2. Code Editor

This is the place to write your Macro code. When you create a new Macro, the minimal required code is already added to this workspace. If you are new to coding, please see the tutorials on how to get started with a Macro.

If you start creating Macros, you will quickly realize, that some of the programming tasks are quite repetitive, like calculating a sum or mean, find the smallest or highest value, etc. The **Functions** from the **Menu Bar** allow you to skip these tasks and use preset functions. These functions vary from simple ones like finding the highest value `MathMax()` or using Euler's number `Math.E` to complex function to transform traces `TransformTrace()` and Regressions `MathLinreg`. Select these functions from the menu, where they get inserted at the current cursor position or the autocomplete menu while you are typing.

Protocols contain a variety of key value pairs like `data_raw` with the trace also displayed on the top right or parameters like `time`. You can simply select these from the **Variables** dropdown in the **Menu Bar** where they get inserted at the current cursor position or the autocomplete menu while you are typing. When you are writing a macro for a protocol set, the content of the menu will change depending on the set you have selected from the **Menu Bar**.

On the left hand-side there are not only the row numbers indicated, but also potential issues (warnings) and errors. Hover over the indicator with the mouse cursor to get an issue explanation. In case of errors, the error message will also be shown in the macro output when the automatic calculation is activated.

![Warning about a potential issue in the code](../images/help/_apps_Desktop_Macro_Editor_warning.png)

Sometimes the Macro code can be quite extensive. Use the keyboard shortcut `Ctrl+F / ⌘F` to search your code. Further the autosuggest function will list available functions, measurement variables and local variables as you type. You can bring up the autosuggest menu at any time using the shortcut `Ctrl+Space / ⌥Space`.

![While typing available variables and functions are autosuggested.](../images/help/_apps_Desktop_Macro_Editor_autosuggest.png)

##### 3. Traces

Most Protocols use at last one of the detectors record traces or spectra. To make it easier to work with those traces, you can simply click on a trace and the variable with the array position is added to your code (eg `json["data_raw"][59]`). yet, most of the times you will be more interested in a subsection of your trace. Use the **Range** checkbox. Now you can highlight a range by click and drag and insert it into your code (e.g. `json["data_raw"].slice(56,66)`). And of cause you can use click and drag to zoom into your trace as long as **Range** is not active.

##### 5. Macro Output

The Macro is executed as you are writing the code, so you can see for example, how changes in an equation affect the output in real time. By default this automatic calculation is activated, indicated by the checkbox labeled with **Auto**. In some cases, the calculations can cause the editor to behave sluggish, especially when you output a lot of traces. In this case you can deactivate the automatic calculations by removing the check from the checkbox. To see the Macro output you can run a calculation using the keyboard shortcut `Ctrl+Shift+R / ⌥⇧R`.