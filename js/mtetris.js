var Tetris = {
  config: {
    wallID: "wall",
    freeBrick: "<div></div>",
    filledBrick: "<i></i>"
  },

  pitch: {
    X:10,
    Y:20,
    bricks: []
  }
};


for (var i = 0; i < Tetris.pitch.X; i++) {
  Tetris.pitch.bricks[i] = [];
  for (var j = 0; j < Tetris.pitch.Y; j++) {
    Tetris.pitch.bricks[i][j] = 0;
  }
}


var tetrisDom = document.getElementById(Tetris.config.wallID);


tetrisDom.innerHTML = '';

for (var i = 0; i < Tetris.pitch.bricks.length; i++) {
  for (var j = 0; j < Tetris.pitch.bricks[i].length; j++) {

    tetrisDom.innerHTML += Tetris.pitch.bricks[i][j]
                         ? Tetris.config.brickFilled
                         : Tetris.config.freeBrick;

  }
}