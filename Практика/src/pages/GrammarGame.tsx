import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaLightbulb, FaTrophy, FaClock, FaHeart } from 'react-icons/fa';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const GrammarGame: React.FC = () => {
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isFinished, setIsFinished] = useState(false);
  const [loading, setLoading] = useState(true);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isGameOverRef = useRef(false); 

  const API_BASE = (import.meta.env?.VITE_API_URL as string | undefined) || 'http://localhost:5000';

  // Таймерди токтотуу
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Оюнду бүтүрүү
  const finishGame = useCallback((finalScore: number) => {
    if (isGameOverRef.current) return;
    isGameOverRef.current = true;
    stopTimer();
    setIsFinished(true);

    // Упайды сактоо
    fetch(`${API_BASE}/api/grammar/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        username: "Окуучу",
        score: finalScore,
        date: new Date().toISOString()
      }),
    }).catch(err => console.error("Score save error:", err));
  }, [API_BASE, stopTimer]);

  // Убакыт бүткөндөгү логика
  const handleTimeout = useCallback(() => {
    setLives((prev) => {
      const newLives = prev - 1;
      if (newLives <= 0) {
        finishGame(score);
        return 0;
      }
      setShowFeedback(true);
      return newLives;
    });
  }, [score, finishGame]);

  // Таймерди иштетүү
  const startTimer = useCallback(() => {
    stopTimer();
    setTimeLeft(30);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          stopTimer();
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [stopTimer, handleTimeout]);

  // Суроолорду жүктөө
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/grammar/questions`);
        if (!res.ok) throw new Error('Network error');
        const data = await res.json();
        setQuestions(data);
      } catch (err) {
        console.error("Fetch error:", err);
        // Fallback data
        setQuestions([{
          id: 1,
          question: "Кыргыз тилинде канча созулма үндүү бар?",
          options: ["4", "6", "8", "5"],
          correct: 1,
          explanation: "Кыргыз тилинде 6 созулма үндүү бар: аа, оо, уу, ээ, өө, үү."
        }]);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [API_BASE]);

  // Таймерди көзөмөлдөө
  useEffect(() => {
    if (questions.length > 0 && !isFinished && !showFeedback && !isGameOverRef.current) {
      startTimer();
    }
    return () => stopTimer();
  }, [currentIdx, isFinished, showFeedback, questions.length, startTimer, stopTimer]);

  const handleCheck = (index: number) => {
    if (showFeedback || isFinished) return;
    stopTimer();
    setSelected(index);
    setShowFeedback(true);
    
    if (index === questions[currentIdx].correct) {
      const bonus = Math.floor(timeLeft / 3);
      setScore(prev => prev + 10 + bonus);
    } else {
      setLives((prev) => {
        const newLives = prev - 1;
        if (newLives <= 0) {
          setTimeout(() => finishGame(score), 800);
        }
        return newLives;
      });
    }
  };

  const handleNext = () => {
    if (isGameOverRef.current || currentIdx === questions.length - 1 || lives <= 0) {
      finishGame(score);
    } else {
      setCurrentIdx(prev => prev + 1);
      setSelected(null);
      setShowFeedback(false);
    }
  };

  if (loading) return <div style={styles.centerBox}>Жүктөлүүдө...</div>;

  if (isFinished) {
    return (
      <div style={styles.container}>
        <div style={styles.resultCard}>
          <FaTrophy style={styles.trophyIcon} />
          <h1 style={styles.resultTitle}>{lives > 0 ? "Азаматсыз!" : "Оюн бүттү"}</h1>
          <div style={styles.finalScoreBox}>
            <p style={styles.scoreLabel}>Жалпы упай</p>
            <h2 style={styles.scoreValue}>{score}</h2>
          </div>
          <div style={styles.buttonGroup}>
            <button onClick={() => window.location.reload()} style={styles.resetBtn}>Кайра баштоо</button>
            <button onClick={() => navigate('/')} style={styles.homeBtn}>Башкы бет</button>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[currentIdx];

  return (
    <div style={styles.container}>
      <div style={styles.statsBar}>
        <div style={styles.statItem}><FaHeart color="#F56565" /> <span style={{marginLeft: 8}}>{lives}</span></div>
        <div style={{...styles.statItem, color: timeLeft < 10 ? '#EF4444' : '#475569'}}>
          <FaClock /> <span style={{marginLeft: 8, width: '50px'}}>{timeLeft}с</span>
        </div>
        <div style={styles.statItem}><b>Упай: {score}</b></div>
      </div>

      <div style={styles.headerNav}>
        <button onClick={() => navigate('/')} style={styles.backCircle}><FaArrowLeft /></button>
        <div style={styles.progressTrack}>
          <div style={{ ...styles.progressFill, width: `${((currentIdx + 1) / questions.length) * 100}%` }} />
        </div>
      </div>

      <div style={styles.quizCard}>
        <h2 style={styles.questionText}>{q?.question}</h2>
        <div style={styles.optionsContainer}>
          {q?.options.map((opt, i) => {
            let btnStyle = { ...styles.optionBtn };
            if (showFeedback) {
              if (i === q.correct) btnStyle = { ...btnStyle, ...styles.correctBtn };
              else if (i === selected) btnStyle = { ...btnStyle, ...styles.wrongBtn };
              else btnStyle = { ...btnStyle, ...styles.dimmedBtn };
            } else if (selected === i) {
              btnStyle = { ...btnStyle, ...styles.selectedBtn };
            }

            return (
              <button key={i} onClick={() => handleCheck(i)} disabled={showFeedback} style={btnStyle}>
                <span style={styles.optLetter}>{String.fromCharCode(65 + i)}</span>
                <span style={styles.optText}>{opt}</span>
              </button>
            );
          })}
        </div>

        {showFeedback && (
          <div style={styles.feedbackArea}>
            <div style={styles.explanationBox}>
              <div style={styles.expHeader}><FaLightbulb /> Түшүндүрмө</div>
              <p style={styles.expContent}>{q?.explanation}</p>
            </div>
            <button onClick={handleNext} style={styles.nextButton}>
              {currentIdx === questions.length - 1 || lives <= 0 ? 'Жыйынтыкты көрүү' : 'Кийинки суроо'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: { minHeight: '100vh', background: '#F1F5F9', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' },
  centerBox: { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '1.2rem' },
  statsBar: { width: '100%', maxWidth: '600px', display: 'flex', justifyContent: 'space-between', marginBottom: '15px', padding: '14px 25px', background: '#fff', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' },
  statItem: { display: 'flex', alignItems: 'center', fontWeight: '800' },
  headerNav: { width: '100%', maxWidth: '600px', display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' },
  backCircle: { width: '45px', height: '45px', borderRadius: '50%', border: '1px solid #E2E8F0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  progressTrack: { flex: 1, height: '10px', background: '#E2E8F0', borderRadius: '20px', overflow: 'hidden' },
  progressFill: { height: '100%', background: '#3B82F6', transition: 'width 0.4s ease' },
  quizCard: { width: '100%', maxWidth: '600px', background: '#fff', borderRadius: '30px', padding: '30px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05)' },
  questionText: { fontSize: '22px', fontWeight: '800', marginBottom: '30px', color: '#1E293B' },
  optionsContainer: { display: 'flex', flexDirection: 'column', gap: '12px' },
  optionBtn: { display: 'flex', alignItems: 'center', padding: '18px 22px', borderRadius: '18px', border: '2px solid #F1F5F9', background: '#F8FAFC', cursor: 'pointer', textAlign: 'left', transition: '0.2s' },
  optLetter: { width: '32px', height: '32px', background: '#E2E8F0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '900', marginRight: '15px' },
  optText: { flex: 1, fontWeight: '700', color: '#334155' },
  selectedBtn: { borderColor: '#3B82F6', background: '#EFF6FF' },
  correctBtn: { borderColor: '#10B981', background: '#ECFDF5', color: '#064E3B' },
  wrongBtn: { borderColor: '#EF4444', background: '#FEF2F2', color: '#7F1D1D' },
  dimmedBtn: { opacity: 0.4 },
  feedbackArea: { marginTop: '25px', display: 'flex', flexDirection: 'column', gap: '20px' },
  explanationBox: { padding: '20px', background: '#F0F9FF', borderRadius: '16px', borderLeft: '6px solid #3B82F6' },
  expHeader: { display: 'flex', alignItems: 'center', color: '#1D4ED8', fontWeight: '900', marginBottom: '8px', gap: '8px' },
  expContent: { fontSize: '15px', margin: 0, color: '#334155', lineHeight: '1.6' },
  nextButton: { padding: '18px', background: '#1E293B', color: '#fff', borderRadius: '16px', fontWeight: '800', border: 'none', cursor: 'pointer' },
  resultCard: { width: '100%', maxWidth: '450px', background: '#fff', padding: '50px 30px', borderRadius: '35px', textAlign: 'center' },
  trophyIcon: { fontSize: '80px', color: '#F59E0B', marginBottom: '25px' },
  resultTitle: { fontSize: '32px', fontWeight: '900', color: '#1E293B' },
  finalScoreBox: { padding: '30px', background: '#F8FAFC', borderRadius: '25px', margin: '20px 0' },
  scoreLabel: { fontSize: '14px', color: '#64748B', fontWeight: '800' },
  scoreValue: { fontSize: '60px', fontWeight: '900', color: '#3B82F6', margin: 0 },
  buttonGroup: { display: 'flex', gap: '15px' },
  resetBtn: { flex: 1, padding: '16px', background: '#F1F5F9', borderRadius: '14px', border: 'none', fontWeight: '800', cursor: 'pointer' },
  homeBtn: { flex: 1, padding: '16px', background: '#3B82F6', color: '#fff', borderRadius: '14px', border: 'none', fontWeight: '800', cursor: 'pointer' }
};

export default GrammarGame;