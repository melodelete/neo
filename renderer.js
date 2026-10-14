document.addEventListener('DOMContentLoaded', () => {
    const launcherContent = document.querySelector('.launcher-content')
    const shortcuts = window.Neo.getShortcut()
    shortcuts.forEach(shortcut => {
        const button = document.createElement('div')
        button.className = 'launcher-button-tooltip'
        button.setAttribute('data-label', shortcut.label)
        button.innerHTML = shortcut.ico
        button.addEventListener('click', (e) => {
            e.preventDefault()
            window.Neo.openUrl(shortcut.url)
            // Hides launcher
            const launcher = document.getElementById('launcher')
            if (launcher) {
                launcher.style.display = 'none'
            }
        })
        launcherContent.appendChild(button)
    })
    // Closes launcher when clicking outside of it
    document.addEventListener('click', (e) => {
        const launcher = document.getElementById('launcher')
        if (launcher && !launcher.contains(e.target)) {
            launcher.style.display = 'none'
        }
    })

    //close launcher on clicking ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const launcher = document.getElementById('launcher')
            if (launcher) {
                launcher.style.display = 'none'
            }
        }
    })
})