import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
// Локалдык маалыматты импорттоо
import { proverbsData as localProverbs } from '../data/proverbsData';

interface Proverb {
  id: number;
  start: string;
  options: string[];
  correct: number;
  explanation: string;
}

const ProverbsGame: React.FC = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Proverb[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [loading, setLoading] = useState(true);

  // Суроолорду аралаштыруу функциясы
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const shuffleArray = (array: any[]) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  // 1. Маалыматты жүктөө (Бекенд + Fallback)
  const fetchProverbs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/proverbs/data');
      
      if (!res.ok) throw new Error('Бекенд жооп берген жок');
      
      const data = await res.json();
      
      if (data && data.length > 0) {
        // Бекендден келген 10 суроону аралаштырып ал
        setQuestions(shuffleArray(data).slice(0, 10));
      } else {
        // Эгер бекенд бош болсо локалдыктан 10 суроо ал
        setQuestions(shuffleArray(localProverbs).slice(0, 10));
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      console.warn("Бекенд иштебейт, локалдык маалыматтар колдонулууда");
      // Ката болсо локалдыктан 10 суроо ал
      setQuestions(shuffleArray(localProverbs).slice(0, 10));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProverbs();
  }, [fetchProverbs]);

  // 2. Упайды серверге сактоо
  const saveFinalScore = async (finalScore: number) => {
    try {
      await fetch('http://localhost:5000/api/proverbs/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: "Окуучу", // Кошумча атын кошсоңуз болот
          score: finalScore,
          date: new Date().toISOString()
        }),
      });
    } catch (err) {
      console.error("Упай сакталган жок:", err);
    }
  };

  const handleCheck = (index: number) => {
    if (selected !== null) return;
    
    const correct = index === questions[currentIdx].correct;
    setSelected(index);
    setIsCorrect(correct);
    
    if (correct) {
      setScore(prev => prev + 20);
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelected(null);
      setIsCorrect(null);
    } else {
      setIsFinished(true);
      saveFinalScore(score); 
    }
  };

  const resetGame = () => {
    setCurrentIdx(0);
    setScore(0);
    setSelected(null);
    setIsCorrect(null);
    setIsFinished(false);
    fetchProverbs();
  };

  if (loading) return <div style={styles.container}>Жүктөлүүдө...</div>;
  if (questions.length === 0) return <div style={styles.container}>Маалымат табылган жок.</div>;

  const q = questions[currentIdx];

  if (isFinished) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={{ fontSize: '80px', marginBottom: '20px' }}>🏆</div>
          <h2 style={{ fontSize: '32px', color: '#2D3748' }}>Керемет!</h2>
          <p style={{ fontSize: '20px', color: '#718096', marginBottom: '30px' }}>
            Сиз жалпы <b>{score}</b> упай топтодуңуз.
          </p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
            <button onClick={resetGame} style={styles.resetBtn}>Кайра баштоо</button>
            <button onClick={() => navigate('/')} style={styles.nextBtn}>Башкы бетке</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => navigate('/')} style={styles.backBtn}>
          <span style={{ marginRight: '8px' }}>←</span> Артка чыгуу
        </button>
        <div style={styles.stats}>
          <span style={{ opacity: 0.7, marginRight: '10px' }}>Упай:</span>
          <span>{score}</span>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.progressContainer}>
          <div style={{ 
            ...styles.progressBar, 
            width: `${((currentIdx + 1) / questions.length) * 100}%` 
          }} />
        </div>
        
        <p style={styles.stepText}>МАКАЛ {currentIdx + 1} / {questions.length}</p>
        <h2 style={styles.questionText}>"{q.start}"</h2>

        <div style={styles.optionsGrid}>
          {q.options.map((opt, i) => {
            let currentBg = '#fff';
            let currentBorder = '#edf2f7';
            let currentText = '#4A5568';
            
            if (selected !== null) {
              if (i === q.correct) {
                currentBg = '#C6F6D5'; currentBorder = '#48BB78'; currentText = '#22543D';
              } else if (selected === i) {
                currentBg = '#FED7D7'; currentBorder = '#F56565'; currentText = '#822727';
              } else {
                currentBg = '#F7FAFC'; currentBorder = '#E2E8F0'; currentText = '#A0AEC0';
              }
            }

            return (
              <button
                key={i}
                onClick={() => handleCheck(i)}
                disabled={selected !== null}
                style={{
                  ...styles.optionBtn,
                  backgroundColor: currentBg,
                  borderColor: currentBorder,
                  color: currentText,
                  cursor: selected === null ? 'pointer' : 'default',
                  transform: selected === i ? 'scale(0.98)' : 'none'
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {selected !== null && (
          <div style={{
            ...styles.feedbackSection,
            borderLeft: `6px solid ${isCorrect ? '#48BB78' : '#F56565'}`,
            animation: 'fadeIn 0.5s ease'
          }}>
            <p style={{ 
              color: isCorrect ? '#2F855A' : '#C53030', 
              fontWeight: '800', fontSize: '18px', margin: '0 0 10px 0'
            }}>
              {isCorrect ? '✅ ТУУРА ЖООП!' : '❌ КАТАЛДЫҢЫЗ'}
            </p>
            <p style={styles.explanation}><b>Макалдын толук түрү:</b> {q.explanation}</p>
            <button onClick={handleNext} style={styles.nextBtn}>
              {currentIdx === questions.length - 1 ? 'Жыйынтыкты көрүү' : 'Кийинкиси →'}
            </button>
          </div>
        )}
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: { padding: '40px 20px', maxWidth: '850px', margin: '0 auto', minHeight: '100vh', background: '#F8FAFC' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
  backBtn: { background: 'white', border: '1px solid #e2e8f0', padding: '10px 20px', borderRadius: '14px', color: '#4A5568', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center' },
  stats: { background: '#3182CE', color: 'white', padding: '10px 25px', borderRadius: '14px', fontWeight: 'bold', fontSize: '18px' },
  card: { background: '#fff', padding: '50px 40px', borderRadius: '35px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.08)', textAlign: 'center' },
  progressContainer: { width: '100%', height: '10px', background: '#F7FAFC', borderRadius: '20px', marginBottom: '30px', overflow: 'hidden', border: '1px solid #edf2f7' },
  progressBar: { height: '100%', background: 'linear-gradient(90deg, #4299E1, #667eea)', transition: 'width 0.6s ease' },
  stepText: { color: '#A0AEC0', fontSize: '13px', fontWeight: '800', letterSpacing: '1px', marginBottom: '15px' },
  questionText: { fontSize: '32px', color: '#1A202C', marginBottom: '45px', fontWeight: '700' },
  optionsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  optionBtn: { padding: '25px 20px', borderRadius: '20px', border: '2px solid #edf2f7', fontSize: '18px', fontWeight: '600', transition: '0.3s' },
  feedbackSection: { marginTop: '40px', padding: '30px', borderRadius: '24px', background: '#F8FAFC', textAlign: 'left' },
  explanation: { fontSize: '16px', color: '#4A5568', marginBottom: '25px', lineHeight: '1.6' },
  nextBtn: { padding: '15px 40px', borderRadius: '16px', border: 'none', background: '#3182CE', color: '#fff', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' },
  resetBtn: { padding: '15px 40px', borderRadius: '16px', border: '2px solid #3182CE', background: 'transparent', color: '#3182CE', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }
};

export default ProverbsGame;