$(function() {
  var MAX_Y = 20;
  var MAX_X = 10;
  var CLEARED_FIGURE = {
    x: 4,
    y: 0,
    figure: null
  };
  var FIGURES = [
    [
      [1, 0],
      [1, 1],
      [0, 1]
    ],
    [
      [0, 1],
      [1, 1],
      [1, 0]
    ],
    [
      [1, 1],
      [1, 1]
    ],
    [
      [1],
      [1],
      [1],
      [1]
    ],
    [
      [0, 1, 0],
      [1, 1, 1]
    ],
    [
      [1, 0, 0],
      [1, 1, 1]
    ],
    [
      [0, 0, 1],
      [1, 1, 1]
    ]
  ];
  var wall = [];
  var $wall = $('#wall');
  var currentFigure = _.extend({}, CLEARED_FIGURE);

  function buildWall(wall, $wall) {
    for(var y = 0; y < MAX_Y; y++) {
      wall.push([]);
      for(var x = 0; x < MAX_X; x++) {
        wall[y].push(false);
        $('<div/>').attr({
          'class': 'brick',
          'id': 'id-' + x + '-' + y,
          'title': x + '-' + y
        }).appendTo($wall);
      }
    }
  }

  function addFigure(figureObj) {
    var newFigure = FIGURES[Math.round(Math.random() * (FIGURES.length - 1))];
    if(isEnoughFreeSpace(figureObj, newFigure, wall)) {
      figureObj.figure = newFigure;
      return true;
    } else {
      return false;
    }
  }

  function moveDown(figureObj) {
    if(isEnoughFreeSpace({
        x: figureObj.x,
        y: figureObj.y + 1
      }, figureObj.figure, wall)) {
      figureObj.y++;
    }
  }

  function moveLeft(figureObj) {
    if(isEnoughFreeSpace({
        x: figureObj.x - 1,
        y: figureObj.y
      }, figureObj.figure, wall)) {
      figureObj.x--;
    }
  }

  function moveRight(figureObj) {
    if(isEnoughFreeSpace({
        x: figureObj.x + 1,
        y: figureObj.y
      }, figureObj.figure, wall)) {
      figureObj.x++;
    }
  }

  function rotate(figureObj) {
    var rotatedFigure = [];

    for(var y = 0; y < figureObj.figure.length; y++) {
      for(var x = 0; x < figureObj.figure[y].length; x++) {
        rotatedFigure[x] = rotatedFigure[x] || [];
        rotatedFigure[x].push(figureObj.figure[figureObj.figure.length - y - 1][x]);
      }
    }
    figureObj.figure = rotatedFigure;
  }

  function isEnoughFreeSpace(offset, figure, wall) {
    for(var y = offset.y; y < offset.y + figure.length; y++) {
      for(var x = offset.x; x < offset.x + figure[y - offset.y].length; x++) {
        if(x < 0 || x >= MAX_X || y >= MAX_Y || (wall[y][x] && figure[y - offset.y][x - offset.x])) {
          return false;
        }
      }
    }
    return true;
  }

  function getWallWithFallingFigure(figureObj, wall) {
    var wallForRender = _.cloneDeep(wall);

    for(var y = 0; y < figureObj.figure.length; y++) {
      for(var x = 0; x < figureObj.figure[y].length; x++) {
        wallForRender[y + figureObj.y][x + figureObj.x] = !!figureObj.figure[y][x] || wall[y + figureObj.y][x + figureObj.x];
      }
    }
    return wallForRender;
  }

  function renderBricks(bricksArray) {
    for(var y = 0; y < MAX_Y; y++) {
      for(var x = 0; x < MAX_X; x++) {
        $('#id-' + x + '-' + y).toggleClass('fill', bricksArray[y][x]);
      }
    }
  }

  function clearLine(wall, lineNumber) {
    for(var x = 0; x < MAX_X; x++) {
      wall[lineNumber][x] = false;
    }
    for(var y = lineNumber - 1; y >= 0; y--) {
      for(x = 0; x < MAX_X; x++) {
        wall[y + 1][x] = wall[y][x];
      }
    }
  }

  function clearLines(wall) {
    for(var y = 0; y < MAX_Y; y++) {
      for(var x = 0; x < MAX_X; x++) {
        if(!wall[y][x]) {
          break;
        }
        if(x == MAX_X - 1) {
          clearLine(wall, y);
        }
      }
    }
  }

  function stopIteration() {
    wall = getWallWithFallingFigure(currentFigure, wall);
    _.extend(currentFigure, CLEARED_FIGURE);
  }

  function startIteration() {
    if(addFigure(currentFigure)) {
      renderBricks(getWallWithFallingFigure(currentFigure, wall));
      var fallingTimer = setInterval(function() {
        if(isEnoughFreeSpace({
            x: currentFigure.x,
            y: currentFigure.y + 1
          }, currentFigure.figure, wall)) {
          moveDown(currentFigure);
          renderBricks(getWallWithFallingFigure(currentFigure, wall));
        } else {
          clearInterval(fallingTimer);
          stopIteration();
          clearLines(wall);
          startIteration();
        }
      }, 500);
    } else {
      alert('You lost!');
    }
  }

  function addKeyListebers() {
    $(document).on('keydown', function(e) {
      switch(e.which) {
        case 37:
          moveLeft(currentFigure);
          break;
        case 38:
          rotate(currentFigure);
          break;
        case 39:
          moveRight(currentFigure);
          break;
        case 40:
          moveDown(currentFigure);
          break;
      }
      renderBricks(getWallWithFallingFigure(currentFigure, wall));
    });
  }

  function init() {
    buildWall(wall, $wall);
    startIteration();
    addKeyListebers();
  }

  init();
});