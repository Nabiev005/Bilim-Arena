import React, { useState } from 'react';
import { FaArrowLeft, FaCheck, FaTimes, FaRedo, FaSpinner, FaCloudUploadAlt, FaCalculator } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
// Маалыматты сырттан импорттоо
import { mathQuestions } from '../../data/mathData'; 

const MathSection: React.FC = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const [username, setUsername] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Учурдагы суроону алуу
  const currentQ = mathQuestions[currentQuestion];

  const saveScoreToBackend = async () => {
    if (!username.trim()) {
      alert("Сураныч, атыңызды киргизиңиз!");
      return;
    }
    setIsSaving(true);
    try {
      const response = await fetch('http://localhost:5000/api/ort/save-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          subject: 'Математика',
          score,
          total: mathQuestions.length
        })
      });
      if (response.ok) setIsSaved(true);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      alert("Серверге туташууда ката кетти.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAnswer = (idx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    if (idx === currentQ.correct) setScore(score + 1);

    setTimeout(() => {
      if (currentQuestion + 1 < mathQuestions.length) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  return (
    <div style={styles.container}>
      <button onClick={() => navigate('/ort-prep')} style={styles.backBtn}>
        <FaArrowLeft /> ЖРТ Менюсу
      </button>

      {!showResult ? (
        <div style={styles.quizCard}>
          <div style={styles.header}>
             <div style={styles.topicBadge}><FaCalculator /> {currentQ.title}</div>
             <span style={styles.counter}>{currentQuestion + 1} / {mathQuestions.length}</span>
          </div>

          <div style={styles.comparisonGrid}>
            <div style={{...styles.columnBox, borderLeft: '6px solid #3B82F6'}}>
              <span style={styles.columnLabel}>А тилкеси</span>
              <div style={styles.columnValue}>{currentQ.columnA}</div>
            </div>
            
            <div style={styles.vsCircle}>VS</div>
            
            <div style={{...styles.columnBox, borderLeft: '6px solid #F59E0B'}}>
              <span style={styles.columnLabel}>Б тилкеси</span>
              <div style={styles.columnValue}>{currentQ.columnB}</div>
            </div>
          </div>

          <div style={styles.optionsList}>
            {/* opt жана idx типтери кошулду, ката болбошу үчүн */}
            {currentQ.options.map((opt: string, idx: number) => {
              const isCorrect = idx === currentQ.correct;
              const isSelected = selectedAnswer === idx;
              return (
                <button 
                  key={idx} 
                  disabled={selectedAnswer !== null}
                  onClick={() => handleAnswer(idx)}
                  style={{
                    ...styles.optBtn,
                    borderColor: isSelected ? (isCorrect ? '#10B981' : '#EF4444') : (selectedAnswer !== null && isCorrect ? '#10B981' : '#F1F5F9'),
                    background: isSelected ? (isCorrect ? '#ECFDF5' : '#FEF2F2') : '#fff',
                    cursor: selectedAnswer !== null ? 'default' : 'pointer'
                  }}
                >
                  <span>{opt}</span>
                  {selectedAnswer === idx && (isCorrect ? <FaCheck color="#10B981" /> : <FaTimes color="#EF4444" />)}
                </button>
              );
            })}
          </div>

          {selectedAnswer !== null && (
            <div style={styles.explanationBox}>
              <strong>Түшүндүрмө:</strong> {currentQ.explanation}
            </div>
          )}
        </div>
      ) : (
        <div style={styles.resultCard}>
          {!isSaved ? (
            <>
              <div style={styles.resultIcon}>🎯</div>
              <h2 style={styles.resultTitle}>Жыйынтык</h2>
              <div style={styles.finalScore}>{score} / {mathQuestions.length}</div>
              <input 
                type="text" 
                placeholder="Атыңызды жазыңыз..." 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={styles.input}
              />
              <button onClick={saveScoreToBackend} disabled={isSaving} style={styles.saveBtn}>
                {isSaving ? <FaSpinner className="spinner" /> : <><FaCloudUploadAlt /> Сактоо</>}
              </button>
            </>
          ) : (
            <>
              <div style={{...styles.resultIcon, color: '#10B981'}}><FaCheck /></div>
              <h2 style={styles.resultTitle}>Ийгиликтүү сакталды!</h2>
              <button onClick={() => window.location.reload()} style={styles.retryBtn}><FaRedo /> Кайра баштоо</button>
            </>
          )}
        </div>
      )}
      <style>{`
        .spinner { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: { padding: '30px 20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' },
  backBtn: { display: 'flex', alignItems: 'center', gap: '8px', border: 'none', background: 'none', cursor: 'pointer', color: '#64748B', fontWeight: '700', marginBottom: '20px' },
  quizCard: { background: '#fff', borderRadius: '24px', padding: '35px', boxShadow: '0 10px 40px rgba(0,0,0,0.06)' },
  header: { display: 'flex', justifyContent: 'space-between', marginBottom: '25px', alignItems: 'center' },
  topicBadge: { background: '#EFF6FF', color: '#2563EB', padding: '8px 15px', borderRadius: '12px', fontSize: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' },
  counter: { color: '#94A3B8', fontWeight: 'bold' },
  comparisonGrid: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '35px' },
  columnBox: { flex: 1, background: '#F8FAFC', padding: '20px', borderRadius: '16px', textAlign: 'center' },
  columnLabel: { fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase', fontWeight: '800', marginBottom: '8px', display: 'block' },
  columnValue: { fontSize: '18px', fontWeight: '700', color: '#1E293B' },
  vsCircle: { width: '40px', height: '40px', background: '#F1F5F9', color: '#64748B', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px' },
  optionsList: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  optBtn: { padding: '18px', borderRadius: '15px', border: '2px solid #F1F5F9', fontSize: '14px', fontWeight: '700', transition: '0.2s', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  explanationBox: { marginTop: '20px', padding: '15px', background: '#F0F9FF', borderRadius: '12px', color: '#1E40AF', fontSize: '14px', borderLeft: '5px solid #3B82F6' },
  resultCard: { background: '#fff', borderRadius: '24px', padding: '50px', textAlign: 'center', boxShadow: '0 10px 40px rgba(0,0,0,0.08)' },
  resultIcon: { fontSize: '50px', marginBottom: '15px' },
  resultTitle: { fontSize: '24px', fontWeight: '900', color: '#1E293B' },
  finalScore: { fontSize: '42px', fontWeight: '900', color: '#3B82F6', margin: '15px 0' },
  input: { width: '100%', padding: '15px', borderRadius: '12px', border: '2px solid #E2E8F0', marginBottom: '15px', textAlign: 'center' },
  saveBtn: { width: '100%', padding: '15px', borderRadius: '12px', border: 'none', background: '#10B981', color: '#fff', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' },
  retryBtn: { padding: '12px 30px', borderRadius: '12px', border: 'none', background: '#3B82F6', color: '#fff', fontWeight: 'bold', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '10px' }
};

export default MathSection;