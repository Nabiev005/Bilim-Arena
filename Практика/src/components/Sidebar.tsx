import React, { useState, useEffect, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FaWhatsapp, FaInstagram, FaTelegramPlane,
  FaHome, FaBook, FaQuoteLeft, FaHorse, FaMoon, FaBullseye, FaTrophy, 
  FaGraduationCap, FaShieldAlt
} from 'react-icons/fa';
import { HiMenuAlt2, HiChevronLeft } from 'react-icons/hi';

// 1. Логотиптин сүрөтүн импорттоо (assets папкасында экенин текшериңиз)
import logoImg from '../assets/logo2.png'; 

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(window.innerWidth > 1024);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  const handleResize = useCallback(() => {
    const width = window.innerWidth;
    setWindowWidth(width);
    
    if (width > 1024) {
      setIsOpen(true);
    } else if (width <= 768) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  const isMobile = windowWidth <= 768;

  const sections = [
    {
      title: 'Негизги',
      items: [
        { name: 'Башкы бет', icon: <FaHome />, path: '/', hit: false },
        { name: 'ЖРТ Аренасы', icon: <FaGraduationCap />, path: '/ort-prep', hit: false, new: true },
      ]
    },
    {
      title: 'Майдан (Оюндар)',
      items: [
        { name: 'Грамматика', icon: <FaBook />, path: '/grammar', hit: true },
        { name: 'Макалдар', icon: <FaQuoteLeft />, path: '/proverbs', hit: false },
        { name: 'Тулпар эсеп', icon: <FaHorse />, path: '/math', hit: false },
        { name: 'Көчмөн Эхосу', icon: <FaMoon />, path: '/echo', hit: false, new: true },
        { name: 'Сөз-Мерген', icon: <FaBullseye />, path: '/wordhunter', hit: false },
      ]
    },
    {
      title: 'Рейтинг & Автор',
      items: [
        { name: 'Лидерлер тактасы', icon: <FaTrophy />, path: '/rating', hit: false },
        { name: 'Платформа жөнүндө', icon: <FaShieldAlt />, path: '/author', hit: false },
      ]
    }
  ];

  const socialLinks = [
    { name: 'WhatsApp', icon: <FaWhatsapp />, color: "#25D366", url: 'https://wa.me/996702952200' },
    { name: 'Telegram', icon: <FaTelegramPlane />, color: "#0088cc", url: 'https://t.me/aibek_dev' },
    { name: 'Instagram', icon: <FaInstagram />, color: "#E1306C", url: 'https://instagram.com/aibek__dev' },
  ];

  return (
    <>
      {/* 1. Мобилдик Overlay */}
      {isMobile && isOpen && (
        <div 
          onClick={() => setIsOpen(false)} 
          style={styles.overlay} 
          role="presentation"
        />
      )}

      {/* 2. Негизги Sidebar */}
      <nav 
        aria-label="Main Sidebar"
        style={{
          ...styles.sidebar,
          width: isOpen ? '280px' : (isMobile ? '0px' : '85px'),
          transform: isMobile && !isOpen ? 'translateX(-100%)' : 'translateX(0)',
          visibility: isMobile && !isOpen ? 'hidden' : 'visible',
        }}
      >
        
        {/* Sidebar Header - Bilim Arena Logo */}
        <div style={{
          ...styles.header,
          justifyContent: isOpen ? 'space-between' : 'center',
          padding: isOpen ? '0 10px 0 15px' : '0'
        }}>
          {isOpen && (
            <div style={styles.logoWrapper}>
              {/* 2. Эмодзинин ордуна сүрөттү (img) койдук */}
              <div style={styles.logoIcon} aria-hidden="true">
                <img 
                  src={logoImg} 
                  alt="Bilim Arena Logo" 
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <h2 style={styles.logoText}>BILIM</h2>
                <span style={styles.logoSubtext}>ARENA</span>
              </div>
            </div>
          )}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            style={styles.toggleBtn}
            aria-label={isOpen ? "Менюну жабуу" : "Менюну ачуу"}
          >
            {isOpen ? <HiChevronLeft size={20} /> : <HiMenuAlt2 size={20} />}
          </button>
        </div>

        {/* Меню контейнери */}
        <div style={styles.menuContainer} className="custom-scrollbar">
          {sections.map((section, sIdx) => (
            <section key={`sec-${sIdx}`} style={{ marginBottom: '25px' }}>
              {isOpen && (
                <p style={styles.sectionTitle}>
                  {section.title}
                </p>
              )}

              {section.items.map((item, index) => (
                <NavLink
                  key={`item-${index}`}
                  to={item.path}
                  onClick={() => isMobile && setIsOpen(false)}
                  style={({ isActive }) => ({
                    ...styles.menuItem,
                    backgroundColor: isActive ? '#f0f7ff' : 'transparent',
                    color: isActive ? '#3B82F6' : '#64748b',
                    justifyContent: isOpen ? 'flex-start' : 'center',
                    borderLeft: isActive && isOpen ? '4px solid #3B82F6' : '4px solid transparent',
                  })}
                >
                  <span style={{
                    ...styles.icon,
                    color: item.new ? '#48BB78' : 'inherit'
                  }} aria-hidden="true">{item.icon}</span>
                  
                  {isOpen && <span style={styles.name}>{item.name}</span>}
                  
                  {isOpen && (
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: '5px' }}>
                      {item.hit && <span style={styles.hitBadge}>TOP</span>}
                      {item.new && <span style={styles.newBadge}>NEW</span>}
                    </div>
                  )}
                </NavLink>
              ))}
            </section>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          ...styles.footer,
          alignItems: isOpen ? 'flex-start' : 'center',
          padding: isOpen ? '20px' : '20px 0'
        }}>
          {isOpen && (
            <div style={styles.socialIcons}>
              {socialLinks.map((link, idx) => (
                <a 
                  key={`soc-${idx}`} 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{...styles.socialIcon, color: link.color}}
                  aria-label={link.name}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          )}
          <p style={styles.footerText}>
            {isOpen ? 'v2.0.1 | © 2026 Bilim Arena' : 'v2.0'}
          </p>
        </div>
      </nav>

      {/* Мобилдик Бургер */}
      {isMobile && !isOpen && (
        <button 
          onClick={() => setIsOpen(true)} 
          style={styles.mobileBurgerBtn}
        >
          <HiMenuAlt2 />
        </button>
      )}

      {!isMobile && (
        <div style={{ 
          width: isOpen ? '280px' : '85px', 
          transition: 'width 0.3s ease',
          flexShrink: 0 
        }} />
      )}
    </>
  );
};

// Стилдер бөлүмүндөгү logoIcon жаңыртылды (сүрөт үчүн оптималдаштырылды)
const styles: { [key: string]: React.CSSProperties } = {
  sidebar: {
    position: 'fixed',
    left: 0,
    top: 0,
    height: '100vh',
    background: '#ffffff',
    borderRight: '1px solid #f1f5f9',
    padding: '25px 0',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    zIndex: 1001,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(15, 23, 42, 0.4)',
    backdropFilter: 'blur(4px)',
    zIndex: 1000,
  },
  mobileBurgerBtn: {
    position: 'fixed',
    top: '20px',
    left: '20px',
    zIndex: 999,
    width: '48px',
    height: '48px',
    borderRadius: '14px',
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    boxShadow: '0 8px 15px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    color: '#3B82F6',
    cursor: 'pointer'
  },
  header: { 
    display: 'flex', 
    alignItems: 'center', 
    marginBottom: '35px', 
    minHeight: '50px' 
  },
  logoWrapper: { display: 'flex', alignItems: 'center', gap: '10px' },
  logoIcon: { 
    width: '45px', 
    height: '45px', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderRadius: '12px',
    // Сүрөт фонсуз болгондуктан, контейнердин фонун transparent кылдык
    background: 'transparent',
    overflow: 'hidden'
  },
  logoText: { color: '#1e293b', fontSize: '18px', margin: 0, fontWeight: '900', letterSpacing: '1px', lineHeight: 1 },
  logoSubtext: { color: '#3B82F6', fontSize: '14px', fontWeight: '800', letterSpacing: '2px' },
  toggleBtn: {
    background: '#f8fafc',
    border: '1px solid #f1f5f9',
    borderRadius: '10px',
    width: '36px',
    height: '36px',
    cursor: 'pointer',
    color: '#94a3b8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuContainer: { 
    flex: 1, 
    overflowY: 'auto', 
    padding: '0 15px'
  },
  sectionTitle: { 
    fontSize: '10px', 
    color: '#94a3b8', 
    fontWeight: '800', 
    letterSpacing: '1px', 
    marginBottom: '10px', 
    textTransform: 'uppercase',
    paddingLeft: '15px'
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '14px 16px',
    borderRadius: '0 14px 14px 0',
    marginBottom: '4px',
    transition: 'all 0.2s ease',
    gap: '14px',
    textDecoration: 'none',
  },
  icon: { fontSize: '20px', display: 'flex', alignItems: 'center' },
  name: { fontSize: '15px', fontWeight: '700', whiteSpace: 'nowrap' },
  hitBadge: { background: '#ff4d4d', color: '#fff', fontSize: '8px', padding: '2px 6px', borderRadius: '4px', fontWeight: '900' },
  newBadge: { background: '#48BB78', color: '#fff', fontSize: '8px', padding: '2px 6px', borderRadius: '4px', fontWeight: '900' },
  footer: { 
    marginTop: 'auto', 
    borderTop: '1px solid #f8fafc', 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '15px' 
  },
  socialIcons: { display: 'flex', gap: '8px', paddingLeft: '15px' },
  socialIcon: {
    fontSize: '18px',
    width: '35px',
    height: '35px',
    borderRadius: '10px',
    background: '#f8fafc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #f1f5f9',
  },
  footerText: { fontSize: '11px', color: '#cbd5e1', fontWeight: '600', paddingLeft: '15px' }
};

export default Sidebar;