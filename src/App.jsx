

import { useEffect, useState, useRef } from "react";
import "./App.css";

const blocks = 9;
function App() {
  const blockElements = [];
  const [req, setReq] = useState(null);
  const [success, setsuccess] = useState(null)
  const[fail,setfail]=useState(null)
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); 
  const [gameOver, setGameOver] = useState(true); 
  const timerRef = useRef(null); 

  // Generate grid blocks
  for (let i = 1; i <= blocks; i++) {
    blockElements.push(
      <div
        key={i}
        className={`block ${req === i ? "blue" : ""} ${success===i?"green":""} ${fail===i?"red":""} `}
        onClick={() => handleBlock(i)}
      ></div>
    );
  }

  // Handle block click
  const handleBlock = (i) => {
    if (gameOver) return;
    if (req === i) {
      setsuccess(i)
      setScore((prev) => prev + 5); // +5 for correct click
    } else {
      setfail(i)
      setScore((prev) => prev - 2.5); // -2.5 for incorrect click
    }
  };

 
  const handleClick = () => {
    setScore(0);
    setTimeLeft(60);
    setGameOver(false);
    setsuccess(null)
    setfail(null)
    timerRef.current = setInterval(() => {
      const random = Math.floor(Math.random() * blocks) + 1;
      setReq(random);
      setsuccess(null)
      setfail(null)
    }, 2000);

    const countdown = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          clearInterval(countdown);
          setGameOver(true);
          updateHighScore(score);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

 
  const updateHighScore = (currentScore) => {
    const highScore = parseFloat(localStorage.getItem("blickclick")) || 0;
    if (currentScore > highScore) {
      localStorage.setItem("blickclick", currentScore);
    }
  };

  useEffect(() => {
    return () => clearInterval(timerRef.current); 
  }, []);

  return (
    <>
      <div className="center-container">
        <div>
      <div>Score: {score}</div>
      <div>High Score: {localStorage.getItem("blickclick") || 0}</div>
      <div>Time Left: {timeLeft}s</div>
      <div className="blockcontainer">{blockElements}</div>
      <button onClick={handleClick} disabled={!gameOver}>
        {gameOver ? "Start" : "Running..."}
      </button>
          {gameOver && <div>Final Score: {score}</div>}
          </div>
        </div>
    </>
  );
}

export default App;
