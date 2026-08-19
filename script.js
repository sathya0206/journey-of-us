import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDpbJdqFSEfk_ksTrRNzbvKhawUyh0Hy2g",
    authDomain: "my-personal-wish-project.firebaseapp.com",
    projectId: "my-personal-wish-project",
    storageBucket: "my-personal-wish-project.firebasestorage.app",
    messagingSenderId: "875613531674",
    appId: "1:875613531674:web:0cde8517eb162f52a92ba3"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app, "https://my-personal-wish-project-default-rtdb.asia-southeast1.firebasedatabase.app");

const loginForm = document.getElementById("loginForm");
const loginScreen = document.getElementById("loginScreen");
const welcomeScreen = document.getElementById("welcomeScreen");
const loginError = document.getElementById("loginError");
const startJourney = document.getElementById("startJourney");
const questionScreen = document.getElementById("questionScreen");

const answerInput = document.getElementById("answerInput");
const submitAnswer = document.getElementById("submitAnswer");
const answerReveal = document.getElementById("answerReveal");
const herAnswer = document.getElementById("herAnswer");
const myAnswer = document.getElementById("myAnswer");
const nextQuestion = document.getElementById("nextQuestion");

const questionText = document.getElementById("questionText");
const questionNumber = document.getElementById("questionNumber");

const photoScreen = document.getElementById("photoScreen");
const continueToQuestions =
    document.getElementById("continueToQuestions");

const previousQuestion = document.getElementById("previousQuestion");

const storyScreen = document.getElementById("storyScreen");
const continueToFinal = document.getElementById("continueToFinal");
const finalScreen = document.getElementById("finalScreen");

const finishQuestions = document.getElementById("finishQuestions");

const questions = [
    {
        question: "What was your first impression of me, and how wrong were you? 😂",
        answer: `1st impression i got (because of others) was you are a kind terror person who will use compass to prick if you don't like that person but actually you are kind and innocent girl.`
    },
    {
        question: "What is one moment from these four years when you felt really proud of us?",
        answer: `For me, when ever i say our love story to someone and they get amazed. 
        Keeping that love strong and we become together forever. So our marriage itself a proud and happy moment for me.`
    },

    {
        question: "What’s one small thing I do that makes you feel cared for, even if I don’t realise I’m doing it?",
        answer: `Always you come and say, spend some money for yourself nothing wrong in that hit me differently`
    },
    {
        question: "What is one moment with me that still makes you laugh whenever you remember it?",
        answer: `There are many things, i couldn't remember now but when ever we talk even for silly things we laugh thinking of that gives me smile in my face now`
    },
    {
        question: "Be honest… what’s the one thing I do that annoys you the most?",
        answer: `You underestimate yourself and the fear you have`
    },
    {
        question: "What do you think has changed the most about us since we got married?",
        answer: `We become responsible for each other and our family. I miss that childish talks we use to have before our marriage.`
    },
    {
        question: "When did it really hit you that we had gone from being just the two of us to becoming a family of three?",
        answer: `Actually it took sometime to accept what was happening around us, but when you become normal is when i accepted we are a family of three.`
    },
    {
        question: "What’s one thing you wish you had done more of during our first four years together?",
        answer: `I wish we had gone for more trips , just the "us" time and some fun in trips you know what i mean.`
    },
    {
        question: "What’s one of my habits that you pretend to be annoyed about but would actually miss if I stopped doing it?",
        answer: `It's easy, you would call out my name for everything sometime it annoys me but i cannot live without that.`
    },
    {
        question: "If you had to describe our four years together using only three words, what would they be?",
        answer: `Definitely three words is not enough to describe our four years together. But if i had to use three words, it would be "Love, trust and care".`
    },
    {
        question: "Who do you think has done more silly things in these four years - me or you? honest answer only",
        answer: `I do more crazy things, you do silly things`
    },
    {
        question: "What is one thing about our life together that you wouldn't want to change?",
        answer: `I want this love, care and trust to continue forever along with the intimacy we have between us`
    }

];

