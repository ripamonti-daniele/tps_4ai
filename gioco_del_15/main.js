// MAIN.JS — gestisce il passaggio tra i due giochi

// Tiene in memoria il modulo del gioco attualmente caricato
let moduloCorrente = null;

// Carica e avvia un gioco (nome = '15' oppure '2048')
async function caricaGioco(nome) {
    // Prima di caricare il nuovo gioco, distruggi quello vecchio
    if (moduloCorrente && moduloCorrente.destroy) {
        try { moduloCorrente.destroy(); } catch (e) { console.error(e); }
        moduloCorrente = null;
    }

    const griglia = document.getElementById('game-board');

    if (nome === '15') {
        const modulo = await import('./giocoDel15.js');
        moduloCorrente = modulo;
        if (griglia) griglia.classList.remove('mode-2048');
        modulo.init();
    } else if (nome === '2048') {
        const modulo = await import('./2048.js');
        moduloCorrente = modulo;
        if (griglia) griglia.classList.add('mode-2048');
        modulo.init();
    }
}

// Imposta i link di navigazione in alto (Gioco del 15 | 2048)
function impostaNavigazione() {
    const link15 = document.getElementById('link-15');
    const link2048 = document.getElementById('link-2048');

    function impostaAttivo(linkAttivo) {
        [link15, link2048].forEach(el => el.classList.toggle('active', el === linkAttivo));
    }

    link15.addEventListener('click', () => {
        impostaAttivo(link15);
        if (window.setGiocoAttivo) window.setGiocoAttivo('15');
        caricaGioco('15');
    });

    link2048.addEventListener('click', () => {
        impostaAttivo(link2048);
        if (window.setGiocoAttivo) window.setGiocoAttivo('2048');
        caricaGioco('2048');
    });
}

// Quando la pagina è pronta, imposta la navigazione e avvia il Gioco del 15
document.addEventListener('DOMContentLoaded', () => {
    impostaNavigazione();
    caricaGioco('15');
});