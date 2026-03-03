import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Баары');
  const [isLoaded, setIsLoaded] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoaded(true);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  const games = [
    {
      id: 'ort',
      title: 'ЖРТ Аренасы',
      description: 'Математика, Аналогия жана Текстти түшүнүү. Өз билимиңди сынап, жогорку упай топто!',
      icon: '🎓',
      color: '#E3F2FD',
      path: '/ort-prep',
      status: 'Хит',
      category: 'Билим',
      players: '10.5k'
    },
    {
      id: 'toguz',
      title: 'Тогуз Коргоол',
      description: 'Кыргыздын интеллектуалдык мурасы. Аренада стратегиялык акыл-эс таймашына кошулуңуз.',
      icon: '🪵',
      color: '#FFE0B2',
      path: '/toguz',
      status: 'Эксклюзив',
      category: 'Логика',
      players: '5.2k'
    },
    {
      id: 'chuko',
      title: 'Чүкө Атуу',
      description: 'Сака менен чүкөлөрдү көздөй атып, "Алчы" түшүрүп упай топтоңуз.',
      icon: '🦴',
      color: '#C6F6D5',
      path: '/chuko',   
      status: 'Жаңы',
      category: 'Логика',
      players: '950'
    },
    {
      id: 'wordgame',
      title: "Ким Көп Билет?",
      description: "Берилген тамгадан башталган сөздөрдү тез таап, сөз байлыгыңызды сынаңыз!",
      icon: "🧠",
      color: "#D1FAE5",
      path: "/wordgame",
      category: "Тил",
      players: "1.2к"
    },
    {
      id: 'manas',
      title: 'Манас Таануу',
      description: 'Манас эпосу боюнча саякаттап, викторина аркылуу билимиңизди сынаңыз.',
      icon: '🐎',
      color: '#FEF08A',
      path: '/manas-quiz',
      status: 'Окутуучу',
      category: 'Билим',
      players: '2.5k'
    },
    {
      id: 'proverbs',
      title: 'Макал-Лабиринт',
      description: 'Элдик акылмандыкты сынап, макалдардын аягын табыңыз.',
      icon: '📜',
      color: '#F1F8E9',
      path: '/proverbs',
      status: 'Хит',
      category: 'Тил',
      players: '3.5k'
    },
    {
      id: 'math',
      title: 'Тулпар эсеп',
      description: 'Тез эсептөө менен тулпарыңызды марага биринчи жеткириңиз.',
      icon: '⚡️',
      color: '#FFF3E0',
      path: '/math',
      status: 'Активдүү',
      category: 'Логика',
      players: '2.8k'
    }
  ];

  const filteredGames = games.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'Баары' || game.category === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div style={{...styles.container, opacity: isLoaded ? 1 : 0}}>
      {/* Top Header */}
      <div style={{
        ...styles.topHeader, 
        flexDirection: isMobile ? 'column' : 'row', 
        alignItems: isMobile ? 'stretch' : 'center',
        gap: isMobile ? '15px' : '0'
      }}>
        <div style={{...styles.searchBox, width: isMobile ? '100%' : '350px'}}>
          <span style={{marginRight: '10px'}}>🔍</span>
          <input 
            type="text" 
            placeholder="Аренадан издөө..." 
            style={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={{...styles.userStats, justifyContent: isMobile ? 'space-between' : 'flex-end'}}>
          <div style={styles.statMini}>
            <span style={styles.statLabel}>🏆</span>
            <span style={styles.statValue}>1,250 упай</span>
          </div>
          <div style={styles.statMini}>
            <span style={styles.statLabel}>⚡️</span>
            <span style={styles.statValue}>Level 5</span>
          </div>
        </div>
      </div>

      {/* Banner Section */}
      <div style={{
        ...styles.banner, 
        flexDirection: isMobile ? 'column' : 'row',
        padding: isMobile ? '30px 20px' : '50px',
        textAlign: isMobile ? 'center' : 'left'
      }}>
        <div style={styles.bannerText}>
          <span style={styles.badge}>Интеллектуалдык Майдан</span>
          <h1 style={{...styles.bannerTitle, fontSize: isMobile ? '28px' : '48px'}}>
            BILIM <span style={{color: '#3B82F6'}}>ARENA</span>
          </h1>
          <p style={{...styles.bannerSubtitle, fontSize: isMobile ? '14px' : '18px', margin: isMobile ? '0 auto' : '0'}}>
            Билим, салттуу баалуулуктар жана логикалык таймаштар бириккен санариптик ордого кош келиңиз!
          </p>
          <button 
            onClick={() => document.getElementById('games-grid')?.scrollIntoView({ behavior: 'smooth' })} 
            style={{...styles.bannerBtn, width: isMobile ? '100%' : 'auto'}}
          >
            Таймашты баштоо
          </button>
        </div>
        {!isMobile && (
          <div style={styles.bannerImage}>
            <div style={styles.abstractShape}>BA</div>
          </div>
        )}
        <div style={styles.bannerDecoration}>
            <div style={styles.circle1}></div>
            <div style={styles.circle2}></div>
        </div>
      </div>

      {/* Quick Start */}
      <div style={styles.quickStart}>
          <h4 style={{marginBottom: '15px', fontSize: '18px'}}>🚀 Аренага кайтуу</h4>
          <div 
          style={styles.quickCard} 
          onClick={() => navigate('/ort-prep')}
          onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'}
          onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
          >
            <span style={{fontSize: '24px'}}>🎓</span>
            <div>
                <div style={{fontWeight: 'bold', fontSize: isMobile ? '14px' : '16px'}}>ЖРТ Аренасы</div>
                <div style={{fontSize: '12px', opacity: 0.7}}>Акыркы аракет: 15 мүнөт мурун</div>
            </div>
            <div style={{marginLeft: 'auto', color: '#3B82F6', fontSize: '14px'}}>
              {isMobile ? '→' : 'Улантуу →'}
            </div>
          </div>
      </div>

      {/* Section Header */}
      <div style={{
        ...styles.sectionHeader, 
        flexDirection: isMobile ? 'column' : 'row', 
        alignItems: isMobile ? 'flex-start' : 'center',
        gap: '15px'
      }}>
        <h3 style={{...styles.sectionTitle, fontSize: isMobile ? '20px' : '24px'}}>⭐️ Тандалган майдандар</h3>
        <div style={{...styles.filterTabs, width: isMobile ? '100%' : 'auto', overflowX: 'auto', paddingBottom: '10px'}}>
          {['Баары', 'Билим', 'Тил', 'Логика'].map(tab => (
            <span 
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={activeTab === tab ? {...styles.activeTab, color: '#3B82F6', borderBottom: '3px solid #3B82F6'} : styles.tab}
            >
              {tab}
            </span>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div id="games-grid" style={{
        ...styles.grid, 
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))'
      }}>
        {filteredGames.length > 0 ? filteredGames.map((game) => (
          <div 
            key={game.id} 
            style={styles.card}
            onClick={() => navigate(game.path)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.borderColor = '#3B82F6';
              e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = '#f1f5f9';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={styles.cardHeader}>
              <div style={{ ...styles.iconBox, background: game.color }}>
                {game.icon}
              </div>
              <div style={styles.statusWrapper}>
                <span style={styles.playerCount}>👤 {game.players} катышуучу</span>
                {game.status && (
                  <span style={{ 
                    ...styles.gameStatus, 
                    background: game.status === 'Хит' ? '#ff4d4d' : 
                                game.status === 'Эксклюзив' ? '#daa520' :
                                game.status === 'Активдүү' ? '#48BB78' : '#3B82F6' 
                  }}>
                    {game.status}
                  </span>
                )}
              </div>
            </div>
            
            <h4 style={styles.cardTitle}>{game.title}</h4>
            <p style={styles.cardDesc}>{game.description}</p>
            
            <div style={styles.cardFooter}>
              <span style={styles.categoryTag}>{game.category}</span>
              <span style={{...styles.playText, color: '#3B82F6'}}>Кирүү →</span>
            </div>
          </div>
        )) : (
          <div style={styles.noResults}>
             <span>🔍</span>
             <p>Аренадан мындай бөлүм табылган жок...</p>
          </div>
        )}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: { width: '100%', padding: '20px', transition: 'opacity 1s ease', maxWidth: '1200px', margin: '0 auto' },
  topHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '30px' },
  searchBox: { background: '#fff', padding: '12px 20px', borderRadius: '15px', display: 'flex', alignItems: 'center', border: '1px solid #e2e8f0' },
  searchInput: { border: 'none', outline: 'none', width: '100%', fontSize: '14px', background: 'transparent' },
  userStats: { display: 'flex', gap: '10px' },
  statMini: { background: '#fff', padding: '10px 15px', borderRadius: '14px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '5px' },
  statValue: { fontWeight: '800', color: '#1e293b', fontSize: '14px' },
  banner: { background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', borderRadius: '25px', color: '#fff', marginBottom: '40px', position: 'relative', display: 'flex', overflow: 'hidden' },
  bannerText: { flex: 1, zIndex: 2 },
  bannerTitle: { margin: '15px 0', fontWeight: '850', letterSpacing: '-1px' },
  bannerSubtitle: { opacity: 0.8, maxWidth: '550px', lineHeight: '1.6' },
  bannerBtn: { marginTop: '25px', padding: '14px 30px', borderRadius: '12px', border: 'none', background: '#3B82F6', color: '#fff', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s' },
  quickStart: { marginBottom: '35px' },
  quickCard: { background: '#fff', padding: '15px 20px', borderRadius: '18px', display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer', border: '1px solid #e2e8f0', transition: '0.3s' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '20px' },
  sectionTitle: { color: '#1e293b', fontWeight: '800' },
  filterTabs: { display: 'flex', gap: '15px' },
  tab: { color: '#64748b', cursor: 'pointer', paddingBottom: '5px', whiteSpace: 'nowrap', transition: '0.2s' },
  activeTab: { fontWeight: 'bold', cursor: 'pointer', paddingBottom: '5px' },
  grid: { display: 'grid', gap: '20px' },
  card: { background: '#fff', padding: '20px', borderRadius: '22px', border: '2px solid #f1f5f9', cursor: 'pointer', display: 'flex', flexDirection: 'column', transition: 'all 0.3s ease' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '15px' },
  iconBox: { width: '50px', height: '50px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' },
  cardTitle: { fontSize: '18px', color: '#1e293b', margin: '0 0 8px 0', fontWeight: '700' },
  cardDesc: { fontSize: '13px', color: '#64748b', lineHeight: '1.5', marginBottom: '15px', flexGrow: 1 },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #f1f5f9' },
  categoryTag: { fontSize: '11px', background: '#f8fafc', padding: '4px 10px', borderRadius: '8px', color: '#64748b' },
  playText: { fontSize: '13px', fontWeight: '700' },
  noResults: { gridColumn: '1 / -1', textAlign: 'center', padding: '50px' },
  bannerImage: { flex: 0.3, zIndex: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' },
  abstractShape: { width: '80px', height: '80px', background: 'rgba(59, 130, 246, 0.2)', borderRadius: '20px', transform: 'rotate(15deg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold', color: '#3B82F6' },
  badge: { background: 'rgba(59, 130, 246, 0.2)', color: '#60A5FA', padding: '6px 14px', borderRadius: '15px', fontSize: '11px', fontWeight: 'bold' },
  circle1: { position: 'absolute', width: '200px', height: '200px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%', top: '-40px', right: '-40px' },
  circle2: { position: 'absolute', width: '100px', height: '100px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '50%', bottom: '10px', right: '60px' },
  statusWrapper: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '3px' },
  playerCount: { fontSize: '10px', color: '#94a3b8' },
  gameStatus: { color: '#fff', fontSize: '9px', padding: '2px 8px', borderRadius: '6px', fontWeight: 'bold' },
};

export default Home;