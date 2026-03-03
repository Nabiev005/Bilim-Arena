import React, { useState, } from 'react';
import { FaArrowLeft, FaCheck, FaTimes, FaUndo, FaPenFancy, FaSpinner, FaCloudUploadAlt, FaLightbulb } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const KyrgyzLanguage: React.FC = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const [username, setUsername] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const questions = [
    {
      type: "Грамматика",
      question: "Төмөнкү сөздөрдүн ичинен кайсынысы туура жазылган?",
      options: ["А) Түнкүсүн", "Б) Түңкүсүн", "В) Түңкүсүң", "Г) Түнүкүсүн"],
      correct: 0,
      explanation: "Кыргыз тилинин орфографиялык эрежеси боюнча 'түнкүсүн' деп 'н' тамгасы менен жазылат."
    },
    {
      type: "Пунктуация",
      question: "Кайсы сүйлөмдө үтүр белгиси туура коюлган?",
      options: [
        "А) Албетте, биз бул ишти бүтүрөбүз.",
        "Б) Албетте биз бул, ишти бүтүрөбүз.",
        "В) Албетте биз бул ишти, бүтүрөбүз.",
        "Г) Албетте биз, бул ишти бүтүрөбүз."
      ],
      correct: 0,
      explanation: "'Албетте' - кириш сөз, ошондуктан сүйлөмдүн башында келсе, андан кийин үтүр коюлат."
    },
    {
      type: "Синтаксис",
      question: "Сүйлөмдүн ээсин табыңыз: 'Быйылкы түшүм мол болду.'",
      options: ["А) Быйылкы", "Б) Түшүм", "В) Мол", "Г) Болду"],
      correct: 1,
      explanation: "Ээси 'эмне?' деген суроого жооп берет. Эмне мол болду? Түшүм."
    }
  ];

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
          total: questions.length
        })
      });
      const data = await response.json();
      if (data.success) setIsSaved(true);
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
    if (idx === questions[currentQuestion].correct) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
      }
    }, 1800); // Түшүндүрмөнү окууга бир аз көбүрөөк убакыт
  };

  // Прогресс пайызы
  const progressPercent = ((currentQuestion + 1) / questions.length) * 100;

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
              <FaPenFancy /> {questions[currentQuestion].type}
            </div>
            <span style={styles.progressText}>Суроо {currentQuestion + 1}/{questions.length}</span>
          </div>

          <h2 style={styles.questionText}>{questions[currentQuestion].question}</h2>

          <div style={styles.optionsContainer}>
            {questions[currentQuestion].options.map((opt, idx) => {
              const isCorrect = idx === questions[currentQuestion].correct;
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
                  }}
                >
                  <span style={styles.optText}>{opt}</span>
                  {anySelected && (isCorrect ? <FaCheck color="#10B981" /> : isSelected ? <FaTimes color="#EF4444" /> : null)}
                </button>
              );
            })}
          </div>

          {selectedAnswer !== null && (
            <div style={styles.explanationBox}>
              <div style={{display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '5px', color: '#3B82F6'}}>
                <FaLightbulb /> <strong>Түшүндүрмө:</strong>
              </div>
              {questions[currentQuestion].explanation}
            </div>
          )}
        </div>
      ) : (
        <div style={styles.resultCard}>
          {!isSaved ? (
            <>
              <div style={styles.resultCircle}>🎯</div>
              <h2 style={styles.resultTitle}>Азаматсыз!</h2>
              <div style={styles.finalScoreDisplay}>{score} / {questions.length}</div>
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
                style={styles.saveBtn}
              >
                {isSaving ? <FaSpinner className="spinner" /> : <><FaCloudUploadAlt /> Рейтингге кошуу</>}
              </button>
            </>
          ) : (
            <>
              <div style={{...styles.resultCircle, background: '#ECFDF5'}}><FaCheck size={30} color="#10B981" /></div>
              <h2 style={styles.resultTitle}>Ийгиликтүү сакталды!</h2>
              <button onClick={() => window.location.reload()} style={styles.retryBtn}>
                <FaUndo /> Кайра баштоо
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: { padding: '30px 20px', maxWidth: '700px', margin: '0 auto', fontFamily: 'sans-serif' },
  backBtn: { display: 'flex', alignItems: 'center', gap: '8px', border: 'none', background: 'none', cursor: 'pointer', color: '#64748B', fontWeight: '700', marginBottom: '20px' },
  card: { background: '#fff', borderRadius: '24px', padding: '30px', boxShadow: '0 10px 40px rgba(0,0,0,0.06)', position: 'relative', overflow: 'hidden' },
  progressBarContainer: { position: 'absolute', top: 0, left: 0, width: '100%', height: '6px', background: '#F1F5F9' },
  progressBar: { height: '100%', background: '#3B82F6', transition: 'width 0.4s ease' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', marginTop: '10px' },
  badge: { background: '#DBEAFE', color: '#1E40AF', padding: '6px 14px', borderRadius: '10px', fontSize: '13px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' },
  progressText: { color: '#94A3B8', fontSize: '14px', fontWeight: '600' },
  questionText: { fontSize: '22px', fontWeight: '800', color: '#1E293B', marginBottom: '25px', lineHeight: '1.4' },
  optionsContainer: { display: 'grid', gap: '12px' },
  optionBtn: { padding: '18px 22px', borderRadius: '16px', border: '2px solid #F1F5F9', transition: '0.2s', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left', width: '100%', cursor: 'pointer' },
  optText: { fontSize: '16px', fontWeight: '600', color: '#334155' },
  explanationBox: { marginTop: '20px', padding: '18px', background: '#F0F9FF', borderRadius: '15px', borderLeft: '5px solid #3B82F6', fontSize: '14px', color: '#1E40AF', lineHeight: '1.5', animation: 'fadeIn 0.5s' },
  resultCard: { background: '#fff', borderRadius: '24px', padding: '50px', textAlign: 'center', boxShadow: '0 10px 40px rgba(0,0,0,0.08)' },
  resultCircle: { width: '70px', height: '70px', background: '#F8FAFC', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '30px' },
  resultTitle: { fontSize: '26px', fontWeight: '900', color: '#1E293B', marginBottom: '10px' },
  finalScoreDisplay: { fontSize: '40px', fontWeight: '900', color: '#3B82F6', marginBottom: '20px' },
  input: { width: '100%', padding: '15px', borderRadius: '12px', border: '2px solid #E2E8F0', marginBottom: '20px', outline: 'none', textAlign: 'center', fontSize: '16px' },
  saveBtn: { width: '100%', padding: '16px', borderRadius: '12px', border: 'none', background: '#10B981', color: '#fff', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', cursor: 'pointer' },
  retryBtn: { padding: '14px 30px', borderRadius: '12px', border: 'none', background: '#3B82F6', color: '#fff', fontWeight: 'bold', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '10px' }
};

export default KyrgyzLanguage;