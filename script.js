/* ==========================================================
   Onam Quiz — JavaScript
   Flow: Start -> Question -> Select -> Next -> Results -> Show Answers -> Play Again
   ========================================================== */

/* ---------- 1. Quiz data ---------- */
const questions = [
  {
    question: "Which legendary king is associated with Onam?",
    options: ["King Mahabali", "King Ashoka", "King Harsha", "King Vikramaditya"],
    answer: "King Mahabali"
  },
  {
    question: "What is the flower carpet made during Onam called?",
    options: ["Rangoli", "Pookalam", "Kolam", "Alpana"],
    answer: "Pookalam"
  },
  {
    question: "What is the traditional Onam feast called?",
    options: ["Vishu Kani", "Onam Sadya", "Payasam", "Pongal"],
    answer: "Onam Sadya"
  },
  {
    question: "Vallam Kali, held during Onam, is better known as which event?",
    options: ["Snake boat race", "Bull race", "Kite festival", "Horse parade"],
    answer: "Snake boat race"
  },
  {
    question: "Onam is the harvest festival of which Indian state?",
    options: ["Kerala", "Tamil Nadu", "Karnataka", "Andhra Pradesh"],
    answer: "Kerala"
  },
  {
    question: "Which day is celebrated as the most important day of Onam?",
    options: ["Atham", "Thiruvonam", "Uthradam", "Chithira"],
    answer: "Thiruvonam"
  },
  {
    question: "Which traditional Kerala outfit is commonly worn during Onam?",
    options: ["Kasavu saree and mundu", "Ghagra choli", "Sherwani", "Phiran"],
    answer: "Kasavu saree and mundu"
  },
  {
    question: "Pulikali, performed during Onam, is a folk art where dancers paint themselves as which animal?",
    options: ["Tiger", "Elephant", "Peacock", "Deer"],
    answer: "Tiger"
  },
  {
    question: "The Onam Sadya is traditionally served on the leaf of which plant?",
    options: ["Banana leaf", "Mango leaf", "Teak leaf", "Lotus leaf"],
    answer: "Banana leaf"
  },
  {
    question: "In the legend, which avatar of Lord Vishnu sent King Mahabali to the netherworld?",
    options: ["Vamana", "Narasimha", "Parashurama", "Matsya"],
    answer: "Vamana"
  }
];

/* ---------- 2. Quiz state ---------- */
let currentQuestionIndex = 0;
let score = 0;
let selectedAnswer = null;
let userAnswers = []; // remembers what the user picked, for the final review

/* ---------- 3. DOM references ---------- */
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

const startBtn = document.getElementById("start-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const nextLabel = document.getElementById("next-label");
const restartBtn = document.getElementById("restart-btn");

const questionCounter = document.getElementById("question-counter");
const progressPercent = document.getElementById("progress-percent");
const progressBar = document.getElementById("progress-bar");
const progressFill = document.getElementById("progress-fill");

const questionText = document.getElementById("question-text");
const optionsList = document.getElementById("options-list");
const feedback = document.getElementById("feedback");

const scoreRing = document.getElementById("score-ring");
const finalScore = document.getElementById("final-score");
const finalPercent = document.getElementById("final-percent");
const resultMessage = document.getElementById("result-message");
const showAnswersBtn = document.getElementById("show-answers-btn");
const review = document.getElementById("review");
const reviewList = document.getElementById("review-list");
const celebration = document.getElementById("celebration");

const letters = ["A", "B", "C", "D"];

/* ---------- 4. Screen helper ---------- */
// Shows one screen and hides the other two.
function showScreen(screenToShow) {
  [startScreen, quizScreen, resultScreen].forEach(function (screen) {
    screen.classList.add("hidden");
  });
  screenToShow.classList.remove("hidden");
}

/* ---------- 5. Start the quiz ---------- */
function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  userAnswers = [];
  showScreen(quizScreen);
  loadQuestion();
}

