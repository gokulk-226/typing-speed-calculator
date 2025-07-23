import React, { useState, useEffect } from "react";
import { generate } from "random-words";
import "./style.css";

function App() {
  const [sentence, setSentence] = useState("");
  const [typed, setTyped] = useState("");
  const [wpm, setWPM] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [duration, setDuration] = useState(0); // New state to store time taken
  const [startTime, setStartTime] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const [testStarted, setTestStarted] = useState(false);

  useEffect(() => {
    generateSentence();
  }, []);

  const generateSentence = () => {
    const words = generate({ exactly: 20, join: " " });
    setSentence(words);
    setTyped("");
    setWPM(0);
    setAccuracy(0);
    setDuration(0);
    setShowStats(false);
    setTestStarted(false);
    setStartTime(null);
  };

  const handleStart = () => {
    setTestStarted(true);
    setStartTime(Date.now());
  };

  const handleChange = (e) => {
    const input = e.target.value;
    setTyped(input);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      calculateStats();
      setShowStats(true);
    }
  };

  const calculateStats = () => {
    const elapsedTime = (Date.now() - startTime) / 1000; // in seconds
    setDuration(elapsedTime.toFixed(2)); // save as string with 2 decimals

    const wordCount = typed.trim().split(" ").length;
    setWPM(Math.round((wordCount / elapsedTime) * 60));

    const originalWords = sentence.trim().split(" ");
    const typedWords = typed.trim().split(" ");
    let correct = 0;
    originalWords.forEach((word, i) => {
      if (typedWords[i] === word) correct++;
    });
    setAccuracy(Math.round((correct / originalWords.length) * 100));
  };

  const renderSentenceWithFeedback = () => {
    const originalWords = sentence.trim().split(" ");
    const typedWords = typed.trim().split(" ");
    return originalWords.map((word, i) => {
      let className = "word-span";
      if (showStats) {
        className += typedWords[i] === word ? " correct" : " incorrect";
      }
      return (
        <span key={i} className={className}>
          {word}
        </span>
      );
    });
  };

  return (
    <div className="app-container">
      <h1>Typing Speed Test</h1>
      {testStarted ? (
        <>
          <div className="sentence-wrapper">
            <div className="sentence">{renderSentenceWithFeedback()}</div>
          </div>
          <textarea
            placeholder="Start typing here..."
            value={typed}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={showStats}
          />
        </>
      ) : (
        <button onClick={handleStart}>Start Test</button>
      )}

      {showStats && (
        <div className="stats">
          <p><strong>Time Taken:</strong> {duration} seconds</p>
          <p><strong>WPM:</strong> {wpm}</p>
          <p><strong>Accuracy:</strong> {accuracy}%</p>
          <button onClick={generateSentence}>Try Again</button>
        </div>
      )}
    </div>
  );
}

export default App;
