// GIOCO DEL 15

// Lista dei numeri da 1 a 15
let numeri = [];
for (let i = 1; i <= 15; i++) numeri.push(i);

// Variabili di stato
let contatoreMosse = 0;
let partitaFinita = false;
let animazioneInCorso = false;

// Riferimenti agli elementi HTML
let griglia, pulsanteReset, displayMosse;

// Lista dei listener aggiunti (serve per rimuoverli quando si cambia gioco)
let _listeners = [];

// ---- FUNZIONI PRINCIPALI ----

// Mescola un array in modo casuale (algoritmo Fisher-Yates)
function mescola(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Costruisce la griglia di gioco nell'HTML
function creaGriglia() {
    griglia.innerHTML = "";
    pulsanteReset.disabled = true;
    if (displayMosse) displayMosse.textContent = "Mosse: 0";

    for (let i = 0; i < 16; i++) {
        const cella = document.createElement("div");
        cella.classList.add("cella");
        cella.id = "cella-" + i;
        cella.addEventListener("click", () => sposta(i));

        if (i < 15) {
            // Celle numerate
            cella.textContent = numeri[i];
        } else {
            // L'ultima cella è il buco (vuoto)
            cella.textContent = "";
            cella.classList.add("empty");
        }

        griglia.appendChild(cella);
    }
}

// Gestisce il click su una cella: la sposta se è adiacente al buco
function sposta(indice) {
    // Ignora il click se la partita è finita, l'indice non è valido,
    // la cella è il buco, oppure c'è un'animazione in corso
    if (partitaFinita || indice < 0 || indice > 15 || griglia.children[indice].classList.contains("empty") || animazioneInCorso) return;

    // Controlla le 4 direzioni possibili (su, giù, sinistra, destra)
    if (indice - 4 >= 0 && griglia.children[indice - 4].classList.contains("empty"))
        scambia(indice, indice - 4);
    else if (indice + 4 <= 15 && griglia.children[indice + 4].classList.contains("empty"))
        scambia(indice, indice + 4);
    else if (indice % 4 !== 0 && griglia.children[indice - 1].classList.contains("empty"))
        scambia(indice, indice - 1);
    else if (indice % 4 !== 3 && griglia.children[indice + 1].classList.contains("empty"))
        scambia(indice, indice + 1);
}

// Anima e poi esegue lo scambio tra la cella cliccata e il buco
function scambia(i, j) {
    animazioneInCorso = true;

    const cella = griglia.children[i];

    // Calcola di quanti "blocchi" si deve spostare (in % rispetto alla cella)
    const dx = (j % 4 - i % 4) * 100;
    const dy = (Math.floor(j / 4) - Math.floor(i / 4)) * 100;
    cella.style.transform = `translate(${dx}%, ${dy}%)`;

    setTimeout(() => {
        // Scambia i contenuti delle due celle
        const temp = griglia.children[i].textContent;
        griglia.children[i].textContent = griglia.children[j].textContent;
        griglia.children[j].textContent = temp;

        // Scambia la classe "empty" tra le due celle
        griglia.children[i].classList.toggle("empty");
        griglia.children[j].classList.toggle("empty");

        cella.style.transform = "";

        contatoreMosse++;
        if (displayMosse) displayMosse.textContent = "Mosse: " + contatoreMosse;

        controllaVittoria();
        animazioneInCorso = false;
    }, 150);
}

// Controlla se le tessere sono nell'ordine corretto (1, 2, 3, ..., 15, buco)
function controllaVittoria() {
    for (let i = 1; i < 16; i++) {
        if (parseInt(griglia.children[i - 1].textContent) !== i) return false;
    }

    // Vittoria
    pulsanteReset.disabled = false;
    partitaFinita = true;
    document.getElementById("victory-message").textContent =
        "Hai completato il gioco in " + contatoreMosse + " mosse!";
    document.getElementById("victory-popup").classList.add("show");
    return true;
}

// Resetta il gioco
function reset() {
    contatoreMosse = 0;
    partitaFinita = false;
    mescola(numeri);
    creaGriglia();
}

// CLASSIFICA (salvata nel browser)

export function caricaClassifica() {
    try {
        const datiGrezzi = localStorage.getItem('gioco15_classifica');
        return datiGrezzi ? JSON.parse(datiGrezzi) : {};
    } catch (e) {
        return {};
    }
}

function salvaClassifica(dati) {
    try {
        localStorage.setItem('gioco15_classifica', JSON.stringify(dati));
    } catch (e) {}
}

export function salvaPunteggio(nome) {
    if (!nome) return;
    const dati = caricaClassifica();
    // Salva solo se è il miglior punteggio (meno mosse = meglio)
    if (!dati[nome] || contatoreMosse < dati[nome].best) {
        dati[nome] = { best: contatoreMosse };
    }
    salvaClassifica(dati);
}

// ---- INIT E DESTROY (usati da main.js per cambiare gioco) ----

export function init() {
    griglia = document.getElementById("game-board");
    pulsanteReset = document.getElementById("reset-btn");
    displayMosse = document.getElementById("moves");

    contatoreMosse = 0;
    partitaFinita = false;
    animazioneInCorso = false;

    pulsanteReset.addEventListener("click", reset);
    _listeners.push({ elemento: pulsanteReset, tipo: "click", funzione: reset });

    mescola(numeri);
    creaGriglia();
}

export function destroy() {
    _listeners.forEach(l => l.elemento.removeEventListener(l.tipo, l.funzione));
    _listeners = [];
    const board = document.getElementById("game-board");
    if (board) board.innerHTML = "";
}