let currentQuestion = 0;

const userAnswers = [];

const correctUsername = "abhaya";
const correctPassword = "21082022";

loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === correctUsername && password === correctPassword) {

        loginError.textContent = "";

        loginScreen.style.display = "none";
        welcomeScreen.style.display = "flex";

    } else {

        loginError.textContent =
            "Hmm... that doesn't look right. Try the date in DDMMYYYY format. ❤️";

        // Make sure login stays visible
        loginScreen.style.display = "flex";
        welcomeScreen.style.display = "none";
    }
});

startJourney.addEventListener("click", function () {
    welcomeScreen.style.display = "none";
    photoScreen.style.display = "flex";

    currentQuestion = 0;
    showQuestion();
});

submitAnswer.addEventListener("click", async function () {

    if (answerInput.value.trim() === "") {
        return;
    }

    userAnswers[currentQuestion] = answerInput.value;

    herAnswer.textContent = userAnswers[currentQuestion];
    myAnswer.textContent = questions[currentQuestion].answer;

    answerReveal.style.display = "block";
    nextQuestion.style.display = "inline-block";

    await set(ref(database, `answers/question_${currentQuestion}`), {
        question: questions[currentQuestion].question,
        userAnswer: answerInput.value,
        timestamp: new Date().toISOString()
    });
});

continueToQuestions.addEventListener("click", async function () {

    photoScreen.style.display = "none";
    questionScreen.style.display = "flex";

    currentQuestion = 0;
    await loadSavedAnswers();
    showQuestion();

});

function showQuestion() {

    const current = questions[currentQuestion];

    questionText.textContent = current.question;

    questionNumber.textContent =
        `Question ${currentQuestion + 1} of ${questions.length}`;

    // Restore her previous answer
    answerInput.value = userAnswers[currentQuestion] || "";

    // If this question was already answered,
    // show the answers again
    if (userAnswers[currentQuestion]) {

        herAnswer.textContent = userAnswers[currentQuestion];
        myAnswer.textContent = current.answer;

        answerReveal.style.display = "block";
        nextQuestion.style.display = "inline-block";

    } else {

        // New question
        answerReveal.style.display = "none";
        nextQuestion.style.display = "none";
    }

    // Previous button
    previousQuestion.style.display =
        currentQuestion > 0 ? "inline-block" : "none";

    // Last question
    nextQuestion.textContent =
        currentQuestion === questions.length - 1
            ? "Finish ❤️"
            : "Next →";
}

showQuestion();

nextQuestion.addEventListener("click", function () {

    userAnswers[currentQuestion] = answerInput.value;

    if (currentQuestion < questions.length - 1) {

        currentQuestion++;
        showQuestion();

    } else {

        console.log("All questions completed!");

        questionScreen.style.display = "none";
        storyScreen.style.display = "flex";

    }

});

previousQuestion.addEventListener("click", function () {

    // Save current answer before going back
    userAnswers[currentQuestion] = answerInput.value;

    if (currentQuestion > 0) {
        currentQuestion--;
        showQuestion();
    }

});

continueToFinal.addEventListener("click", () => {
    storyScreen.style.display = "none";
    finalScreen.style.display = "flex";
});

finishQuestions.addEventListener("click", () => {
    // something here
});

async function loadSavedAnswers() {
    try {
        const answersRef = ref(database, 'answers');
        const snapshot = await get(answersRef);

        if (snapshot.exists()) {
            const data = snapshot.val();
            for (const key in data) {
                const questionIndex = parseInt(key.split('_')[1]);
                if (!isNaN(questionIndex)) {
                    userAnswers[questionIndex] = data[key].userAnswer;
                }
            }
        }
    } catch (error) {
        console.log("No saved answers found or error loading:", error);
    }
}

loadSavedAnswers();
