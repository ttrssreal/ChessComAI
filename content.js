const squarePositions = {
  "11": "a1",
  "12": "a2",
  "13": "a3",
  "14": "a4",
  "15": "a5",
  "16": "a6",
  "17": "a7",
  "18": "a8",
  "21": "b1",
  "22": "b2",
  "23": "b3",
  "24": "b4",
  "25": "b5",
  "26": "b6",
  "27": "b7",
  "28": "b8",
  "31": "c1",
  "32": "c2",
  "33": "c3",
  "34": "c4",
  "35": "c5",
  "36": "c6",
  "37": "c7",
  "38": "c8",
  "41": "d1",
  "42": "d2",
  "43": "d3",
  "44": "d4",
  "45": "d5",
  "46": "d6",
  "47": "d7",
  "48": "d8",
  "51": "e1",
  "52": "e2",
  "53": "e3",
  "54": "e4",
  "55": "e5",
  "56": "e6",
  "57": "e7",
  "58": "e8",
  "61": "f1",
  "62": "f2",
  "63": "f3",
  "64": "f4",
  "65": "f5",
  "66": "f6",
  "67": "f7",
  "68": "f8",
  "71": "g1",
  "72": "g2",
  "73": "g3",
  "74": "g4",
  "75": "g5",
  "76": "g6",
  "77": "g7",
  "78": "g8",
  "81": "h1",
  "82": "h2",
  "83": "h3",
  "84": "h4",
  "85": "h5",
  "86": "h6",
  "87": "h7",
  "88": "h8"
}

const pieceWeights = {
  "p": 100,
  "n": 280,
  "b": 320,
  "r": 479,
  "q": 929,
  "k": 60000,
}

function GenerateFEN() {
  let result = [];
  let pieceClasses = [];
  $(".piece").each((index, element) => {
    pieceClasses.push($(element).attr("class"));
  });

  for (let row = 8; row > 0; row--) {
    let whiteSpaceCounter = 0;

    for (let column = 1; column < 9; column++) {
      let pushed = false;

      for (let index = 0; index < pieceClasses.length; index++) {
        const element = pieceClasses[index];

        if (element.substr(16, 2) == column.toString() + row.toString()) {
          pushed = true;
          if (whiteSpaceCounter > 0) {
            result.push(whiteSpaceCounter.toString());
          }
          whiteSpaceCounter = 0;
          result.push(element.substr(6, 2));
        }
      }

      if (!pushed) {
        whiteSpaceCounter++;
      }
    }
  }
  return result;
}

function arr_diff(a1, a2) {
  var a = [],
    diff = [];

  for (var i = 0; i < a1.length; i++) {
    a[a1[i]] = true;
  }

  for (var i = 0; i < a2.length; i++) {
    if (a[a2[i]]) {
      delete a[a2[i]];
    } else {
      a[a2[i]] = true;
    }
  }

  for (var k in a) {
    diff.push(k);
  }

  return diff;
}

function arrayEquals(a, b) {
  return (
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index])
  );
}

function evalBoard(board, color) {
  var value = 0;
  board.forEach(function(row) {
    row.forEach(function(piece) {
      if (piece) {
        value += pieceWeights[piece['type']]
                 * (piece['color'] === color ? 1 : -1);
      }
    });
  });
  return value;
}

function calculateBestMove(board) {
    var newGameMoves = board.moves();
    var bestMove = null;

    var bestValue = -9999;

    for(var i = 0; i < newGameMoves.length; i++) {
        var newGameMove = newGameMoves[i];
        board.move(newGameMove);

        console.log(bestValue);

        //take the negative as AI plays as black
        var boardValue = evalBoard(board.board(), "w")
        board.undo();
        if(boardValue > bestValue) {
            bestValue = boardValue;
            bestMove = newGameMove
        }
    }

    return bestMove;
}

function getPieceValue(piece) {
    if (piece === null) {
        return 0;
    }
    var getAbsoluteValue = function (piece) {
        if (piece.type === 'p') {
            return 10;
        } else if (piece.type === 'r') {
            return 50;
        } else if (piece.type === 'n') {
            return 30;
        } else if (piece.type === 'b') {
            return 30 ;
        } else if (piece.type === 'q') {
            return 90;
        } else if (piece.type === 'k') {
            return 900;
        }
        throw "Unknown piece type: " + piece.type;
    };

    var absoluteValue = getAbsoluteValue(piece, piece.color === 'w');
    return piece.color === 'w' ? absoluteValue : -absoluteValue;
}

function minimax(depth, game, isMaximisingPlayer) {
    positionCount++;
    if (depth === 0) {
        return -evalBoard(game.board());
    }

    var newGameMoves = game.moves();

    if (isMaximisingPlayer) {
        var bestMove = -9999;
        for (var i = 0; i < newGameMoves.length; i++) {
            game.move(newGameMoves[i]);
            bestMove = Math.max(bestMove, minimax(depth - 1, game, !isMaximisingPlayer));
            game.undo();
        }
        return bestMove;
    } else {
        var bestMove = 9999;
        for (var i = 0; i < newGameMoves.length; i++) {
            game.move(newGameMoves[i]);
            bestMove = Math.min(bestMove, minimax(depth - 1, game, !isMaximisingPlayer));
            game.undo();
        }
        return bestMove;
    }
}

