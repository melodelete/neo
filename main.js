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
    ipcMain.handle('get-shortcut', () => {
        return [
            { label: 'Web search', ico: '🔎', url: 'https://www.google.com' },
            { label: 'Open GitHub', ico: '🐙', url: 'https://github.com' },
            { label: 'Gmail', ico: '📧', url: 'https://mail.google.com' },
            { label: 'Calender', ico: '📅', url: 'https://calendar.google.com' }
        ]
    })
    // Shortcuts with fallbacks for Linux compatibility
    function registerShortcutWithFallback(primary, fallbacks, description) {
        let registered = globalShortcut.register(primary, () => {
            console.log(`${description} shortcut activated`)
            showWindow()
        })
        if (!registered) {
            console.log(`Primary shortcut '${primary}' failed for ${description}, trying fallbacks...`)
            for (const fallback of fallbacks) {
                registered = globalShortcut.register(fallback, () => {
                    console.log(`${description} shortcut activated (via ${fallback})`)
                    showWindow()
                })
                if (registered) {
                    console.log(`Fallback shortcut '${fallback}' succeeded for ${description}`)
                    break
                }
            }
        }
        return registered
    }

    // Define shortcut variations for backtick and tilde
    const backtickRegistered = registerShortcutWithFallback('`', ['Alt+`', 'Control+`', 'Shift+`', 'Alt+Shift+`'], 'Backtick')
    const tildeRegistered = registerShortcutWithFallback('Shift+`', ['Alt+Shift+`', 'Control+Shift+`', 'Alt+Control+Shift+`'], 'Tilde')

    console.log(`Backtick shortcut registered: ${backtickRegistered}`)
    console.log(`Tilde shortcut registered: ${tildeRegistered}`)
    if (!backtickRegistered || !tildeRegistered) {
        console.log('One or more shortcut registrations failed')
    } else {
        console.log('Both shortcuts registered successfully')
    }
    tray.setToolTip('Neo - Press ` or ~ to show launcher (with fallbacks Alt+`, Ctrl+`, etc.)')
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