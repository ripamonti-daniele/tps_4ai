//NON FUNZIONA

const nomeInput = document.getElementById("nome");
const emailInput = document.getElementById("email");

nomeInput.preventDefault();
emailInput.preventDefault();

function addFocusStyle(input) {
    input.addEventListener("focus", () => {
        input.classList.add("is-focused");
    });

    input.addEventListener("blur", () => {
        input.classList.remove("is-focused");
    });
}

addFocusStyle(nomeInput);
addFocusStyle(emailInput);