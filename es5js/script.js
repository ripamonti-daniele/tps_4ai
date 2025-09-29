let cambia_col = document.querySelector("#id_btn1");
let agg_bordo = document.querySelector("#id_btn2");
let box = document.querySelector("#id_box");

cambia_col.addEventListener("click", () => {
    box.style.backgroundColor = "red";
});

agg_bordo.addEventListener("click", () => {
    box.classList.add("bordo");
});