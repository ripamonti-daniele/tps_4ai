let lista = document.querySelector('#id_lista');
let aggiungi = document.querySelector('#id_btn_agg');
let input = document.querySelector('#id_txt');

aggiungi.addEventListener('click', () => {
    let nuovoLi = document.createElement('li');
    
    let testo = document.createElement("p");
    testo.textContent = input.value;
    
    let btn_fatto = document.createElement("input");
    btn_fatto.type = "button";
    btn_fatto.classList.add("bottone_lista")

    btn_fatto.value = "Fatto";
    btn_fatto.addEventListener('click', () => {
        nuovoLi.remove();
    });

    nuovoLi.appendChild(testo);
    nuovoLi.appendChild(btn_fatto);
    lista.appendChild(nuovoLi);
    input.value = "";
});