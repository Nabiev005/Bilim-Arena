import React, { useState, useEffect, useCallback, } from 'react';
import { useNavigate } from 'react-router-dom';

const MathGame: React.FC = () => {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(Number(localStorage.getItem('math_high_score')) || 0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWrong, setIsWrong] = useState(false);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null); // Кайсы баскыч басылганын билүү үчүн
  
  const [question, setQuestion] = useState({ 
    a: 0, b: 0, op: '+', answer: 0, options: [] as number[] 
  });

  // 1. Суроо жаратуу функциясы
  const generateQuestion = useCallback((currentScore: number) => {
    const difficulty = Math.floor(currentScore / 50) * 5; 
    const a = Math.floor(Math.random() * (15 + difficulty)) + 2;
    const b = Math.floor(Math.random() * (15 + difficulty)) + 2;
    
    const ops = currentScore > 100 ? ['+', '-', '*'] : ['+', '-'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    
    let ans = 0;
    if (op === '+') ans = a + b;
    else if (op === '-') ans = a - b;
    else ans = a * b;

    const opts = new Set<number>();
    opts.add(ans);
    while (opts.size < 4) {
      const offset = Math.floor(Math.random() * 15) - 7;
      const fake = ans + (offset === 0 ? 3 : offset);
      opts.add(fake);
    }

    setQuestion({
      a, b, op, 
      answer: ans, 
      options: Array.from(opts).sort(() => Math.random() - 0.5)
    });
    setTimeLeft(15); 
    setIsWrong(false);
    setSelectedOpt(null);
  }, []);

  // 2. Баштапкы жүктөө
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    generateQuestion(0);
  }, [generateQuestion]);

  // 3. Таймер логикасы
  useEffect(() => {
    if (isGameOver || isWrong) return;

    if (timeLeft <= 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsGameOver(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isGameOver, isWrong]);

  // 4. Жоопту текшерүү
  const handleAnswer = (val: number) => {
    if (isGameOver || isWrong) return; // Кайра-кайра басуудан коргоо

    setSelectedOpt(val);
    if (val === question.answer) {
      const newScore = score + 10;
      setScore(newScore);
      // Кичинекей пауза (туура жоопту көрүү үчүн)
      setTimeout(() => generateQuestion(newScore), 200);
    } else {
      setIsWrong(true);
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('math_high_score', score.toString());
      }
      // Ката болгондо 0.5 секунддан кийин оюн бүтөт
      setTimeout(() => setIsGameOver(true), 500);
    }
  };

  const resetGame = () => {
    setScore(0);
    setIsGameOver(false);
    setIsWrong(false);
    setSelectedOpt(null);
    generateQuestion(0);
  };

  const horsePos = Math.min((score / 200) * 100, 90);

  if (isGameOver) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={{ fontSize: '80px' }}>🏆</div>
          <h2 style={{ fontSize: '32px', color: '#2d3748', margin: '10px 0' }}>Оюн бүттү!</h2>
          <div style={styles.resultBox}>
            <p>Упай: <b style={{color: '#4299e1'}}>{score}</b></p>
            <p>Рекорд: <b>{highScore}</b></p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button onClick={resetGame} style={styles.resetBtn}>Кайра баштоо</button>
            <button onClick={() => navigate('/')} style={styles.exitBtn}>Башкы бетке</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => navigate('/')} style={styles.backBtn}>← Артка</button>
        <div style={styles.scoreGroup}>
          <div style={styles.scoreBadge}>Упай: {score}</div>
          <div style={styles.highScore}>★ Рекорд: {highScore}</div>
        </div>
      </div>

      <div style={styles.track}>
        <div style={{ ...styles.horse, left: `${horsePos}%` }}>🐎</div>
        <div style={styles.finishLine}>🏁</div>
      </div>

      <div style={{ 
        ...styles.card, 
        animation: isWrong ? 'shake 0.4s ease-in-out' : 'none',
        borderColor: isWrong ? '#fc8181' : '#fff' 
      }}>
        <div style={styles.timerWrapper}>
          <div style={{ 
            ...styles.timerCircle, 
            borderColor: timeLeft <= 5 ? '#f56565' : '#4299e1',
            color: timeLeft <= 5 ? '#f56565' : '#2d3748'
          }}>
            {timeLeft}
          </div>
        </div>
        
        <h1 style={styles.mathText}>
          {question.a} <span style={{color: '#4299e1'}}>{question.op}</span> {question.b}
        </h1>
        <div style={styles.equalSign}>= ?</div>

        <div style={styles.grid}>
          {question.options.map((opt, i) => (
            <button 
              key={i} 
              onClick={() => handleAnswer(opt)} 
              style={{
                ...styles.optionBtn,
                background: selectedOpt === opt ? (opt === question.answer ? '#c6f6d5' : '#fed7d7') : '#fff',
                borderColor: selectedOpt === opt ? (opt === question.answer ? '#48bb78' : '#f56565') : '#edf2f7'
              }}
              disabled={isWrong}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-10px); }
          40%, 80% { transform: translateX(10px); }
        }
      `}</style>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: { padding: '20px', maxWidth: '500px', margin: '0 auto', fontFamily: '"Inter", sans-serif', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
  scoreGroup: { textAlign: 'right' },
  scoreBadge: { background: '#4299e1', color: '#fff', padding: '6px 15px', borderRadius: '12px', fontWeight: 'bold' },
  highScore: { fontSize: '12px', color: '#718096', marginTop: '4px', fontWeight: 'bold' },
  backBtn: { background: '#fff', border: '1px solid #e2e8f0', padding: '8px 15px', borderRadius: '10px', cursor: 'pointer', color: '#4a5568', fontWeight: '600' },
  track: { height: '65px', background: '#edf2f7', borderRadius: '35px', position: 'relative', marginBottom: '30px', border: '4px solid #fff', display: 'flex', alignItems: 'center', padding: '0 20px', overflow: 'hidden', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' },
  horse: { position: 'absolute', fontSize: '40px', transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)', zIndex: 2, transform: 'scaleX(-1)' },
  finishLine: { position: 'absolute', right: '15px', fontSize: '28px', opacity: 0.3 },
  card: { background: '#fff', padding: '40px 30px', borderRadius: '40px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', textAlign: 'center', border: '3px solid transparent', transition: '0.3s' },
  timerWrapper: { display: 'flex', justifyContent: 'center', marginBottom: '20px' },
  timerCircle: { width: '65px', height: '65px', borderRadius: '50%', border: '5px solid', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: '900', transition: '0.3s' },
  mathText: { fontSize: '64px', color: '#2d3748', margin: '0', fontWeight: '900', letterSpacing: '-2px' },
  equalSign: { fontSize: '24px', color: '#a0aec0', marginBottom: '30px', fontWeight: 'bold' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
  optionBtn: { padding: '20px', fontSize: '26px', borderRadius: '22px', border: '2px solid #edf2f7', cursor: 'pointer', fontWeight: '800', color: '#2d3748', transition: 'all 0.2s' },
  resultBox: { background: '#f8fafc', padding: '20px', borderRadius: '20px', margin: '20px 0', fontSize: '20px', border: '1px solid #e2e8f0' },
  resetBtn: { padding: '18px 25px', background: '#4299e1', color: '#fff', border: 'none', borderRadius: '15px', cursor: 'pointer', fontWeight: 'bold', fontSize: '18px' },
  exitBtn: { padding: '15px 25px', background: 'transparent', color: '#718096', border: 'none', borderRadius: '15px', cursor: 'pointer', fontWeight: '600' },
};

export default MathGame;