// script.js

// Initialize quiz variables
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

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB74rDbZl3GnXSP_nyhdvIE-v3hSbNUzPM",
  authDomain: "exam-results-accfin2018.firebaseapp.com",
  projectId: "exam-results-accfin2018",
  storageBucket: "exam-results-accfin2018.firebasestorage.app",
  messagingSenderId: "162880978689",
  appId: "1:162880978689:web:723507aafc6d79c5586500",
  measurementId: "G-R8N43LVZE8"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Start quiz and hide the info form
function startQuiz(event) {
  event.preventDefault();
  studentInfo.id = document.getElementById("student-id").value.trim();
  studentInfo.name = document.getElementById("student-name").value.trim();

  // Basic validation
  if (studentInfo.id === "" || studentInfo.name === "") {
    alert("Please enter both Student ID and Name.");
    return;
  }

  console.log(`Starting quiz for Student ID: ${studentInfo.id}, Name: ${studentInfo.name}`);
  
  startTime = Date.now();
  questionStartTime = Date.now();
  
  // Store student info in Firestore
  db.collection("students").add({
    studentId: studentInfo.id,
    studentName: studentInfo.name,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then((docRef) => {
    console.log("Student info successfully written with ID: ", docRef.id);
    // Hide the student info form and show the quiz
    document.getElementById("student-info").style.display = "none";
    document.getElementById("quiz-container").style.display = "block";
    displayQuestion();
  })
  .catch((error) => {
    console.error("Error adding student info: ", error);
    alert("There was an error starting the quiz. Please try again.");
  });
}

// Display question
function displayQuestion() {
  const questionElement = document.getElementById("question");
  const options = document.querySelectorAll(".option");
  const solutionElement = document.getElementById("solution");

  questionStartTime = Date.now(); // Start timing for the current question

  const question = questions[currentQuestionIndex];
  questionElement.innerHTML = question.question;

  options.forEach((option, index) => {
    option.innerText = question.answers[index];
    option.style.backgroundColor = "#3498db";
    option.disabled = false;
  });

  solutionElement.innerText = "";
  updateNavigationButtons();

  // Typeset any MathJax expressions
  MathJax.typesetPromise();
}

// Handle answer selection
function selectAnswer(answerIndex) {
  const question = questions[currentQuestionIndex];
  const solutionElement = document.getElementById("solution");
  const timeTaken = (Date.now() - questionStartTime) / 1000; // time in seconds
  const isCorrect = answerIndex === question.correct;

  console.log(`Question ${currentQuestionIndex + 1}: Selected option ${answerIndex} (${question.answers[answerIndex]}) - ${isCorrect ? "Correct" : "Incorrect"}`);

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
    solutionElement.innerHTML = "Correct! " + question.solution;
    document.querySelectorAll(".option")[answerIndex].style.backgroundColor = "#2ecc71";
  } else {
    solutionElement.innerHTML = "Incorrect. " + question.solution;
    document.querySelectorAll(".option")[answerIndex].style.backgroundColor = "#e74c3c";
    // Highlight the correct answer
    document.querySelectorAll(".option")[question.correct].style.backgroundColor = "#2ecc71";
  }

  disableOptions();
  MathJax.typesetPromise();
}

// Disable options
function disableOptions() {
  document.querySelectorAll(".option").forEach(option => {
    option.disabled = true;
  });
}

// Enable options
function enableOptions() {
  document.querySelectorAll(".option").forEach(option => {
    option.disabled = false;
    option.style.backgroundColor = "#3498db";
  });
}

// Navigate to question
function goToQuestion(index) {
  currentQuestionIndex = index;
  displayQuestion();

  if (answers[currentQuestionIndex]) {
    const selectedAnswer = answers[currentQuestionIndex].selected;
    const selectedIndex = questions[currentQuestionIndex].answers.indexOf(selectedAnswer);
    const isCorrect = answers[currentQuestionIndex].isCorrect;
    document.querySelectorAll(".option")[selectedIndex].style.backgroundColor = isCorrect ? "#2ecc71" : "#e74c3c";
    document.getElementById("solution").innerHTML = (isCorrect ? "Correct! " : "Incorrect. ") + answers[currentQuestionIndex].explanation;
    disableOptions();
  }
}

// Update navigation buttons
function updateNavigationButtons() {
  const navigationContainer = document.getElementById("navigation");
  navigationContainer.innerHTML = "";

  questions.forEach((_, index) => {
    const navButton = document.createElement("button");
    navButton.innerText = index + 1;
    navButton.onclick = () => goToQuestion(index);
    navButton.style.margin = "2px";
    navButton.style.padding = "5px 10px";
    navButton.style.border = "none";
    navButton.style.borderRadius = "4px";
    navButton.style.cursor = "pointer";

    if (answers[index]) {
      navButton.style.backgroundColor = answers[index].isCorrect ? "#2ecc71" : "#e74c3c";
      navButton.style.color = "#fff";
    } else {
      navButton.style.backgroundColor = "#ddd";
      navButton.style.color = "#000";
    }

    navigationContainer.appendChild(navButton);
  });
}

// Go to next question
function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    enableOptions();
    displayQuestion();
  } else {
    document.getElementById("next-btn").style.display = "none";
    document.getElementById("submit-btn").style.display = "block";
  }
}

// Submit quiz results
function submitQuiz() {
  displayResults();
  totalTime = (Date.now() - startTime) / 1000; // Total time in seconds

  const resultsData = {
    studentInfo: studentInfo,
    score: score,
    totalTime: totalTime,
    answers: answers.map((answer, index) => ({
      questionNumber: index + 1,
      selectedAnswer: answer.selected,
      correctAnswer: answer.correct,
      timeTaken: answer.timeTaken,
      isCorrect: answer.isCorrect
    })),
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  };

  console.log("Submitting quiz results:", resultsData);

  // Save results to Firebase Firestore
  saveResultsToFirestore(resultsData);
}

// Display results
function displayResults() {
  document.getElementById("quiz-container").style.display = "none";
  document.getElementById("results-container").style.display = "block";

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

  document.getElementById("results").innerHTML = resultsHTML + `<p><strong>Average Time per Question:</strong> ${formatTime(averageTime)}</p>`;
  MathJax.typesetPromise();
}

// Format time in minutes and seconds
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins} minutes, ${secs} seconds`;
}

// Save results to Firebase Firestore
function saveResultsToFirestore(data) {
  db.collection("quizResults").add(data)
    .then((docRef) => {
      console.log("Quiz results successfully written with ID: ", docRef.id);
      // Optionally, you can inform the user that their results have been saved
    })
    .catch((error) => {
      console.error("Error adding quiz results: ", error);
      alert("There was an error submitting your quiz results. Please try again.");
    });
}

// Initially display the student info form
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById('student-info').style.display = 'block';
});
