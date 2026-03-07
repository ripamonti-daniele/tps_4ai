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

function scriviRisultato(file, nome, mosse) {
    let risultati = [];
    if (fs.existsSync(file)) {
        const data = fs.readFileSync(file);
        risultati = JSON.parse(data);
    }
    risultati.push({ nome: nome, mosse: mosse });
    fs.writeFileSync(file, JSON.stringify(risultati, null, 2));
}

const griglia = document.getElementById("game-board");
const btnReset = document.getElementById("reset-btn");
const displayMosse = document.getElementById("moves");
// const fs = require("fs");
let finePartita = false;

let numeri = [];
for (let i = 1; i <= 15; i++) numeri.push(i);

let mosse = 0;
let animazione = false;

// mescola(numeri);
numeri[14] = 11;
numeri[10] = 12;
numeri[11] = 15; 

btnReset.addEventListener("click", reset);

// Event listener per il popup di vittoria
document.getElementById("submit-name").addEventListener("click", () => {
    let nome = document.getElementById("name-input").value.trim();
    scriviRisultato("gioco_del_15\\giocoDel15.json", nome, mosse);
    document.getElementById("victory-popup").classList.remove("show");
    document.getElementById("name-input").value = "";
});

inizializzaGriglia();

