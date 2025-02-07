// Game Name(Header):
let gameName = "Guess The Word";
document.title = gameName;
document.querySelector("body>h1").innerHTML = gameName;
document.querySelector(
    "footer"
).innerHTML = `${gameName} Created By Mohamed Habib`;

// Game Options (essential variables)
let numOfTrials = 10;
let numOfLetters = 6;
let currentTrial = 1; //First Trial Is Active
let numOfHints = 3;

// Manage Words (to guess):
let wordToGuess = "";
const wordsToGuess = ["cookie", "domain", "layout", "script"];

wordToGuess =
    wordsToGuess[Math.floor(Math.random() * wordsToGuess.length)].toLowerCase();
let messageArea = document.querySelector(".message");

//Manage Hints:
const hintBtn = document.querySelector(".hint");
document.querySelector(".hint span").innerHTML = numOfHints;
hintBtn.addEventListener("click", getHint);
function getHint() {
    if (numOfHints > 0) {
        numOfHints--;
        document.querySelector(".hint span").innerHTML = numOfHints;
    }
    if (numOfHints == 0) {
        disableInput(hintBtn, true);
    }
    const enabledInputs = document.querySelectorAll("input:not([disabled])");
    const emptyEnabledInputs = Array.from(enabledInputs).filter(
        (inp) => inp.value == ""
    );
    if (emptyEnabledInputs.length > 0) {
        const randomIndex = Math.floor(
            Math.random() * emptyEnabledInputs.length
        );
        const randomInput = emptyEnabledInputs[randomIndex];
        const indexToFill = Array.from(enabledInputs).indexOf(randomInput);
        if (indexToFill != -1) {
            randomInput.value = wordToGuess[indexToFill].toUpperCase();
        }
    }
}

function generateInput() {
    const inputsContainer = document.querySelector(".inputs");
    // Create Main Trials Div:
    for (let i = 1; i <= numOfTrials; i++) {
        const tryDiv = document.createElement("div");
        tryDiv.classList.add(`try-${i}`);
        tryDiv.innerHTML = `<span>Try ${i}:</span>`;
        if (i != 1) tryDiv.classList.add("disabled-input");
        // Create Inputs:
        for (let j = 1; j <= numOfLetters; j++) {
            const input = document.createElement("input");
            input.type = "text";
            input.id = `try-${i}-letter-${j}`;
            input.setAttribute("maxLength", "1");
            tryDiv.appendChild(input);
        }
        inputsContainer.appendChild(tryDiv);
    }
    // Focus On First Input:
    inputsContainer.children[0].children[1].focus();
    // Disable All Inputs Except The First One:
    const inputsInDisabledDiv = document.querySelectorAll(
        ".disabled-input input"
    );
    inputsInDisabledDiv.forEach((inp) => (inp.disabled = true));
    // Convert Letters To Uppercase And Refocusing:
    const inputs = document.querySelectorAll(".inputs input");
    inputs.forEach((inp, index) => {
        inp.addEventListener("input", function () {
            this.value = this.value.toUpperCase();
            const nextInp = inputs[index + 1];
            if (nextInp) nextInp.focus();
        });
        // Accessibility By Keyboard:
        inp.addEventListener("keydown", function (e) {
            switch (e.key) {
                case "ArrowRight": {
                    if (index != inputs.length) {
                        inputs[index + 1].focus();
                        break;
                    }
                }
                case "ArrowLeft": {
                    if (index != 0) {
                        inputs[index - 1].focus();
                    }
                    break;
                }
                case "Backspace": {
                    inp.value = "";
                    e.preventDefault();
                    if (index != 0) {
                        inputs[index - 1].focus();
                    }
                    break;
                }
                case "Enter": {
                    handleGuesses();
                    break;
                }
            }
        });
    });
}

const checkBtn = document.querySelector(".check");

// Check Button:
checkBtn.addEventListener("click", handleGuesses);

function handleGuesses() {
    let successGuess = true;
    for (let i = 1; i <= numOfLetters; i++) {
        const inpField = document.querySelector(
            `#try-${currentTrial}-letter-${i}`
        );
        const letter = inpField.value.toLowerCase();
        const actualLetter = wordToGuess[i - 1];
        // Game Logic:

        // 1) Correct Letter And Place:
        if (letter === actualLetter) {
            inpField.classList.add("yes");
        }
        // 2) Correct Letter Bun Wrong Place:
        else if (wordToGuess.includes(letter) && letter !== "") {
            inpField.classList.add("not-place");
            successGuess = false;
        }
        // 3) Wrong Letter:
        else {
            inpField.classList.add("no");
            successGuess = false;
        }
    }

    // If Win Or Lose:
    //1) Win:
    if (successGuess) {
        messageArea.innerHTML = `You Won:)`;
        messageArea.style.color = "green";
        // Can't Type Anything In Any Input After The Winning:
        let allTrials = document.querySelectorAll(".inputs > div");
        allTrials.forEach((trial) => trial.classList.add("disabled-input"));
        // Can't Check Again:
        disableInput(checkBtn, true);

        //Convert Hint Button To 'Play Again' Button:
        convertHintButton("green", "Play Again");
    }
    //2) Lose:
    else {
        document
            .querySelector(`.try-${currentTrial}`)
            .classList.add("disabled-input");
        const currentTrialInputs = document.querySelectorAll(
            `.try-${currentTrial} input`
        );
        currentTrialInputs.forEach((inp) => (inp.disabled = true));
        currentTrial++;
        const nextTrialInputs = document.querySelectorAll(
            `.try-${currentTrial} input`
        );
        nextTrialInputs.forEach((inp) => {
            inp.disabled = false;
            inp.parentElement.classList.remove("disabled-input");
        });
        if (nextTrialInputs[0] != undefined) {
            nextTrialInputs[0].focus();
        } else {
            // Can't Check Unexpectedly:
            checkBtn.classList.add("disabled-input");
            checkBtn.disabled = true;

            //Convert Hint Button To 'Try Again' Button:
            convertHintButton("red", "Try Again");

            // Losing Message:
            messageArea.innerHTML = `You Lost:(`;
            messageArea.style.color = "red";
        }
    }
}

// DRY Functions:
function convertHintButton(color, msg) {
    hintBtn.disabled = false;
    hintBtn.innerHTML = msg;
    hintBtn.style.backgroundColor = color;
    hintBtn.classList.remove("disabled-input");
    hintBtn.addEventListener("click", () => location.reload());
}

function disableInput(input, withClass = false) {
    input.disabled = true;
    if (withClass) input.classList.add("disabled-input");
}

window.onload = function () {
    generateInput();
};
