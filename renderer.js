document.addEventListener('DOMContentLoaded', () => {
    const shortcuts = window.Node.getShortcut()
    const sections = {
        search: shortcuts.filter(s => ['Web Search'].includes(s.label)),
        productivity: shortcuts.filter(s => ['Calculator', 'Notepad', 'Terminal'].includes(s.label)),
        entertainment: shortcuts.filter(s => ['YouTube', 'Netflix', 'Spotify'].includes(s.label)),
        social: shortcuts.filter(s => ['Twitter', 'Facebook', 'Instagram'].includes(s.label)),
        utilities: shortcuts.filter(s => ['Settings', 'File Explorer'].includes(s.label)),
    }
    const launcher = document.getElementById('launcher')
    for (const [section, items] of Object.entries(sections)) {
        const sectionDiv = document.createElement('div')
        sectionDiv.classList.add('launcher-section')
        sectionDiv.style.transform = `rotate(${Object.keys(sections).indexOf(section) * (360 / Object.keys(sections).length)}deg) translateY(-80px) rotate(-${Object.keys(sections).indexOf(section) * (360 / Object.keys(sections).length)}deg)`
        items.forEach(item => {
            const button = document.createElement('div')
            button.classList.add('launcher-button')
            button.innerText = item.label[0]
            button.title = item.label
            button.addEventListener('click', () => {
                window.Node.openUrl(item.url)
            })
            sectionDiv.appendChild(button)
        })
        launcher.appendChild(sectionDiv)
    }
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