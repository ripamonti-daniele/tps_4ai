const griglia = document.getElementById("game-board");

let numeri = [];
for (let i = 1; i <= 15; i++) numeri.push(i);

function mescola(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

mescola(numeri);

for (let i = 0; i < 16; i++) {
    const cella = document.createElement("div");
    cella.textContent = String(numeri[i] || "");
    cella.classList.add("cella");
    cella.id = "cella-" + i;
    cella.addEventListener("click", () => sposta(i));
    if (i < 15) cella.textContent = numeri[i];
    else cella.classList.add("empty");
    griglia.appendChild(cella);
}

function sposta(indice) {
    if (indice < 0 || indice > 15 || griglia.children[indice].classList.contains("empty")) return;
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
}