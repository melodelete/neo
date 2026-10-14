const { app, BrowserWindow, Tray, Menu, shell, globalShortcut, ipcMain, screen} = require('electron')
const path = require('path')

let win = null
let tray = null

function createWindow() {
    win = new BrowserWindow({
        width:200,
        height:200,
        transparent:true,
        frame:false,
        skipTaskbar:true,
        alwaysOnTop:true,
        webPreferences:{
            preload: path.join(__dirname, 'preload.js'),
        }
    })
    win.loadFile('index.html')
    win.on('blur', () => {
        win.hide()
    })
}

function createTray() {
    tray = new Tray(path.join(__dirname, 'assets', 'icon.png'))
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Show Neo', click: () => showWindow()  },
        { label: 'Quit', click: () => app.quit() }
    ])
    tray.setToolTip('Neo - Press Ctrl+Shift+Space to show launcher')
    tray.setContextMenu(contextMenu)
}
function showWindow() {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize
    win.setPosition(Math.floor(width / 2) - 100, Math.floor(height / 2) - 100)
    win.show()
    win.focus()
}
app.whenReady().then(() => {
    createWindow()
    createTray()
    setTimeout(() => {
        showWindow()
        console.log('Neo Launcher Shown')
    }, 1000)
    // SHortuct
    const ret = globalShortcut.register('Control+Shift+Space', () => {
        console.log('Shortcut activated')
        showWindow()
    })
    if (!ret) {
        console.log('Shortcut registration failed')
    }
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})