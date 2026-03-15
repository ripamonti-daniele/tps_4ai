// GIOCO 2048

// Array piatto di 16 valori che rappresenta la griglia 4x4
// L'indice i corrisponde a: riga = Math.floor(i/4), colonna = i%4
let celle = [];

// Riferimenti agli elementi HTML
let pulsanteReset = null;
let displayPunteggio = null;

// Lista dei listener aggiunti (serve per rimuoverli quando si cambia gioco)
let _listeners = [];

// ---- PUNTEGGIO ----

function aggiornaPunteggio() {
    if (!displayPunteggio) return;
    const punteggio = celle.reduce((somma, val) => somma + val, 0);
    displayPunteggio.textContent = 'Punteggio: ' + punteggio;
}

// ---- COSTRUZIONE DELLA GRIGLIA ----

function costruisciGriglia() {
    const griglia = document.getElementById('game-board');
    if (!griglia) return;
    griglia.innerHTML = '';
    celle = new Array(16).fill(0);

    for (let i = 0; i < 16; i++) {
        // Ogni cella ha uno sfondo fisso e una tessera sopra
        const sfondo = document.createElement('div');
        sfondo.className = 'bg-cell';
        sfondo.dataset.index = i;

        const tessera = document.createElement('div');
        tessera.className = 'tile';
        sfondo.appendChild(tessera);
        griglia.appendChild(sfondo);
    }
}

// Disegna le tessere sulla griglia in base all'array `celle`
function disegnaGriglia() {
    for (let i = 0; i < 16; i++) {
        const sfondo = document.querySelector(`#game-board .bg-cell[data-index='${i}']`);
        if (!sfondo) continue;
        const tessera = sfondo.querySelector('.tile');
        const valore = celle[i] || 0;

        tessera.className = 'tile';
        tessera.style.opacity = '1';

        if (valore > 0) {
            tessera.textContent = String(valore);
            tessera.classList.add('tile-' + valore); // aggiunge il colore giusto (es. tile-2, tile-4...)
        } else {
            tessera.textContent = '';
        }
    }
    aggiornaPunteggio();
    controllaFinePartita();
}

// ---- GENERAZIONE TESSERE ----

// Genera alcune tessere casuali all'inizio della partita
function generaTessereCasuali() {
    const tessereIniziali = Math.floor(Math.random() * 4) + 3; // da 3 a 6 tessere iniziali
    const indiciScelti = [];
    while (indiciScelti.length < tessereIniziali) {
        const idx = Math.floor(Math.random() * 16);
        if (!indiciScelti.includes(idx)) indiciScelti.push(idx);
    }
    indiciScelti.forEach(i => {
        celle[i] = Math.random() < 0.5 ? 2 : 4;
    });
    disegnaGriglia();
}

// Genera una sola tessera casuale dopo ogni mossa
function generaUnaTessera() {
    const celleVuote = [];
    for (let i = 0; i < 16; i++) {
        if (!celle[i] || celle[i] === 0) celleVuote.push(i);
    }
    if (celleVuote.length === 0) return false;
    const idx = celleVuote[Math.floor(Math.random() * celleVuote.length)];
    celle[idx] = Math.random() < 0.9 ? 2 : 4; // 90% di probabilità che sia 2, 10% che sia 4
    return true;
}

// ---- LOGICA DEL MOVIMENTO ----

// Controlla se due array hanno gli stessi valori
function arrayUguali(a, b) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
    return true;
}

// Elabora una riga: compatta i valori verso sinistra e unisce le coppie uguali
// Riceve un array di oggetti { val, pos } e restituisce i nuovi valori e da dove venivano
function elaboraRiga(riga) {
    // Rimuovi gli zeri
    const compact = riga.filter(x => x.val && x.val !== 0);

    const risultato = [];   // nuovi valori della riga
    const origini = [];     // da quali posizioni originali vengono i valori

    let i = 0;
    while (i < compact.length) {
        // Se i due valori adiacenti sono uguali (e non sono 2048), uniscili
        if (i + 1 < compact.length && compact[i].val === compact[i + 1].val && compact[i].val !== 2048) {
            risultato.push(compact[i].val * 2);
            origini.push([compact[i].pos, compact[i + 1].pos]);
            i += 2;
        } else {
            risultato.push(compact[i].val);
            origini.push([compact[i].pos]);
            i += 1;
        }
    }

    // Riempi con zeri fino a 4 elementi
    while (risultato.length < 4) {
        risultato.push(0);
        origini.push([]);
    }

    return { risultato, origini };
}

