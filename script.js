let selectedAnswer = null;
let currentPrizeLevel = 0;

const prizeValues = [
  1000, 2500, 4000, 5500, 7500, 9500, 12000, 14500, 17500, 20000, 25000, 30000,
  35000, 40000, 50000,
];
let fiftyFiftyUsed = false;

function useFiftyFifty() {
  if (fiftyFiftyUsed) return;

  fiftyFiftyUsed = true;

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

  // Disable the lifeline button after use
  document.getElementById("fiftyFiftyLifeline").disabled = true;
  document.getElementById("fiftyFiftyLifeline").classList.add("used");
}

function loadQuestion() {
  selectedAnswer = null;

  document.querySelectorAll(".answerContain .ans").forEach((ansDiv) => {
    ansDiv.classList.remove("hovered", "correct", "incorrect");
    ansDiv.style.visibility = "visible";
  });

  fetch("get_question.php")
    .then((response) => response.json())
    .then((data) => {
      console.log("Loaded question data:", data);

      if (data.error) {
        document.querySelector(".questContain .quest p").textContent =
          data.error;
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
        enableNextArrow();
      } else {
        this.classList.remove("hovered");
        this.classList.add("incorrect");
      }
      showCorrectAnswer();
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
    currentPrizeLevel++;
    const prizeElements = document.querySelectorAll(".middle2 .prize");

    if (prizeElements.length >= prizeValues.length) {
      if (prizeElements[prizeElements.length - currentPrizeLevel]) {
        prizeElements[prizeElements.length - currentPrizeLevel].classList.add(
          "active"
        );
      }

      if (prizeElements[prizeElements.length - currentPrizeLevel - 1]) {
        prizeElements[
          prizeElements.length - currentPrizeLevel - 1
        ].classList.remove("active");
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
    })
    .catch((error) => console.error("Error updating correct answers:", error));
}

function showPrize() {
  const prizeAmount = prizeValues[currentPrizeLevel - 1];
  const formattedPrize = `N ${prizeAmount.toLocaleString()}`;

  const prizeDiv = document.querySelector(".price p");
  prizeDiv.textContent = formattedPrize;
  document.querySelector(".price").style.display = "block";

  setTimeout(() => {
    document.querySelector(".price").style.display = "none";
  }, 3000);
}

function enableNextArrow() {
  document.getElementById("next-arrow").style.display = "inline-block";
}

document.getElementById("next-arrow").addEventListener("click", () => {
  loadQuestion();
  document.getElementById("next-arrow").style.display = "none";
});

let askAudienceUsed = false;

function useAskAudience() {
  if (askAudienceUsed) return;

  askAudienceUsed = true;
  document.getElementById("askAudienceLifeline").disabled = true;
  document.getElementById("askAudienceLifeline").classList.add("used");
}
let phoneFriendUsed = false;

function usePhoneAFriend() {
  if (phoneFriendUsed) return;

  phoneFriendUsed = true;
  document.getElementById("phoneFriendLifeline").disabled = true;
  document.getElementById("phoneFriendLifeline").classList.add("used");

  const timerDiv = document.getElementById("phoneTimer");
  timerDiv.style.display = "inline";
  let timeLeft = 30;

  const countdownInterval = setInterval(() => {
    timerDiv.textContent = timeLeft;
    timeLeft--;

    if (timeLeft < 0) {
      clearInterval(countdownInterval);
      timerDiv.style.display = "none";
      alert("Time's up! The call has ended.");
    }
  }, 1000);
}

loadQuestion();
