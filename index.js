const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;
let workSetWindow;

app.on('ready', function() {
mainWindow = new BrowserWindow({});
mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'mainWindow.html'),
    protocol: 'file:',
    slashes: true
}));
mainWindow.on('closed', function() {
    app.quit();
});
const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu)
});

function createSetWorkTimeWindow() {
    workSetWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Set Work Time'
    });
    workSetWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'workSetWindow.html'),
        protocol: 'file:',
        slashes: true
    }));
    workSetWindow.on('close', function(){
        workSetWindow=null;
    })
}

function createSetBreakTimeWindow() {
    breakSetWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Set Break Time'
    });
    breakSetWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'breakSetWindow.html'),
        protocol: 'file:',
        slashes: true
    }));
    breakSetWindow.on('close', function(){
        workSetWindow=null;
    })

}

// ipcMain.on('item:addWorkTime',function(e, item) {
//     console.log(item);
//     mainWindow.webContents.send('item:add', item);
//     workSetWindow.close();
// });
ipcMain.on('item:addWork', function(e, item){
    console.log(item)
    mainWindow.webContents.send('item:addWork', item);
    workSetWindow.close(); 
    // Still have a reference to addWindow in memory. Need to reclaim memory (Grabage collection)
    //addWindow = null;
  });
  
  ipcMain.on('item:addBreak', function(e, item){
    console.log(item)
    mainWindow.webContents.send('item:addBreak', item);
    breakSetWindow.close(); 
    // Still have a reference to addWindow in memory. Need to reclaim memory (Grabage collection)
    //addWindow = null;
  });
  

const mainMenuTemplate = [
    {
        label: 'File',
        submenu:[
            {
                label: 'Parental Control',
            },
            {
                label: 'Quit',
                accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click() {
                    app.quit();
                }
            }
        ]},
        {
        label: 'Settings',
        submenu: [
            {
                label: 'Set Work Time',
                click() {
                    createSetWorkTimeWindow();
                }
            },
            {
                label: 'Set Break Time',
                click() {
                    createSetBreakTimeWindow();
                }
            } //comma here if needed
        ]
    }
];

if (process.platform === 'darwin') {
    mainMenuTemplate.unshift({});
}

//dev tools

if (process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [
            {
                label:'Toggle Dev Tools',
                accelerator: process.platform === 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }

        ]
        

        
    })

}