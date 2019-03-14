# PhotosynQ Documentation

Documentation on how to use the PhotosynQ Platform, including Help, Tutorials and FAQs.

## Build

The latest release is available at <https://help.photosynq.org>.

### Folders & Files

Files are named using the help or tutorial title, e.g. `this-is-the-chapter-1.md`.

```shell
├── docs
│   ├── _404.md                 // 404 Error Pagefile
│   ├── _sidebar.md             // Sidebar Menu file
│   ├── _navbar.md              // Top Navigation Menu file
│   ├── account                 // Account Chapters folder
│   │   └── images
│   ├── desktop-application     // Desktop Application Chapters folder
│   │   └── images
│   ├── instruments             // Instrument Chapters folder
│   │   └── images
│   ├── macros                  // Macro Chapters folder
│   │   └── images
│   ├── mobile-application      // Mobile Application Chapters folder
│   │   └── images
│   ├── projects                // Project Chapters folder
│   │   └── images
│   ├── protocols               // Protocol Chapters folder
│   │   └── images
│   ├── tutorials               // Tutorials folder
│   │   └── images
│   └── view-and-analyze-data   // Data viewing and analysis Chapters folder
│   │   └── images
└── firmware                    // Firmware Commands folder
```

### Images

All images are placed in the `images` folder in the corresponding chapter folders. For now we don't have any special naming conventions.

Include images as `![A figure description](images/file.*)`

Make sure to use png, jpeg or gifs if animations are necessary.

### Special functions

`?> **Tip:** This is a Tip for you.` Will create a blue info box on the website. Don't use line breaks.

`!> **Note:** This is a Note for you.` Will create a yellow note box on the website. Don't use line breaks.

`<i class="fa fa-..."></i>` Will include the corresponding <https://fontawesome.com/v4.7.0/icons> icon (v4.7.0) on the website.

### Firmware

The firmware folder contains individual files for each command, using the command as a filename `command.json`. Use the following command generate a template file for a new command.

```shell
node index.js cmd --new <command>
```

The standard structure for documenting a command is the following:

```Javascript
{
    "name": "<string>",             // Command Name
    "abstract": "<string>",         // A brief one line description about the Command's function
    "description": "<string>",      // Description of the Command's function
    "alias": ["<string"],           // If the Command has an alias add it here, no separate file needed
    "input": "string|array|number", // If the Command expects a string, number or array
    "values": [],
    "example": "<string>",          // Add an example on how to use the command
    "type": "console|protocol",     // Where the Command can be used
    "editor": "table|fixed",        // Location in the Protocol Editor
    "compatibility": {},            // "Instrument Name": ["firmware version",...]
    "time":{
        "modified": "<time>",       // Timestamp YYYY-MM-DDTHH:mm:ssZ
        "created": "<time>",        // Timestamp YYYY-MM-DDTHH:mm:ssZ
    },
    "deprecated": false,            // If a Command is deprecated set to true
    "dependencies":[],              // Add Commands that are required with this command in protocols
    "parent": "<string>",           // When the command nested within a command
    "access": "public|private"      // If the command is in the outside documentation
}
```

### Test Help Documentation

Requires *docsify-cli* to be installed. Open the url in a browser when the server is started.

```shell
npm run server
```

### Compile Master documents

To generate one big help document and one tutorials document, use the compile script.

#### Build from latest commit

```shell
npm run build
```

#### Build from latest tag (release)

```shell
npm run release
```