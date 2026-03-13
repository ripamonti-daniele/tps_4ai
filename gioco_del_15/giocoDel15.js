function mescola(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function inizializzaGriglia() {
    griglia.innerHTML = "";
    btnReset.disabled = true;

    if (displayMosse) displayMosse.textContent = "Mosse: 0";

    for (let i = 0; i < 16; i++) {

        const cella = document.createElement("div");

        cella.classList.add("cella");
        cella.id = "cella-" + i;

        cella.addEventListener("click", () => sposta(i));

        if (i < 15) {
            cella.textContent = numeri[i];
        } else {
            cella.textContent = "";
            cella.classList.add("empty");
        }

        griglia.appendChild(cella);
    }
}

function sposta(indice) {

    if (
        finePartita ||
        indice < 0 ||
        indice > 15 ||
        griglia.children[indice].classList.contains("empty") ||
        animazione
    ) return;

    if (indice - 4 >= 0 && griglia.children[indice - 4].classList.contains("empty"))
        scambia(indice, indice - 4);

    else if (indice + 4 <= 15 && griglia.children[indice + 4].classList.contains("empty"))
        scambia(indice, indice + 4);

    else if (indice % 4 !== 0 && griglia.children[indice - 1].classList.contains("empty"))
        scambia(indice, indice - 1);

    else if (indice % 4 !== 3 && griglia.children[indice + 1].classList.contains("empty"))
        scambia(indice, indice + 1);
}

function scambia(i, j) {

    animazione = true;

    const cella = griglia.children[i];

    const rigaI = Math.floor(i / 4);
    const colonnaI = i % 4;

    const rigaJ = Math.floor(j / 4);
    const colonnaJ = j % 4;

    const dx = (colonnaJ - colonnaI) * 100;
    const dy = (rigaJ - rigaI) * 100;

    cella.style.transform = `translate(${dx}%, ${dy}%)`;

    setTimeout(() => {

        const temp = griglia.children[i].textContent;

        griglia.children[i].textContent = griglia.children[j].textContent;
        griglia.children[j].textContent = temp;

        griglia.children[i].classList.toggle("empty");
        griglia.children[j].classList.toggle("empty");

        cella.style.transform = "";

        mosse++;

        if (displayMosse)
            displayMosse.textContent = "Mosse: " + mosse;

        controllaVittoria();

        animazione = false;

    }, 150);
}

function controllaVittoria() {

    for (let i = 1; i < 16; i++) {
        if (parseInt(griglia.children[i - 1].textContent) !== i)
            return false;
    }

    btnReset.disabled = false;
    finePartita = true;

    document.getElementById("victory-message").textContent =
        "Hai completato il gioco in " + mosse + " mosse!";

    document.getElementById("victory-popup").classList.add("show");

    return true;
}

function reset() {
    mosse = 0;
    finePartita = false;
    mescola(numeri);
    inizializzaGriglia();
}

// --- Classifica (localStorage) ---

export function caricaClassifica() {
    try {
        const raw = localStorage.getItem('gioco15_classifica');
        return raw ? JSON.parse(raw) : {};
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
    if (!dati[nome] || mosse < dati[nome].best) {
        dati[nome] = { best: mosse };
    }
    salvaClassifica(dati);
}

let _listeners = [];

export function init() {

    griglia = document.getElementById("game-board");
    btnReset = document.getElementById("reset-btn");
    displayMosse = document.getElementById("moves");

    mosse = 0;
    finePartita = false;
    animazione = false;

    const onReset = reset;

    btnReset.addEventListener("click", onReset);

    _listeners.push({ el: btnReset, type: "click", fn: onReset });

    mescola(numeri);
    inizializzaGriglia();
}

export function destroy() {

    _listeners.forEach(l =>
        l.el.removeEventListener(l.type, l.fn)
    );

    _listeners = [];

    const board = document.getElementById("game-board");

    if (board)
        board.innerHTML = "";

}

let griglia = document.getElementById("game-board");
let btnReset = document.getElementById("reset-btn");
let displayMosse = document.getElementById("moves");

let finePartita = false;

let numeri = [];

for (let i = 1; i <= 15; i++)
    numeri.push(i);

let mosse = 0;

let animazione = false;
