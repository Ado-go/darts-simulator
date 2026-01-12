class Game {
  constructor(dartBoard) {
    this.dartBoard = dartBoard;
    this.gameRunning = false;
    this.playerTurn = Math.random() < 0.5 ? true : false;
    this.startingPlayer = this.playerTurn;
    this.playerOne = null;
    this.playerTwo = null;
    this.playerPlaying = null;
    this.bot = true;
    this.botLevel = 0;
    this.legs = 0;
    this.sets = 0;
    this.totalPoints = 0;
    this.botsDificulty = [35, 40, 50, 55, 60, 75, 80, 90, 100, 105];
    this.botFinishChances = [
      0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55,
    ];
    this.botThrwoChances = {
      0: [1, 1, 2, 2, 3, 3, 5, 5, 10, 10, 15, 20, 40, 60],
      1: [1, 2, 2, 3, 3, 5, 5, 10, 10, 15, 15, 20, 40, 60],
      2: [1, 2, 3, 3, 5, 5, 10, 10, 15, 15, 20, 20, 40, 60],
      3: [1, 2, 3, 5, 5, 10, 10, 15, 15, 20, 20, 40, 40, 60],
      4: [1, 2, 3, 5, 10, 10, 15, 15, 20, 20, 40, 40, 60, 60],
      5: [1, 2, 3, 5, 10, 15, 15, 20, 20, 40, 40, 60, 60],
      6: [1, 2, 3, 5, 10, 15, 20, 20, 40, 40, 60, 60],
      7: [1, 2, 3, 5, 10, 15, 20, 20, 20, 40, 40, 40, 60, 60, 60],
      8: [1, 2, 3, 5, 10, 15, 20, 40, 40, 40, 60, 60, 60],
      9: [1, 2, 3, 5, 10, 15, 20, 40, 60, 60, 60, 60],
    };
  }

  setPlayingPlayer() {
    this.playerPlaying = this.playerTurn ? this.playerOne : this.playerTwo;
  }

  newLeg(player) {
    if (player.legs == this.legs) {
      player.sets++;
      this.playerOne.legs = 0;
      this.playerTwo.legs = 0;
    }

    if (player.sets == this.sets) {
      alert(player.name + " Winner");
      onOffGame();
      return;
    }

    this.playerOne.points = this.totalPoints;
    this.playerTwo.points = this.totalPoints;

    this.playerOne.pointsTurnStart = this.totalPoints;
    this.playerTwo.pointsTurnStart = this.totalPoints;

    changeStats();
    if (this.playerTurn == this.startingPlayer) {
      changePlayerPointer();
    }

    this.startingPlayer = !this.startingPlayer;
    this.playerTurn = this.startingPlayer;
    this.setPlayingPlayer();

    this.playerOne.totalDartsThrown = 0;
    this.playerTwo.totalDartsThrown = 0;

    if (!this.playerTurn && this.playerPlaying.bot) {
      setTimeout(() => {
        this.botTurn();
      }, 500);
    }
  }

  playerThrow(e) {
    if (!this.gameRunning || this.playerPlaying.bot) {
      return;
    }

    let throwSum = 0;

    this.playerPlaying.totalDartsThrown++;

    const rect = canvas.getBoundingClientRect();
    const canvasWidth = rect.width;
    const canvasHeight = rect.height;
    const scale = canvasWidth / 600;

    let x = e.clientX - rect.left - canvasWidth / 2;
    let y = canvasHeight / 2 - (e.clientY - rect.top);

    x = x / scale;
    y = y / scale;

    let newThrow = 0;
    if (Math.sqrt(x ** 2 + y ** 2) <= 280) {
      newThrow = this.dartBoard.boardHit(x, y);
    }

    if (this.playerPlaying.points % 2 == 0 && this.playerPlaying.points <= 50) {
      this.playerPlaying.finishDarts++;
    }

    this.playerPlaying.turnThrow.push(newThrow);
    this.playerPlaying.points -= newThrow;

    if (this.playerPlaying.points == 0) {
      if (this.dartBoard.isDouble(x, y)) {
        this.playerPlaying.finishSuccess++;
        this.playerPlaying.legs++;

        for (let i = 0; i < this.playerPlaying.turnThrow.length; i++) {
          throwSum += this.playerPlaying.turnThrow[i];
        }

        this.playerPlaying.throws.push(throwSum);
        this.playerPlaying.turnThrow = [];
        this.newLeg(this.playerPlaying);
      } else {
        this.playerPlaying.pointsReset();
        for (let i = 0; i < this.playerPlaying.turnThrow.length; i++) {
          this.playerPlaying.turnThrow[i] = 0;
        }
        this.endPlayerTurn();
      }
      changeStats();
      changeDartsStats();
    } else {
      if (this.playerPlaying.points <= 1) {
        this.playerPlaying.pointsReset();
        for (let i = 0; i < this.playerPlaying.turnThrow.length; i++) {
          this.playerPlaying.turnThrow[i] = 0;
        }
        this.endPlayerTurn();
      }

      if (this.playerPlaying.turnThrow.length == 3) {
        this.endPlayerTurn();
      }

      changeStats();
      changeDartsStats();
    }
  }

  endPlayerTurn() {
    let throwSum = 0;
    for (let i = 0; i < this.playerPlaying.turnThrow.length; i++) {
      throwSum += this.playerPlaying.turnThrow[i];
    }
    this.playerPlaying.throws.push(throwSum);
    this.playerPlaying.turnThrow = [];
    this.playerPlaying.pointsTurnStart = this.playerPlaying.points;
    changePlayerPointer();
    this.changePlayer();
    if (this.bot) {
      setTimeout(() => {
        this.botTurn();
      }, 500);
    }
  }

  start(playerName, secondPlayerName, botName, botLevel, legs, sets, points) {
    this.gameRunning = true;
    this.playerOne = new Player(playerName, points, 0, 0, false);
    this.playerTwo = this.bot
      ? new Player(botName, points, 0, 0, true)
      : new Player(secondPlayerName, points, 0, 0, false);
    this.botLevel = this.bot ? botLevel : 0;
    this.legs = legs;
    this.sets = sets;
    this.totalPoints = points;

    if (!this.playerTurn && this.bot) {
      this.botTurn();
    }
  }

  botTurn() {
    let newThrow = 0;
    let unFinishable = {
      169: true,
      168: true,
      166: true,
      165: true,
      163: true,
      162: true,
      159: true,
    };
    if (
      this.playerTwo.getPoints() > 170 ||
      unFinishable[this.playerTwo.getPoints()]
    ) {
      for (let i = 0; i < 3; i++) {
        newThrow += this.botThrow();
      }
      this.playerTwo.points = this.playerTwo.points - newThrow;
      this.playerTwo.pointsTurnStart = this.playerTwo.points;

      setTimeout(() => {
        changeStats();
        changePlayerPointer();
        this.changePlayer();
      }, 500);
    } else {
      if (Math.random() < this.botFinishChances[this.botLevel]) {
        this.playerTwo.legs++;
        this.newLeg(this.playerTwo);
      } else {
        if (this.playerTwo.points > 4) {
          this.playerTwo.points = Math.floor(this.playerTwo.points / 2);
        }
        setTimeout(() => {
          changeStats();
          changePlayerPointer();
          this.changePlayer();
        }, 500);
      }
    }
  }

  end() {
    this.gameRunning = false;
  }

  reset() {
    this.gameRunning = false;
    this.playerTurn = Math.random() < 0.5 ? true : false;
    this.playerOne = "";
    this.playerTwo = "";
    this.bot = bot;
    this.legs = 0;
    this.sets = 0;
    this.totalPoints = 0;
  }

  botThrow() {
    return this.botThrwoChances[this.botLevel][
      Math.floor(Math.random() * this.botThrwoChances[this.botLevel].length)
    ];
  }

  changePlayer() {
    this.playerTurn = !this.playerTurn;
    this.setPlayingPlayer();
  }

  isRunning() {
    return this.gameRunning;
  }

  setPlayerOne(player) {
    this.playerOne = player;
  }

  setPlayerTwo(player) {
    this.playerTwo = player;
  }

  turnOffBot() {
    this.bot = false;
  }
}
