'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ViewCounter from '@/components/ViewCounter';

const GAME_WIDTH = 375;
const GAME_HEIGHT = 580;

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
  type: string;
  dodged?: boolean;
}

interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
}

export default function CodeRunner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState('');
  const [inputName, setInputName] = useState('');
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const scoreRef = useRef(0);
  const timeAlive = useRef(0);
  const touchX = useRef<number | null>(null);

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
    let bossTimer: NodeJS.Timeout;
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

    // Keyboard controls
    window.addEventListener('keydown', (e) => (keys[e.key] = true));
    window.addEventListener('keyup', (e) => (keys[e.key] = false));

    // Touch controls
    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      touchX.current = e.touches[0].clientX - canvas.getBoundingClientRect().left;
    });
    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      touchX.current = e.touches[0].clientX - canvas.getBoundingClientRect().left;
    });
    canvas.addEventListener('touchend', () => {
      touchX.current = null;
    });

    const getBugType = (): Bug => {
      const rand = Math.random();
      if (rand < 0.4) {
        return { type: 'basic', speed: 2 + timeAlive.current * 0.02, width: 30, height: 30 } as Bug;
      } else if (rand < 0.6) {
        return { type: 'fast', speed: 4 + timeAlive.current * 0.03, width: 25, height: 25 } as Bug;
      } else if (rand < 0.75) {
        return { type: 'tank', speed: 1.5 + timeAlive.current * 0.015, width: 40, height: 40 } as Bug;
      } else if (rand < 0.9) {
        return { type: 'spider', speed: 2.5 + timeAlive.current * 0.02, width: 30, height: 30 } as Bug;
      } else {
        return { type: 'kamikaze', speed: 6 + timeAlive.current * 0.04, width: 20, height: 20 } as Bug;
      }
    };

    const gameLoop = () => {
      if (!gameActive) return;

      ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
      ctx.font = '40px Arial';
      ctx.fillText('👨‍💻', player.x, player.y);

      // Handle keyboard movement
      if (keys['ArrowLeft'] && player.x > 0) player.x -= player.speed;
      if (keys['ArrowRight'] && player.x < GAME_WIDTH - player.width) player.x += player.speed;

      // Handle touch movement
      if (touchX.current !== null) {
        const targetX = touchX.current - player.width / 2;
        if (targetX > 0 && targetX < GAME_WIDTH - player.width) {
          player.x += (targetX - player.x) * 0.2; // Smooth movement
        }
      }

      bugs.forEach((bug, index) => {
        bug.y += bug.speed;
        const emoji = bug.type === 'basic' ? '💾'      // basic bug - floppy disk, old tech vibes
          : bug.type === 'fast' ? '⚙️'      // fast bug - gears, moving parts
            : bug.type === 'tank' ? '🖥️'     // tank bug - heavy computer/server
              : bug.type === 'spider' ? '🧬'
                : '❓';
        ctx.fillText(emoji, bug.x, bug.y);

        if (
          player.x < bug.x + bug.width &&
          player.x + player.width > bug.x &&
          player.y < bug.y + bug.height &&
          player.y + player.height > bug.y
        ) {
          gameActive = false;
          cancelAnimationFrame(animationFrameId);
          clearInterval(bugTimer);
          clearInterval(bossTimer);
          setGameOver(true);
          if (scoreRef.current > highScore) {
            setHighScore(scoreRef.current);
            localStorage.setItem('codeRunnerHighScore', scoreRef.current.toString());
          }
          setScore(scoreRef.current);
          storeScore(name, scoreRef.current);
          return;
        }

        if (bug.y > player.y && !bug.dodged) {
          bug.dodged = true;
          scoreRef.current += 5;
          setScore(scoreRef.current);
        }

        if (bug.y > GAME_HEIGHT) {
          bugs.splice(index, 1);
        }
      });

      const now = Date.now();
      if (now - lastScoreTime >= 1000) {
        scoreRef.current += 1;
        timeAlive.current += 1;
        setScore(scoreRef.current);
        lastScoreTime = now;
      }

      if (gameActive) {
        animationFrameId = requestAnimationFrame(gameLoop);
      }
    };

    const spawnBug = () => {
      if (!gameActive) return;
      const base = getBugType();
      const bug: Bug = {
        x: Math.random() * (GAME_WIDTH - base.width),
        y: -base.height,
        width: base.width,
        height: base.height,
        speed: base.speed,
        type: base.type,
        dodged: false,
      };
      bugs.push(bug);
    };

    const spawnBossBug = () => {
      if (!gameActive) return;
      const bug: Bug = {
        x: Math.random() * (GAME_WIDTH - 50),
        y: -50,
        width: 50,
        height: 50,
        speed: 5 + timeAlive.current * 0.02,
        type: 'boss',
        dodged: false,
      };
      bugs.push(bug);
    };

    gameLoop();
    bugTimer = setInterval(spawnBug, Math.max(400, 1500 - timeAlive.current * 10));
    bossTimer = setInterval(spawnBossBug, 20000);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(bugTimer);
      clearInterval(bossTimer);
      window.removeEventListener('keydown', () => { });
      window.removeEventListener('keyup', () => { });
      canvas.removeEventListener('touchstart', () => { });
      canvas.removeEventListener('touchmove', () => { });
      canvas.removeEventListener('touchend', () => { });
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
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-4">
        <h1 className="text-2xl font-bold text-center">Code Runner - Enter Your Name</h1>
        <input
          type="text"
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
          className="border rounded px-4 py-2 w-full max-w-xs"
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
    <div className="container mx-auto space-y-4 px-4">

      {/* Meta tags for SEO */}
      <title>Code Runner - Dodge the Bugs Game | Buddhsen Tripathi</title>
      <meta name="description" content="Play Code Runner, a fun game where you dodge coding bugs and compete for high scores. Test your reflexes and climb the leaderboard!" />

      {/* Open Graph tags for social sharing */}
      <meta property="og:title" content="Code Runner - Dodge the Bugs Game" />
      <meta property="og:description" content="Challenge yourself in this addictive coding-themed game. Dodge bugs, score points, and compete with other players!" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://buddhsentripathi.com/code-runner" />
      <meta property="og:image" content="https://buddhsentripathi.com/code-runner.webp" />

      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Code Runner - Dodge the Bugs Game" />
      <meta name="twitter:description" content="Challenge yourself in this addictive coding-themed game. Dodge bugs, score points, and compete with other players!" />
      <meta name="twitter:image" content="https://buddhsentripathi.com/code-runner.webp" />

      {/* Additional SEO tags */}
      <meta name="keywords" content="code runner, coding game, bug dodging game, programming game, web game, browser game, leaderboard game" />
      <meta name="author" content="Buddhsen Tripathi" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href="https://buddhsentripathi.com/code-runner" />

      {/* Mobile optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <meta name="theme-color" content="#1a1a1a" />

      <div className="flex items-center justify-between">
        <Link href="/projects" className="flex items-center text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Projects
        </Link>
        <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
          <ViewCounter slug="code-runner" readOnly={false} />
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 w-full">
        <h1 className="text-3xl font-bold">Code Runner</h1>
        <p className="text-sm text-gray-500">Welcome, {name}!</p>
        <div className="flex gap-4">
          <p>Score: {score}</p>
          <p>High Score: {highScore}</p>
        </div>
        <div
          ref={containerRef}
          className="w-full max-w-[390px]"
          style={{
            aspectRatio: `${GAME_WIDTH}/${GAME_HEIGHT}`,
          }}
        >
          <canvas
            ref={canvasRef}
            width={GAME_WIDTH}
            height={GAME_HEIGHT}
            className="border border-gray-300 rounded-lg w-full h-full touch-none"
          />
        </div>
        {gameOver && (
          <div className="space-y-4">
            <p className="text-xl font-bold text-center">Game Over!</p>
            <div className="flex gap-4 justify-center">
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
        <div className="text-sm text-gray-500 text-center">
          Use arrow keys or touch to dodge bugs
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