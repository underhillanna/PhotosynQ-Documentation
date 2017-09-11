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

## Tutorial - Pages

Each file represents one tab on <https://photosynq.org/tutorials>.

| File | Tutorial Content |
| :-- | :-- |
| _getting_started.md | How to set up an account, connect an instrument and use a project. |
| _data_collection.md | How to collect data for a Project. |
| _data_viewing.md | How to view data in the Web-Browser. |
| _data_analysis.md | Overview for data analysis. R and Python examples are documented in the corresponding repos. |
| _building_a_protocol.md | How to build a simple Protocol. |
| _building_a_macro.md | How to build a simple Macro. |
| _videos.md | List of videos from the YouTube channel. |

## FAQs  - Page

Each file represents one tab on <https://photosynq.org/faqs>.

| File | Tab Content |
| :-- | :-- |
| _apps.md | Questions on using the app with an Instrument. |
| _general.md | General questions about the Platform. |
| _instruments.md | Questions for MultispeQ beta and v1.0. |
| _photosynthesis.md | Table with definitions and literature. |
| _projects.md | Questions about Projects. |
| _protocols_and_macros.md | Questions about Protocols and Macros. |

***

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

### Compile Master documents

To generate one big help document and one tutorials document, use the compile script.

```bash
$ . compile.sh
```

In order to generate the PDF files make sure, you have [Pandoc](http://pandoc.org/) and [LaTeX](https://www.latex-project.org/) installed.