const inputValue = document.getElementById("user-input");
const calcHistory = document.getElementById("calc-history");
const clearHistoryButton = document.getElementById("clear-history");

// Load history from localStorage when the page loads
window.addEventListener("load", function () {
    const savedHistory = JSON.parse(localStorage.getItem("calcHistory")) || [];
    savedHistory.forEach(addCalculationToHistory);
});

document.querySelectorAll(".numbers").forEach(function (item) {
    item.addEventListener("click", function (e) {
        handleInput(e.target.innerHTML.trim());
    });
});

document.querySelectorAll(".operations").forEach(function (item) {
    item.addEventListener("click", function (e) {
        handleOperation(e.target.innerHTML.trim());
    });
});

document.addEventListener("keydown", function (e) {
    const key = e.key;
    if (!isNaN(key) || key === ".") {
        handleInput(key);
    } else if (["+", "-", "*", "/", "%", "Enter", "=", "Backspace", "Delete", "Escape"].includes(key)) {
        handleOperation(key);
    }
});

function handleInput(value) {
    if (inputValue.innerText === "NaN" || inputValue.innerText === "0") {
        inputValue.innerText = "";
    }
    inputValue.innerText += value;
}

function handleOperation(operation) {
    let lastValue = inputValue.innerText.substring(inputValue.innerText.length - 1);
    if (!isNaN(lastValue) && (operation === "=" || operation === "Enter")) {
        const result = eval(inputValue.innerText);
        addCalculationToHistory(inputValue.innerText + " = " + result);
        inputValue.innerText = result;
    } else if (operation === "AC" || operation === "Escape") {
        inputValue.innerText = 0;
    } else if (operation === "DEL" || operation === "Backspace" || operation === "Delete") {
        inputValue.innerText = inputValue.innerText.substring(0, inputValue.innerText.length - 1);
        if (inputValue.innerText.length == 0) {
            inputValue.innerText = 0;
        }
    } else if (!isNaN(lastValue) || lastValue === ".") {
        inputValue.innerText += operation;
    }
}

function addCalculationToHistory(calculation) {
    const calcItem = document.createElement("div");
    calcItem.className = "calc-item";
    calcItem.innerHTML = `
        <span>${calculation}</span>
        <button type="button" class="delete-calc">&times;</button>
    `;
    calcHistory.appendChild(calcItem);

    // Save to localStorage
    saveHistory();

    calcItem.querySelector(".delete-calc").addEventListener("click", function () {
        calcHistory.removeChild(calcItem);
        // Save to localStorage
        saveHistory();
    });
}

// Event listener for clearing all calculation history
clearHistoryButton.addEventListener("click", function () {
    calcHistory.innerHTML = "";
    // Save to localStorage
    saveHistory();
});

function saveHistory() {
    const historyItems = Array.from(calcHistory.querySelectorAll(".calc-item span")).map(item => item.innerText);
    localStorage.setItem("calcHistory", JSON.stringify(historyItems));
}