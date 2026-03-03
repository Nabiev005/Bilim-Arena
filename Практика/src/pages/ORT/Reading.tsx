import React, { useState, useEffect } from 'react';
import { 
  FaArrowLeft, FaBookOpen, FaLightbulb, FaCheck, FaTimes, 
  FaRedo, FaCloudUploadAlt, FaSpinner, 
  FaClock, FaTextHeight, FaSearchPlus, FaSearchMinus 
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Reading: React.FC = () => {
  const navigate = useNavigate();
  
  // Тесттин абалы
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  
  // Визуалдык параметрлер
  const [fontSize, setFontSize] = useState(17);
  const [timeLeft, setTimeLeft] = useState(300); // 5 мүнөт (300 секунд)

  // Колдонуучу жана Сактоо
  const [username, setUsername] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const passage = {
    title: "Тил жана маданият",
    content: `Тил — бул жөн гана баарлашуунун куралы эмес, ал элдин маданиятынын, тарыхынын жана дүйнө таанымынын күзгүсү. Ар бир тил өзүнө гана мүнөздүү болгон өзгөчөлүктөр аркылуу ошол элдин жашоо образын чагылдырат. Эгерде тил жоголсо, анда ошол элдин кылымдар бою топтогон акыл-эс байлыгы, каада-салты жана өзгөчө көз карашы кошо жок болот. Ошондуктан тилди сактоо — бул улутту сактоо дегендикке жатат. Бүгүнкү ааламдашуу заманында тилдердин өз ара таасир алышуусу күчөп жатат, бирок эне тилдин тазалыгын сактоо ар бир инсандын ыйык милдети бойдон калууда.`,
  };

  const questions = [
    {
      question: "Тексттин негизги ою кайсы?",
      options: [
        "А) Ааламдашуу процессинин пайдасы",
        "Б) Тилдин маданият жана улутту сактоодогу ролу",
        "В) Тилдердин бири-бирине тийгизген таасири",
        "Г) Жашоо образын өзгөртүү жолдору"
      ],
      correct: 1,
      explanation: "Текстте тил улуттун жана маданияттун негизи экени баса белгиленген."
    },
    {
      question: "Автордун пикири боюнча, тил жоголсо эмне болот?",
      options: [
        "А) Баарлашуу жеңилдейт",
        "Б) Жаңы тилдер пайда болот",
        "В) Элдин акыл-эс байлыгы жана тарыхы кошо жоголот",
        "Г) Элдин саны азаят"
      ],
      correct: 2,
      explanation: "Текстте: 'Тил жоголсо, ошол элдин топтогон акыл-эс байлыгы кошо жок болот' деп ачык айтылган."
    },
    {
      question: "Текстке ылайык, эне тилди сактоо кимдин милдети?",
      options: [
        "А) Мамлекеттин гана милдети",
        "Б) Ар бир инсандын ыйык милдети",
        "В) Филологдордун милдети",
        "Г) Келечек муундун милдети"
      ],
      correct: 1,
      explanation: "Тексттин соңунда эне тилди сактоо ар бир инсандын милдети деп көрсөтүлгөн."
    }
  ];

  // Таймер логикасы
  useEffect(() => {
    if (timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setShowResult(true);
    }
  }, [timeLeft, showResult]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleAnswer = (idx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    
    if (idx === questions[currentQuestion].correct) {
      setScore(prev => prev + 1);
    }

    setTimeout(() => {
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
      }
    }, 2000);
  };

  const saveScoreToBackend = async () => {
    if (!username.trim()) { alert("Атыңызды киргизиңиз!"); return; }
    setIsSaving(true);
    try {
      // API дарегиңизди бул жерге жазыңыз
      await new Promise(res => setTimeout(res, 1500)); // Симуляция
      setIsSaved(true);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      alert("Серверге туташууда ката кетти.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.headerRow}>
        <button onClick={() => navigate('/ort-prep')} style={styles.backBtn}>
          <FaArrowLeft /> ЖРТ Менюсу
        </button>
        
        {!showResult && (
          <div style={{...styles.timer, color: timeLeft < 60 ? '#EF4444' : '#1E293B'}}>
            <FaClock /> {formatTime(timeLeft)}
          </div>
        )}
      </div>

      {!showResult ? (
        <>
          {/* Progress Bar */}
          <div style={styles.progressBarBg}>
            <div style={{...styles.progressBarFill, width: `${((currentQuestion + 1) / questions.length) * 100}%`}}></div>
          </div>

          <div style={styles.layout}>
            {/* Текст тарабы */}
            <div style={styles.passageSide}>
              <div style={styles.passageHeader}>
                <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                  <FaBookOpen color="#EF4444" />
                  <h3 style={styles.passageTitle}>{passage.title}</h3>
                </div>
                <div style={styles.fontSizeControls}>
                  <button onClick={() => setFontSize(f => Math.max(14, f - 2))} style={styles.iconBtn}><FaSearchMinus /></button>
                  <FaTextHeight size={14} color="#64748B" />
                  <button onClick={() => setFontSize(f => Math.min(24, f + 2))} style={styles.iconBtn}><FaSearchPlus /></button>
                </div>
              </div>
              <div style={{...styles.passageBody, fontSize: `${fontSize}px`}}>
                {passage.content}
              </div>
              <div style={styles.tipBox}>
                <FaLightbulb color="#F59E0B" />
                <span>Сунуш: Маанилүү жерлерин көзүңүз менен белгилеп алыңыз.</span>
              </div>
            </div>

            {/* Суроо тарабы */}
            <div style={styles.questionSide}>
              <div style={styles.progressHeader}>
                СУРОО {currentQuestion + 1} / {questions.length}
              </div>
              <h2 style={styles.questionTitle}>{questions[currentQuestion].question}</h2>
              
              <div style={styles.optionsList}>
                {questions[currentQuestion].options.map((opt, idx) => {
                  const isCorrect = idx === questions[currentQuestion].correct;
                  const isSelected = selectedAnswer === idx;
                  return (
                    <button
                      key={idx}
                      disabled={selectedAnswer !== null}
                      onClick={() => handleAnswer(idx)}
                      style={{
                        ...styles.optBtn,
                        borderColor: isSelected ? (isCorrect ? '#10B981' : '#EF4444') : '#E2E8F0',
                        background: isSelected ? (isCorrect ? '#ECFDF5' : '#FEF2F2') : '#fff',
                      }}
                    >
                      <span style={styles.optText}>{opt}</span>
                      {isSelected && (isCorrect ? <FaCheck color="#10B981" /> : <FaTimes color="#EF4444" />)}
                    </button>
                  );
                })}
              </div>

              {selectedAnswer !== null && (
                <div style={styles.explanationBox}>
                  <strong>Түшүндүрмө:</strong> {questions[currentQuestion].explanation}
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        /* Жыйынтык картасы */
        <div style={styles.resultCard}>
          {!isSaved ? (
            <>
              <div style={styles.circleProgress}>
                <span style={styles.circleScore}>{Math.round((score/questions.length)*100)}%</span>
              </div>
              <h2 style={styles.resultTitle}>Азаматсыз!</h2>
              <p style={styles.resultScore}>Сиз {questions.length} суроодон <b>{score}</b> упай алдыңыз.</p>
              
              <div style={styles.saveSection}>
                <input 
                  type="text" 
                  placeholder="Атыңызды киргизиңиз..." 
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
              </div>
            </>
          ) : (
            <div style={styles.successState}>
              <FaCheck size={50} color="#10B981" />
              <h2 style={styles.resultTitle}>Сакталды!</h2>
              <p style={styles.resultScore}>Жыйынтык лидерлер тактасына жөнөтүлдү.</p>
              <button onClick={() => window.location.reload()} style={styles.retryBtn}>
                <FaRedo /> Кайра баштоо
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Стилдер
const styles: { [key: string]: React.CSSProperties } = {
  container: { padding: '30px 20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Inter, sans-serif' },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  backBtn: { display: 'flex', alignItems: 'center', gap: '8px', border: 'none', background: 'none', cursor: 'pointer', color: '#64748B', fontWeight: '700' },
  timer: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', fontWeight: '800', background: '#fff', padding: '8px 16px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' },
  progressBarBg: { width: '100%', height: '6px', background: '#E2E8F0', borderRadius: '10px', marginBottom: '30px', overflow: 'hidden' },
  progressBarFill: { height: '100%', background: '#3B82F6', transition: '0.4s ease' },
  layout: { display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px', alignItems: 'start' },
  passageSide: { background: '#fff', padding: '35px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', border: '1px solid #F1F5F9' },
  passageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  fontSizeControls: { display: 'flex', alignItems: 'center', gap: '10px', background: '#F8FAFC', padding: '5px 10px', borderRadius: '10px' },
  iconBtn: { border: 'none', background: 'none', cursor: 'pointer', color: '#3B82F6' },
  passageTitle: { margin: 0, fontSize: '22px', fontWeight: '800' },
  passageBody: { lineHeight: '1.8', color: '#334155', textAlign: 'justify', transition: 'font-size 0.2s' },
  tipBox: { marginTop: '25px', padding: '15px', background: '#FFFBEB', borderRadius: '15px', display: 'flex', gap: '10px', fontSize: '14px', color: '#B45309', border: '1px solid #FEF3C7' },
  questionSide: { background: '#F8FAFC', padding: '35px', borderRadius: '24px', border: '1px solid #E2E8F0' },
  progressHeader: { fontSize: '12px', fontWeight: '800', color: '#3B82F6', marginBottom: '10px' },
  questionTitle: { fontSize: '20px', fontWeight: '800', marginBottom: '25px', color: '#1E293B' },
  optionsList: { display: 'grid', gap: '12px' },
  optBtn: { padding: '18px', borderRadius: '15px', border: '2px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left', cursor: 'pointer', transition: '0.2s' },
  optText: { fontSize: '15px', fontWeight: '600' },
  explanationBox: { marginTop: '20px', padding: '15px', background: '#E0F2FE', borderRadius: '12px', color: '#0369A1', borderLeft: '4px solid #3B82F6' },
  resultCard: { textAlign: 'center', padding: '50px', background: '#fff', borderRadius: '30px', boxShadow: '0 20px 50px rgba(0,0,0,0.08)' },
  circleProgress: { width: '120px', height: '120px', borderRadius: '50%', border: '8px solid #3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' },
  circleScore: { fontSize: '28px', fontWeight: '900', color: '#3B82F6' },
  saveSection: { maxWidth: '350px', margin: '20px auto' },
  input: { width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid #E2E8F0', marginBottom: '10px', outline: 'none' },
  saveBtn: { width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: '#10B981', color: '#fff', fontWeight: '700', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '10px' },
  retryBtn: { padding: '12px 30px', borderRadius: '12px', border: 'none', background: '#3B82F6', color: '#fff', fontWeight: '700', cursor: 'pointer', marginTop: '20px', display: 'inline-flex', gap: '10px' }
};

export default Reading;