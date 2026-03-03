import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaBook, FaCalculator, FaLightbulb, FaPenNib, 
  FaArrowRight, FaTrophy, FaChartLine, FaCheckCircle, 
  FaFire, FaGraduationCap, FaHourglassHalf, FaSearch 
} from 'react-icons/fa';

// Интерфейстер
interface UserStats {
  [key: string]: string;
}

const QUOTES = [
  "Бүгүнкү кичинекей кадамдар эртеңки чоң жеңиштин негизи.",
  "Билим — бул дүйнөнү өзгөртүү үчүн эң күчтүү курал.",
  "Ийгилик — бул күн сайын кайталанган кичинекей аракеттердин жыйынтыгы.",
  "Эч качан токтобо, анткени билимдин чеги жок."
];

const ORT_SUBJECTS = [
  { id: 'kyrgyz-language', title: 'Кыргыз тили', dbName: 'Кыргыз тили', desc: 'Грамматика, синтаксис жана пунктуация эрежелери', icon: <FaPenNib />, color: '#3B82F6', gradient: 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)' },
  { id: 'math', title: 'Математика', dbName: 'Математика', desc: 'Сандар, геометрия жана логикалык татаал эсептер', icon: <FaCalculator />, color: '#10B981', gradient: 'linear-gradient(135deg, #34D399 0%, #10B981 100%)' },
  { id: 'analogies', title: 'Аналогиялар', dbName: 'Аналогиялар', desc: 'Сөздөрдүн ортосундагы логикалык байланышты табуу', icon: <FaLightbulb />, color: '#F59E0B', gradient: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)' },
  { id: 'reading', title: 'Текстти түшүнүү', dbName: 'Текстти түшүнүү', desc: 'Текстти талдоо жана негизги ойду аныктоо', icon: <FaBook />, color: '#EF4444', gradient: 'linear-gradient(135deg, #F87171 0%, #EF4444 100%)' },
];

