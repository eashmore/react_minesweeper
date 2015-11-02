var Tile = React.createClass({
  handleClick: function(event) {
    var flag = event.altKey ? true : false;
    this.props.updateGame(this.props.pos, flag);
  },

  render: function() {
    var tile = this.props.tile;
    var content = "";
    var klass = "";

    if (tile.flagged) {
      klass = "flagged";
      content = "\u2691";
    } else if (tile.bombed) {
      klass = "bombed";
      content = "\u2622";
    } else if (tile.explored){
      klass = "explored";
      content = tile.adjacentBombCount();
    }
    klass = "tile " + klass;
    return (
      <div className={klass} onClick={this.handleClick}>{content}</div>
    );
  }
});

var Board = React.createClass({
  render: function() {
    var board = this.props.board.grid;
    var that = this;

    return (
      <div>
        {
          board.map(function(row, i) {
            return <div key={i} className="row">
              {
                row.map(function(tile, j) {
                  return <Tile
                    tile={tile}
                    pos={[i, j]}
                    updateGame={that.props.updateGame}
                  />;
                })
              }
             </div>;
          })
        }
      </div>
    );
  }
});

var Game = React.createClass({
  getInitialState: function () {
    var board = new window.Minesweeper.Board([9, 9], 10);
    return { board: board, win: false, lose: false };
  },

  updateGame: function(pos, isFlag) {
    if (isFlag) {
      this.state.board.grid[pos[0]][pos[1]].toggleFlag();
    } else {
      this.state.board.grid[pos[0]][pos[1]].explore();
    }

    var won = this.state.board.win();
    var lose = this.state.board.lose();

    this.setState({ win: won, lose: lose });
  },

  render: function() {
    var gameOver;

    if (this.state.won) {
      gameOver = "You Won!";
    } else if (this.state.lose) {
      gameOver = "You Lose!";
    }

    return (
      <div>
        {gameOver}
        <Board board={ this.state.board } updateGame={ this.updateGame }/>
      </div>
    );
  }
});

React.render(
  <Game/>,
  document.getElementById("game")
);
