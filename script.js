const questions = [
  {
    question: "What is the mean of the dataset: 3, 7, 7, 2, 9?",
    answers: ["5.6", "6.0", "7.0", "4.5"],
    correct: 0,
    solution: "Solution: The mean is calculated as (3 + 7 + 7 + 2 + 9) / 5 = 5.6."
  },
  {
    question: "Which of the following is a measure of central tendency?",
    answers: ["Variance", "Mean", "Standard Deviation", "Range"],
    correct: 1,
    solution: "Solution: Mean is a measure of central tendency, while variance and standard deviation are measures of dispersion."
  },
  {
    question: "What is the variance of the data set: 4, 4, 6, 8?",
    answers: ["2", "4", "5", "3"],
    correct: 0,
    solution: "Solution: The mean is 5.5, and variance = [(4-5.5)^2 + (4-5.5)^2 + (6-5.5)^2 + (8-5.5)^2] / 4 = 2."
  },
  {
    question: "Which distribution is symmetric and bell-shaped?",
    answers: ["Uniform Distribution", "Binomial Distribution", "Normal Distribution", "Poisson Distribution"],
    correct: 2,
    solution: "Solution: The normal distribution is symmetric and bell-shaped."
  }
];

let currentQuestionIndex = 0;
let score = 0;

function displayQuestion() {
  const questionElement = document.getElementById("question");
  const options = document.querySelectorAll(".option");
  const solutionElement = document.getElementById("solution");

  questionElement.innerText = questions[currentQuestionIndex].question;
  options.forEach((option, index) => {
    option.innerText = questions[currentQuestionIndex].answers[index];
    option.style.backgroundColor = "#3498db";
  });
  solutionElement.innerText = ""; // Clear the previous solution
}

function selectAnswer(answerIndex) {
  const question = questions[currentQuestionIndex];
  const solutionElement = document.getElementById("solution");

  if (answerIndex === question.correct) {
    score++;
    solutionElement.innerText = "Correct! " + question.solution;
    document.querySelectorAll(".option")[answerIndex].style.backgroundColor = "#2ecc71";
  } else {
    solutionElement.innerText = "Incorrect. " + question.solution;
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
    document.getElementById("question-container").innerHTML = `<p>Exam Completed!</p>`;
    document.getElementById("next-btn").style.display = "none";
  }
}

displayQuestion();
