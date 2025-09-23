//le variabili si dichiarano con let
let x = 4;
let y = 3;

console.log(x + y);

//le costanti si dichiarano con const
const k = 10;

//come scrivere all'interno di un elemento del dom
//document object model è un albero che il browser genera quando renderizza la pagina

// const section = document.querySelector('#test')
// console.log(section)
// section.textContent = "ciao a tutti i ragazzi della 4ai"

//creare un elemento e aggiungerlo al dom
// const section = document.querySelector('#test');
// let paragrafo = document.createElement("p");
// paragrafo.textContent = "ciao a tutti i ragazzi della 4ai";
// console.log(paragrafo);
// section.appendChild(paragrafo);

//introduzione velocissima agli eventi
let bottone = document.querySelector("#id_btn");
// bottone.addEventListener("click", () => {
//     alert("Ciao")
// });

// bottone.addEventListener("click", miafunzione);
// function miafunzione() {
//     alert("Ciao");
// }

//cosa divertente
//scrivere il codice js che consenta di inserire in una tabella una riga con due celle una contenente il nome e l'altra il 

const section = document.querySelector("#test");

bottone.addEventListener("click", () => {
    let n = id_nome.value;
    let c = id_cognome.value;
    const tabella = document.querySelector("#tabella");
    let riga = document.createElement("tr");
    let cella1 = document.createElement("td");
    let cella2 = document.createElement("td");
    riga.appendChild(cella1);
    riga.appendChild(cella2);
    tabella.appendChild(riga);
    cella1.textContent = n;
    cella2.textContent = c;
});
