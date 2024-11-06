const questions = [
  {
    question: "What does HTML stand for?",
    answers: ["Hyper Text Markup Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language", "None of the above"],
    correct: 0
  },
  {
    question: "Which language is used for styling web pages?",
    answers: ["HTML", "CSS", "JavaScript", "Python"],
    correct: 1
  },
  {
    question: "What is the correct syntax for referring to an external script?",
    answers: ["<script href='xxx.js'>", "<script name='xxx.js'>", "<script src='xxx.js'>", "<script file='xxx.js'>"],
    correct: 2
  }
];

let currentQuestionIndex = 0;
let score = 0;

function displayQuestion() {
  const questionElement = document.getElementById("question");
  const options = document.querySelectorAll(".option");
  questionElement.innerText = questions[currentQuestionIndex].question;
  options.forEach((option, index) => {
    option.innerText = questions[currentQuestionIndex].answers[index];
    option.style.backgroundColor = "#3498db";
  });
}

function selectAnswer(answerIndex) {
  const isCorrect = answerIndex === questions[currentQuestionIndex].correct;
  if (isCorrect) {
    score++;
    document.querySelectorAll(".option")[answerIndex].style.backgroundColor = "#2ecc71";
  } else {
    document.querySelectorAll(".option")[answerIndex].style.backgroundColor = "#e74c3c";
  }
  document.getElementById("score").innerText = `Score: ${score}`;
  disableOptions();
}

function disableOptions() {
  document.querySelectorAll(".option").forEach(option => {
    option.disabled = true;
  });
}

function enableOptions() {
  document.querySelectorAll(".option").forEach(option => {
    option.disabled = false;
    option.style.backgroundColor = "#3498db";
  });
}

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    enableOptions();
    displayQuestion();
  } else {
    document.getElementById("question-container").innerHTML = `<p>Quiz Completed!</p>`;
    document.getElementById("next-btn").style.display = "none";
  }
}

displayQuestion();
