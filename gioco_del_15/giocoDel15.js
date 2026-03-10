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
        cella.textContent = String(numeri[i] || "");
        cella.classList.add("cella");
        cella.id = "cella-" + i;
        cella.addEventListener("click", () => sposta(i));
        if (i < 15) {
            cella.textContent = numeri[i];
        } 
        else {
            cella.textContent = "";
            cella.classList.add("empty");
        }
        griglia.appendChild(cella);
    }
}

function sposta(indice) {
    if (finePartita || indice < 0 || indice > 15 || griglia.children[indice].classList.contains("empty") || animazione) return;
    if (indice - 4 >= 0 && griglia.children[indice - 4].classList.contains("empty")) scambia(indice, indice - 4);
    else if (indice + 4 <= 15 && griglia.children[indice + 4].classList.contains("empty")) scambia(indice, indice + 4);
    else if (indice % 4 !== 0 && griglia.children[indice - 1].classList.contains("empty")) scambia(indice, indice - 1);
    else if (indice % 4 !== 3 && griglia.children[indice + 1].classList.contains("empty")) scambia(indice, indice + 1);
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
        cella.style.transform = '';
        mosse++;
        if (displayMosse) displayMosse.textContent = "Mosse: " + mosse;
        controllaVittoria();
        animazione = false;
    }, 150);
}

function controllaVittoria() {
    for (let i = 1; i < 16; i++) {
        if (parseInt(griglia.children[i - 1].textContent) !== i) return false;
    }
    btnReset.disabled = false;
    finePartita = true;
    // if (displayMosse) { displayMosse.textContent = "Hai vinto in " + mosse + " mosse!"; }
    document.getElementById("victory-message").textContent = "Hai completato il gioco in " + mosse + " mosse!";
    document.getElementById("victory-popup").classList.add("show");
    return true;
}

function reset() {
    mosse = 0;
    finePartita = false;
    mescola(numeri);
    inizializzaGriglia();
}

let _listeners = [];
export function init() {
    griglia = document.getElementById("game-board");
    btnReset = document.getElementById("reset-btn");
    displayMosse = document.getElementById("moves");
    // reset state
    mosse = 0;
    finePartita = false;
    animazione = false;
    // attach listeners
    const onReset = reset;
    btnReset.addEventListener("click", onReset);
    _listeners.push({ el: btnReset, type: 'click', fn: onReset });

    const onSubmit = () => {
        let nome = document.getElementById("name-input").value.trim();
        // fallback: save to localStorage
        const key = 'giocoDel15_results';
        const arr = JSON.parse(localStorage.getItem(key) || '[]');
        arr.push({ nome: nome || 'Giocatore', mosse, data: new Date().toISOString() });
        localStorage.setItem(key, JSON.stringify(arr));
        document.getElementById("victory-popup").classList.remove("show");
        document.getElementById("name-input").value = "";
    };
    const submitBtn = document.getElementById("submit-name");
    submitBtn.addEventListener('click', onSubmit);
    _listeners.push({ el: submitBtn, type: 'click', fn: onSubmit });

    inizializzaGriglia();
}

export function destroy() {
    // remove listeners
    _listeners.forEach(l => l.el.removeEventListener(l.type, l.fn));
    _listeners = [];
    // clear board
    const board = document.getElementById("game-board");
    if (board) board.innerHTML = '';
}

function scriviRisultato(file, nome, mosse) {
    const dati = { nome: nome, mosse: mosse };
    // 1. Convertire l'oggetto in stringa JSON
    const datiJson = JSON.stringify(dati);

    // 2. Creare un Blob con i dati
    const blob = new Blob([datiJson], { type: "application/json" });

    // 3. Creare un link per il download
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = file;

    // 4. Cliccare programmaticamente
    link.click();
}

let griglia = document.getElementById("game-board");
let btnReset = document.getElementById("reset-btn");
let displayMosse = document.getElementById("moves");
let finePartita = false;

let numeri = [];
for (let i = 1; i <= 15; i++) numeri.push(i);

let mosse = 0;
let animazione = false;

// mescola(numeri);
numeri[14] = 11;
numeri[10] = 12;
numeri[11] = 15; 

// Note: module's init() will attach listeners and call inizializzaGriglia

