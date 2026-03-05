import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { akTerekQuestions } from '../data/akTerekData';

const AkTerekGame: React.FC = () => {
  const navigate = useNavigate();
  const [teamA, setTeamA] = useState(5);
  const [teamB, setTeamB] = useState(5);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [turn, setTurn] = useState<'A' | 'B'>('A');
  const [message, setMessage] = useState('Ак теректен ким керек?');
  const [gameOver, setGameOver] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Экрандын көлөмүн көзөмөлдөө (мобилдик үчүн)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const currentQuestion = akTerekQuestions[currentIndex];

  const handleAnswer = (selectedOption: string) => {
    if (gameOver || showFeedback || !currentQuestion) return;

    const correct = selectedOption === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);

    setTimeout(() => {
      let newTeamA = teamA;
      let newTeamB = teamB;

      if (correct) {
        if (turn === 'A') {
          newTeamA += 1;
          newTeamB -= 1;
        } else {
          newTeamB += 1;
          newTeamA -= 1;
        }
      } else {
        if (turn === 'A') {
          newTeamA -= 1;
          newTeamB += 1;
        } else {
          newTeamB -= 1;
          newTeamA += 1;
        }
      }

      setTeamA(newTeamA);
      setTeamB(newTeamB);

      // Жеңүүчүнү текшерүү
      if (newTeamA <= 0 || newTeamB <= 0) {
        setGameOver(true);
      } else {
        setCurrentIndex((prev) => (prev + 1) % akTerekQuestions.length);
        setTurn(turn === 'A' ? 'B' : 'A');
        setShowFeedback(false);
        setIsCorrect(null);
        setMessage(turn === 'A' ? 'Көк теректен ким керек?' : 'Ак теректен ким керек?');
      }
    }, 2000);
  };

  return (
    <div style={styles.container}>
      <Sidebar />
      <main style={{ ...styles.content, padding: isMobile ? '20px 15px' : '40px 20px' }}>
        <div style={styles.topActions}>
          <button onClick={() => navigate(-1)} style={styles.backBtn}>← Артка</button>
          <button onClick={() => window.location.reload()} style={styles.resetBtn}>🔄 Жаңылоо</button>
        </div>

        <div style={styles.gameHeader}>
          <div style={styles.badge}>Улуттук-интеллектуалдык оюн</div>
          <h1 style={{ ...styles.title, fontSize: isMobile ? '24px' : '32px' }}>Ак терек, Көк терек 🌳</h1>
          <p style={styles.subtitle}>Аналогияны чечип, командаңызды сактап калыңыз</p>
        </div>

        {/* Скорборд */}
        <div style={{ ...styles.scoreBoard, flexDirection: isMobile ? 'column' : 'row' }}>
          <div style={{ ...styles.teamCard, borderBottom: turn === 'A' ? '6px solid #3182CE' : '2px solid #E2E8F0' }}>
            <h3 style={{ color: '#3182CE', margin: 0 }}>Ак терек</h3>
            <div style={styles.playerIcons}>
              {[...Array(Math.max(0, teamA))].map((_, i) => <span key={i} style={{fontSize: '18px'}}>🔵</span>)}
            </div>
            <div style={styles.scoreNum}>{teamA}</div>
          </div>
          
          {!isMobile && <div style={styles.vsCircle}>VS</div>}

          <div style={{ ...styles.teamCard, borderBottom: turn === 'B' ? '6px solid #667EEA' : '2px solid #E2E8F0' }}>
            <h3 style={{ color: '#667EEA', margin: 0 }}>Көк терек</h3>
            <div style={styles.playerIcons}>
              {[...Array(Math.max(0, teamB))].map((_, i) => <span key={i} style={{fontSize: '18px'}}>🟣</span>)}
            </div>
            <div style={styles.scoreNum}>{teamB}</div>
          </div>
        </div>

        {!gameOver ? (
          <div style={{ ...styles.questionBox, padding: isMobile ? '20px' : '30px' }}>
            <div style={styles.turnIndicator}>
              Кезек: {turn === 'A' ? 'Ак терек' : 'Көк терек'}
            </div>
            <p style={styles.messageText}>{message}</p>
            <h2 style={{ ...styles.questionTitle, fontSize: isMobile ? '18px' : '22px' }}>
              {currentQuestion?.question}
            </h2>

            <div style={styles.optionsGrid}>
              {currentQuestion?.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option)}
                  disabled={showFeedback}
                  style={{
                    ...styles.optionBtn,
                    borderColor: showFeedback && option === currentQuestion.correctAnswer ? '#48BB78' : '#E2E8F0',
                    background: showFeedback && option === currentQuestion.correctAnswer ? '#F0FFF4' : '#FFF',
                    boxShadow: showFeedback && option === currentQuestion.correctAnswer ? '0 0 10px rgba(72, 187, 120, 0.2)' : 'none'
                  }}
                >
                  {option}
                </button>
              ))}
            </div>

            {showFeedback && (
              <div style={{
                ...styles.feedback,
                background: isCorrect ? '#F0FFF4' : '#FFF5F5',
                color: isCorrect ? '#2F855A' : '#C53030',
                border: `1px solid ${isCorrect ? '#C6F6D5' : '#FED7D7'}`
              }}>
                {isCorrect ? "✅ Туура! Сиз чынжырды үзүп, оюнчу алдыңыз!" : "❌ Ката! Сиз өтө албай, туткунга кеттиңиз."}
              </div>
            )}
          </div>
        ) : (
          <div style={styles.gameOverCard}>
            <span style={{fontSize: '60px'}}>🏆</span>
            <h2 style={{fontSize: '28px', marginTop: '10px'}}>Оюн бүттү!</h2>
            <p style={{fontSize: '22px', fontWeight: '700', margin: '20px 0', color: '#2D3748'}}>
              {teamA > teamB ? "Ак терек жеңди! 🎉" : "Көк терек жеңди! 🎉"}
            </p>
            <button onClick={() => window.location.reload()} style={styles.checkBtn}>Кайра баштоо</button>
          </div>
        )}
      </main>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: { display: 'flex', background: '#F8FAFC', minHeight: '100vh', fontFamily: "'Inter', sans-serif" },
  content: { flex: 1, maxWidth: '900px', margin: '0 auto' },
  topActions: { display: 'flex', justifyContent: 'space-between', marginBottom: '30px' },
  backBtn: { background: '#FFF', border: '1px solid #E2E8F0', padding: '10px 18px', borderRadius: '12px', color: '#64748B', cursor: 'pointer', fontWeight: '600' },
  resetBtn: { background: '#FFF', border: '1px solid #E2E8F0', padding: '10px 18px', borderRadius: '12px', cursor: 'pointer', fontWeight: '600' },
  gameHeader: { textAlign: 'center', marginBottom: '30px' },
  badge: { background: '#EBF4FF', color: '#3182CE', display: 'inline-block', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', marginBottom: '10px' },
  title: { fontWeight: '800', color: '#1A202C', margin: 0 },
  subtitle: { color: '#718096', marginTop: '8px' },
  scoreBoard: { display: 'flex', justifyContent: 'space-between', alignItems: 'stretch', gap: '15px', marginBottom: '30px' },
  teamCard: { background: '#FFF', flex: 1, padding: '20px', borderRadius: '24px', textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', transition: 'all 0.3s' },
  playerIcons: { margin: '15px 0', minHeight: '30px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '4px' },
  scoreNum: { fontSize: '32px', fontWeight: '900', color: '#2D3748' },
  vsCircle: { background: '#F1F5F9', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#94A3B8', alignSelf: 'center' },
  questionBox: { background: '#FFF', borderRadius: '32px', border: '1px solid #E2E8F0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' },
  turnIndicator: { background: '#F7FAFC', display: 'inline-block', padding: '8px 20px', borderRadius: '12px', fontWeight: '700', color: '#4A5568', marginBottom: '10px', fontSize: '14px' },
  messageText: { color: '#A0AEC0', fontSize: '13px', marginBottom: '15px', fontStyle: 'italic' },
  questionTitle: { fontWeight: '800', color: '#2D3748', marginBottom: '25px', lineHeight: '1.4' },
  optionsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' },
  optionBtn: { padding: '18px', textAlign: 'left', border: '2px solid #F1F5F9', borderRadius: '18px', cursor: 'pointer', fontSize: '15px', fontWeight: '600', transition: 'all 0.2s' },
  feedback: { marginTop: '25px', padding: '18px', borderRadius: '16px', textAlign: 'center', fontWeight: '700', fontSize: '15px' },
  gameOverCard: { textAlign: 'center', background: '#FFF', padding: '50px 30px', borderRadius: '32px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', border: '1px solid #E2E8F0' },
  checkBtn: { background: '#2D3748', color: '#FFF', padding: '16px 45px', borderRadius: '16px', border: 'none', cursor: 'pointer', fontSize: '18px', fontWeight: '700', transition: '0.2s' }
};

export default AkTerekGame;