import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;
// Кыргыз тилиндеги 5 тамгалуу сөздөр базасы
const WORD_LIST = ["КИТЕП", "АЛМАШ", "БИЛИМ", "САЛАМ", "ТАЛАА", "КУРАК", "ӨНӨРҮ", "МЕКЕН"];

const WordHunter: React.FC = () => {
  const navigate = useNavigate();
  // Оюн башталганда кокустан сөз тандоо
  // eslint-disable-next-line react-hooks/purity
  const targetWord = useMemo(() => WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)], []);
  
  const [guesses, setGuesses] = useState<string[]>(Array(MAX_GUESSES).fill(''));
  const [currentGuess, setCurrentGuess] = useState('');
  const [currentRow, setCurrentRow] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [shakeRow, setShakeRow] = useState<number | null>(null);

  const saveScore = async (finalScore: number) => {
    try {
      await fetch('http://localhost:5000/api/word-hunter/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: "Колдонуучу",
          score: finalScore,
          date: new Date().toLocaleDateString('ky-KG'),
          rank: finalScore >= 80 ? "Тулпар" : "Көчмөн"
        }),
      });
    } catch (error) {
      console.error("Байланыш катасы:", error);
    }
  };

  const submitGuess = useCallback(() => {
    if (currentGuess.length !== WORD_LENGTH) {
      setShakeRow(currentRow);
      setTimeout(() => setShakeRow(null), 500);
      return;
    }

    const newGuesses = [...guesses];
    newGuesses[currentRow] = currentGuess.toUpperCase();
    setGuesses(newGuesses);

    if (currentGuess.toUpperCase() === targetWord) {
      setIsGameOver(true);
      setStatus('won');
      saveScore((MAX_GUESSES - currentRow) * 20);
    } else if (currentRow === MAX_GUESSES - 1) {
      setIsGameOver(true);
      setStatus('lost');
    } else {
      setCurrentRow(prev => prev + 1);
      setCurrentGuess('');
    }
  }, [currentGuess, currentRow, guesses, targetWord]);

  const handleKeyDown = useCallback((e: KeyboardEvent | string) => {
    if (isGameOver) return;
    
    const key = typeof e === 'string' ? e : e.key;

    if (key === 'Enter') {
      submitGuess();
    } else if (key === 'Backspace' || key === '←') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (/^[а-яА-ЯөӨүҮңҢ]$/.test(key) && currentGuess.length < WORD_LENGTH) {
      setCurrentGuess(prev => prev + key.toUpperCase());
    }
  }, [isGameOver, currentGuess.length, submitGuess]);

  useEffect(() => {
    const listener = (e: KeyboardEvent) => handleKeyDown(e);
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [handleKeyDown]);

  const getBoxStyle = (letter: string, index: number, rowIdx: number) => {
    const isRevealed = rowIdx < currentRow || (isGameOver && rowIdx === currentRow);
    if (!isRevealed) return styles.letterBox;

    if (targetWord[index] === letter) return { ...styles.letterBox, ...styles.correct };
    if (targetWord.includes(letter)) return { ...styles.letterBox, ...styles.present };
    return { ...styles.letterBox, ...styles.absent };
  };

  // Виртуалдык клавиатура тамгалары
  const keys = ["ЙЦУКЕНГШЩЗХ", "ФЫВАПРОЛДЖЭ", "ЯЧСМИТЬБЮӨҮҢ", "Enter", "←"];

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.topBar}>
          <button onClick={() => navigate('/')} style={styles.backBtn}>← Артка</button>
          <div style={styles.gameInfo}>Аракет: {currentRow + 1}/6</div>
        </div>

        <div style={styles.header}>
          <h1 style={styles.title}>Сөз Мерген</h1>
          
        </div>

        <div style={styles.grid}>
          {guesses.map((guess, rowIdx) => (
            <div key={rowIdx} style={{
              ...styles.row,
              animation: shakeRow === rowIdx ? 'shake 0.5s' : 'none'
            }}>
              {Array.from({ length: WORD_LENGTH }).map((_, colIdx) => {
                const letter = rowIdx === currentRow ? currentGuess[colIdx] : guess[colIdx];
                return (
                  <div key={colIdx} style={getBoxStyle(letter || '', colIdx, rowIdx)}>
                    {letter}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {isGameOver ? (
          <div style={styles.resultCard}>
            <h2>{status === 'won' ? 'Жеңиш! 🎉' : 'Утулдуңуз 😔'}</h2>
            <p>Жашыруун сөз: <b>{targetWord}</b></p>
            <button onClick={() => window.location.reload()} style={styles.retryBtn}>Кайра ойноо</button>
          </div>
        ) : (
          <div style={styles.keyboard}>
            {keys.map((row, i) => (
              <div key={i} style={styles.keyboardRow}>
                {row.split(i === 2 ? '' : '').map(key => (
                  <button 
                    key={key} 
                    onClick={() => handleKeyDown(key)}
                    style={{
                      ...styles.key,
                      width: key.length > 1 ? '65px' : '35px'
                    }}
                  >
                    {key}
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-5px); }
          40%, 80% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: { minHeight: '100vh', background: '#F8FAFC', padding: '10px', display: 'flex', justifyContent: 'center' },
  content: { width: '100%', maxWidth: '450px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  topBar: { width: '100%', display: 'flex', justifyContent: 'space-between', marginBottom: '20px' },
  backBtn: { padding: '8px 15px', background: '#fff', border: '1px solid #E2E8F0', borderRadius: '10px', cursor: 'pointer' },
  gameInfo: { background: '#EBF4FF', padding: '8px 12px', borderRadius: '10px', fontWeight: 'bold', color: '#2B6CB0' },
  header: { textAlign: 'center', marginBottom: '20px' },
  title: { fontSize: '28px', fontWeight: '800', margin: 0 },
  grid: { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '25px' },
  row: { display: 'flex', gap: '8px' },
  letterBox: { 
    width: '55px', height: '55px', border: '2px solid #E2E8F0', borderRadius: '10px',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: '800'
  },
  correct: { background: '#48BB78', color: '#fff', borderColor: '#48BB78' },
  present: { background: '#ECC94B', color: '#fff', borderColor: '#ECC94B' },
  absent: { background: '#A0AEC0', color: '#fff', borderColor: '#A0AEC0' },
  keyboard: { width: '100%', marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' },
  keyboardRow: { display: 'flex', justifyContent: 'center', gap: '4px' },
  key: { 
    height: '45px', background: '#D1D5DB', border: 'none', borderRadius: '4px', 
    cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', display: 'flex', 
    alignItems: 'center', justifyContent: 'center' 
  },
  resultCard: { padding: '20px', background: '#fff', borderRadius: '15px', textAlign: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', width: '100%' },
  retryBtn: { marginTop: '10px', padding: '10px 20px', background: '#3182CE', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }
};

export default WordHunter;