// Esegue il movimento in una direzione e restituisce le operazioni animate (o null se niente è cambiato)
function muovi(direzione) {
    const prima = celle.slice(); // salva lo stato prima della mossa
    const operazioni = [];       // lista dei movimenti da animare

    if (direzione === 'sinistra') {
        for (let r = 0; r < 4; r++) {
            const base = r * 4;
            const riga = [0, 1, 2, 3].map(k => ({ val: celle[base + k], pos: base + k })); //somma a ogni elemento la base per ottenere l'indice corretto in celle
            const { risultato, origini } = elaboraRiga(riga);
            risultato.forEach((v, k) => celle[base + k] = v);
            origini.forEach((lista, idx) => {
                const destinazione = base + idx;
                lista.forEach(origine => operazioni.push({ da: origine, a: destinazione, valPrima: prima[origine] }));
            });
        }
    } else if (direzione === 'destra') {
        for (let r = 0; r < 4; r++) {
            const base = r * 4;
            const riga = [3, 2, 1, 0].map(k => ({ val: celle[base + k], pos: base + k }));
            const { risultato, origini } = elaboraRiga(riga);
            risultato.forEach((v, k) => celle[base + (3 - k)] = v);
            origini.forEach((lista, idx) => {
                const destinazione = base + (3 - idx);
                lista.forEach(origine => operazioni.push({ da: origine, a: destinazione, valPrima: prima[origine] }));
            });
        }
    } else if (direzione === 'su') {
        for (let c = 0; c < 4; c++) {
            const riga = [0, 1, 2, 3].map(k => ({ val: celle[c + 4 * k], pos: c + 4 * k }));
            const { risultato, origini } = elaboraRiga(riga);
            risultato.forEach((v, k) => celle[c + 4 * k] = v);
            origini.forEach((lista, idx) => {
                const destinazione = c + 4 * idx;
                lista.forEach(origine => operazioni.push({ da: origine, a: destinazione, valPrima: prima[origine] }));
            });
        }
    } else if (direzione === 'giu') {
        for (let c = 0; c < 4; c++) {
            const riga = [3, 2, 1, 0].map(k => ({ val: celle[c + 4 * k], pos: c + 4 * k }));
            const { risultato, origini } = elaboraRiga(riga);
            risultato.forEach((v, k) => celle[c + 4 * (3 - k)] = v);
            origini.forEach((lista, idx) => {
                const destinazione = c + 4 * (3 - idx);
                lista.forEach(origine => operazioni.push({ da: origine, a: destinazione, valPrima: prima[origine] }));
            });
        }
    }

    // Tieni solo le operazioni dove la tessera si è davvero spostata
    const opSignificative = operazioni.filter(o => o.valPrima && o.da !== o.a);
    if (arrayUguali(prima, celle) || opSignificative.length === 0) return null;
    return opSignificative;
}

// ---- ANIMAZIONI ----

// Anima le tessere che si spostano
function animaMovimento(operazioni) {
    return new Promise(risolvi => {
        const griglia = document.getElementById('game-board');
        if (!griglia || !operazioni || !operazioni.length) return risolvi();

        const cloni = [];
        const tessereOriginali = [];

        operazioni.forEach(op => {
            const cellaPartenza = griglia.querySelector(`.bg-cell[data-index='${op.da}']`);
            const cellaArrivo   = griglia.querySelector(`.bg-cell[data-index='${op.a}']`);
            if (!cellaPartenza || !cellaArrivo) return;

            // Nascondi la tessera originale durante l'animazione
            const tessera = cellaPartenza.querySelector('.tile');
            tessereOriginali.push(tessera);
            tessera.style.opacity = '0';

            // Crea un clone che si sposterà visivamente
            const cloneEl = document.createElement('div');
            cloneEl.className = 'tile tile-clone';
            if (op.valPrima) cloneEl.classList.add('tile-' + op.valPrima);
            cloneEl.textContent = op.valPrima ? String(op.valPrima) : '';

            // Posiziona il clone sopra la cella di partenza
            cloneEl.style.position = 'absolute';
            cloneEl.style.left = cellaPartenza.offsetLeft + 'px';
            cloneEl.style.top  = cellaPartenza.offsetTop + 'px';
            cloneEl.style.width  = cellaPartenza.offsetWidth + 'px';
            cloneEl.style.height = cellaPartenza.offsetHeight + 'px';
            cloneEl.style.transition = 'transform 180ms ease, opacity 160ms ease';
            cloneEl.style.zIndex = '1000';

            griglia.appendChild(cloneEl);

            // Calcola di quanto deve spostarsi
            const dx = cellaArrivo.offsetLeft - cellaPartenza.offsetLeft;
            const dy = cellaArrivo.offsetTop  - cellaPartenza.offsetTop;
            cloni.push({ el: cloneEl, dx, dy });
        });

        void griglia.offsetWidth; // forza il browser a "vedere" la posizione iniziale prima di animare

        // Avvia l'animazione
        cloni.forEach(c => {
            c.el.style.transform = `translate(${c.dx}px, ${c.dy}px)`;
        });

        // Dopo l'animazione: rimuovi i cloni e mostra le tessere vere
        setTimeout(() => {
            cloni.forEach(c => c.el.remove());
            tessereOriginali.forEach(t => t.style.opacity = '1');
            risolvi();
        }, 180);
    });
}

