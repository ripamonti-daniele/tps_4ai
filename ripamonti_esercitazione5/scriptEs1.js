const nomeInput = document.getElementById("nome");
const emailInput = document.getElementById("email");
const form = document.getElementById("form");
esito = document.getElementById("esito");

function addFocusStyle(input) {
    input.addEventListener("focus", () => {
        input.classList.add("is-focused");
    });

    input.addEventListener("blur", () => {
        input.classList.remove("is-focused");
        if (!input.value.trim()) {
          input.classList.add('err');
        };
    });

    input.addEventListener('input', () => {
        input.classList.remove('err');
        input.classList.remove('accepted');
    });
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!emailInput.checkValidity()) {
        esito.textContent = 'Email non valida.';
        emailInput.classList.add('err');
    }
    else if (nomeInput.value.trim() && emailInput.value.trim()) {
        esito.textContent = 'Registrazione completata con successo!';
        nomeInput.classList.add('accepted');
        emailInput.classList.add('accepted');
    }
    else {
        esito.textContent = 'Compila tutti i campi.';
        if (!nomeInput.value.trim()) {
            nomeInput.classList.add('err');
        }
        if (!emailInput.value.trim()) {
            emailInput.classList.add('err');
        }
    }
});

addFocusStyle(nomeInput);
addFocusStyle(emailInput);