const ORTPrepPage: React.FC = () => {
  const navigate = useNavigate();
  const [userStats, setUserStats] = useState<UserStats>({});
  const [greeting, setGreeting] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [daysLeft, setDaysLeft] = useState(0);

  useEffect(() => {
    // 1. Убакытка жараша учурашуу
    const hour = new Date().getHours();
    setGreeting(hour < 12 ? 'Кутман таң!' : hour < 18 ? 'Кутман күн!' : 'Кутман кеч!');

    // 2. ЖРТга чейинки күндөрдү эсептөө (Мисалы: 20-май)
    const ortDate = new Date('2026-05-20');
    const today = new Date();
    const diff = Math.ceil((ortDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    setDaysLeft(diff > 0 ? diff : 0);

    // 3. Статистиканы жүктөө
    const mockStats = JSON.parse(localStorage.getItem('ort_stats') || '{"Математика": "15/20", "Аналогиялар": "18/20"}');
    setUserStats(mockStats);
  }, []);

  // Кокустук накыл сөз (Ар бир барак жүктөлгөндө өзгөрөт)
  // eslint-disable-next-line react-hooks/purity
  const randomQuote = useMemo(() => QUOTES[Math.floor(Math.random() * QUOTES.length)], []);

  // Издөө логикасы
  const filteredSubjects = ORT_SUBJECTS.filter(sub => 
    sub.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const completedCount = Object.keys(userStats).length;
  const progressPercentage = (completedCount / ORT_SUBJECTS.length) * 100;

  return (
    <div style={styles.container}>
      {/* 1. Header Area */}
      <div style={styles.topBar}>
        <div style={styles.heroSection}>
          <span style={styles.greetingText}>{greeting} <FaFire color="#FF4500" /></span>
          <h1 style={styles.title}>ЖРТ (ОРТ) Порталы</h1>
        </div>
        
        <div style={styles.headerActions}>
          <div style={styles.timerBadge}>
            <FaHourglassHalf />
            <span>ЖРТга чейин: <b>{daysLeft} күн</b></span>
          </div>
          <button style={styles.leaderboardBtn} onClick={() => navigate('/ort/leaderboard')}>
            <FaTrophy color="#F59E0B" size={18} />
            <span>Рейтинг</span>
          </button>
        </div>
      </div>

      {/* 2. Global Progress Banner */}
      <div style={styles.statsBanner}>
        <div style={styles.progressHeader}>
          <div style={styles.statsItem}>
            <FaChartLine color="#3B82F6" />
            <span>Сиздин прогресс: <b>{progressPercentage.toFixed(0)}%</b></span>
          </div>
          <div style={styles.statsItem}>
            <FaGraduationCap color="#8B5CF6" />
            <span>Аяктаган: <b>{completedCount} / {ORT_SUBJECTS.length}</b></span>
          </div>
        </div>
        <div style={styles.mainProgressBar}>
          <div style={{ ...styles.mainProgressFill, width: `${progressPercentage}%` }} />
        </div>
      </div>

      {/* 3. Search Bar */}
      <div style={styles.searchWrapper}>
        <FaSearch style={styles.searchIcon} />
        <input 
          type="text" 
          placeholder="Предметти издөө..." 
          style={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* 4. Subjects Grid */}
      <div style={styles.grid}>
        {filteredSubjects.map((sub) => {
          const isCompleted = !!userStats[sub.dbName];
          return (
            <div key={sub.id} style={styles.card} onClick={() => navigate(`/ort/${sub.id}`)} className="subject-card">
              {isCompleted && (
                <div style={styles.scoreBadge}><FaCheckCircle size={12} /> {userStats[sub.dbName]}</div>
              )}
              <div style={{ ...styles.iconBox, background: sub.gradient }}>{sub.icon}</div>
              <h3 style={styles.cardTitle}>{sub.title}</h3>
              <p style={styles.cardDesc}>{sub.desc}</p>
              <div style={styles.subjectMiniProgress}>
                <div style={{ ...styles.miniProgressFill, width: isCompleted ? '100%' : '5%', background: sub.color }} />
              </div>
              <div style={{...styles.footerBtn, color: sub.color}}>
                <span>{isCompleted ? 'Кайра тапшыруу' : 'Баштоо'}</span>
                <FaArrowRight size={14} className="arrow-icon" />
              </div>
            </div>
          );
        })}
      </div>

      {/* 5. Footer Motivation */}
      <div style={styles.motivationBox}>
        <FaLightbulb color="#F59E0B" size={24} />
        <p>"{randomQuote}"</p>
      </div>

      <style>{`
        .subject-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px -10px rgba(0,0,0,0.1) !important; }
        .subject-card:hover .arrow-icon { transform: translateX(5px); transition: 0.3s; }
      `}</style>
    </div>
  );
};

// Стилдерди жакшыртуу
const styles: { [key: string]: React.CSSProperties } = {
  container: { padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', background: '#F8FAFC', minHeight: '100vh' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px', flexWrap: 'wrap', gap: '20px' },
  headerActions: { display: 'flex', gap: '15px', alignItems: 'center' },
  timerBadge: { background: '#FEF2F2', color: '#EF4444', padding: '10px 18px', borderRadius: '14px', fontSize: '14px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid #FEE2E2' },
  greetingText: { color: '#3B82F6', fontWeight: '800', fontSize: '14px', letterSpacing: '1px' },
  title: { fontSize: '32px', fontWeight: '900', color: '#1E293B', marginTop: '5px' },
  searchWrapper: { position: 'relative', marginBottom: '30px', maxWidth: '400px' },
  searchIcon: { position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' },
  searchInput: { width: '100%', padding: '12px 12px 12px 45px', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '15px', background: '#fff' },
  statsBanner: { background: '#fff', borderRadius: '24px', padding: '25px', marginBottom: '35px', border: '1px solid #F1F5F9', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' },
  progressHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '15px' },
  mainProgressBar: { width: '100%', height: '10px', background: '#F1F5F9', borderRadius: '10px' },
  mainProgressFill: { height: '100%', background: 'linear-gradient(90deg, #3B82F6, #10B981)', borderRadius: '10px', transition: 'width 1s' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' },
  card: { background: '#fff', borderRadius: '24px', padding: '30px', cursor: 'pointer', border: '1px solid #F1F5F9', transition: 'all 0.3s ease', position: 'relative' },
  iconBox: { width: '55px', height: '55px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', color: '#fff', marginBottom: '20px' },
  cardTitle: { fontSize: '20px', fontWeight: '800', color: '#1E293B', marginBottom: '8px' },
  cardDesc: { fontSize: '14px', color: '#64748B', lineHeight: '1.5', marginBottom: '20px' },
  scoreBadge: { position: 'absolute', top: '20px', right: '20px', background: '#ECFDF5', color: '#059669', padding: '6px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' },
  subjectMiniProgress: { height: '4px', background: '#F1F5F9', borderRadius: '2px', marginBottom: '20px' },
  miniProgressFill: { height: '100%', borderRadius: '2px' },
  footerBtn: { display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800', fontSize: '12px', textTransform: 'uppercase' },
  motivationBox: { marginTop: '60px', padding: '40px', background: '#fff', borderRadius: '24px', textAlign: 'center', border: '1px solid #F1F5F9' },
  leaderboardBtn: { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 18px', borderRadius: '14px', border: '1px solid #E2E8F0', background: '#fff', fontWeight: '700', cursor: 'pointer' }
};

export default ORTPrepPage;