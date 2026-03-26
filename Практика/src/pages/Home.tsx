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
  const isSmallMobile = windowWidth < 480;

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
    },
    {
      id: 'ak-terek',
      title: 'Ак терек, көк терек',
      description: 'ЖРТ аналогиялары менен чынжырды үзүп, командаңызды жеңишке жеткириңиз!',
      icon: '🌳',
      color: '#E3F2FD',
      path: '/ak-terek',
      status: 'Жаңы',
      category: 'Тил',
      players: '0'
    },
    {
      id: 'history',
      title: 'Тарых барактары',
      description: 'Тарыхый окуяларды хронологиялык иретте тизип, өткөн чакка саякат жасаңыз!',
      icon: '🏛️',
      color: '#FFF3E0',
      path: '/history',
      status: 'Популярдуу',
      category: 'Тарых',
      players: '100+'
    },
    {
      id: 'yurta-builder',
      title: 'Боз үй кура',
      description: 'Көчмөн маданиятынын керемети — боз үйдү өз колуңуз менен ирети менен тигип үйрөнүңүз!',
      icon: '⛺',
      color: '#EFEBE9',
      path: '/yurta-game',
      status: 'Жаңы',
      category: 'Маданият',
      players: '50+'
    },
    {
      id: 'math-kok-boru',
      title: 'Математикалык Көк-Бөрү',
      description: 'Улакты казанга так таштаңыз! Математикалык амалдарды колдонуп, эң кыска жол менен жеңишке жетиньиз.',
      icon: '🐎',
      color: '#065f46',
      path: '/kok-boru-game',
      status: 'Жаңы',
      category: 'Логика',
      players: '100+'
    }, 
    {
      id: 'cyber-shield',
      title: 'Кибер Калкан: Firewall',
      description: 'Серверди хакерлердин чабуулунан коргоңуз! Математикалык коддорду тез чечип, системанын коопсуздугун камсыз кылыңыз.',
      icon: '🛡️',
      color: '#0a0a0c',
      path: '/cyber-shield',
      status: 'Жаңы',
      category: 'IT & Логика',
      players: '50+'
    },
    {
      id: 'algorithmic-path',
      title: 'Код Көчү: If/Else',
      description: 'Алгоритмди туура түзүп, программист баланы серверге жеткириңиз. Логикалык шарттарды колдонууну үйрөнүңүз.',
      icon: '👨‍💻',
      color: '#4ec9b0',
      path: '/algorithmic-path',
      status: 'Жаңы',
      category: 'IT & Логика',
      players: '80+'
    },
    {
      id: 'ordo-sql',
      title: 'Ордо: SQL Query',
      description: 'SQL суроо-талаптарын жазуу менен чүкөлөрдү чөйрөдөн атып чыгыңыз. Маалыматтар базасын башкарууну үйрөнүңүз.',
      icon: '🎯',
      color: '#fbbf24',
      path: '/ordo-sql',
      status: 'Жаңы',
      category: 'IT & SQL',
      players: '120+'
    },
    {
      id: 'besh-tash',
      title: 'Беш Таш: Multithreading',
      description: 'Процессордун ылдамдыгын сезиңиз! Негизги таш жерге түшкөнчө, бардык фондук тапшырмаларды чечип жетишиңиз керек.',
      icon: '💎',
      color: '#38bdf8',
      path: '/besh-tash',
      status: 'Жаңы',
      category: 'IT & Процесс',
      players: '90+'
    },
    {
      id: 'kyz-kuumai-encryption',
      title: 'Кыз Куумай: Data Encryption',
      description: 'Маалыматты хакерлерден коргоп, шифрлөө ачкычтарын табыңыз. Киберкоопсуздук дүйнөсүнө аттаныңыз.',
      icon: '🏇',
      color: '#64ffda',
      path: '/kyz-kuumai-encryption',
      status: 'Жаңы',
      category: 'IT & Security',
      players: '70+'
    }
  ];

  const filteredGames = games.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'Баары' || game.category === activeTab || (activeTab === 'IT' && game.category.includes('IT'));
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
            <span style={styles.statValue}>{isSmallMobile ? '1.2k' : '1,250 упай'}</span>
          </div>
          <div style={styles.statMini}>
            <span style={styles.statLabel}>⚡️</span>
            <span style={styles.statValue}>Lvl 5</span>
          </div>
        </div>
      </div>

      {/* Banner Section */}
      <div style={{
        ...styles.banner, 
        flexDirection: isMobile ? 'column' : 'row',
        padding: isMobile ? '30px 20px' : '50px',
        textAlign: isMobile ? 'center' : 'left',
        minHeight: isMobile ? 'auto' : '300px'
      }}>
        <div style={styles.bannerText}>
          <span style={styles.badge}>Интеллектуалдык Майдан</span>
          <h1 style={{...styles.bannerTitle, fontSize: isSmallMobile ? '24px' : isMobile ? '32px' : '48px'}}>
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
          >
            <span style={{fontSize: '24px'}}>🎓</span>
            <div style={{flex: 1}}>
                <div style={{fontWeight: 'bold', fontSize: isMobile ? '14px' : '16px'}}>ЖРТ Аренасы</div>
                <div style={{fontSize: '11px', opacity: 0.7}}>Акыркы аракет: 15 мүнөт мурун</div>
            </div>
            <div style={{color: '#3B82F6', fontSize: '14px', fontWeight: 'bold'}}>
               →
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
        <div style={{
          ...styles.filterTabs, 
          width: isMobile ? '100%' : 'auto', 
          overflowX: 'auto', 
          paddingBottom: isMobile ? '5px' : '0',
          display: 'flex',
          msOverflowStyle: 'none',
          scrollbarWidth: 'none'
        }}>
          {['Баары', 'Билим', 'Тил', 'Логика', 'IT & Логика', 'Тарых', 'Маданият'].map(tab => (
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
        gridTemplateColumns: isSmallMobile ? '1fr' : isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: isMobile ? '12px' : '20px'
      }}>
        {filteredGames.length > 0 ? filteredGames.map((game) => (
          <div 
            key={game.id} 
            style={{
              ...styles.card,
              padding: isMobile ? '15px' : '20px'
            }}
            onClick={() => navigate(game.path)}
          >
            <div style={styles.cardHeader}>
              <div style={{ ...styles.iconBox, background: game.color, width: isMobile ? '40px' : '50px', height: isMobile ? '40px' : '50px' }}>
                {game.icon}
              </div>
              <div style={styles.statusWrapper}>
                <span style={styles.playerCount}>👤 {game.players}</span>
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
            
            <h4 style={{...styles.cardTitle, fontSize: isMobile ? '16px' : '18px'}}>{game.title}</h4>
            <p style={{...styles.cardDesc, fontSize: isMobile ? '12px' : '13px'}}>{game.description}</p>
            
            <div style={styles.cardFooter}>
              <span style={styles.categoryTag}>{game.category.split(' ')[0]}</span>
              <span style={{...styles.playText, color: '#3B82F6', fontSize: isMobile ? '11px' : '13px'}}>Кирүү →</span>
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
  container: { width: '100%', padding: '15px', transition: 'opacity 1s ease', maxWidth: '1200px', margin: '0 auto', boxSizing: 'border-box' },
  topHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '25px' },
  searchBox: { background: '#fff', padding: '10px 15px', borderRadius: '15px', display: 'flex', alignItems: 'center', border: '1px solid #e2e8f0', boxSizing: 'border-box' },
  searchInput: { border: 'none', outline: 'none', width: '100%', fontSize: '14px', background: 'transparent' },
  userStats: { display: 'flex', gap: '8px' },
  statMini: { background: '#fff', padding: '8px 12px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '5px' },
  statValue: { fontWeight: '800', color: '#1e293b', fontSize: '13px', whiteSpace: 'nowrap' },
  banner: { background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', borderRadius: '25px', color: '#fff', marginBottom: '35px', position: 'relative', display: 'flex', overflow: 'hidden', boxSizing: 'border-box' },
  bannerText: { flex: 1, zIndex: 2, position: 'relative' },
  bannerTitle: { margin: '10px 0', fontWeight: '850', letterSpacing: '-1px' },
  bannerSubtitle: { opacity: 0.8, maxWidth: '550px', lineHeight: '1.5' },
  bannerBtn: { marginTop: '20px', padding: '12px 25px', borderRadius: '12px', border: 'none', background: '#3B82F6', color: '#fff', fontWeight: 'bold', cursor: 'pointer' },
  quickStart: { marginBottom: '30px' },
  quickCard: { background: '#fff', padding: '12px 18px', borderRadius: '18px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', border: '1px solid #e2e8f0' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '20px' },
  sectionTitle: { color: '#1e293b', fontWeight: '800', margin: 0 },
  filterTabs: { display: 'flex', gap: '15px', scrollbarWidth: 'none' },
  tab: { color: '#64748b', cursor: 'pointer', paddingBottom: '5px', whiteSpace: 'nowrap', fontSize: '14px' },
  activeTab: { fontWeight: 'bold', cursor: 'pointer', paddingBottom: '5px', fontSize: '14px' },
  grid: { display: 'grid' },
  card: { background: '#fff', borderRadius: '22px', border: '2px solid #f1f5f9', cursor: 'pointer', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '12px' },
  iconBox: { borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' },
  cardTitle: { color: '#1e293b', margin: '0 0 6px 0', fontWeight: '700' },
  cardDesc: { color: '#64748b', lineHeight: '1.4', marginBottom: '12px', flexGrow: 1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #f1f5f9' },
  categoryTag: { fontSize: '10px', background: '#f8fafc', padding: '3px 8px', borderRadius: '6px', color: '#64748b' },
  playText: { fontWeight: '700' },
  noResults: { gridColumn: '1 / -1', textAlign: 'center', padding: '40px' },
  bannerImage: { flex: 0.3, zIndex: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' },
  abstractShape: { width: '70px', height: '70px', background: 'rgba(59, 130, 246, 0.2)', borderRadius: '18px', transform: 'rotate(15deg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: 'bold', color: '#3B82F6' },
  badge: { background: 'rgba(59, 130, 246, 0.2)', color: '#60A5FA', padding: '5px 12px', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold', display: 'inline-block' },
  circle1: { position: 'absolute', width: '150px', height: '150px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%', top: '-30px', right: '-30px' },
  circle2: { position: 'absolute', width: '80px', height: '80px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '50%', bottom: '10px', right: '40px' },
  statusWrapper: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' },
  playerCount: { fontSize: '10px', color: '#94a3b8' },
  gameStatus: { color: '#fff', fontSize: '8px', padding: '1px 6px', borderRadius: '5px', fontWeight: 'bold' },
};

export default Home;