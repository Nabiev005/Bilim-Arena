import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPlay, FaRedo, FaCheckCircle, FaTrophy, FaLightbulb } from 'react-icons/fa';

interface LeaderboardEntry {
  id: number;
  score: number;
  rank: string;
  date: string;
}

const letters = "АБВДГЕЖЗИЙКЛМНОПРСТУҮФХЦЧШЭЮЯ".split("");

const WordGame: React.FC = () => {
  const navigate = useNavigate();
  const [randomLetter, setRandomLetter] = useState('');
  const [userInput, setUserInput] = useState('');
  const [wordsList, setWordsList] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [shake, setShake] = useState(false); // Ката болгондо же убакыт бүтөөрдө титирөө
  const inputRef = useRef<HTMLInputElement>(null);

  const getRank = (count: number) => {
    if (count > 15) return "Сөз чебери 👑";
    if (count > 10) return "Чечен 🔥";
    if (count > 5) return "Жаш тилчи 🌱";
    return "Үйрөнчүк ✨";
  };

  // Лидербордду жүктөө (Сервер же LocalStorage)
  const loadLeaderboard = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:5000/api/word-game/leaderboard');
      if (res.ok) {
        const data = await res.json();
        setLeaderboard(data);
      } else {
        const localData = JSON.parse(localStorage.getItem('wordGameScores') || '[]');
        setLeaderboard(localData);
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      const localData = JSON.parse(localStorage.getItem('wordGameScores') || '[]');
      setLeaderboard(localData);
    }
  }, []);

  const saveScore = useCallback(async (score: number) => {
    const newEntry = { id: Date.now(), score, rank: getRank(score), date: new Date().toLocaleDateString() };
    
    // 1. LocalStorage-ко сактоо
    const localData = JSON.parse(localStorage.getItem('wordGameScores') || '[]');
    const updatedLocal = [newEntry, ...localData].slice(0, 5);
    localStorage.setItem('wordGameScores', JSON.stringify(updatedLocal));

    // 2. Серверге сактоо (аракет кылуу)
    try {
      await fetch('http://localhost:5000/api/word-game/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEntry)
      });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      console.log("Упай локалдык түрдө сакталды.");
    }
    loadLeaderboard();
  }, [loadLeaderboard]);

  const startGame = () => {
    const letter = letters[Math.floor(Math.random() * letters.length)];
    setRandomLetter(letter);
    setWordsList([]);
    setUserInput('');
    setTimeLeft(30);
    setIsActive(true);
    setIsFinished(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
        if (timeLeft <= 5) setShake(true); // Соңку 5 секундда титирөө
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsActive(false);
      setIsFinished(true);
      setShake(false);
      saveScore(wordsList.length);
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft, wordsList.length, saveScore]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadLeaderboard();
  }, [loadLeaderboard]);

  const handleAddWord = (e: React.FormEvent) => {
    e.preventDefault();
    const word = userInput.trim().toUpperCase();
    
    // Текшерүү шарттары
    if (word.length > 1 && word.startsWith(randomLetter) && !wordsList.includes(word)) {
      setWordsList(prev => [word, ...prev]);
      setUserInput('');
      setShake(false);
    } else {
      // Туура эмес киргизсе титирөө эффекти
      setShake(true);
      setTimeout(() => setShake(false), 300);
    }
  };

  return (
    <div style={{...styles.container, animation: shake ? 'shake 0.5s' : 'none'}}>
      <button onClick={() => navigate('/')} style={styles.backBtn}>
        <FaArrowLeft /> Артка
      </button>

      <div style={styles.content}>
        <h1 style={styles.title}>Ким Көп Билет? 🧠</h1>

        {!isActive && !isFinished ? (
          <div style={styles.startSection}>
            <p style={styles.instruction}>Берилген тамгага 30 секунд ичинде мүмкүн болушунча көп сөз жазыңыз!</p>
            <button onClick={startGame} style={styles.mainBtn}>
              <FaPlay /> Оюнду баштоо
            </button>
            
            <div style={styles.leaderboardBox}>
              <h3 style={styles.sectionTitle}><FaTrophy color="#ECC94B" /> Мыкты Рекорддор</h3>
              {leaderboard.map((s, i) => (
                <div key={i} style={styles.leaderItem}>
                  <span>{i + 1}. {s.score} сөз</span>
                  <span style={styles.rankBadge}>{s.rank}</span>
                </div>
              ))}
            </div>
          </div>
        ) : isActive ? (
          <div style={styles.gameSection}>
            <div style={styles.statsRow}>
              <div style={styles.letterCircle}>
                <small>Тамга:</small>
                <strong>{randomLetter}</strong>
              </div>
              <div style={{ ...styles.timer, color: timeLeft < 10 ? '#E53E3E' : '#3182CE' }}>
                {timeLeft} <small>сек</small>
              </div>
            </div>

            <form onSubmit={handleAddWord} style={styles.inputGroup}>
              <input
                ref={inputRef}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Сөз жазыңыз..."
                style={styles.input}
              />
              <button type="submit" style={styles.addBtn}>+</button>
            </form>

            <div style={styles.wordCount}>
              <FaLightbulb color="#F6E05E" /> Табылган сөздөр: {wordsList.length}
            </div>

            <div style={styles.scrollArea}>
              {wordsList.map((w, i) => (
                <div key={i} style={styles.wordBadge}>
                  <FaCheckCircle color="#48BB78" size={12} /> {w}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={styles.resultCard}>
            <FaTrophy size={50} color="#ECC94B" style={{marginBottom: '15px'}} />
            <h2 style={{margin: 0}}>Жыйынтык!</h2>
            <div style={styles.finalScore}>{wordsList.length}</div>
            <p style={styles.rankLabel}>Сиздин деңгээл:</p>
            <div style={styles.rankValue}>{getRank(wordsList.length)}</div>
            <button onClick={startGame} style={styles.restartBtn}>
              <FaRedo /> Кайра баштоо
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          50% { transform: translateX(5px); }
          75% { transform: translateX(-5px); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

// Стилдерди жакшыртуу
const styles: { [key: string]: React.CSSProperties } = {
  container: { minHeight: '100vh', background: '#EDF2F7', padding: '20px', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' },
  backBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', background: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
  content: { maxWidth: '450px', margin: '20px auto', textAlign: 'center' },
  title: { fontSize: '36px', color: '#1A202C', marginBottom: '25px', letterSpacing: '-1px' },
  instruction: { color: '#718096', marginBottom: '20px', fontSize: '14px' },
  startSection: { background: '#fff', padding: '30px', borderRadius: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' },
  mainBtn: { display: 'flex', alignItems: 'center', gap: '10px', margin: '0 auto', padding: '16px 35px', background: '#3182CE', color: '#fff', border: 'none', borderRadius: '15px', fontSize: '18px', cursor: 'pointer', fontWeight: 'bold', transition: '0.2s' },
  sectionTitle: { fontSize: '18px', marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },
  leaderboardBox: { marginTop: '25px', borderTop: '2px dashed #EDF2F7', paddingTop: '20px' },
  leaderItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: '#F8FAFC', borderRadius: '10px', marginBottom: '8px', fontSize: '14px' },
  rankBadge: { fontSize: '12px', fontWeight: 'bold', color: '#3182CE' },
  gameSection: { background: '#fff', padding: '25px', borderRadius: '24px', boxShadow: '0 15px 30px rgba(0,0,0,0.1)' },
  statsRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' },
  letterCircle: { display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#EBF8FF', padding: '10px 20px', borderRadius: '15px', color: '#2B6CB0' },
  timer: { fontSize: '32px', fontWeight: '800' },
  inputGroup: { display: 'flex', gap: '10px', marginBottom: '20px' },
  input: { flex: 1, padding: '15px', borderRadius: '12px', border: '2px solid #E2E8F0', fontSize: '16px', outline: 'none', transition: '0.2s' },
  addBtn: { width: '60px', background: '#48BB78', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '24px', fontWeight: 'bold' },
  wordCount: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '15px', color: '#4A5568', fontWeight: '600' },
  scrollArea: { display: 'flex', flexWrap: 'wrap', gap: '8px', minHeight: '100px', maxHeight: '200px', overflowY: 'auto', background: '#F7FAFC', padding: '15px', borderRadius: '15px', border: '1px inset #EDF2F7' },
  wordBadge: { background: '#fff', padding: '6px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  resultCard: { background: '#fff', padding: '40px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' },
  finalScore: { fontSize: '80px', fontWeight: '900', color: '#3182CE', margin: '10px 0' },
  rankLabel: { color: '#718096', marginBottom: '5px' },
  rankValue: { fontSize: '20px', fontWeight: 'bold', color: '#2D3748', marginBottom: '25px' },
  restartBtn: { padding: '15px 30px', background: '#2D3748', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold', margin: '0 auto' }
};

export default WordGame;