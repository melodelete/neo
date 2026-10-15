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
        show: false,
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
    tray.setToolTip('Neo - Press ` or ~ to show launcher')
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
    // Shortcuts
    const ret1 = globalShortcut.register('`', () => {
        console.log('Backtick shortcut activated')
        showWindow()
    })
    const ret2 = globalShortcut.register('Shift+`', () => {
        console.log('Tilde shortcut activated')
        showWindow()
    })
    console.log(`Backtick shortcut registered: ${ret1}`)
    console.log(`Tilde shortcut registered: ${ret2}`)
    if (!ret1 || !ret2) {
        console.log('One or more shortcut registrations failed')
    } else {
        console.log('Both shortcuts registered successfully')
    }
    tray.setToolTip('Neo - Press Shift + ` or ~ to show launcher')
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