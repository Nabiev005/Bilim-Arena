import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface Question {
  id: number;
  location: string;
  question: string;
  options: string[];
  correct: number;
  info: string;
}

const ManasQuiz: React.FC = () => {
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState<Question[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [showExplanation, setShowExplanation] = useState(false);
  const [lastSelected, setLastSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. Серверден маалыматтарды жүктөө
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Эгер сервериңиз жок болсо, бул жерге тесттик маалыматтарды жазсаңыз болот
        const res = await fetch('http://localhost:5000/api/manas/questions');
        const data = await res.json();
        setQuizData(data);
      } catch (err) {
        console.error("Ката кетти:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 2. Упайды серверге сактоо (useEffect аркылуу жыйынтык чыкканда жөнөтүлөт)
  useEffect(() => {
    if (showResult) {
      const saveScore = async () => {
        try {
          await fetch('http://localhost:5000/api/manas/score', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ score: score, total: quizData.length }),
          });
        } catch (err) {
          console.error("Сактоо катасы:", err);
        }
      };
      saveScore();
    }
  }, [showResult, score, quizData.length]);

  const handleNextStep = useCallback(() => {
    setShowExplanation(false);
    setLastSelected(null);
    setTimeLeft(15);

    if (currentStep < quizData.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setShowResult(true);
    }
  }, [currentStep, quizData.length]);

  // Таймер логикасы
  useEffect(() => {
    if (showResult || showExplanation || loading) return;

    if (timeLeft === 0) {
      handleNextStep();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, showResult, showExplanation, handleNextStep, loading]);

  const handleAnswer = (index: number) => {
    if (showExplanation) return;
    
    setLastSelected(index);
    if (index === quizData[currentStep].correct) {
      setScore(prev => prev + 1);
    }
    setShowExplanation(true);
  };

  const restartGame = () => {
    setCurrentStep(0);
    setScore(0);
    setShowResult(false);
    setTimeLeft(15);
    setShowExplanation(false);
    setLastSelected(null);
  };

  if (loading) return <div style={styles.container}>Жүктөлүүдө...</div>;
  if (quizData.length === 0) return <div style={styles.container}>Суроолор табылган жок.</div>;

  return (
    <div style={styles.container}>
      <button onClick={() => navigate('/')} style={styles.backBtn}>← Башкы бетке</button>

      <div style={styles.content}>
        <h1 style={styles.title}>Манас Таануу: Саякат 🐎</h1>

        {!showResult ? (
          <>
            {/* Саякат картасы */}
            <div style={styles.mapContainer}>
              <div style={styles.mapLine} />
              {quizData.map((step, index) => (
                <div key={step.id} style={styles.stepWrapper}>
                  <div style={{
                    ...styles.stepDot,
                    background: index === currentStep ? '#FFD700' : index < currentStep ? '#48BB78' : '#fff',
                    border: index === currentStep ? '3px solid #3e2723' : '2px solid #E2E8F0',
                    transform: index === currentStep ? 'scale(1.2) scaleX(-1)' : 'scale(1)',
                    zIndex: index === currentStep ? 10 : 2
                  }}>
                    {index === currentStep ? '🏇' : index < currentStep ? '✅' : '📍'}
                  </div>
                  <span style={{
                    ...styles.locationName, 
                    color: index === currentStep ? '#2D3748' : '#A0AEC0'
                  }}>
                    {step.location}
                  </span>
                </div>
              ))}
            </div>

            {/* Таймер тилкеси */}
            <div style={styles.timerTrack}>
              <div style={{
                ...styles.timerBar, 
                width: `${(timeLeft / 15) * 100}%`, 
                background: timeLeft < 5 ? '#F56565' : '#48BB78'
              }} />
            </div>

            {/* Суроо картасы */}
            <div style={styles.quizCard}>
              <div style={styles.cardHeader}>
                <span style={styles.stepCount}>Суроо {currentStep + 1} / {quizData.length}</span>
                <h2 style={styles.locationTitle}>📍 {quizData[currentStep].location}</h2>
              </div>
              <p style={styles.questionText}>{quizData[currentStep].question}</p>
              
              <div style={styles.optionsGrid}>
                {quizData[currentStep].options.map((option, index) => {
                  let btnBg = '#fff';
                  let btnBorder = '#E2E8F0';
                  // eslint-disable-next-line prefer-const
                  let color = '#2D3748';
                  
                  if (showExplanation) {
                    if (index === quizData[currentStep].correct) {
                      btnBg = '#C6F6D5';
                      btnBorder = '#48BB78';
                    } else if (index === lastSelected) {
                      btnBg = '#FED7D7';
                      btnBorder = '#F56565';
                    }
                  }
                  
                  return (
                    <button 
                      key={index} 
                      onClick={() => handleAnswer(index)}
                      style={{ ...styles.optionBtn, background: btnBg, borderColor: btnBorder, color: color }}
                      disabled={showExplanation}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              {showExplanation && (
                <div style={styles.explanationBox}>
                  <p style={styles.infoText}><b>💡 Биле жүр:</b> {quizData[currentStep].info}</p>
                  <button onClick={handleNextStep} style={styles.nextBtn}>
                    {currentStep === quizData.length - 1 ? "Жыйынтыкка баруу" : "Кийинки аялдама ➔"}
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div style={styles.resultCard}>
            <h2 style={{fontSize: '32px', color: '#2D3748'}}>Саякат аяктады! 🎉</h2>
            <div style={styles.scoreCircle}>
                <div style={{textAlign: 'center'}}>
                  <span style={{fontSize: '40px', display: 'block'}}>{score} / {quizData.length}</span>
                  <span style={{fontSize: '14px', color: '#718096'}}>туура жооп</span>
                </div>
            </div>
            <p style={styles.feedbackText}>
              {score === quizData.length 
                ? "Уламыштардагыдай билим! Сиз чыныгы Манас таануучусуз. Сизге 'Чоро' наамы берилди." 
                : "Жакшы аракет! Эпосту дагы бир сыйра окуп чыгуу менен билимиңизди тереңдете аласыз."}
            </p>
            <button onClick={restartGame} style={styles.restartBtn}>Кайра баштоо</button>
          </div>
        )}
      </div>
    </div>
  );
};

// Стилдерди жакшыртуу
const styles: { [key: string]: React.CSSProperties } = {
  container: { minHeight: '100vh', background: '#F0F4F8', padding: '30px 20px', fontFamily: "'Segoe UI', Roboto, sans-serif" },
  backBtn: { padding: '10px 20px', background: '#3e2723', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', marginBottom: '20px' },
  content: { maxWidth: '900px', margin: '0 auto', textAlign: 'center' },
  title: { color: '#1A202C', fontSize: '36px', fontWeight: '800', marginBottom: '40px' },
  mapContainer: { display: 'flex', justifyContent: 'space-between', marginBottom: '40px', position: 'relative', padding: '0 10px' },
  mapLine: { position: 'absolute', top: '25px', left: '40px', right: '40px', height: '4px', background: '#CBD5E0', zIndex: 1, borderRadius: '2px' },
  stepWrapper: { display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, width: '100px' },
  stepDot: { width: '55px', height: '55px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
  locationName: { marginTop: '10px', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' },
  timerTrack: { height: '10px', background: '#E2E8F0', borderRadius: '5px', marginBottom: '25px', overflow: 'hidden', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' },
  timerBar: { height: '100%', transition: '1s linear' },
  quizCard: { background: '#fff', padding: '35px', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)', textAlign: 'left' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  stepCount: { background: '#EDF2F7', padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', color: '#4A5568' },
  locationTitle: { color: '#718096', fontSize: '16px', fontWeight: '600' },
  questionText: { fontSize: '24px', fontWeight: '700', color: '#2D3748', lineHeight: '1.4', marginBottom: '30px' },
  optionsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' },
  optionBtn: { padding: '18px 25px', fontSize: '17px', borderRadius: '16px', border: '2px solid #E2E8F0', cursor: 'pointer', transition: 'all 0.2s ease', fontWeight: '600', textAlign: 'left' },
  explanationBox: { marginTop: '25px', padding: '25px', background: '#F0F9FF', borderRadius: '20px', borderLeft: '6px solid #3182CE' },
  infoText: { fontSize: '16px', lineHeight: '1.7', color: '#2A4365' },
  nextBtn: { marginTop: '20px', padding: '12px 25px', background: '#3182CE', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', width: '100%', fontSize: '16px' },
  resultCard: { background: '#fff', padding: '50px 30px', borderRadius: '32px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)' },
  scoreCircle: { margin: '30px auto', width: '180px', height: '180px', borderRadius: '50%', border: '12px solid #3e2723', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', background: '#FFFAF0' },
  feedbackText: { fontSize: '20px', color: '#4A5568', marginBottom: '35px', lineHeight: '1.6' },
  restartBtn: { padding: '18px 50px', background: '#3e2723', color: '#fff', borderRadius: '16px', border: 'none', cursor: 'pointer', fontSize: '20px', fontWeight: 'bold', transition: 'transform 0.2s' }
};

export default ManasQuiz;