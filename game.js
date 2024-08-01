const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const counterDisplay = document.getElementById("counter");
const scoreDisplay = document.getElementById("score");

let currentQuestion = {};
let loading = true;
let score = 0;
let counter = 0;
let remainingQuestions = [];
let numberOfQuestions = 5;
    
let questions = [];
const difficulty = localStorage.getItem("difficulty");
let linkToFetch;
switch(difficulty) {
    case "hard":
        linkToFetch = "https://opentdb.com/api.php?amount=10&category=17&difficulty=hard&type=multiple";
        break;
    case "medium":
        linkToFetch = "https://opentdb.com/api.php?amount=10&category=17&difficulty=medium&type=multiple";
        break;
    default:
        linkToFetch = "https://opentdb.com/api.php?amount=10&category=17&difficulty=easy&type=multiple";
}

fetch(
    linkToFetch
)
.then((res) => {
    return res.json();
})
.then((lqs) => {
    questions = lqs.results.map((lq) => {
        const fq = {
            question: lq.question,
        };

        const answerChoices = [...lq.incorrect_answers];
        fq.answer = Math.floor(Math.random() * 4) + 1;
        answerChoices.splice(
            fq.answer - 1,
            0,
            lq.correct_answer
        );

        answerChoices.forEach((choice, index) => {
            fq['choice' + (index + 1)] = choice;
        });

        return fq;
    });
    startGame();
})
.catch((error) => {
    console.error(error);
});

startGame = () => {
    //Set default values
    loading = true;
    score = 0;
    counter = 0;
    remainingQuestions = [...questions];
    getNewQuestion();
};

getNewQuestion = () => {
    if(counter >= numberOfQuestions) {
        localStorage.setItem("playerScore", score);
        return window.location.assign("end.html");
    }   
    counter++;  
    counterDisplay.innerText = counter + "/" + numberOfQuestions;
    scoreDisplay.innerText = score;

    //Choose a random question from the available questions array
    const questionIndex = Math.floor(Math.random() * remainingQuestions.length);
    currentQuestion = remainingQuestions[questionIndex];
    //Set the question and choices based on the current question
    question.innerText = currentQuestion.question;
    for(let i = 1; i <= 4; i++) {
        const choice = document.getElementById("choice-" + i);
        choice.innerText = currentQuestion["choice" + i];
    }

    remainingQuestions.splice(questionIndex, 1);
    loading = false;
};

choices.forEach(choice =>{
    choice.addEventListener("click", e => {
        //Occurs when user selects a choice
        if(loading) {
            return;
        }
        console.log("start");

        loading = true;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.id.slice(-1);
        
        const isCorrect = selectedAnswer == currentQuestion.answer;
        if(isCorrect) {
            score += 1;
            scoreDisplay.innerHTML = score;
        }
        const classToApply = isCorrect ? "correct" : "incorrect";
        const elementToApply = selectedChoice.parentElement;

        elementToApply.classList.add(classToApply);
        setTimeout(() => {
            elementToApply.classList.remove(classToApply);
            getNewQuestion();
        }, 1000);
    })
})

startGame();