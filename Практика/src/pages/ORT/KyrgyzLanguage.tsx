import React, { useState } from 'react';
import { FaArrowLeft, FaCheck, FaTimes, FaUndo, FaPenFancy, FaSpinner, FaCloudUploadAlt, FaLightbulb } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
// Сиздин папкаңыздын түзүлүшүнө жараша импортту текшериңиз
import { grammarData } from '../../data/grammarData'; 

const KyrgyzLanguage: React.FC = () => {
  const navigate = useNavigate();
  
  // Абалдар (States)
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const [username, setUsername] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Учурдагы суроону алуу
  const currentQ = grammarData[currentQuestion];

  const handleAnswer = (idx: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(idx);
    if (idx === currentQ.correct) {
      setScore(prev => prev + 1);
    }

    // Кийинки суроого өтүү
    setTimeout(() => {
      if (currentQuestion + 1 < grammarData.length) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
      }
    }, 1800);
  };

  const saveScoreToBackend = async () => {
    if (!username.trim()) {
      alert("Сураныч, атыңызды жазыңыз!");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('http://localhost:5000/api/ort/save-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          subject: 'Кыргыз тили',
          score,
          total: grammarData.length
        })
      });
      
      const data = await response.json();
      // Эгер сервериңиз success же ийгиликтүү статус кайтарса
      if (response.ok) {
        setIsSaved(true);
      } else {
        throw new Error(data.message || "Сактоодо ката кетти");
      }
    } catch (error) {
      console.error("Error saving score:", error);
      alert("Серверге туташууда ката кетти. Сураныч, кайра аракет кылыңыз.");
    } finally {
      setIsSaving(false);
    }
  };

  const progressPercent = ((currentQuestion + 1) / grammarData.length) * 100;

  return (
    <div style={styles.container}>
      <button onClick={() => navigate('/ort-prep')} style={styles.backBtn}>
        <FaArrowLeft /> ЖРТ Менюсу
      </button>

      {!showResult ? (
        <div style={styles.card}>
          <div style={styles.progressBarContainer}>
            <div style={{...styles.progressBar, width: `${progressPercent}%`}}></div>
          </div>

          <div style={styles.header}>
            <div style={styles.badge}>
              <FaPenFancy /> {currentQ.type || "Грамматика"}
            </div>
            <span style={styles.progressText}>Суроо {currentQuestion + 1}/{grammarData.length}</span>
          </div>

          <h2 style={styles.questionText}>{currentQ.question}</h2>

          <div style={styles.optionsContainer}>
            {/* Сүрөттөгү катаны оңдоо үчүн opt жана idx тибин бердик */}
            {currentQ.options.map((opt: string, idx: number) => {
              const isCorrect = idx === currentQ.correct;
              const isSelected = selectedAnswer === idx;
              const anySelected = selectedAnswer !== null;

              return (
                <button
                  key={idx}
                  disabled={anySelected}
                  onClick={() => handleAnswer(idx)}
                  style={{
                    ...styles.optionBtn,
                    opacity: anySelected && !isSelected && !isCorrect ? 0.6 : 1,
                    borderColor: anySelected ? (isCorrect ? '#10B981' : isSelected ? '#EF4444' : '#F1F5F9') : '#F1F5F9',
                    background: isSelected ? (isCorrect ? '#ECFDF5' : '#FEF2F2') : (anySelected && isCorrect ? '#ECFDF5' : '#fff'),
                    cursor: anySelected ? 'default' : 'pointer'
                  }}
                >
                  <span style={styles.optText}>{opt}</span>
                  {anySelected && (
                    isCorrect ? <FaCheck color="#10B981" /> : isSelected ? <FaTimes color="#EF4444" /> : null
                  )}
                </button>
              );
            })}
          </div>

          {selectedAnswer !== null && (
            <div style={styles.explanationBox}>
              <div style={{display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '5px', color: '#3B82F6'}}>
                <FaLightbulb /> <strong>Түшүндүрмө:</strong>
              </div>
              {currentQ.explanation}
            </div>
          )}
        </div>
      ) : (
        <div style={styles.resultCard}>
          {!isSaved ? (
            <>
              <div style={styles.resultCircle}>🎯</div>
              <h2 style={styles.resultTitle}>Азаматсыз!</h2>
              <div style={styles.finalScoreDisplay}>{score} / {grammarData.length}</div>
              <p style={{ color: '#64748B', marginBottom: '20px' }}>Жыйынтыкты сактоо үчүн атыңызды жазыңыз:</p>
              
              <input 
                type="text" 
                placeholder="Сиздин атыңыз..." 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={styles.input}
              />

              <button 
                onClick={saveScoreToBackend} 
                disabled={isSaving}
                style={{
                  ...styles.saveBtn,
                  opacity: isSaving ? 0.7 : 1
                }}
              >
                {isSaving ? <FaSpinner className="spinner" /> : <><FaCloudUploadAlt /> Рейтингге кошуу</>}
              </button>
            </>
          ) : (
            <div style={{ animation: 'fadeIn 0.5s' }}>
              <div style={{...styles.resultCircle, background: '#ECFDF5'}}><FaCheck size={30} color="#10B981" /></div>
              <h2 style={styles.resultTitle}>Ийгиликтүү сакталды!</h2>
              <button onClick={() => window.location.reload()} style={styles.retryBtn}>
                <FaUndo /> Кайра баштоо
              </button>
            </div>
          )}
        </div>
      )}

      {/* Анимация үчүн стилдер */}
      <style>{`
        .spinner { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
};

// Стилдер (Styles)
const styles: { [key: string]: React.CSSProperties } = {
  container: { padding: '30px 20px', maxWidth: '700px', margin: '0 auto', fontFamily: 'sans-serif', minHeight: '100vh', backgroundColor: '#F8FAFC' },
  backBtn: { display: 'flex', alignItems: 'center', gap: '8px', border: 'none', background: 'none', cursor: 'pointer', color: '#64748B', fontWeight: '700', marginBottom: '20px' },
  card: { background: '#fff', borderRadius: '24px', padding: '30px', boxShadow: '0 10px 40px rgba(0,0,0,0.06)', position: 'relative', overflow: 'hidden' },
  progressBarContainer: { position: 'absolute', top: 0, left: 0, width: '100%', height: '6px', background: '#F1F5F9' },
  progressBar: { height: '100%', background: '#3B82F6', transition: 'width 0.4s ease' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', marginTop: '10px' },
  badge: { background: '#DBEAFE', color: '#1E40AF', padding: '6px 14px', borderRadius: '10px', fontSize: '13px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' },
  progressText: { color: '#94A3B8', fontSize: '14px', fontWeight: '600' },
  questionText: { fontSize: '22px', fontWeight: '800', color: '#1E293B', marginBottom: '25px', lineHeight: '1.4' },
  optionsContainer: { display: 'grid', gap: '12px' },
  optionBtn: { padding: '18px 22px', borderRadius: '16px', border: '2px solid #F1F5F9', transition: '0.2s', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left', width: '100%' },
  optText: { fontSize: '16px', fontWeight: '600', color: '#334155' },
  explanationBox: { marginTop: '20px', padding: '18px', background: '#F0F9FF', borderRadius: '15px', borderLeft: '5px solid #3B82F6', fontSize: '14px', color: '#1E40AF', lineHeight: '1.5' },
  resultCard: { background: '#fff', borderRadius: '24px', padding: '50px', textAlign: 'center', boxShadow: '0 10px 40px rgba(0,0,0,0.08)' },
  resultCircle: { width: '70px', height: '70px', background: '#F8FAFC', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '30px' },
  resultTitle: { fontSize: '26px', fontWeight: '900', color: '#1E293B', marginBottom: '10px' },
  finalScoreDisplay: { fontSize: '40px', fontWeight: '900', color: '#3B82F6', marginBottom: '20px' },
  input: { width: '100%', padding: '15px', borderRadius: '12px', border: '2px solid #E2E8F0', marginBottom: '20px', outline: 'none', textAlign: 'center', fontSize: '16px' },
  saveBtn: { width: '100%', padding: '16px', borderRadius: '12px', border: 'none', background: '#10B981', color: '#fff', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', cursor: 'pointer' },
  retryBtn: { padding: '14px 30px', borderRadius: '12px', border: 'none', background: '#3B82F6', color: '#fff', fontWeight: 'bold', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '10px' }
};

export default KyrgyzLanguage;