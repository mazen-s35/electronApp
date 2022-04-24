const { ipcMain } = require("electron");
const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
// const ipc = electron.ipcMain;
const Datastore = require('nedb');

let win;
let datastore;

function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        autoHideMenuBar: true
    })
    win.loadFile(__dirname + '/renderer/index.html');
    // win.webContents.toggleDevTools();
    win.addListener('ready-to-show', () => {
        win.show();
    })
}

function initDatastore() {
    let path = app.getPath("userData");
    datastore = new Datastore({
        filename: path + '/note.json'
    });

    datastore.loadDatabase((err) => {
        if (err) {
            console.log('there was some error');
            throw err;
        } else {
            console.log('datastore loaded successfully')
        }
    })
}

app.whenReady().then(() => {
    initDatastore()
    createWindow()
})

app.addListener('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
})

ipcMain.on("save-note", function(e, note) {
    datastore.insert(note, (err, new_doc) => {
        console.log(new_doc);
        if (err) {
            console.log("There was error in inserting DB");
            throw err;
        } else {
            console.log("Data inserting successfully")
        }
    })
});

ipcMain.handle("get_data", async(e) => {
    return new Promise((resolve, reject) => {
        datastore.find({}, (err, docs) => {
            if (err) {
                reject(err);
            } else {
                resolve(docs);
            }
        })
    })
});