/* ---------- 6. Load the current question ---------- */
function loadQuestion() {
  selectedAnswer = null;

  const currentQuestion = questions[currentQuestionIndex];

  // Question text
  questionText.textContent = currentQuestion.question;

  // Clear old feedback and hide the Next button again
  feedback.textContent = "";
  feedback.className = "feedback";
  nextBtn.classList.add("hidden");

  // Build the four answer buttons from scratch
  optionsList.innerHTML = "";
  currentQuestion.options.forEach(function (option, index) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option";
    button.dataset.option = option;

    // Letter badge: A. B. C. D. (decorative, so screen readers skip it)
    const letterSpan = document.createElement("span");
    letterSpan.className = "option-letter";
    letterSpan.textContent = letters[index];
    letterSpan.setAttribute("aria-hidden", "true");

    // Answer text
    const textSpan = document.createElement("span");
    textSpan.className = "option-text";
    textSpan.textContent = option;

    // Empty icon slot — filled once the option is chosen
    const iconSpan = document.createElement("span");
    iconSpan.className = "option-icon";

    button.append(letterSpan, textSpan, iconSpan);
    button.addEventListener("click", function () {
      selectAnswer(option);
    });

    optionsList.appendChild(button);
  });

  // Last question gets a different label on the forward arrow
  nextLabel.textContent =
    currentQuestionIndex === questions.length - 1 ? "See Results" : "Next";
  nextBtn.setAttribute(
    "aria-label",
    currentQuestionIndex === questions.length - 1 ? "See results" : "Next question"
  );

  // Going back is only possible from question 2 onwards
  prevBtn.disabled = currentQuestionIndex === 0;

  // A question visited again shows the answer that was picked earlier
  const previousAnswer = userAnswers[currentQuestionIndex];
  if (previousAnswer !== undefined) {
    markAnswered(previousAnswer);
  }

  updateProgress();
}

/* ---------- 7. Handle an answer click ---------- */
function selectAnswer(chosenOption) {
  // Ignore extra clicks once an answer is locked in
  if (selectedAnswer !== null) return;

  const correctAnswer = questions[currentQuestionIndex].answer;

  if (chosenOption === correctAnswer) {
    score++;
  }

  // Save the choice so it can be shown again later and on the results screen
  userAnswers[currentQuestionIndex] = chosenOption;

  markAnswered(chosenOption);
  nextBtn.focus();
}

/* Marks a question as answered — used for a fresh click and when
   returning to a question with the back arrow. */
function markAnswered(chosenOption) {
  selectedAnswer = chosenOption;

  // Only the chosen option is marked — whether it was right stays secret
  // until every question has been answered.
  const allOptions = optionsList.querySelectorAll(".option");
  allOptions.forEach(function (optionButton) {
    if (optionButton.dataset.option === chosenOption) {
      optionButton.classList.add("selected");
      optionButton.querySelector(".option-icon").textContent = "●";
      optionButton.setAttribute("aria-label", chosenOption + " — selected");
    }

    // Lock all answers so the choice cannot be changed
    optionButton.disabled = true;
  });

  // Neutral confirmation: it must not hint at correct or incorrect
  feedback.textContent = "Answer recorded 🌿 All answers are revealed at the end.";
  feedback.className = "feedback show";

  // Now the user can move on
  nextBtn.classList.remove("hidden");
}

/* ---------- 8. Progress counter and bar ---------- */
function updateProgress() {
  const questionNumber = currentQuestionIndex + 1;
  const percent = Math.round((questionNumber / questions.length) * 100);

  questionCounter.textContent =
    "Question " + questionNumber + " of " + questions.length;
  progressPercent.textContent = percent + "%";
  progressFill.style.width = percent + "%";
  progressBar.setAttribute("aria-valuenow", percent);
}

/* ---------- 9. Move between questions ---------- */
function previousQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    loadQuestion();
  }
}

function nextQuestion() {
  currentQuestionIndex++;

  if (currentQuestionIndex < questions.length) {
    loadQuestion();
  } else {
    showResults();
  }
}

