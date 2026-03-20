import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Hacker {
  id: number;
  q: string;
  a: number;
  pos: number;
}

const CyberShield: React.FC = () => {
  const navigate = useNavigate();
  const [hackers, setHackers] = useState<Hacker[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(100);
  const [gameOver, setGameOver] = useState(false);

  const createHacker = () => {
    const num1 = Math.floor(Math.random() * 20) + 1;
    const num2 = Math.floor(Math.random() * 20) + 1;
    return {
      id: Date.now(),
      q: `${num1} + ${num2}`,
      a: num1 + num2,
      pos: 0
    };
  };

    useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setHackers(prev => {
        const moved = prev.map(h => ({ ...h, pos: h.pos + 2 }));
        const reached = moved.filter(h => h.pos >= 90);
        if (reached.length > 0) {
          setHealth(h => Math.max(0, h - reached.length * 10));
        }
        return moved.filter(h => h.pos < 90);
      });
    }, 500);

    return () => clearInterval(interval);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver) return;
    const spawn = setInterval(() => {
      setHackers(prev => [...prev, createHacker()]);
    }, 3000);
    return () => clearInterval(spawn);
  }, [gameOver]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (health <= 0) setGameOver(true);
  }, [health]);

  const checkAnswer = () => {
    const answer = parseInt(inputValue);
    const target = hackers.find(h => h.a === answer);

    if (target) {
      setHackers(prev => prev.filter(h => h.id !== target.id));
      setScore(s => s + 10);
      setInputValue("");
    } else {
      setInputValue("");
    }
  };

  return (
    <div style={s.container}>
      <div style={s.header}>
        <button onClick={() => navigate('/')} style={s.backBtn}>← Меню</button>
        <div style={s.stats}>
          <span style={s.statItem}>СПОРТ: {score}</span>
          <span style={{...s.statItem, color: health < 30 ? '#ef4444' : '#10b981'}}>
            КАЛКАН: {health}%
          </span>
        </div>
      </div>

      <div style={s.cyberArena}>
        {/* Сервер (Корголо турган объект) */}
        <div style={s.server}>
          <div style={s.serverIcon}>🖥️</div>
          <div style={s.serverLabel}>НЕГИЗГИ СЕРВЕР</div>
          <div style={{...s.shieldGlow, opacity: health / 100}} />
        </div>

        {/* Хакерлердин чабуулу */}
        {hackers.map(h => (
          <div key={h.id} style={{...s.hacker, bottom: `${h.pos}%`}}>
            <div style={s.bugIcon}>👾</div>
            <div style={s.question}>{h.q}</div>
          </div>
        ))}
      </div>

      <div style={s.inputArea}>
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
          placeholder="Кибер-кодду жазыңыз..."
          style={s.input}
          autoFocus
        />
        <button onClick={checkAnswer} style={s.fireBtn}>FIREWALL ИШТЕШҮҮ</button>
      </div>

      {gameOver && (
        <div style={s.overlay}>
          <div style={s.modal}>
            <h2 style={{color: '#ef4444'}}>СИСТЕМА КӨРГӨН!</h2>
            <p>Сиздин упайыңыз: {score}</p>
            <button onClick={() => window.location.reload()} style={s.resetBtn}>СИСТЕМАНЫ ЖАҢЫРТ</button>
          </div>
        </div>
      )}
    </div>
  );
};

const s: { [key: string]: React.CSSProperties } = {
  container: { height: '100vh', background: '#0a0a0c', color: '#00ff41', fontFamily: '"Courier New", monospace', padding: '20px', display: 'flex', flexDirection: 'column' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  backBtn: { background: '#1a1a1e', color: '#00ff41', border: '1px solid #00ff41', padding: '8px 15px', cursor: 'pointer', borderRadius: '4px' },
  stats: { fontSize: '20px', fontWeight: 'bold', display: 'flex', gap: '30px' },
  statItem: { textShadow: '0 0 10px currentColor' },
  cyberArena: { flex: 1, position: 'relative', background: 'radial-gradient(circle, #1a1a1e 1px, transparent 1px)', backgroundSize: '30px 30px', border: '2px solid #1a1a1e', borderRadius: '15px', overflow: 'hidden', marginBottom: '20px' },
  server: { position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', zIndex: 10 },
  serverIcon: { fontSize: '60px', filter: 'drop-shadow(0 0 15px #00ff41)' },
  serverLabel: { fontSize: '12px', marginTop: '5px' },
  shieldGlow: { position: 'absolute', top: '-20px', left: '-20px', right: '-20px', bottom: '-20px', border: '2px solid #00ff41', borderRadius: '50%', boxShadow: '0 0 20px #00ff41', animation: 'pulse 2s infinite' },
  hacker: { position: 'absolute', left: '50%', transform: 'translateX(-50%)', transition: 'bottom 0.5s linear', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  bugIcon: { fontSize: '30px', filter: 'drop-shadow(0 0 5px #ef4444)' },
  question: { background: '#ef4444', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '14px', fontWeight: 'bold', marginTop: '5px' },
  inputArea: { display: 'flex', gap: '10px', maxWidth: '600px', margin: '0 auto', width: '100%' },
  input: { flex: 1, background: '#1a1a1e', border: '1px solid #00ff41', color: '#00ff41', padding: '15px', fontSize: '18px', outline: 'none', borderRadius: '8px' },
  fireBtn: { background: '#00ff41', color: '#000', border: 'none', padding: '0 20px', fontWeight: 'bold', cursor: 'pointer', borderRadius: '8px' },
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 },
  modal: { background: '#1a1a1e', padding: '40px', borderRadius: '20px', textAlign: 'center', border: '2px solid #ef4444' },
  resetBtn: { marginTop: '20px', padding: '10px 25px', background: '#00ff41', border: 'none', color: '#000', fontWeight: 'bold', cursor: 'pointer', borderRadius: '5px' }
};

export default CyberShield;