let currentPrizeLevel = 0;
let currentSession = 1;
const prizeValues = [
  1000, 2500, 4000, 5500, 7500, 9500, 12000, 14500, 17500, 20000, 25000, 30000,
  35000, 40000, 50000,
];
let fiftyFiftyUsed = false;

function useFiftyFifty() {
  if (fiftyFiftyUsed) return;

  fiftyFiftyUsed = true;

  // Play the 50:50 audio effect
  const fiftyFiftyAudio = document.getElementById("fiftyFiftyAudio");
  fiftyFiftyAudio.play();

  const incorrectOptions = Array.from(
    document.querySelectorAll(".answerContain .ans")
  ).filter((option) => option.dataset.correct === "false");

  if (incorrectOptions.length >= 2) {
    const [option1, option2] = incorrectOptions
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);

    option1.querySelector("p").textContent = "";
    option2.querySelector("p").textContent = "";
  }

  // Change the image to indicate the lifeline has been used
  const fiftyFiftyImage = document.getElementById("fiftyFiftyLifeline");
  fiftyFiftyImage.src = "assets/img/Classic5050used.webp"; // Path to the new image

  // Disable the lifeline button after use
  fiftyFiftyImage.disabled = true;
  fiftyFiftyImage.classList.add("used");
}

const questionLoadAudio = document.getElementById("questionLoadAudio");
const correctAnswerAudio = document.getElementById("correctAnswerAudio");

function startBackgroundAudio() {
  questionLoadAudio.play();
}

function stopBackgroundAudio() {
  questionLoadAudio.pause();
  questionLoadAudio.currentTime = 0; // Reset to the start
}

function handleCorrectAnswer() {
  // Stop the question audio
  stopBackgroundAudio();

  // Play the correct answer audio
  correctAnswerAudio.play();

  // Once the correct answer audio finishes, ensure the question audio does not restart immediately
  correctAnswerAudio.onended = () => {
    // Enable the next arrow after correct answer audio ends
    enableNextArrow();
  };
}

