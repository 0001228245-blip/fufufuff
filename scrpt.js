
"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const frequencyButtons = document.querySelectorAll("[data-frequency]");
    const amountButtons = document.querySelectorAll("[data-amount]");
    const customAmountInput = document.getElementById("custom-amount");

    const frequencyDescription = document.getElementById(
        "frequency-description"
    );
    const selectedValue = document.getElementById("selected-value");
    const selectedFrequency = document.getElementById("selected-frequency");

    const continueButton = document.getElementById("continue-button");
    const message = document.getElementById("demo-message");

    let frequency = "monthly";
    let amount = 75;

    const currency = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    function updateDisplay() {
        selectedValue.textContent = currency.format(amount);

        selectedFrequency.textContent =
            frequency === "monthly" ? "por mês" : "pagamento único";

        frequencyDescription.textContent =
            frequency === "monthly"
                ? "Valor demonstrativo de contribuição mensal."
                : "Valor demonstrativo de contribuição única.";

        frequencyButtons.forEach((button) => {
            const active = button.dataset.frequency === frequency;

            button.classList.toggle("active", active);
            button.setAttribute("aria-pressed", String(active));
        });

        amountButtons.forEach((button) => {
            const active =
                Number(button.dataset.amount) === amount &&
                customAmountInput.value.trim() === "";

            button.classList.toggle("selected", active);
            button.setAttribute("aria-pressed", String(active));
        });
    }

    function hideMessage() {
        message.hidden = true;
        message.textContent = "";
    }

    frequencyButtons.forEach((button) => {
        button.addEventListener("click", () => {
            frequency = button.dataset.frequency;

            hideMessage();
            updateDisplay();
        });
    });

    amountButtons.forEach((button) => {
        button.addEventListener("click", () => {
            amount = Number(button.dataset.amount);

            customAmountInput.value = "";

            hideMessage();
            updateDisplay();
        });
    });

    customAmountInput.addEventListener("input", () => {
        const value = customAmountInput.value.trim();

        hideMessage();

        if (value === "") {
            amount = 0;
            updateDisplay();
            selectedValue.textContent = "Escolha um valor";
            return;
        }

        amount = Number(value);
        updateDisplay();
    });

    continueButton.addEventListener("click", () => {
        const rawValue = customAmountInput.value.trim();

        if (rawValue !== "") {
            amount = Number(rawValue);
        }

        if (
            !Number.isFinite(amount) ||
            amount < 1 ||
            amount > 1000000
        ) {
            message.textContent =
                "Informe um valor entre R$ 1,00 e R$ 1.000.000,00.";
            message.hidden = false;
            customAmountInput.focus();
            return;
        }

        const period =
            frequency === "monthly"
                ? "mensal"
                : "única";

        message.textContent =
            "Simulação concluída! Valor selecionado: " +
            currency.format(amount) +
            ". Modalidade: " +
            period +
            ". Nenhum pagamento foi realizado.";

        message.hidden = false;
    });

    updateDisplay();
});
