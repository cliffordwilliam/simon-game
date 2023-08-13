//refs
const buttonContainer = document.querySelector(".button-container");
const buttons = document.querySelectorAll("button");
const heading = document.querySelector("h1");

// vars
let sentence = []; // store words
let duplicateSentence; // to pop
var delayInMilliseconds = 1000; // 1 second gap
let gameState = "Press any key to play"; // Initial game state

function updateHeadingText() {
  heading.textContent = gameState;
}

function disableButtons() {
  // prevent clicking
  for (let i = 0; i < buttons.length; i++) {
    const button = buttons[i];
    button.classList.add("disabled");
  }
}

function enableButtons() {
  // allow clicking
  for (let i = 0; i < buttons.length; i++) {
    const button = buttons[i];
    button.classList.remove("disabled");
  }
}

function addWord() {
  // this starts the game
  // add word to sentence
  let randNum = Math.floor(Math.random() * 3 + 1);
  sentence.push(randNum);
  // Create a shallow copy of the sentence array
  duplicateSentence = [...sentence];
  // talk
  setTimeout(talk, delayInMilliseconds);
  gameState = "Remember the pattern"; // Update game state
  updateHeadingText(); // Update heading text
}

function talk() {
  // read the sentence
  // Remove and return the first element
  let number = duplicateSentence.shift();
  // select button with word
  let currentButton = buttonContainer.children[number];
  // glow the selected button
  currentButton.classList.add("glow");
  // after anim
  function onGlowAnimationEnd() {
    // detach signal
    currentButton.removeEventListener("animationend", onGlowAnimationEnd);
    // remove anim
    currentButton.classList.remove("glow");
    // check sentence
    if (duplicateSentence.length > 0) {
      // still have words, talk
      setTimeout(talk, delayInMilliseconds);
    } else {
      // no more words, player turn
      enableButtons();
      // Create a shallow copy of the sentence array
      duplicateSentence = [...sentence];
      gameState = "Repeat the pattern"; // Update game state
      updateHeadingText(); // Update heading text
    }
  }
  // attach anim signal to current
  currentButton.addEventListener("animationend", onGlowAnimationEnd);
}

function onPlayerClick() {
  // remove and return the first element
  let number = duplicateSentence.shift();
  if (this.id === number.toString()) {
    //correct
    // check sentence
    if (duplicateSentence.length === 0) {
      // no more words, you survived, simon turn
      disableButtons();
      addWord();
    }
  } else {
    // wrong, reset the game
    sentence = []; // store words
    disableButtons();
    waiting();
  }
}

function handleScreenClick() {
  heading.classList.remove("click-me");
  heading.removeEventListener("click", handleScreenClick);
  addWord();
}

function waiting() {
  heading.classList.add("click-me");
  // connect keyboard signal tp doc
  heading.addEventListener("click", handleScreenClick);
  gameState = "Click me to play"; // Update game state
  updateHeadingText(); // Update heading text
}

// connect button signal
for (let i = 0; i < buttons.length; i++) {
  let button = buttons[i];
  button.addEventListener("click", onPlayerClick);
}

disableButtons();
waiting();
