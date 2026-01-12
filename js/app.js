let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let dartBoard = null;

function resizeCanvas() {
  const container = document.getElementById("container");
  const rect = container.getBoundingClientRect();
  const size = Math.min(rect.width, rect.height, 600);
  canvas.width = size;
  canvas.height = size;
  ctx.scale(size / 600, size / 600);
  if (dartBoard != null) {
    dartBoard.drawBoard();
  }
}

window.addEventListener("resize", resizeCanvas);
document.addEventListener("DOMContentLoaded", resizeCanvas);

let playerName = document.getElementById("player");
let secondPlayerName = document.getElementById("playerTwo");
let checkBoxPlayers = document.getElementById("twoPlayers");
let bot = document.getElementById("bots");
let gameMode = document.getElementById("modes");
let startGameButton = document.getElementById("startGame");
let legs = document.getElementById("legs");
let sets = document.getElementById("sets");
let gameStateContainer = document.getElementById("gameStateContainer");

let leftPlayer = document.getElementById("leftPlayer");
let leftPlayerName = document.getElementById("leftPlayerName");
let leftPlayerPoints = document.getElementById("leftPlayerPoints");
let leftPlayerLegs = document.getElementById("leftPlayerLegs");
let leftPlayerSets = document.getElementById("leftPlayerSets");
let leftPlayerAverage = document.getElementById("leftPlayerAverage");
let leftPlayerFinish = document.getElementById("leftPlayerFinish");
let leftPlayerDarts = document.getElementById("leftPlayerDarts");

let rightPlayer = document.getElementById("rightPlayer");
let rightPlayerName = document.getElementById("rightPlayerName");
let rightPlayerPoints = document.getElementById("rightPlayerPoints");
let rightPlayerLegs = document.getElementById("rightPlayerLegs");
let rightPlayerSets = document.getElementById("rightPlayerSets");
let rightPlayerAverage = document.getElementById("rightPlayerAverage");
let rightPlayerFinish = document.getElementById("rightPlayerFinish");
let rightPlayerDarts = document.getElementById("rightPlayerDarts");

canvas.addEventListener("mousedown", throwDart);
startGameButton.addEventListener("click", onOffGame);
checkBoxPlayers.addEventListener("click", addAnotherPlayer);

dartBoard = new DartBoard(ctx, 20);

let game = new Game(dartBoard);

function onOffGame() {
  if (game.isRunning()) {
    if (game.playerTurn) {
      leftPlayer.classList.remove("playersTurn");
    } else {
      rightPlayer.classList.remove("playersTurn");
    }

    game.reset();
    enableOptions();
    startGameButton.innerText = "Start Game";
    game.end();
    gameStateContainer.style.visibility = "hidden";
  } else {
    if (legs.value == "" || sets.value == "" || playerName.value == "") {
      alert("Players name cannot be empty. Legs and Sets must be at least 1");
      return;
    }
    if (checkBoxPlayers.checked) {
      game.turnOffBot();
    }
    disableOptions();
    startGameButton.innerText = "Game Over";
    setGameState();
    if (game.playerTurn) {
      leftPlayer.classList.add("playersTurn");
    } else {
      rightPlayer.classList.add("playersTurn");
    }
    gameStateContainer.style.visibility = "visible";

    game.start(
      playerName.value,
      secondPlayerName.value,
      bot.selectedOptions[0].innerText,
      parseInt(bot.value),
      parseInt(legs.value),
      parseInt(sets.value),
      parseInt(gameMode.value)
    );

    game.setPlayingPlayer();

    changeDartsStats();
  }
}

function addAnotherPlayer() {
  secondPlayerName.style.visibility =
    secondPlayerName.style.visibility == "visible" ? "hidden" : "visible";
}

function setGameState() {
  leftPlayerName.innerText = playerName.value;
  if (checkBoxPlayers.checked) {
    rightPlayerName.innerText = secondPlayerName.value;
  } else {
    rightPlayerName.innerText = bot.selectedOptions[0].innerText;
  }

  leftPlayerPoints.innerText = parseInt(gameMode.value);
  rightPlayerPoints.innerText = parseInt(gameMode.value);

  leftPlayerLegs.innerText = "Legs: 0";
  rightPlayerLegs.innerText = "Legs: 0";

  leftPlayerSets.innerText = "Sets: 0";
  rightPlayerSets.innerText = "Sets: 0";
}

function throwDart(e) {
  game.playerThrow(e);
}

function changeStats() {
  leftPlayerPoints.innerText = game.playerOne.points;
  rightPlayerPoints.innerText = game.playerTwo.points;

  leftPlayerLegs.innerText = "Legs: " + game.playerOne.legs;
  rightPlayerLegs.innerText = "Legs: " + game.playerTwo.legs;

  leftPlayerSets.innerText = "Sets: " + game.playerOne.sets;
  rightPlayerSets.innerText = "Sets: " + game.playerTwo.sets;
}

function changeDartsStats() {
  leftPlayerAverage.innerText = game.playerOne.getAverage() + " Avg.";
  leftPlayerFinish.innerText = game.playerOne.getFinishAverage() + " Finish %";
  leftPlayerDarts.innerText = "Dart: " + game.playerOne.totalDartsThrown;

  rightPlayerAverage.innerText = game.playerTwo.getAverage() + " Avg.";
  rightPlayerFinish.innerText = game.playerTwo.getFinishAverage() + " Finish %";
  rightPlayerDarts.innerText = "Dart: " + game.playerTwo.totalDartsThrown;
}

function changePlayerPointer() {
  if (game.playerTurn) {
    leftPlayer.classList.remove("playersTurn");
    rightPlayer.classList.add("playersTurn");
  } else {
    rightPlayer.classList.remove("playersTurn");
    leftPlayer.classList.add("playersTurn");
  }
}

function disableOptions() {
  bot.disabled = true;
  gameMode.disabled = true;
  legs.disabled = true;
  sets.disabled = true;
}

function enableOptions() {
  bot.disabled = false;
  gameMode.disabled = false;
  legs.disabled = false;
  sets.disabled = false;
}
