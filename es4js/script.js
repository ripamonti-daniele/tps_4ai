let lista = document.querySelector('#id_lista');
let bottone = document.querySelector('#id_btn');
let input = document.querySelector('#id_txt');

bottone.addEventListener("click", () => {
    let nuovoLi = lista.appendChild(document.createElement("li"));
    nuovoLi.textContent = input.value;
    nuovoLi.style.fontSize = "24px";
});