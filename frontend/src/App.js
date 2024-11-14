import React, { useState } from 'react';
import Board from './Board';
import './App.css';

function App() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [isDraw, setIsDraw] = useState(false);

  const current = history[stepNumber];

  const handleClick = (i) => {
    const historyUpToNow = history.slice(0, stepNumber + 1);
    const currentBoard = historyUpToNow[historyUpToNow.length - 1];
    const squares = [...currentBoard];

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = xIsNext ? 'X' : 'O';
    setHistory([...historyUpToNow, squares]);
    setStepNumber(historyUpToNow.length);
    setXIsNext(!xIsNext);

    const gameWinner = calculateWinner(squares);
    if (gameWinner) {
      setWinner(gameWinner);
    } else if (!squares.includes(null)) {
      setIsDraw(true);
    }
  };

  const jumpTo = (step) => {
    setStepNumber(step);
    setXIsNext(step % 2 === 0);
    setWinner(null);
    setIsDraw(false);
  };

  const status = winner
    ? 'Winner: ' + winner
    : isDraw
      ? 'It’s a Draw!'
      : 'Next player: ' + (xIsNext ? 'X' : 'O');

  return (
    <div className="game">
      <h1 className="game-title">Tic-Tac-Toe Game</h1>
      <div className="game-container">
        <div className="game-board">
          <Board squares={current} onClick={(i) => handleClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>
            {history.map((step, move) => (
              <li key={move}>
                <button className="jump-button" onClick={() => jumpTo(move)}>
                  {move ? `Go to move #${move}` : 'Go to game start'}
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Modal for game result */}
      {(winner || isDraw) && (
        <div className="modal">
          <div className="modal-content">
            {winner ? `Player ${winner} wins! 🎉` : "It's a draw! 🤝"}
            <button onClick={() => jumpTo(0)} className="modal-button">
              Restart Game
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default App;
