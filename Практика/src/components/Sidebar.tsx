import React, { useState, useEffect, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FaWhatsapp, FaInstagram, FaTelegramPlane,
  FaHome, FaBook, FaQuoteLeft, FaHorse, FaMoon, FaBullseye, FaTrophy, 
  FaGraduationCap, FaShieldAlt
} from 'react-icons/fa';
import { HiMenuAlt2, HiChevronLeft, HiX } from 'react-icons/hi'; // HiX кошулду

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
      {isMobile && isOpen && (
        <div 
          onClick={() => setIsOpen(false)} 
          style={styles.overlay} 
          role="presentation"
        />
      )}

      <nav 
        aria-label="Main Sidebar"
        style={{
          ...styles.sidebar,
          width: isOpen ? '280px' : (isMobile ? '0px' : '85px'),
          transform: isMobile && !isOpen ? 'translateX(-100%)' : 'translateX(0)',
          visibility: isMobile && !isOpen ? 'hidden' : 'visible',
          // Мобилдикте көлөкө кошуп, ажыратып көрсөтүү үчүн
          boxShadow: isMobile && isOpen ? '10px 0 30px rgba(0,0,0,0.1)' : 'none',
        }}
      >
        
        <div style={{
          ...styles.header,
          justifyContent: isOpen ? 'space-between' : 'center',
          padding: isOpen ? '0 10px 0 15px' : '0'
        }}>
          {isOpen && (
            <div style={styles.logoWrapper}>
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
          {/* Десктоп версиядагы жебе (Мобилдикте жашырылат) */}
          {!isMobile && (
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              style={styles.toggleBtn}
            >
              {isOpen ? <HiChevronLeft size={20} /> : <HiMenuAlt2 size={20} />}
            </button>
          )}
        </div>

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

      {/* ЖАҢЫ МОБИЛДИК БУРГЕР (Floating Button) */}
      {isMobile && (
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          style={{
            ...styles.mobileBurgerBtn,
            // Эгер меню ачык болсо, кнопка оңго жылат (Sidebar ичине киргендей болот) же өңүн өзгөртөт
            left: isOpen ? '230px' : '20px',
            backgroundColor: isOpen ? '#3B82F6' : '#ffffff',
            color: isOpen ? '#ffffff' : '#3B82F6',
            transform: `rotate(${isOpen ? '180deg' : '0deg'})`,
          }}
        >
          {isOpen ? <HiX /> : <HiMenuAlt2 />}
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

const styles: { [key: string]: React.CSSProperties } = {
  sidebar: {
    position: 'fixed',
    left: 0,
    top: 0,
    height: '100vh',
    background: '#ffffff',
    borderRight: '1px solid #f1f5f9',
    padding: '25px 0',
    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1)', // Анимация жумшартылды
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
    background: 'rgba(15, 23, 42, 0.3)',
    backdropFilter: 'blur(8px)', // Блур көбөйтүлдү
    zIndex: 1000,
    transition: 'opacity 0.3s ease'
  },
  mobileBurgerBtn: {
    position: 'fixed',
    top: '20px',
    zIndex: 1100, // Sidebar'дан да жогору туруш керек
    width: '45px',
    height: '45px',
    borderRadius: '12px',
    border: 'none',
    boxShadow: '0 10px 25px rgba(59, 130, 246, 0.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '22px',
    cursor: 'pointer',
    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', // Пружина эффекти
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
    borderRadius: '14px', // Бардык бурчу тегеректелди
    marginBottom: '6px',
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