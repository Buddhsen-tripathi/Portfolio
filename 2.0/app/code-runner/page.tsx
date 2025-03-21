'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ViewCounter from '@/components/ViewCounter';

const GAME_WIDTH = 400;
const GAME_HEIGHT = 600;

interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
}

interface Bug {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  dodged?: boolean;
}

interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
}

export default function CodeRunner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [name, setName] = useState('');
  const [inputName, setInputName] = useState('');
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const scoreRef = useRef(0);

  useEffect(() => {
    const savedName = localStorage.getItem('codeRunnerName');
    if (savedName) setName(savedName);

    const savedHighScore = localStorage.getItem('codeRunnerHighScore');
    if (savedHighScore) setHighScore(parseInt(savedHighScore));
  }, []);

  useEffect(() => {
    if (!name) return;
    startGame();
    fetchLeaderboard();
  }, [name]);

  const startGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let bugTimer: NodeJS.Timeout;
    let gameActive = true;
    let lastScoreTime = Date.now();

    const player: Player = {
      x: GAME_WIDTH / 2 - 20,
      y: GAME_HEIGHT - 60,
      width: 40,
      height: 40,
      speed: 5,
    };
    let bugs: Bug[] = [];
    const keys: { [key: string]: boolean } = {};

    window.addEventListener('keydown', (e) => (keys[e.key] = true));
    window.addEventListener('keyup', (e) => (keys[e.key] = false));

    const gameLoop = () => {
      if (!gameActive) return;

      ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

      ctx.font = '40px Arial';
      ctx.fillText('👨‍💻', player.x, player.y);

      if (keys['ArrowLeft'] && player.x > 0) player.x -= player.speed;
      if (keys['ArrowRight'] && player.x < GAME_WIDTH - player.width) player.x += player.speed;

      bugs.forEach((bug, index) => {
        bug.y += bug.speed;
        ctx.fillText('🐞', bug.x, bug.y);

        if (
          player.x < bug.x + bug.width &&
          player.x + player.width > bug.x &&
          player.y < bug.y + bug.height &&
          player.y + player.height > bug.y
        ) {
          gameActive = false;
          cancelAnimationFrame(animationFrameId);
          clearInterval(bugTimer);
          console.log('Collision detected, score before end:', scoreRef.current);
          setGameOver(true);
          if (scoreRef.current > highScore) {
            setHighScore(scoreRef.current);
            localStorage.setItem('codeRunnerHighScore', scoreRef.current.toString());
          }
          setScore(scoreRef.current);
          console.log('Game over, sending score:', scoreRef.current);
          storeScore(name, scoreRef.current);
          return;
        }

        if (bug.y > player.y && !bug.dodged) {
          bug.dodged = true;
          scoreRef.current += 5;
          setScore(scoreRef.current);
          console.log('Bug dodged, score +5, now:', scoreRef.current);
        }

        if (bug.y > GAME_HEIGHT) {
          bugs.splice(index, 1);
        }
      });

      const now = Date.now();
      if (now - lastScoreTime >= 1000) {
        scoreRef.current += 1;
        setScore(scoreRef.current);
        console.log('Time bonus, score +1, now:', scoreRef.current);
        lastScoreTime = now;
      }

      if (gameActive) {
        animationFrameId = requestAnimationFrame(gameLoop);
      }
    };

    const spawnBug = () => {
      if (!gameActive) return;
      const bug: Bug = {
        x: Math.random() * (GAME_WIDTH - 30),
        y: -30,
        width: 30,
        height: 30,
        speed: 2 + Math.random() * 2,
        dodged: false,
      };
      bugs.push(bug);
    };

    gameLoop();
    bugTimer = setInterval(spawnBug, 1500);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(bugTimer);
    };
  };

  const storeScore = async (name: string, score: number) => {
    try {
      console.log('Checking score before POST:', { name, score });
      if (score === 0) {
        console.log('Score is 0, skipping leaderboard entry');
        fetchLeaderboard(); 
        return;
      }

      console.log('POST /api/leaderboard:', { name, score });
      const response = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, score }),
      });

      const text = await response.text();
      if (!response.ok) {
        console.error('Store score failed:', { status: response.status, text });
        return;
      }

      console.log('Score stored:', text);
      fetchLeaderboard();
    } catch (err) {
      console.error('Store score network error:', err);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      console.log('GET /api/leaderboard');
      const response = await fetch('/api/leaderboard', { method: 'GET' });
      const text = await response.text();
      if (!response.ok) {
        throw new Error(`Fetch leaderboard failed: ${text || 'No body'} (Status: ${response.status})`);
      }
      const data = JSON.parse(text);
      console.log('Leaderboard data:', data);
      setLeaderboard(data);
    } catch (err) {
      console.error('Fetch leaderboard error:', err);
    }
  };

  const handleNameSubmit = () => {
    if (!inputName.trim()) return;
    localStorage.setItem('codeRunnerName', inputName.trim());
    setName(inputName.trim());
  };

  if (!name) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 pb-16">
        <h1 className="text-2xl font-bold">Code Runner - Enter Your Name</h1>
        <input
          type="text"
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
          className="border rounded px-4 py-2"
          placeholder="Your coder alias"
        />
        <button
          onClick={handleNameSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Start Coding
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4 space-y-4">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center text-sm text-gray-500 hover:text-blue-600">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Link>
        <div><ViewCounter slug='bug-dodge' readOnly={false}/></div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <h1 className="text-3xl font-bold">Code Runner</h1>
        <p className="text-sm text-gray-500">Welcome, {name}!</p>
        <div className="flex gap-4">
          <p>Score: {score}</p>
          <p>High Score: {highScore}</p>
        </div>
        <canvas
          ref={canvasRef}
          width={GAME_WIDTH}
          height={GAME_HEIGHT}
          className="border border-gray-300 rounded-lg"
        />
        {gameOver && (
          <div className="space-y-4">
            <p className="text-xl font-bold text-center">Game Over!</p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setGameOver(false);
                  setScore(0);
                  scoreRef.current = 0;
                  startGame();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Run Again
              </button>
            </div>
          </div>
        )}
        <div className="text-sm text-gray-500">
          Use left/right arrow keys to dodge bugs
        </div>

        <div className="w-full max-w-md mt-8">
          <h2 className="text-xl font-bold mb-2">🏆 Leaderboard (Top 10)</h2>
          <ul className="space-y-1 text-sm">
            {leaderboard.map((entry, index) => (
              <li key={entry.id} className="flex justify-between">
                <span>{index + 1}. {entry.name}</span>
                <span>{entry.score}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}