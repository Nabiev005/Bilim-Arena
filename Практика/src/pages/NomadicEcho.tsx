import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const NomadicEcho: React.FC = () => {
  const navigate = useNavigate();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isMessage, setIsMessage] = useState("Түн. Үндөр сизге жол көрсөтөт...");
  const [isMoving, setIsMoving] = useState(false);

  // 1. Карта (0: жол, 1: аска, 2: Боз Үй)
  const [gameMap] = useState([
    [0, 0, 1, 0, 0],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 0, 0],
    [0, 0, 0, 1, 2],
  ]);

  // 2. Үн ойнотуу функциясы
  const playEcho = useCallback((type: 'path' | 'wall' | 'win') => {
    const sounds = {
      path: 'https://actions.google.com/sounds/v1/foley/wind_chime_single.ogg',
      wall: 'https://actions.google.com/sounds/v1/foley/stone_hit.ogg',
      win: 'https://actions.google.com/sounds/v1/celebration/victory_fanfare.ogg'
    };

    const audio = new Audio(sounds[type]);
    audio.volume = 0.4;
    audio.play().catch(() => console.log("Аудио ойнотулган жок."));
  }, []);

  const movePlayer = (dx: number, dy: number) => {
    if (isMoving) return; // Анимация учурунда басууга болбойт
    
    setIsMoving(true);
    const newX = position.x + dx;
    const newY = position.y + dy;

    // Анимация эффектиси үчүн кичинекей пауза
    setTimeout(() => {
      // Картанын чегин текшерүү
      if (newX >= 0 && newX < gameMap.length && newY >= 0 && newY < gameMap[0].length) {
        const cell = gameMap[newX][newY];

        if (cell === 1) {
          playEcho('wall');
          setIsMessage("Аска! Кыл кыяктын ачуу үнү жаңырып, жол жабылды.");
        } else if (cell === 2) {
          playEcho('win');
          setIsMessage("Куттуктайбыз! Сиз Боз Үйгө (финишке) жеттиңиз!");
          setPosition({ x: newX, y: newY });
          setTimeout(() => navigate('/'), 4000);
        } else {
          playEcho('path');
          setIsMessage("Комуздун добушу... Жол ачык, алга кадам таштаңыз.");
          setPosition({ x: newX, y: newY });
        }
      } else {
        setIsMessage("Караңгылык... Бул тарапта жол жок.");
      }
      setIsMoving(false);
    }, 300);
  };

  return (
    <div style={styles.container}>
      <button onClick={() => navigate('/')} style={styles.backBtn}>← Артка</button>

      <div style={styles.content}>
        <div style={styles.visualizer}>
          {/* Ripple анимациясы активдүү кадамда күчөйт */}
          <div className={`ripple ${isMoving ? 'active' : ''}`}></div>
          <div className={`ripple delay-1 ${isMoving ? 'active' : ''}`}></div>
          <div className={`ripple delay-2 ${isMoving ? 'active' : ''}`}></div>
          <div style={{...styles.nomadIcon, transform: isMoving ? 'scale(1.2)' : 'scale(1)'}}>
            {gameMap[position.x][position.y] === 2 ? '🛖' : '🌙'}
          </div>
        </div>

        <h1 style={styles.title}>Көчмөн Эхосу</h1>
        <p style={styles.message}>{isMessage}</p>

        <div style={styles.controls}>
          <button style={styles.btn} onClick={() => movePlayer(-1, 0)}>⬆️ Чоор</button>
          <div style={styles.midGroup}>
            <button style={styles.btn} onClick={() => movePlayer(0, -1)}>⬅️ Кыяк</button>
            <button style={styles.btn} onClick={() => movePlayer(0, 1)}>➡️ Комуз</button>
          </div>
          <button style={styles.btn} onClick={() => movePlayer(1, 0)}>⬇️ Доол</button>
        </div>

        {/* Оюнчуга кайда экенин билдирген кичинекей индикатор (милдеттүү эмес, бирок жардам берет) */}
        <div style={styles.positionInfo}>
          Абалыңыз: {position.x + 1}, {position.y + 1}
        </div>
      </div>

      <style>{`
        .ripple {
          position: absolute;
          width: 120px;
          height: 120px;
          border: 2px solid #daa520;
          border-radius: 50%;
          animation: pulse 4s infinite;
          opacity: 0;
          transition: 0.3s;
        }
        .ripple.active {
          border-color: #fff;
          border-width: 4px;
        }
        .delay-1 { animation-delay: 1.2s; }
        .delay-2 { animation-delay: 2.4s; }
        @keyframes pulse {
          0% { transform: scale(0.8); opacity: 0.6; }
          100% { transform: scale(3.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0a0a0a',
    color: '#daa520',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontFamily: "'Segoe UI', Roboto, sans-serif",
    padding: '20px',
    overflow: 'hidden'
  },
  backBtn: {
    alignSelf: 'flex-start',
    background: 'rgba(218, 165, 32, 0.1)',
    border: '1px solid #daa520',
    color: '#daa520',
    padding: '10px 25px',
    borderRadius: '30px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: '0.3s'
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '40px',
    width: '100%'
  },
  visualizer: {
    width: '250px',
    height: '250px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    background: 'radial-gradient(circle, rgba(218,165,32,0.1) 0%, rgba(0,0,0,0) 70%)',
    borderRadius: '50%'
  },
  nomadIcon: { 
    fontSize: '60px', 
    zIndex: 5, 
    transition: '0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)' 
  },
  title: { 
    fontSize: '42px', 
    letterSpacing: '5px', 
    margin: 0, 
    textAlign: 'center',
    textShadow: '0 0 20px rgba(218, 165, 32, 0.5)'
  },
  message: { 
    fontSize: '18px', 
    color: '#cbd5e0', 
    maxWidth: '350px', 
    textAlign: 'center', 
    height: '60px',
    lineHeight: '1.5'
  },
  controls: { display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' },
  midGroup: { display: 'flex', gap: '50px' },
  btn: {
    background: '#121212',
    border: '2px solid #daa520',
    color: '#daa520',
    padding: '25px 35px',
    borderRadius: '20px',
    fontSize: '20px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 5px 15px rgba(0,0,0,0.5)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '5px'
  },
  positionInfo: {
    fontSize: '12px',
    color: '#4a5568',
    marginTop: '20px',
    letterSpacing: '2px'
  }
};

export default NomadicEcho;