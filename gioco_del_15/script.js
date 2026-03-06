const griglia = document.getElementById("game-board");
const btn = document.getElementById("reset-btn");
const movesEl = document.getElementById("moves");
let finePartita = false;

let numeri = [];
for (let i = 1; i <= 15; i++) numeri.push(i);

let mosse = 0;

function mescola(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// mescola(numeri);
numeri[14] = 11;
numeri[10] = 12;
numeri[11] = 15; 

function inizializzaGriglia() {
    griglia.innerHTML = "";
    btn.disabled = true;
    if (movesEl) movesEl.textContent = "Mosse: 0";
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
    if (finePartita || indice < 0 || indice > 15 || griglia.children[indice].classList.contains("empty")) return;
    if (indice - 4 >= 0 && griglia.children[indice - 4].classList.contains("empty")) scambia(indice, indice - 4);
    else if (indice + 4 <= 15 && griglia.children[indice + 4].classList.contains("empty")) scambia(indice, indice + 4);
    else if (indice % 4 !== 0 && griglia.children[indice - 1].classList.contains("empty")) scambia(indice, indice - 1);
    else if (indice % 4 !== 3 && griglia.children[indice + 1].classList.contains("empty")) scambia(indice, indice + 1);
}

function scambia(i, j) {
    const temp = griglia.children[i].textContent;
    griglia.children[i].textContent = griglia.children[j].textContent;
    griglia.children[j].textContent = temp;
    griglia.children[i].classList.toggle("empty");
    griglia.children[j].classList.toggle("empty");
    mosse++;
    if (movesEl) movesEl.textContent = "Mosse: " + mosse;
    controllaVittoria();
}

function controllaVittoria() {
    for (let i = 1; i < 16; i++) {
        if (parseInt(griglia.children[i - 1].textContent) !== i) return false;
    }
    btn.disabled = false;
    finePartita = true;
    if (movesEl) { movesEl.textContent = "Hai vinto in " + mosse + " mosse!"; }
    return true;
}

function reset() {
    mosse = 0;
    finePartita = false;
    mescola(numeri);
    inizializzaGriglia();
}

btn.addEventListener("click", reset);

inizializzaGriglia();
