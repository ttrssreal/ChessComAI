squarePositions = {
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

pieceWeights = {
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

const chess = new Chess();

$(".piece").html("YES");

var currentPieces = [];
$(".piece").each((index, element) => {
  currentPieces.push($(element).attr("class"));
});

var timeInterval = 1;

       
      /* .move({ from: 'h7', <- where the 'move' is a move object (additional
       *         to :'h8',      fields are ignored)
       *         promotion: 'q',
       *      })
       */

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "clicked_browser_action") {
    var bestMove = calculateBestMove(chess);
    console.log(bestMove);
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

    // console.log(difference);

    if (typeof difference[1] != 'undefined') {
      if (difference[1].search("dragging") == -1) {
      difference[0] = difference[0].slice(0, 18);
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
      }
    }
    }
    currentPieces = newPieces;
  }
}, timeInterval);


