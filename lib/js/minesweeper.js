(function() {
  "use strict";

  if (typeof window.Minesweeper === 'undefined') {
    window.Minesweeper = {};
  }

  var Tile = window.Minesweeper.Tile = function(board, position) {
    this.board = board;
    this.position = position;
    this.bombed = false;
    this.flagged = false;
    this.explored = false;
  };

  Tile.DELTAS = [[-1, -1], [-1,  0], [-1,  1], [ 0, -1],
                 [ 0,  1], [ 1, -1], [ 1,  0], [ 1,  1]];

  Tile.prototype.plantBomb = function() {
    this.bombed = true;
  };

  Tile.prototype.explore = function() {
    this.explored = true;

    if (this.bombed){
      return;
    }

    if (this.adjacentBombCount() === "") {
      this.neighbors().forEach(function(neighbor) {
        if (!neighbor.explored) {
          neighbor.explore();
        }
      });
    }
  };

  Tile.prototype.toggleFlag = function() {
    if (this.flagged) {
      this.flagged = false;
    } else {
      this.flagged = true;
    }
  };

  Tile.prototype.neighbors = function() {
    var neighbors = [];

    Tile.DELTAS.forEach(function(delta) {
      var row = this.position[0] + delta[0];
      var col = this.position[1] + delta[1];

      var maxRow = this.board.gridSize[0];
      var maxCol = this.board.gridSize[1];

      if ((row >= 0 && row < maxRow) && (col >= 0 && col < maxCol)) {
        neighbors.push([row, col]);
      }
    }.bind(this));

    neighbors = neighbors.map(function(neighbor) {
      return this.board.grid[neighbor[0]][neighbor[1]];
    }.bind(this));

    return neighbors;
  };

  Tile.prototype.adjacentBombCount = function() {
    var bombCount = 0;
    var neighbors = this.neighbors();

    neighbors.forEach(function(neighbor) {
      if (neighbor.bombed) {
        bombCount += 1;
      }
    });

    if (bombCount === 0) {
      bombCount = "";
    }
    return bombCount;
  };

  var Board = window.Minesweeper.Board = function (gridSize, numBombs) {
    this.gridSize = gridSize;
    this.numBombs = numBombs;
    this.grid = [];

    this.generateBoard();
    this.generateBombs();
  };

  Board.prototype.generateBoard = function() {
    for (var i = 0; i < this.gridSize[0]; i++) {
      this.grid.push([]);
      for (var j = 0; j < this.gridSize[1]; j++) {
        var tile = new Tile(this, [i, j]);
        this.grid[i].push(tile);
      }
    }
  };

  Board.prototype.generateBombs = function() {
    for (var i = 0; i < this.numBombs; i++) {
      var row = Math.floor(Math.random() * (this.gridSize[0] - 1));
      var col = Math.floor(Math.random() * (this.gridSize[1] - 1));

      this.grid[row][col].plantBomb();
    }
  };

  Board.prototype.lose = function(){
    var lost = false;
    this.grid.forEach(function(row) {
      row.forEach(function(tile) {
        if (tile.bombed && tile.explored) {
          lost = true;
        }
      });
    });
    return lost;
  };

  Board.prototype.win = function() {
    var won = true;
    this.grid.forEach(function(row) {
      row.forEach(function(tile) {
        if (tile.bombed === tile.explored) {
          won = false;
        }
      });
    });
    return won;
  };
})();
