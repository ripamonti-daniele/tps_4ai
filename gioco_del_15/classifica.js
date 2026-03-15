import { caricaClassifica, salvaPunteggio } from './giocoDel15.js';
import { caricaClassifica2048, salvaPunteggio2048 } from './2048.js';

// Quale gioco è aperto in questo momento ('15' o '2048')
window._giocoAttivo = '15';

// Crea una riga della classifica con posizione, nome e punteggio
function creaRiga(i, nome, punteggio) {
    const medaglie = ['🥇', '🥈', '🥉'];
    const posizione = medaglie[i] || `${i + 1}.`;
    const li = document.createElement('li');
    li.innerHTML = `<span class="rank">${posizione}</span>
                    <span class="player-name">${nome}</span>
                    <span class="player-score">${punteggio}</span>`;
    return li;
}

// Aggiorna la lista visiva della classifica in base al gioco attivo
function aggiornaClassifica() {
    const lista = document.getElementById('lista-classifica');
    lista.innerHTML = '';

    // Leggi i dati dal localStorage, ordinali e prendi i primi 10
    let giocatori;
    if (window._giocoAttivo === '15') {
        giocatori = Object.entries(caricaClassifica())
            .map(([nome, dati]) => ({ nome, best: dati.best }))
            .sort((a, b) => a.best - b.best) // meno mosse = meglio
            .slice(0, 10)
            .map((p, i) => creaRiga(i, p.nome, `${p.best} mosse`));
    } else {
        giocatori = Object.entries(caricaClassifica2048())
            .map(([nome, dati]) => ({ nome, best: dati.best }))
            .sort((a, b) => b.best - a.best) // più punti = meglio
            .slice(0, 10)
            .map((p, i) => creaRiga(i, p.nome, `${p.best} pt`));
    }

    if (giocatori.length === 0) {
        // Nessun punteggio salvato: mostra messaggio vuoto
        const li = document.createElement('li');
        li.className = 'classifica-vuota';
        li.textContent = 'Nessun punteggio ancora';
        lista.appendChild(li);
    } else {
        giocatori.forEach(riga => lista.appendChild(riga));
    }
}

// Quando si clicca "Salva punteggio" nel popup
document.getElementById('submit-name').addEventListener('click', () => {
    const nome = document.getElementById('name-input').value.trim();
    if (!nome) return;

    if (window._giocoAttivo === '15') salvaPunteggio(nome);
    else salvaPunteggio2048(nome);

    aggiornaClassifica();
    document.getElementById('victory-popup').classList.remove('show');
    document.getElementById('name-input').value = '';
});

// Chiamata da main.js quando si cambia gioco
window.aggiornaClassificaVisual = aggiornaClassifica;
window.setGiocoAttivo = (gioco) => {
    window._giocoAttivo = gioco;
    const titolo = document.getElementById('popup-title');
    if (titolo) titolo.textContent = gioco === '2048' ? 'Partita terminata!' : 'Hai completato il gioco!';
    aggiornaClassifica();
};

// Mostra subito la classifica all'avvio
aggiornaClassifica();