function loadQuestion() {
  selectedAnswer = null;

  // Reset and ensure the question audio plays for the new question
  if (questionLoadAudio.paused) {
    questionLoadAudio.currentTime = 0; // Start from the beginning
    questionLoadAudio.play();
  }

  document.querySelectorAll(".answerContain .ans").forEach((ansDiv) => {
    ansDiv.classList.remove("hovered", "correct", "incorrect");
    ansDiv.style.visibility = "visible";
  });

  fetch(`get_question.php?session=${currentSession}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Data received from server:", data);

      if (data.error) {
        if (data.error === "Session transitioned, load next session.") {
          currentSession++;
          loadQuestion(); // Load next session
        } else if (data.error === "Quiz completed!") {
          window.location.href = "completion.php";
        } else {
          document.querySelector(".questContain .quest p").textContent =
            data.error;
        }
        return;
      }

      document.querySelector(".questContain .quest p").textContent =
        data.question;
      document
        .querySelectorAll(".answerContain .ans")
        .forEach((ansDiv, index) => {
          const optionText = data[`option_${String.fromCharCode(97 + index)}`];
          ansDiv.querySelector("p").textContent = `${String.fromCharCode(
            65 + index
          )}: ${optionText}`;
          ansDiv.dataset.correct =
            data.correct_answer === String.fromCharCode(65 + index);
        });

      document.getElementById("next-arrow").style.display = "none";
      document.querySelector(".price").style.display = "none";
    })
    .catch((error) => console.error("Error loading question:", error));
}

document.getElementById("next-session").addEventListener("click", () => {
  // Increment session before sending it
  currentSession++;

  // Update the session in the backend
  fetch("update_session.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session: currentSession }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Session updated:", data);

      // Check if the quiz is completed
      if (data.quiz_completed) {
        // Redirect to completion page
        window.location.href = "completion.php";
      } else {
        // Load the next question if quiz isn't complete
        loadQuestion();
      }
    })
    .catch((error) => console.error("Error updating session:", error));
});
document.querySelectorAll(".answerContain .ans").forEach((ansDiv) => {
  ansDiv.addEventListener("click", function () {
    if (selectedAnswer === null) {
      selectedAnswer = this;
      this.classList.add("hovered");
    } else if (selectedAnswer === this) {
      if (this.dataset.correct === "true") {
        this.classList.remove("hovered");
        this.classList.add("correct");
        incrementCorrectAnswers();
        updatePrizeLevel();
        showPrize();

        // Handle correct answer audio
        handleCorrectAnswer();
      } else {
        this.classList.remove("hovered");
        this.classList.add("incorrect");

        // Play the wrong answer audio
        const wrongAnswerAudio = document.getElementById("wrongAnswerAudio");
        wrongAnswerAudio.play();

        // Optional: Add a delay before revealing the correct answer
        setTimeout(() => {
          showCorrectAnswer();
        }, 2000); // 2 seconds delay
      }
    } else {
      selectedAnswer.classList.remove("hovered");
      selectedAnswer = this;
      this.classList.add("hovered");
    }
  });
});

function showCorrectAnswer() {
  document.querySelectorAll(".answerContain .ans").forEach((ansDiv) => {
    if (ansDiv.dataset.correct === "true") {
      ansDiv.classList.add("correct");
    }
  });
}

function updatePrizeLevel() {
  if (currentPrizeLevel < prizeValues.length - 1) {
    // Increment the prize level
    currentPrizeLevel++;

    // Select all prize elements
    const prizeElements = document.querySelectorAll(".middle2 .prize");

    if (prizeElements.length >= prizeValues.length) {
      // Remove the "active" class from all elements first
      prizeElements.forEach((element) => element.classList.remove("active"));

      // Add the "active" class to the current prize level
      if (prizeElements[prizeElements.length - currentPrizeLevel]) {
        prizeElements[prizeElements.length - currentPrizeLevel].classList.add(
          "active"
        );
      }
    } else {
      console.error(
        `Not enough prize elements. Expected ${prizeValues.length}, but found ${prizeElements.length}.`
      );
    }
  }
}

function incrementCorrectAnswers() {
  fetch("increment_correct_answers.php")
    .then((response) => response.json())
    .then((data) => {
      console.log("Correct answers count updated:", data.correct_answers);

      if (data.quiz_completed) {
        // Redirect to completion page if the quiz is completed
        window.location.href = "completion.php";
      }
    })
    .catch((error) => console.error("Error updating correct answers:", error));
}

function showPrize() {
  const prizeAmount = prizeValues[currentPrizeLevel - 1];
  const formattedPrize = `N ${prizeAmount.toLocaleString()}`;

  const prizeDiv = document.querySelector(".price p");
  prizeDiv.textContent = formattedPrize;

  const priceContainer = document.querySelector(".price");

  // Hide the next arrow initially
  document.getElementById("next-arrow").style.display = "none";

  // Show the prize container
  priceContainer.style.display = "block";

  // Hide the prize container after 3 seconds, then show the next arrow
  setTimeout(() => {
    priceContainer.style.display = "none"; // Hide the prize container
    enableNextArrow(); // Show the next arrow after the prize disappears
  }, 3000);
}

function enableNextArrow() {
  document.getElementById("next-arrow").style.display = "inline-block";
}

document.getElementById("next-arrow").addEventListener("click", () => {
  loadQuestion();
  document.getElementById("next-arrow").style.display = "none";
});

// Start the question background audio on page load
window.addEventListener("load", startBackgroundAudio);

let askAudienceUsed = false;

function useAskAudience() {
  if (askAudienceUsed) return;

  askAudienceUsed = true;

  const lifelineButton = document.getElementById("askAudienceLifeline");
  lifelineButton.disabled = true;
  lifelineButton.classList.add("used");

  // Play the Ask the Audience sound
  const askAudienceAudio = document.getElementById("askAudienceSound");
  askAudienceAudio.play();

  // Remove the button after the animation ends
  lifelineButton.addEventListener("animationend", () => {
    lifelineButton.style.display = "none";
  });

  // Additional logic for the lifeline can be added here
}

let phoneFriendUsed = false;

function usePhoneAFriend() {
  if (phoneFriendUsed) return;

  phoneFriendUsed = true;

  const lifelineButton = document.getElementById("phoneFriendLifeline");
  lifelineButton.disabled = true;
  lifelineButton.classList.add("used");

  // Play the Phone a Friend audio effect
  const phoneAFriendAudio = document.getElementById("phoneAFriendAudio");
  phoneAFriendAudio.play();

  // Remove the button after the animation ends
  lifelineButton.addEventListener("animationend", () => {
    lifelineButton.style.display = "none";
  });

  // Show the timer container immediately
  const timerContainer = document.getElementById("phoneAFriendTimerContainer");
  timerContainer.style.display = "block";

  // Set up initial timer text
  const timerText = document.getElementById("phoneAFriendTime");
  timerText.textContent = "00:30"; // 30 seconds timer

  let timeLeft = 30; // Total countdown time

  // Set a 15-second delay before the timer starts counting
  setTimeout(() => {
    const countdownInterval = setInterval(() => {
      // Update timer display
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      timerText.textContent = `${String(minutes).padStart(2, "0")}:${String(
        seconds
      ).padStart(2, "0")}`;

      timeLeft--;

      if (timeLeft < 0) {
        clearInterval(countdownInterval);
        timerContainer.style.display = "none"; // Hide the timer when done
      }
    }, 1000);
  }, 12000); // 15-second delay before the timer starts counting
}

function triggerAnimation() {
  const options = document.querySelectorAll(".answerContain .ans");
  options.forEach((option, index) => {
    option.style.animation = `slideIn 0.5s ease-out forwards ${index * 0.5}s`;
  });
}
document.querySelectorAll(".ans").forEach((ans, index) => {
  console.log(`Option ${index + 1}:`, window.getComputedStyle(ans).opacity);
});

// Example: Trigger when the page loads or a button is clicked
triggerAnimation();

loadQuestion();
