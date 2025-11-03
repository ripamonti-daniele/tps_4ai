const nomeInput = document.getElementById("nome");
const emailInput = document.getElementById("email");
const textarea = document.getElementById("textarea");
const contacaratteri = document.getElementById("contacaratteri")
const form = document.getElementById("form");
esito = document.getElementById("esito");

function addFocusStyle(input, is_textarea) {
    input.addEventListener("focus", () => {
        input.classList.add("is-focused");
    });

    input.addEventListener("blur", () => {
        input.classList.remove("is-focused");
        if (input.value.trim().length < 30 && is_textarea) {
            input.classList.add('err');
        }
        else if (!input.value.trim()) {
          input.classList.add('err');
        };
    });

    input.addEventListener('input', () => {
        input.classList.remove('err');
        input.classList.remove('accepted');
    });
}

textarea.addEventListener("input", (e) => {
    contacaratteri.textContent = "Caratteri scritti: " + textarea.value.length;
})

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!emailInput.checkValidity()) {
        esito.textContent = 'Email non valida.';
        emailInput.classList.add('err');
    }
    else if (nomeInput.value.trim() && emailInput.value.trim() && textarea.value.trim().length >= 30) {
        esito.textContent = 'Registrazione completata con successo!';
        nomeInput.classList.add('accepted');
        emailInput.classList.add('accepted');
        textarea.classList.add('accepted');
    }
    else {
        esito.textContent = 'Compila correttamente tutti i campi.';
        if (!nomeInput.value.trim()) {
            nomeInput.classList.add('err');
        }
        if (!emailInput.value.trim()) {
            emailInput.classList.add('err');
        }
    }
});

addFocusStyle(nomeInput, false);
addFocusStyle(emailInput, false);
addFocusStyle(textarea, true);