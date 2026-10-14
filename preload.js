const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('Neo', {
    openUrl: (url) => {ipcRenderer.send('open-url', url)},
    getShortcut: () => { return ipccRenderer.sendSync('get-shortcut')},
})
// Handled by rendereer.js
ipcRenderer.on('get-shortcut-reply', (event, shortcut) => {})

