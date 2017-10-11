# PhotosynQ Documentation
Documentation on how to use the PhotosynQ Platform, including Help, Tutorials and FAQs.

## Help - Pages

The prefix defines the chapters on the index page <https://photosynq.org/help>.

| Prefix | Chapter Content |
| :-- | :-- |
| \_account\_ | Topics related to the user account on the PhotosynQ website. |
| \_apps\_ | Topics related to the Desktop and Mobile App. |
| \_data\_ | Information on how to view collected Data in the Web-Browser. |
| \_macros\_ | Topics related on using and building Macros. |
| \_projects\_ | Topics related on setting up and using Projects.|
| \_protocols\_ | Topics related on using and building Protocols. |

Files are named using the prefix and the help title, e.g. `_apps_This_is_the_Chapter_1.md` This is important since `This_is_the_Chapter_1` will be used as the chapter title: _This is the Chapter 1_.

### Account Basics
+ [Create an Account](help/_account_Create_an_Account.md)
+ [Edit your profile](help/_account_Edit_your_Profile.md)
+ [Manage your password](help/_account_Manage_your_password.md)
+ [PhotosynQ Glossary](help/_account_PhotosynQ_Glossary.md)
+ [Sign in to PhotosynQ](help/_account_Sign_in_to_PhotosynQ.md)
+ [Change your email address](help/_account_Change_your_mail_address.md)
+ [Your subscriptions](help/_account_Your_subscriptions.md)
+ [Project invitations](help/_account_Project_invitations.md)
+ [Sign out of PhotosynQ](help/_account_Sign_out_of_PhotosynQ.md)
+ [Deactivate your PhotosynQ Account](help/_account_Deactivate_your_PhotosynQ_Account.md)
 
### Apps
+ [PhotosynQ on computers, phones and tablets](help/_apps_PhotosynQ_on_computers_phones_and_tablets.md)
+ [PhotosynQ for Android](help/_apps_PhotosynQ_for_Android.md)
+ [PhotosynQ for Desktops](help/_apps_PhotosynQ_for_Desktops.md)
+ [Connect an Instrument](help/_apps_Connect_an_Instrument.md)
+ [My Projects](help/_apps_My_Projects.md)
+ [Adding Notes and Pictures](help/_apps_Adding_Notes_and_Pictures.md)
 
### Projects
+ [What are projects?](help/_projects_What_are_projects.md)
+ [Join a Project](help/_projects_Join_a_project.md)
+ [Create a new Project](help/_projects_Create_a_new_Project.md)
+ [Select a Protocol](help/_projects_Select_a_protocol.md)
+ [Adding Project Questions](help/_projects_Adding_Project_Questions.md)
+ [Project Locations](help/_projects_Project_Locations.md)
+ [Adding a Project Description](help/_projects_Adding_a_Project_Description.md)
+ [Editing a Project](help/_projects_Editing_a_Project.md)
+ [Managing Project Settings](help/_projects_Managing_Project_Settings.md)
 
### View & Analyze Data
+ [View your Project Data](help/_data_View_your_Project_Data.md)
+ [The Dashboard](help/_data_The_Dashboard.md)
+ [Plot Data](help/_data_Plot_Data.md)
+ [The Map](help/_data_The_Map.md)
+ [The Spreadsheet](help/_data_The_Spreadsheet.md)
+ [Statistics](help/_data_Statistics.md)
+ [Series (Data subsets)](help/_data_Series_Data_subsets.md)
+ [Filter Data](help/_data_Filter_Data.md)
+ [Set Thresholds](help/_data_Set_Thresholds.md)
+ [Viewing Notes and Pictures](help/_data_Viewing_Notes_and_Pictures.md)
 
### Protocols
+ [Protocol Basics](help/_protocols_Protocol_Basics.md)
+ [View your Protocols](help/_protocols_View_your_Protocols.md)
+ [Create a Protocol](help/_protocols_Create_a_new_Protocol.md)
+ [Save a Protocol](help/_protocols_Save_a_Protocol.md)
+ [Edit a Protocol](help/_protocols_Edit_a_Protocol.md)
+ [Run a Protocol](help/_protocols_Run_a_Protocol.md)
+ [Commands](help/_protocols_Commands.md)
 
### Macros
+ [View your Macros](help/_macros_View_your_Macros.md)
+ [Create a new Macro](help/_macros_Create_a_new_Macro.md)
+ [Save a Macro](help/_macros_Save_a_Macro.md)
+ [Edit a Macro](help/_macros_Edit_a_Macro.md)
+ [Coding and Functions](help/_macros_Coding_and_Functions.md)

### Instruments
+ [Instrument basics](help/_instruments_Instrument_basics.md)
+ [What does the MultispeQ measure?](help/_instruments_What_does_the_MultispeQ_measure.md)
+ [MultispeQ v1.0 Configuration](help/_instruments_MultispeQ_v1.0_configuration.md)

## Tutorial - Pages

Each file represents one tab on <https://photosynq.org/tutorials>.

| File | Tutorial Content |
| :-- | :-- |
| [_getting_started.md](tutorials/_getting_started.md) | How to set up an account, connect an instrument and use a project. |
| [_creating_a_project.md](tutorials/_creating_a_project.md) | How to create a new Project for data collection. |
| [_data_collection.md](tutorials/_data_collection.md) | How to collect data for a Project. |
| [_data_viewing.md](tutorials/_data_viewing.md) | How to view data in the Web-Browser. |
| [_data_analysis.md](tutorials/_data_analysis.md) | Overview for data analysis. R and Python examples are documented in the corresponding repos. |
| [_building_a_protocol.md](tutorials/_building_a_protocol.md) | How to build a simple Protocol. |
| [_building_a_macro.md](tutorials/_building_a_macro.md) | How to build a simple Macro. |
| [_videos.md](tutorials/_videos.md) | List of videos from the YouTube channel. |
| Analysis - R | [Import Data](tutorials/_r_import_photosynq_data.md), [Anova and Multivariate Analysis](tutorials/_r_anova_and_multivariate_analysis.md), [Correlation and Mixed Effects](tutorials_r_correlation_and_mixed_effects.md/) |
| Analysis - Python | [Import Data](tutorials/_python_connect_python_to_photosynq.md) |

## Build

### Images
All images are placed in the `images` folder in the corresponding folders. For now we don't have any special naming conventions. The description will appear on the website as a figure legend.

Include images as `![A figure description](../images/folder/file.*)`

Make sure to use png, jpeg or gifs if animations are necessary.

### Special functions

`***Tip:*** This is a Tip for you.` Will create a blue info box on the website. Don't use line breaks.

`***Note:*** This is a Note for you.` Will create a yellow note box on the website. Don't use line breaks.

`<i class="fa fa-..."></i>` Will include the corresponding <http://fontawesome.io/> icon on the website.

### Elasticlunr.js Search Index

Manually generate a search index for Elasticlunr.js

```bash
$ node index.js create
```

Test the search function as it is used on PhotosynQ

```bash
$ node index.js search --term <search term>
```

In order to generate the index make sure, you have [Node.js](https://nodejs.org/) installed.

### Compile Master documents

To generate one big help document and one tutorials document, use the compile script.

```bash
$ . compile.sh
```

In order to generate the PDF files make sure, you have [Pandoc](http://pandoc.org/) and [LaTeX](https://www.latex-project.org/) installed.