function minimaxRoot(depth, game, isMaximisingPlayer) {

    var newGameMoves = game.moves();
    var bestMove = -9999;
    var bestMoveFound;
    positionCount = 0;

    for(var i = 0; i < newGameMoves.length; i++) {
        var newGameMove = newGameMoves[i];
        game.move(newGameMove);
        var value = minimax(depth - 1, game, !isMaximisingPlayer);
        game.undo();
        if(value >= bestMove) {
            bestMove = value;
            bestMoveFound = newGameMove;
        }
    }
    return bestMoveFound;
};

const chess = new Chess();

$(".piece").html("YES");

// console.log($(".player-row-component").html())

$(".player-row-component.player-component").html($(".player-row-component.player-component").html() + `
<div class="player-row-container">
   <div class="player-row-wrapper">
    <img alt="" src="`+chrome.runtime.getURL("icon.jpeg")+`" srcset="https:////betacssjs.chesscomfiles.com/bundles/web/images/user-image.007dad08.svg, https:////betacssjs.chesscomfiles.com/bundles/web/images/user-image.007dad08.svg 2x" class="avatar-component player-row-avatar" image="https:////betacssjs.chesscomfiles.com/bundles/web/images/user-image.007dad08.svg" style="height: 40px; left: 0px; width: 40px;">
    <div>
     <div class="player-row-username">
      <div class="user-tagline-component player-row-username">
       <!----> 
       <span class="user-username-component user-username-lightgray user-tagline-username boiiiii">Move: </span> 
       <!----> 
      </div>
     </div> 
    </div>
   </div>
  </div>
`);

let button = `
<div class="move-feedback-component feedback-wrapper-component">
<script>
function resetBoard() {
  var evt = document.createEvent('Event');
  evt.initEvent('resetBoard', true, false);
  document.dispatchEvent(evt);
}
</script> 
<button onclick="resetBoard()">Clear AI Memory</button>
</div>
`
$(".feedback.layout-feedback").html($(".feedback.layout-feedback").html() + button);

$(".move-feedback-component.feedback-wrapper-component").css({"height": "52px"})

/*
<div class="player-row-container"><div class="player-row-wrapper"><img alt="" class="avatar-component player-row-avatar" image="https://images.chesscomfiles.com/uploads/v1/user/66746160.794c1e49.200x200o.dbe7eab8b66c.png" style="height: 40px; left: 0px; width: 40px;"> <div><div class="player-row-username"><div class="user-tagline-component player-row-username"><!----> <span class="user-username-component user-username-lightgray user-tagline-username">Qxe8
</span>   <!----> </div></div> </div></div></div>
*/

var currentPieces = [];
$(".piece").each((index, element) => {
  currentPieces.push($(element).attr("class"));
});

var timeInterval = 1;

function updateMove() {
  var positionCount;
  var bestMove = minimaxRoot(2, chess, true);
  $(".user-username-component.user-username-lightgray.user-tagline-username.boiiiii").html("Move: " + bestMove);
}

document.addEventListener('resetBoard', function() {
  console.log("boardReset");
  chess.reset();
});
       
      /* .move({ from: 'h7', <- where the 'move' is a move object (additional
       *         to :'h8',      fields are ignored)
       *         promotion: 'q',
       *      })
       */

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "clicked_browser_action") {
    updateMove();
    
  }
});

setInterval(() => {
  newPieces = [];
  $(".piece").each((index, element) => {
    newPieces.push($(element).attr("class"));
  });

  if (!arrayEquals(currentPieces, newPieces)) {
    let difference = arr_diff(currentPieces, newPieces);
    let containsDragging = false;
    let blackPiece = false;

    // console.log(difference);

    if (typeof difference[1] != 'undefined') {
      if (/b/.test(difference[0]) || /b/.test(difference[1])) {
        blackPiece = true;
      } else {
        blackPiece = false;
      }
      if (difference[1].search("dragging") == -1) {
        // difference[0] = difference[0].slice(0, 18);
        console.log(difference);
        if (!(difference[0] == difference[1])) {
          difference = [difference[0], difference[1]];
          
          let doubleDigitsRegexp = /\d\d/;

          let move = [squarePositions[difference[0].match(doubleDigitsRegexp)[0]], squarePositions[difference[1].match(doubleDigitsRegexp)[0]]]
          
          chess.move({
            from: move[0],
            to: move[1]
          });

          console.log(move)

          console.log(chess.ascii());

          if (blackPiece) {
            updateMove();
          }
        }
      }
    }
    currentPieces = newPieces;
  }
}, timeInterval);


