import React, { useState } from 'react';
import { 
  FaPlus, FaLock, FaBars, FaGamepad, FaTimes, 
  FaDatabase, FaChartLine, FaSignOutAlt, FaEye, FaEyeSlash, FaCheckCircle 
} from 'react-icons/fa';

const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pass, setPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState('grammar');

  // Форма үчүн штаттар
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<string[]>(['', '', '', '']);
  const [correct, setCorrect] = useState<number>(0);

  const games = [
    { id: 'grammar', name: 'Грамматика', color: '#6366f1' },
    { id: 'proverbs', name: 'Макалдар', color: '#f59e0b' },
    { id: 'manas', name: 'Манас таануу', color: '#ec4899' },
    { id: 'math', name: 'Математика', color: '#10b981' }
  ];

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSave = () => {
    const newQuestion = {
      id: Date.now(),
      type: selectedGame,
      question: question,
      options: options,
      correct: correct,
      explanation: ""
    };
    console.log("Жаңы суроо базага даяр:", newQuestion);
    alert("Суроо кошулду!");
    // Тазалоо
    setQuestion('');
    setOptions(['', '', '', '']);
  };

  if (!isAuthenticated) {
    return (
      <div style={s.loginOverlay}>
        <div style={s.loginGlassCard}>
          <div style={s.iconCircle}><FaLock /></div>
          <h2 style={s.loginTitle}>Админ Панель</h2>
          <div style={s.passWrapper}>
            <input 
              type={showPass ? "text" : "password"} 
              placeholder="Купуя сөз" 
              style={s.loginInput} 
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
            <button onClick={() => setShowPass(!showPass)} style={s.eyeBtn}>
              {showPass ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <button onClick={() => pass === 'admin777' && setIsAuthenticated(true)} style={s.loginBtn}>
            Кирүү
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={s.dashboard}>
      <aside style={{...s.sidebar, transform: isMenuOpen ? 'translateX(0)' : (window.innerWidth <= 1024 ? 'translateX(-100%)' : 'translateX(0)')}}>
        <div style={s.sideHeader}>
          <div style={s.logoIcon}>B</div>
          <div style={s.logoText}>BILIM PANEL</div>
        </div>
        <div style={s.navSection}>
          <p style={s.navLabel}>НЕГИЗГИ МЕНЮ</p>
          {games.map(game => (
            <div 
              key={game.id} 
              onClick={() => { setSelectedGame(game.id); setIsMenuOpen(false); }}
              style={{
                ...s.navItem, 
                backgroundColor: selectedGame === game.id ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                color: selectedGame === game.id ? '#6366f1' : '#94a3b8',
                borderLeft: selectedGame === game.id ? `4px solid ${game.color}` : '4px solid transparent'
              }}
            >
              <FaGamepad /> {game.name}
            </div>
          ))}
        </div>
        <button onClick={() => setIsAuthenticated(false)} style={s.logoutBtn}>
          <FaSignOutAlt /> Чыгуу
        </button>
      </aside>

      <main style={s.main}>
        <header style={s.topBar}>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} style={s.burgerBtn}>
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
          <div style={s.stats}>
            <span style={s.statBadge}><FaDatabase /> 1,240 суроо</span>
            <span style={s.statBadge}><FaChartLine /> 85% активдүүлүк</span>
          </div>
        </header>

        <div style={s.contentArea}>
          <div style={s.formCard}>
            <h1 style={s.formTitle}>Жаңы суроо кошуу</h1>
            <p style={s.formSub}>{games.find(g => g.id === selectedGame)?.name} бөлүмү үчүн</p>
            
            <div style={s.inputGroup}>
              <label style={s.label}>Суроонун мазмуну</label>
              <textarea 
                style={s.textarea} 
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Мисалы: 'Кыргызстандын борбор шаары кайсы?'"
              />
            </div>

            <label style={s.label}>Жооп варианттары (туурасын белгилеңиз)</label>
            <div style={s.optionsGrid}>
              {options.map((opt, i) => (
                <div key={i} style={{...s.optionBox, borderColor: correct === i ? '#10b981' : '#e2e8f0'}}>
                  <div onClick={() => setCorrect(i)} style={s.radio}>
                    {correct === i && <FaCheckCircle color="#10b981" />}
                  </div>
                  <input 
                    style={s.optInput} 
                    value={opt}
                    onChange={(e) => handleOptionChange(i, e.target.value)}
                    placeholder={`${i + 1}-вариант`} 
                  />
                </div>
              ))}
            </div>

            <button onClick={handleSave} style={s.submitBtn}>
              <FaPlus /> Базага жүктөө
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

// Стилдерди объект катары өзүнчө сактайбыз
const s: Record<string, React.CSSProperties> = {
  loginOverlay: { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' },
  loginGlassCard: { background: '#1e293b', padding: '40px', borderRadius: '24px', textAlign: 'center', width: '350px' },
  iconCircle: { width: '60px', height: '60px', background: '#3b82f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#fff', fontSize: '24px' },
  loginTitle: { color: '#fff', marginBottom: '25px' },
  passWrapper: { position: 'relative', marginBottom: '20px' },
  loginInput: { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #334155', background: '#0f172a', color: '#fff', outline: 'none' },
  eyeBtn: { position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' },
  loginBtn: { width: '100%', padding: '12px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' },
  dashboard: { display: 'flex', minHeight: '100vh', background: '#f8fafc' },
  sidebar: { width: '280px', background: '#0f172a', height: '100vh', position: 'fixed', transition: '0.3s', zIndex: 100, padding: '20px' },
  sideHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px', color: '#fff' },
  logoIcon: { background: '#3b82f6', padding: '5px 10px', borderRadius: '8px', fontWeight: 'bold' },
  logoText: { fontWeight: 'bold', fontSize: '18px' },
  navSection: { flex: 1 },
  navLabel: { color: '#475569', fontSize: '12px', fontWeight: 'bold', marginBottom: '15px' },
  navItem: { display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', borderRadius: '10px', cursor: 'pointer', marginBottom: '5px', transition: '0.2s' },
  logoutBtn: { width: '100%', padding: '12px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' },
  main: { flex: 1, marginLeft: '280px', width: 'calc(100% - 280px)' },
  topBar: { height: '70px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 30px', borderBottom: '1px solid #e2e8f0' },
  burgerBtn: { display: 'none', background: 'none', border: 'none', fontSize: '20px' },
  stats: { display: 'flex', gap: '15px' },
  statBadge: { background: '#f1f5f9', padding: '5px 12px', borderRadius: '20px', fontSize: '12px', color: '#64748b' },
  contentArea: { padding: '40px' },
  formCard: { background: '#fff', padding: '40px', borderRadius: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' },
  formTitle: { fontSize: '24px', fontWeight: 'bold', marginBottom: '5px' },
  formSub: { color: '#64748b', marginBottom: '30px' },
  label: { display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#475569' },
  textarea: { width: '100%', minHeight: '100px', padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f9fafb', outline: 'none' },
  optionsGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginBottom: '30px' },
  optionBox: { display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '12px' },
  radio: { cursor: 'pointer', width: '20px', height: '20px', display: 'flex', alignItems: 'center' },
  optInput: { border: 'none', outline: 'none', width: '100%', background: 'transparent' },
  submitBtn: { width: '100%', padding: '15px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }
};

export default AdminPage;