/* ---------- 10. Results screen ---------- */
function showResults() {
  const percent = Math.round((score / questions.length) * 100);

  finalScore.textContent = score + " / " + questions.length;
  finalPercent.textContent = percent + "%";
  resultMessage.textContent = getResultMessage(score);

  // Fills the gold arc of the score ring
  scoreRing.style.setProperty("--score", percent);

  buildReview();
  hideAnswers(); // the review starts closed every time
  showScreen(resultScreen);
  launchCelebration();
}

/* Lists every question with the user's answer and the correct answer. */
function buildReview() {
  reviewList.innerHTML = "";

  questions.forEach(function (question, index) {
    const chosen = userAnswers[index];
    const isCorrect = chosen === question.answer;

    const item = document.createElement("li");
    item.className = "review-item " + (isCorrect ? "review-correct" : "review-wrong");
    item.style.animationDelay = index * 0.06 + "s"; // items appear one after another

    // Badge shows ✓ or ✕ so the result is not colour-only
    const badge = document.createElement("span");
    badge.className = "review-badge";
    badge.textContent = isCorrect ? "✓" : "✕";

    const body = document.createElement("div");
    body.className = "review-body";

    const questionLine = document.createElement("p");
    questionLine.className = "review-question";
    questionLine.textContent = question.question;

    const yourLine = document.createElement("p");
    yourLine.className = "review-line " + (isCorrect ? "line-correct" : "line-wrong");
    yourLine.textContent = "Your answer: " + chosen;

    body.append(questionLine, yourLine);

    // Only worth repeating the right answer when the user missed it
    if (!isCorrect) {
      const correctLine = document.createElement("p");
      correctLine.className = "review-line line-correct";
      correctLine.textContent = "Correct answer: " + question.answer;
      body.appendChild(correctLine);
    }

    item.append(badge, body);
    reviewList.appendChild(item);
  });
}

// Picks an encouraging message based on the score.
function getResultMessage(finalScoreValue) {
  if (finalScoreValue >= 9) {
    return "Onam Expert! 🌼 You know the festival incredibly well!";
  } else if (finalScoreValue >= 7) {
    return "Great job! 🎉 You know your Onam traditions!";
  } else if (finalScoreValue >= 5) {
    return "Nice effort! 🌸 You know quite a bit about Onam.";
  }
  return "Keep exploring! 🌿 There's more Onam magic to discover.";
}

/* Shows or hides the answer review when the button is clicked. */
function toggleAnswers() {
  const isHidden = review.classList.contains("hidden");

  if (isHidden) {
    review.classList.remove("hidden");
    showAnswersBtn.textContent = "Hide Answers";
    showAnswersBtn.setAttribute("aria-expanded", "true");
  } else {
    hideAnswers();
  }
}

function hideAnswers() {
  review.classList.add("hidden");
  showAnswersBtn.textContent = "Show Answers";
  showAnswersBtn.setAttribute("aria-expanded", "false");
}

/* ---------- 11. Falling petals celebration (no library) ---------- */
function launchCelebration() {
  const petalEmojis = ["🌼", "🌸", "🪷", "🌺", "🌿"];

  for (let i = 0; i < 30; i++) {
    const petal = document.createElement("span");
    petal.className = "confetti-petal";
    petal.textContent = petalEmojis[i % petalEmojis.length];
    petal.style.left = Math.random() * 100 + "vw";
    petal.style.animationDuration = 3 + Math.random() * 2.5 + "s";
    petal.style.animationDelay = Math.random() * 1.5 + "s";

    // Clean up each petal once it finishes falling
    petal.addEventListener("animationend", function () {
      petal.remove();
    });

    celebration.appendChild(petal);
  }
}

function clearCelebration() {
  celebration.innerHTML = "";
}

/* ---------- 12. Restart ---------- */
function restartQuiz() {
  clearCelebration();
  hideAnswers();
  startQuiz();
}

/* ---------- 13. Event listeners ---------- */
startBtn.addEventListener("click", startQuiz);
prevBtn.addEventListener("click", previousQuestion);
nextBtn.addEventListener("click", nextQuestion);
showAnswersBtn.addEventListener("click", toggleAnswers);
restartBtn.addEventListener("click", restartQuiz);
