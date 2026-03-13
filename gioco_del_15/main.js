let currentModule = null;

async function loadGame(name) {
    if (currentModule && currentModule.destroy) {
        try { currentModule.destroy(); } catch (e) { console.error(e); }
        currentModule = null;
    }

    const title = document.getElementById('page-title');
    const board = document.getElementById('game-board');
    if (name === '15') {
        const mod = await import('./giocoDel15.js');
        currentModule = mod;
        if (title) title.textContent = 'Gioco del 15';
        if (board) board.classList.remove('mode-2048');
        if (currentModule.init) currentModule.init();
    } else if (name === '2048') {
        const mod = await import('./2048.js');
        currentModule = mod;
        if (title) title.textContent = '2048';
        if (board) board.classList.add('mode-2048');
        if (currentModule.init) currentModule.init();
    }
}

function setupNav() {
    const link15 = document.getElementById('link-15');
    const link2048 = document.getElementById('link-2048');
    function setActive(activeEl) {
        [link15, link2048].forEach(el => el.classList.toggle('active', el === activeEl));
    }
    link15.addEventListener('click', () => {
        setActive(link15);
        if (window.setGiocoAttivo) window.setGiocoAttivo('15');
        loadGame('15');
    });
    link2048.addEventListener('click', () => {
        setActive(link2048);
        if (window.setGiocoAttivo) window.setGiocoAttivo('2048');
        loadGame('2048');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setupNav();
    loadGame('15');
});
