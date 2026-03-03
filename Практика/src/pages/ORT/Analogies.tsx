import React, { useState } from 'react';
import { FaArrowLeft, FaCheckCircle, FaSpinner, FaUserCircle, FaLightbulb, FaTimesCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Analogies: React.FC = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [, setIsCorrect] = useState<boolean | null>(null);
  
  const [username, setUsername] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const questions = [
    {
      pair: "КИТЕП : ОКУУ",
      options: ["А) Бычак : Кесүү", "Б) Суу : Идиш", "В) Машина : Жол", "Г) Калем : Кагаз"],
      correct: 0,
      explanation: "Китеп окуу үчүн кызмат кылат, ошол сыяктуу эле бычак кесүү үчүн колдонулат."
    },
    {
      pair: "ДАГЫ : КАЙРА",
      options: ["А) Бирге : Жалгыз", "Б) Тез : Акырын", "В) Дайым : Ар качан", "Г) Эрте : Кеч"],
      correct: 2,
      explanation: "Бул сөздөр маанилеш (синонимдер). 'Дайым' жана 'Ар качан' да бири-бирин толуктайт."
    },
    {
      pair: "УСТО : БАЛКА",
      options: ["А) Мугалим : Класс", "Б) Тигүүчү : Ийне", "В) Суучул : Көл", "Г) Доктур : Оорукана"],
      correct: 1,
      explanation: "Усто балка менен иштейт (курал), тигүүчү ийне менен иштейт."
    }
  ];

  const handleAnswer = (index: number) => {
    if (selectedOption !== null) return; // Кайра басууга болбойт

    setSelectedOption(index);
    const correct = index === questions[currentQuestion].correct;
    setIsCorrect(correct);

    if (correct) {
      setScore(prev => prev + 1);
    }

    // Кийинки суроого автоматтык түрдө өтүү (1.5 секунддан кийин)
    setTimeout(() => {
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedOption(null);
        setIsCorrect(null);
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
          total: questions.length
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
          <div style={localStyles.progress}>Суроо: {currentQuestion + 1} / {questions.length}</div>
          <h2 style={localStyles.mainPair}>{questions[currentQuestion].pair}</h2>
          <p style={localStyles.hint}>Логикалык байланышты тандаңыз:</p>
          
          <div style={localStyles.optionsGrid}>
            {questions[currentQuestion].options.map((opt, idx) => {
              const isThisCorrect = idx === questions[currentQuestion].correct;
              const isThisSelected = idx === selectedOption;
              
              // eslint-disable-next-line prefer-const
              let btnStyle = { ...localStyles.optBtn };
              if (selectedOption !== null) {
                if (isThisCorrect) btnStyle.borderColor = '#10B981'; // Туура болсо жашыл
                if (isThisSelected && !isThisCorrect) btnStyle.borderColor = '#EF4444'; // Ката болсо кызыл
              }

              return (
                <button 
                  key={idx} 
                  onClick={() => handleAnswer(idx)} 
                  style={btnStyle}
                >
                  {opt}
                  {selectedOption !== null && isThisCorrect && <FaCheckCircle style={{float: 'right', color: '#10B981'}} />}
                  {isThisSelected && !isThisCorrect && <FaTimesCircle style={{float: 'right', color: '#EF4444'}} />}
                </button>
              );
            })}
          </div>

          {selectedOption !== null && (
            <div style={localStyles.explanationBox}>
              <FaLightbulb color="#F59E0B" />
              <span>{questions[currentQuestion].explanation}</span>
            </div>
          )}
        </div>
      ) : (
        <div style={localStyles.resultCard}>
          {!isSaved ? (
            <>
              <FaUserCircle size={50} color="#3B82F6" style={{ marginBottom: '15px' }} />
              <h2>Тест аяктады!</h2>
              <div style={localStyles.scoreCircle}>{score} / {questions.length}</div>
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
            <>
              <FaCheckCircle size={60} color="#10B981" />
              <h2 style={{ marginTop: '15px' }}>Сакталды!</h2>
              <button onClick={() => window.location.reload()} style={localStyles.retryBtn}>Кайра баштоо</button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

const localStyles: { [key: string]: React.CSSProperties } = {
  container: { padding: '40px 20px', maxWidth: '650px', margin: '0 auto', fontFamily: 'sans-serif' },
  backBtn: { display: 'flex', alignItems: 'center', gap: '8px', border: 'none', background: 'none', cursor: 'pointer', color: '#64748B', fontWeight: '600', marginBottom: '20px' },
  card: { background: '#fff', borderRadius: '24px', padding: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', textAlign: 'center' },
  progress: { color: '#3B82F6', fontWeight: 'bold', marginBottom: '15px', fontSize: '14px' },
  mainPair: { fontSize: '28px', letterSpacing: '3px', color: '#1E293B', marginBottom: '10px', fontWeight: 'bold' },
  hint: { color: '#94A3B8', marginBottom: '25px', fontSize: '14px' },
  optionsGrid: { display: 'grid', gap: '12px' },
  optBtn: { padding: '16px', borderRadius: '12px', border: '2px solid #F1F5F9', background: '#fff', fontSize: '16px', cursor: 'pointer', transition: '0.2s', textAlign: 'left' },
  explanationBox: { marginTop: '20px', padding: '15px', background: '#FFFBEB', borderRadius: '12px', color: '#92400E', fontSize: '14px', display: 'flex', gap: '10px', alignItems: 'flex-start', textAlign: 'left', animation: 'fadeIn 0.5s' },
  resultCard: { background: '#fff', borderRadius: '24px', padding: '40px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' },
  scoreCircle: { fontSize: '32px', fontWeight: 'bold', color: '#3B82F6', margin: '20px 0' },
  input: { width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #E2E8F0', marginBottom: '15px', outline: 'none' },
  saveBtn: { width: '100%', padding: '14px', borderRadius: '10px', border: 'none', background: '#10B981', color: '#fff', fontWeight: 'bold', cursor: 'pointer' },
  retryBtn: { marginTop: '10px', padding: '12px 25px', borderRadius: '10px', border: 'none', background: '#3B82F6', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }
};

export default Analogies;