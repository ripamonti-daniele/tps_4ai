let bottone = document.querySelector("#id_btn");
let messaggio = document.createElement("h2");
bottone.addEventListener("click", () => {
    event.preventDefault();
    messaggio.textContent = "Ciao " + id_nome.value;
    document.body.appendChild(messaggio);
});