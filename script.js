// Ganti URL di bawah ini dengan URL API Google Apps Script kamu nanti
const API_URL = "https://script.google.com/macros/s/AKfycbx01CyqyhXNeFp7NHk6_Ntm5_5BcOvIBJqxI6lEjSsLVSCqaQm_GzejgwihrlPPtBit/exec";

let questions = [];
let currentQuestionIndex = 0;
let wrongGuesses = 0;
const maxWrong = 3; // Batas salah 3 kali

const bridgeArea = document.getElementById("bridge-area");
const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const restartBtn = document.getElementById("restart-btn");

async function fetchQuestions() {
    try {
        questionText.innerText = "Loading questions from spreadsheet...";
        let response = await fetch(API_URL);
        let data = await response.json();
        
        questions = data;
        startGame();
    } catch (error) {
        console.error("Failed to load questions:", error);
        questionText.innerText = "Failed to load questions. Please check your API URL.";
    }
}

function startGame() {
    currentQuestionIndex = 0;
    wrongGuesses = 0;
    bridgeArea.className = "stage-0";
    restartBtn.style.display = "none";
    loadQuestion();
}

function loadQuestion() {
    if (currentQuestionIndex >= questions.length) {
        questionText.innerText = "🎉 Amazing! You successfully answered all questions and saved the character!";
        optionsContainer.innerHTML = "";
        restartBtn.style.display = "inline-block";
        restartBtn.innerText = "Play Again";
        return;
    }

    let q = questions[currentQuestionIndex];
    questionText.innerText = q.question;
    optionsContainer.innerHTML = "";
    restartBtn.style.display = "none";

    let options = [
        { label: "A", text: q.optionA },
        { label: "B", text: q.optionB },
        { label: "C", text: q.optionC },
        { label: "D", text: q.optionD }
    ];

    options.forEach(opt => {
        let btn = document.createElement("button");
        btn.className = "option-btn";
        btn.innerText = `${opt.label}. ${opt.text}`;
        btn.onclick = () => checkAnswer(opt.label, q.correctAnswer);
        optionsContainer.appendChild(btn);
    });
}

function checkAnswer(selected, correct) {
    let buttons = document.querySelectorAll(".option-btn");

    if (selected === correct) {
        buttons.forEach(btn => {
            if (btn.innerText.startsWith(correct)) {
                btn.style.backgroundColor = "#27ae60";
                btn.style.color = "white";
            }
            btn.disabled = true;
        });

        setTimeout(() => {
            currentQuestionIndex++;
            loadQuestion();
        }, 1200);

    } else {
        wrongGuesses++;
        bridgeArea.className = `stage-${wrongGuesses}`;

        buttons.forEach(btn => {
            if (btn.innerText.startsWith(selected)) {
                btn.style.backgroundColor = "#c0392b";
                btn.style.color = "white";
                btn.disabled = true;
            }
        });

        if (wrongGuesses >= maxWrong) {
            questionText.innerText = "💥 Game Over! The bridge collapsed and the character fell into the pond!";
            buttons.forEach(btn => btn.disabled = true);
            restartBtn.style.display = "inline-block";
            restartBtn.innerText = "Try Again";
        }
    }
}

restartBtn.onclick = () => {
    if (questions.length > 0) {
        startGame();
    } else {
        fetchQuestions();
    }
};

// Jalankan saat pertama kali dibuka
fetchQuestions();
