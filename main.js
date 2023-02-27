const {app,BrowserWindow,ipcMain,webContents} = require("electron");

let mainWindow;
let secWin;
let allChildWindow= new Map();

const createWindow = ()=>{
    //function for creating a browser window

    mainWindow= new BrowserWindow({
        height:700,
        width:600,
        webPreferences:{
            nodeIntegration:true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    })


    mainWindow.loadFile("index.html");
    // mainWindow.webContents.openDevTools();

}

const createSecWin=()=>{
    secWin = new BrowserWindow({
        height:600,
        width:500,
        parent:mainWindow,
        webPreferences:{
            nodeIntegration:true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    })
    secWin.loadFile("index1.html")
    secWin.webContents.openDevTools();
    let Id = secWin.webContents.id;
    secWin.setTitle(Id.toString())
    // console.log(Id)
    // secWin.webContents.executeJavaScript(`window.id.value = ${Id}`)

    const childId = `${secWin.webContents.id}`
    allChildWindow.set(childId, secWin)

    secWin.on("close",(e)=>{
        // e.preventDefault();
        mainWindow.send("deleteWindow",Id)
        // secWin.close();

    })
    // console.log(secWin)


    mainWindow.on("focus",()=>{
        app.setBadgeCount(0);
    })
   


}

app.whenReady()
.then(()=>{
    createWindow();
})

let track;
ipcMain.on("message1",(e,msg)=>{
    //receiving message from second window
    // console.log(msg);
    track = e.sender;
    // console.log(track.id)
    mainWindow.send("channel1",{msg,id:e.sender.id})
    app.setBadgeCount(app.getBadgeCount() + 1);
})
ipcMain.on("message2",(e,msg)=>{
    //receiving message from main window
    // console.log(msg)
    createSecWin();
    mainWindow.send("sending",secWin.webContents.id);
    // console.log(webContents.getAllWebContents())
    app.setBadgeCount(app.getBadgeCount() + 1);
})

ipcMain.on("parent",(e,msg)=>{
    // console.log(msg)
    let msgObj = {
        id: e.sender.id,
        message : msg
    }
    track.send("child",msgObj)
    app.setBadgeCount(app.getBadgeCount() + 1);
})

ipcMain.on("main-msg",(e,msg)=>{
    let msgToSend =msg.message;
    let windowId = msg.winId;
    
    let selectedWin = allChildWindow.get(windowId);
    // console.log(selectedWin)
    selectedWin.send("child",{msgToSend,windowId})
    app.setBadgeCount(app.getBadgeCount() + 1);
})

// app.on('browser-window-focus',()=>{
//     app.setBadgeCount(0);
// })