// ---- FINE PARTITA ----

function controllaFinePartita() {
    const grigliaPiena = celle.every(v => v > 0);
    if (!grigliaPiena) { pulsanteReset.disabled = true; return; }

    // Prova tutte le direzioni: se almeno una mossa è possibile, la partita continua
    const puoAncoraGiocare = ['sinistra', 'destra', 'su', 'giu'].some(dir => {
        const backup = celle.slice();
        const ops = muovi(dir);
        celle = backup; // ripristina (muovi() modifica celle direttamente)
        return ops && ops.length;
    });

    if (!puoAncoraGiocare) {
        pulsanteReset.disabled = false;
        const punteggio = celle.reduce((somma, val) => somma + val, 0);
        const popup = document.getElementById('victory-popup');
        const messaggio = document.getElementById('victory-message');
        if (popup && messaggio) {
            messaggio.textContent = `Hai totalizzato ${punteggio} punti!`;
            popup.classList.add('show');
        }
    }
}

// ---- CLASSIFICA (salvata nel browser) ----

export function caricaClassifica2048() {
    try {
        const datiGrezzi = localStorage.getItem('gioco2048_classifica');
        return datiGrezzi ? JSON.parse(datiGrezzi) : {};
    } catch (e) {
        return {};
    }
}

function salvaClassifica2048(dati) {
    try {
        localStorage.setItem('gioco2048_classifica', JSON.stringify(dati));
    } catch (e) {}
}

export function salvaPunteggio2048(nome) {
    if (!nome) return;
    const punteggio = celle.reduce((somma, val) => somma + val, 0);
    const dati = caricaClassifica2048();
    // Salva solo se è il miglior punteggio (più punti = meglio)
    if (!dati[nome] || punteggio > dati[nome].best) {
        dati[nome] = { best: punteggio };
    }
    salvaClassifica2048(dati);
}

// ---- INIT E DESTROY (usati da main.js per cambiare gioco) ----

export function init() {
    const griglia = document.getElementById('game-board');
    if (!griglia) return;

    pulsanteReset = document.getElementById('reset-btn');
    displayPunteggio = document.getElementById('moves');

    costruisciGriglia();
    generaTessereCasuali();

    // Pulsante "Gioca ancora"
    const alReset = () => {
        costruisciGriglia();
        generaTessereCasuali();
        aggiornaPunteggio();
        pulsanteReset.disabled = true;
    };
    pulsanteReset.addEventListener('click', alReset);
    _listeners.push({ elemento: pulsanteReset, tipo: 'click', funzione: alReset });

    // Controlli da tastiera
    const alTasto = async (e) => {
        const tasto = e.key.toLowerCase();
        const inputAttivo = document.activeElement && document.activeElement.id === 'name-input';
        let direzione = null;

        if (tasto === 'arrowup' || (!inputAttivo && tasto === 'w')) direzione = 'su';
        else if (tasto === 'arrowdown' || (!inputAttivo && tasto === 's')) direzione = 'giu';
        else if (tasto === 'arrowleft' || (!inputAttivo && tasto === 'a')) direzione = 'sinistra';
        else if (tasto === 'arrowright' || (!inputAttivo && tasto === 'd')) direzione = 'destra';

        if (direzione) {
            e.preventDefault();
            const ops = muovi(direzione);
            if (ops && ops.length) {
                await animaMovimento(ops);
                generaUnaTessera();
                disegnaGriglia();
            }
        }
    };
    document.addEventListener('keydown', alTasto);
    _listeners.push({ elemento: document, tipo: 'keydown', funzione: alTasto });
}

export function destroy() {
    _listeners.forEach(l => l.elemento.removeEventListener(l.tipo, l.funzione));
    _listeners = [];
    const griglia = document.getElementById('game-board');
    if (griglia) griglia.innerHTML = '';
    celle = [];
}