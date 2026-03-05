import React, { useState } from 'react';
import { FaArrowLeft, FaCheckCircle, FaSpinner, FaUserCircle, FaLightbulb, FaTimesCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
// Импортту сиздин папкаңыздын түзүлүшүнө карап оңдодум:
import { analogiesData, type AnalogyQuestion } from '../../data/analogiesData'; 

const Analogies: React.FC = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  
  const [username, setUsername] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Учурдагы суроону алуу (Тибин так көрсөттүк)
  const currentQ: AnalogyQuestion = analogiesData[currentQuestion];

  const handleAnswer = (index: number) => {
    if (selectedOption !== null) return;

    setSelectedOption(index);
    if (index === currentQ.correct) {
      setScore(prev => prev + 1);
    }

    setTimeout(() => {
      if (currentQuestion + 1 < analogiesData.length) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedOption(null);
      } else {
        setShowResult(true);
      }
    }, 1800);
  };

  const saveResult = async () => {
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
          subject: 'Аналогиялар',
          score,
          total: analogiesData.length
        })
      });
      if (response.ok) setIsSaved(true);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      alert("Серверге сактоодо ката кетти.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={localStyles.container}>
      <button onClick={() => navigate('/ort-prep')} style={localStyles.backBtn}>
        <FaArrowLeft /> Артка
      </button>

      {!showResult ? (
        <div style={localStyles.card}>
          <div style={localStyles.progress}>
            Суроо: {currentQuestion + 1} / {analogiesData.length}
          </div>
          
          {currentQ && (
            <>
              <h2 style={localStyles.mainPair}>{currentQ.pair}</h2>
              <p style={localStyles.hint}>Логикалык байланышты тандаңыз:</p>
              
              <div style={localStyles.optionsGrid}>
                {/* Ката ушул жерден чыгып жаткан, 'opt: string' деп тип бердик */}
                {currentQ.options.map((opt: string, idx: number) => {
                  const isThisCorrect = idx === currentQ.correct;
                  const isThisSelected = idx === selectedOption;
                  
                  let btnStyle = { ...localStyles.optBtn };
                  if (selectedOption !== null) {
                    if (isThisCorrect) {
                      btnStyle = { ...btnStyle, borderColor: '#10B981', backgroundColor: '#F0FDF4' };
                    } else if (isThisSelected) {
                      btnStyle = { ...btnStyle, borderColor: '#EF4444', backgroundColor: '#FEF2F2' };
                    }
                  }

                  return (
                    <button 
                      key={idx} 
                      onClick={() => handleAnswer(idx)} 
                      style={btnStyle}
                      disabled={selectedOption !== null}
                    >
                      <span>{opt}</span>
                      {selectedOption !== null && isThisCorrect && <FaCheckCircle color="#10B981" />}
                      {isThisSelected && !isThisCorrect && <FaTimesCircle color="#EF4444" />}
                    </button>
                  );
                })}
              </div>

              {selectedOption !== null && (
                <div style={localStyles.explanationBox}>
                  <FaLightbulb color="#F59E0B" style={{ minWidth: '20px' }} />
                  <span>{currentQ.explanation}</span>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <div style={localStyles.resultCard}>
          {!isSaved ? (
            <>
              <FaUserCircle size={50} color="#3B82F6" style={{ marginBottom: '15px' }} />
              <h2>Тест аяктады!</h2>
              <div style={localStyles.scoreCircle}>{score} / {analogiesData.length}</div>
              <input 
                type="text" 
                placeholder="Сиздин атыңыз..." 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={localStyles.input}
              />
              <button onClick={saveResult} disabled={isSaving} style={localStyles.saveBtn}>
                {isSaving ? <FaSpinner className="spinner" /> : 'Рейтингге кошуу'}
              </button>
            </>
          ) : (
            <div style={{ animation: 'fadeIn 0.5s' }}>
              <FaCheckCircle size={60} color="#10B981" />
              <h2 style={{ marginTop: '15px' }}>Сакталды!</h2>
              <button onClick={() => window.location.reload()} style={localStyles.retryBtn}>Кайра баштоо</button>
            </div>
          )}
        </div>
      )}

      <style>{`
        .spinner { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
};

const localStyles: { [key: string]: React.CSSProperties } = {
  container: { padding: '40px 20px', maxWidth: '650px', margin: '0 auto', fontFamily: 'sans-serif', minHeight: '100vh', backgroundColor: '#F8FAFC' },
  backBtn: { display: 'flex', alignItems: 'center', gap: '8px', border: 'none', background: 'none', cursor: 'pointer', color: '#64748B', fontWeight: 'bold', marginBottom: '20px' },
  card: { background: '#fff', borderRadius: '24px', padding: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', textAlign: 'center' },
  progress: { color: '#3B82F6', fontWeight: 'bold', marginBottom: '15px', fontSize: '14px' },
  mainPair: { fontSize: '28px', letterSpacing: '3px', color: '#1E293B', marginBottom: '10px', fontWeight: 'bold' },
  hint: { color: '#94A3B8', marginBottom: '25px', fontSize: '14px' },
  optionsGrid: { display: 'grid', gap: '12px' },
  optBtn: { padding: '16px', borderRadius: '12px', border: '2px solid #F1F5F9', background: '#fff', fontSize: '16px', cursor: 'pointer', transition: '0.2s', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', outline: 'none' },
  explanationBox: { marginTop: '20px', padding: '15px', background: '#FFFBEB', borderRadius: '12px', color: '#92400E', fontSize: '14px', display: 'flex', gap: '10px', alignItems: 'flex-start', textAlign: 'left', border: '1px solid #FEF3C7' },
  resultCard: { background: '#fff', borderRadius: '24px', padding: '40px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' },
  scoreCircle: { fontSize: '32px', fontWeight: 'bold', color: '#3B82F6', margin: '20px 0', background: '#EFF6FF', display: 'inline-block', padding: '10px 25px', borderRadius: '50px' },
  input: { width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #E2E8F0', marginBottom: '15px', outline: 'none' },
  saveBtn: { width: '100%', padding: '14px', borderRadius: '10px', border: 'none', background: '#10B981', color: '#fff', fontWeight: 'bold', cursor: 'pointer' },
  retryBtn: { marginTop: '10px', padding: '12px 25px', borderRadius: '10px', border: 'none', background: '#3B82F6', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }
};

export default Analogies;