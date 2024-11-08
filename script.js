// script.js

// Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB74rDbZl3GnXSP_nyhdvIE-v3hSbNUzPM",
  authDomain: "exam-results-accfin2018.firebaseapp.com",
  projectId: "exam-results-accfin2018",
  storageBucket: "exam-results-accfin2018.firebasestorage.app",
  messagingSenderId: "162880978689",
  appId: "1:162880978689:web:723507aafc6d79c5586500",
  measurementId: "G-R8N43LVZE8"
};
// script.js



// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
console.log("Firebase initialized successfully.");

// Initialize quiz variables
let currentQuestionIndex = 0;
let score = 0;
let studentInfo = { id: "", name: "" };
let answers = [];
let startTime = 0;
let questionStartTime = 0;
let totalTime = 0;

// Define quiz questions
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

// Authenticate Student Function
function authenticateStudent(event) {
  event.preventDefault();

  const studentID = document.getElementById("student-id").value.trim();
  const studentName = document.getElementById("student-name").value.trim();
  const authError = document.getElementById("auth-error");

  // Clear previous error messages
  authError.innerText = "";

  // Basic validation
  if (studentID === "" || studentName === "") {
    authError.innerText = "Please enter both Student ID and Name.";
    return;
  }

  console.log(`Authenticating Student ID: ${studentID}, Name: ${studentName}`);

  // Fetch the authorized student document by studentID
  db.collection("authorizedStudents").doc(studentID).get()
    .then((doc) => {
      if (doc.exists && doc.data().studentName === studentName) {
        // Authorized
        console.log("Student is authorized.");
        studentInfo.id = studentID;
        studentInfo.name = studentName;
        startQuiz();
      } else {
        // Not authorized
        console.warn("Student ID and Name not found in authorized list.");
        authError.innerText = "Your Student ID and Name are not authorized to take the quiz.";
      }
    })
    .catch((error) => {
      console.error("Error querying authorizedStudents:", error);
      authError.innerText = "An error occurred during authentication. Please try again.";
    });
}

// Start Quiz Function
function startQuiz() {
  // Hide the authentication form and show the quiz section
  document.getElementById("authentication").style.display = "none";
  document.getElementById("quiz-section").style.display = "block";

  // Initialize quiz variables
  currentQuestionIndex = 0;
  score = 0;
  answers = [];
  startTime = Date.now();
  questionStartTime = Date.now();

  displayQuestion();
}

// Display the current question
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
  updateNavigationButtons();
  MathJax.typesetPromise();
}

// Disable answer buttons after selection
function disableOptions() {
  document.querySelectorAll(".option").forEach(option => {
    option.disabled = true;
  });
}

// Enable answer buttons for the next question
function enableOptions() {
  document.querySelectorAll(".option").forEach(option => {
    option.disabled = false;
    option.style.backgroundColor = "#3498db";
  });
}

// Navigate to a specific question
function goToQuestion(index) {
  currentQuestionIndex = index;
  displayQuestion();

  if (answers[currentQuestionIndex]) {
    const selectedAnswer = answers[currentQuestionIndex].selected;
    const selectedIndex = questions[currentQuestionIndex].answers.indexOf(selectedAnswer);
    const isCorrect = answers[currentQuestionIndex].isCorrect;
    document.querySelectorAll(".option")[selectedIndex].style.backgroundColor = isCorrect ? "#2ecc71" : "#e74c3c";
    if (!isCorrect) {
      document.querySelectorAll(".option")[questions[currentQuestionIndex].correct].style.backgroundColor = "#2ecc71";
    }
    document.getElementById("solution").innerHTML = (isCorrect ? "Correct! " : "Incorrect. ") + answers[currentQuestionIndex].explanation;
    disableOptions();
  }
}

// Update navigation buttons to reflect answered questions
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

// Proceed to the next question
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

// Display quiz results to the user
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

// Format time from seconds to minutes and seconds
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins} minutes, ${secs} seconds`;
}

// Save quiz results to Firebase Firestore
function saveResultsToFirestore(data) {
  db.collection("quizResults").add(data)
    .then((docRef) => {
      console.log("Quiz results successfully written with ID: ", docRef.id);
      // Optionally, inform the user that their results have been saved
      // alert("Your results have been submitted successfully!");
    })
    .catch((error) => {
      console.error("Error adding quiz results: ", error);
      alert("There was an error submitting your quiz results. Please try again.");
    });
}
