let currentQuestionIndex = 0;
let score = 0;
let studentInfo = { id: "", name: "" };
let answers = [];
let startTime = 0;
let questionStartTime = 0;
let totalTime = 0;

const questions = [
  {
    question: "What is the mean of the dataset: 3, 7, 7, 2, 9?",
    answers: ["5.6", "6.0", "7.0", "4.5"],
    correct: 0,
    solution: "Solution: The mean is calculated as $$\\frac{3 + 7 + 7 + 2 + 9}{5} = 5.6.$$"
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
    solution: "Solution: The mean is 5.5, and variance is $$\\frac{(4-5.5)^2 + (4-5.5)^2 + (6-5.5)^2 + (8-5.5)^2}{4} = 2.$$"
  },
  {
    question: "Which distribution is symmetric and bell-shaped?",
    answers: ["Uniform Distribution", "Binomial Distribution", "Normal Distribution", "Poisson Distribution"],
    correct: 2,
    solution: "Solution: The normal distribution is symmetric and bell-shaped."
  }
];

function startQuiz(event) {
  event.preventDefault();
  studentInfo.id = document.getElementById("student-id").value;
  studentInfo.name = document.getElementById("student-name").value;
  startTime = Date.now();
  questionStartTime = Date.now();
  document.getElementById("student-info").style.display = "none";
  document.getElementById("quiz-container").style.display = "block";

  displayQuestion();
}

function displayQuestion() {
  const questionElement = document.getElementById("question");
  const options = document.querySelectorAll(".option");
  const solutionElement = document.getElementById("solution");

  questionStartTime = Date.now(); // Start timing for the current question

  const question = questions[currentQuestionIndex];

  questionElement.innerText = question.question;
  options.forEach((option, index) => {
    option.innerText = question.answers[index];
    option.style.backgroundColor = "#3498db";
    option.disabled = false;
  });

  solutionElement.innerText = "";

  // Update navigation buttons
  updateNavigationButtons();

  // Typeset any MathJax expressions
  MathJax.typesetPromise();
}

function selectAnswer(answerIndex) {
  const question = questions[currentQuestionIndex];
  const solutionElement = document.getElementById("solution");
  const timeTaken = (Date.now() - questionStartTime) / 1000; // time in seconds

  const isCorrect = answerIndex === question.correct;

  // Store the user's answer
  answers[currentQuestionIndex] = {
    question: question.question,
    selected: question.answers[answerIndex],
    correct: question.answers[question.correct],
    explanation: question.solution,
    isCorrect,
    timeTaken
  };

  if (isCorrect) {
    score++;
    solutionElement.innerText = "Correct! " + question.solution;
    document.querySelectorAll(".option")[answerIndex].style.backgroundColor = "#2ecc71";
  } else {
    solutionElement.innerText = "Incorrect. " + question.solution;
    document.querySelectorAll(".option")[answerIndex].style.backgroundColor = "#e74c3c";
  }

  disableOptions();

  // Typeset any MathJax expressions
  MathJax.typesetPromise();
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

function goToQuestion(index) {
  currentQuestionIndex = index;
  displayQuestion();

  // If the user has already selected an answer for this question, show it
  if (answers[currentQuestionIndex]) {
    const selectedAnswer = answers[currentQuestionIndex].selected;
    const selectedIndex = questions[currentQuestionIndex].answers.indexOf(selectedAnswer);

    const isCorrect = answers[currentQuestionIndex].isCorrect;
    document.querySelectorAll(".option")[selectedIndex].style.backgroundColor = isCorrect ? "#2ecc71" : "#e74c3c";
    document.getElementById("solution").innerText = (isCorrect ? "Correct! " : "Incorrect. ") + answers[currentQuestionIndex].explanation;

    disableOptions();
  }
}

function updateNavigationButtons() {
  const navigationContainer = document.getElementById("navigation");
  navigationContainer.innerHTML = "";

  questions.forEach((_, index) => {
    const navButton = document.createElement("button");
    navButton.innerText = index + 1;
    navButton.onclick = () => goToQuestion(index);

    if (answers[index]) {
      navButton.style.backgroundColor = answers[index].isCorrect ? "#2ecc71" : "#e74c3c";
    } else {
      navButton.style.backgroundColor = "#ddd";
    }

    navigationContainer.appendChild(navButton);
  });
}

function submitQuiz() {
  displayResults();
}

function displayResults() {
  document.getElementById("quiz-container").style.display = "none";
  document.getElementById("results-container").style.display = "block";
  totalTime = (Date.now() - startTime) / 1000; // Total time in seconds

  const summary = `
    <p><strong>Student ID:</strong> ${studentInfo.id}</p>
    <p><strong>Name:</strong> ${studentInfo.name}</p>
    <p><strong>Score:</strong> ${score} / ${questions.length}</p>
    <p><strong>Total Time Taken:</strong> ${formatTime(totalTime)}</p>
  `;

  document.getElementById("student-info-summary").innerHTML = summary;

  const averageTime = totalTime / questions.length;
  let resultsHTML = "";
  answers.forEach((answer, index) => {
    resultsHTML += `
      <h3>Question ${index + 1}</h3>
      <p><strong>Question:</strong> ${answer.question}</p>
      <p><strong>Your Answer:</strong> ${answer.selected}</p>
      <p><strong>Correct Answer:</strong> ${answer.correct}</p>
      <p><strong>Explanation:</strong> ${answer.explanation}</p>
      <p><strong>Time Taken:</strong> ${formatTime(answer.timeTaken)}</p>
      <p><strong>Result:</strong> ${answer.isCorrect ? "Correct" : "Incorrect"}</p><hr>
    `;
  });

  const statsHTML = `
    <p><strong>Average Time per Question:</strong> ${formatTime(averageTime)}</p>
  `;

  document.getElementById("results").innerHTML = resultsHTML + statsHTML;

  // Typeset any MathJax expressions
  MathJax.typesetPromise();
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins} minutes, ${secs} seconds`;
}

// Initially display the student info form
document.getElementById("student-info").style.display = "block";
