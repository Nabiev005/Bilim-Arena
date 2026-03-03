import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ChukoGame: React.FC = () => {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [shots, setShots] = useState(12); // Октордун саны
  const [isDragging, setIsDragging] = useState(false);
  const [sakaPos, setSakaPos] = useState({ x: 150, y: 300 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isGameOver, setIsGameOver] = useState(false);
  
  const [chukos, setChukos] = useState([
    { id: 1, x: 600, y: 120, active: true, isKhan: false },
    { id: 2, x: 650, y: 220, active: true, isKhan: false },
    { id: 3, x: 600, y: 320, active: true, isKhan: false },
    { id: 4, x: 650, y: 420, active: true, isKhan: false },
    { id: 5, x: 750, y: 270, active: true, isKhan: true }, // Хан
  ]);

  // Оюн бүттүбү текшерүү
  useEffect(() => {
    const allCleared = chukos.every(c => !c.active);
    if ((shots === 0 && !isDragging) || allCleared) {
      setTimeout(() => setIsGameOver(true), 1000);
    }
  }, [shots, chukos, isDragging]);

  const checkCollision = useCallback((finalX: number, finalY: number) => {
    setChukos(prevChukos => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      let hit = false;
      const nextChukos = prevChukos.map(chuko => {
        const distance = Math.sqrt(
          Math.pow(finalX - chuko.x, 2) + Math.pow(finalY - chuko.y, 2)
        );
        if (chuko.active && distance < 70) {
          hit = true;
          setScore(s => s + (chuko.isKhan ? 100 : 20));
          return { ...chuko, active: false };
        }
        return chuko;
      });
      return nextChukos;
    });
  }, []);

  const handleMouseDown = () => {
    if (shots <= 0 || isGameOver) return;
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const currentX = clientX - rect.left;
    const currentY = clientY - rect.top;

    const dx = currentX - 150;
    const dy = currentY - 300;
    
    // Тартуу чектөөсү
    if (Math.abs(dx) < 180 && Math.abs(dy) < 180) {
      setDragOffset({ x: dx, y: dy });
    }
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const powerX = -dragOffset.x * 5.5;
    const powerY = -dragOffset.y * 5.5;

    const finalX = 150 + powerX;
    const finalY = 300 + powerY;

    setSakaPos({ x: finalX, y: finalY });
    setShots(s => s - 1);

    setTimeout(() => {
      checkCollision(finalX, finalY);
      setTimeout(() => {
        setSakaPos({ x: 150, y: 300 });
        setDragOffset({ x: 0, y: 0 });
      }, 500);
    }, 400);
  };

  const resetGame = () => {
    setScore(0);
    setShots(12);
    setIsGameOver(false);
    setChukos(chukos.map(c => ({ ...c, active: true })));
  };

  return (
    <div style={styles.container}>
      <button onClick={() => navigate('/')} style={styles.backBtn}>← Менюга кайтуу</button>
      
      <div style={styles.header}>
        <h1 style={styles.title}>Кыргыз Ордо: Чүкө Атуу 🎯</h1>
        <div style={styles.stats}>
          <div style={styles.statItem}>Упай: <span style={{color: '#ffd700'}}>{score}</span></div>
          <div style={styles.statItem}>Аракет: <span style={{color: shots < 4 ? '#ff4d4d' : '#4dff88'}}>{shots}</span></div>
        </div>
      </div>

      <div 
        style={styles.gameBoard}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchMove={handleMouseMove}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
        onMouseLeave={() => isDragging && handleMouseUp()}
      >
        {/* Багыттоочу сызык */}
        {isDragging && (
          <div style={{
            ...styles.trajectory,
            width: Math.sqrt(dragOffset.x**2 + dragOffset.y**2) * 3,
            transform: `rotate(${Math.atan2(-dragOffset.y, -dragOffset.x) * 180 / Math.PI}deg)`,
            left: 170,
            top: 320,
          }} />
        )}

        {/* Сака */}
        <div style={{
          ...styles.saka,
          left: isDragging ? 150 + dragOffset.x : sakaPos.x,
          top: isDragging ? 300 + dragOffset.y : sakaPos.y,
          transition: isDragging ? 'none' : 'all 0.5s cubic-bezier(0.1, 0.5, 0.3, 1)',
          filter: isDragging ? 'drop-shadow(0 0 15px #4299e1)' : 'none'
        }}>
          🔵
        </div>

        {/* Чүкөлөр */}
        {chukos.map(chuko => (
          <div key={chuko.id} style={{ 
            ...styles.chuko, 
            left: chuko.x, 
            top: chuko.y, 
            opacity: chuko.active ? 1 : 0,
            transform: chuko.active ? 'scale(1)' : 'scale(0) rotate(360deg)',
            background: chuko.isKhan ? 'linear-gradient(135deg, #ffd700, #b8860b)' : '#fff',
          }}>
            {chuko.isKhan ? '👑' : '🦴'}
          </div>
        ))}

        <div style={styles.ordoLine} />

        {/* Game Over Overlay */}
        {isGameOver && (
          <div style={styles.overlay}>
            <h2 style={{fontSize: '48px'}}>Оюн бүттү!</h2>
            <p style={{fontSize: '24px'}}>Жалпы упайыңыз: {score}</p>
            <button onClick={resetGame} style={styles.resetBtn}>Кайра баштоо</button>
          </div>
        )}
      </div>

      <div style={styles.instructions}>
        <b>Кантип ойноо керек:</b> Саканы <b>солго же артка</b> тартып, бутаны мээлеп туруп коё бериңиз. 
        Ханды (👑) атуу үчүн көбүрөөк упай берилет!
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: { minHeight: '100vh', background: 'radial-gradient(circle, #2d5a27 0%, #1a472a 100%)', color: '#fff', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', userSelect: 'none', touchAction: 'none' },
  backBtn: { alignSelf: 'flex-start', padding: '12px 24px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', background: 'rgba(255,255,255,0.1)', color: '#fff', fontWeight: 'bold', transition: '0.3s' },
  header: { textAlign: 'center', margin: '10px 0' },
  title: { fontSize: '40px', marginBottom: '15px', fontWeight: '900', letterSpacing: '-1px' },
  stats: { display: 'flex', gap: '15px' },
  statItem: { background: 'rgba(0,0,0,0.5)', padding: '12px 30px', borderRadius: '20px', fontSize: '20px', fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.1)' },
  gameBoard: { width: '900px', height: '550px', background: '#254a20', borderRadius: '50px', border: '15px solid #3e2723', position: 'relative', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.7)', marginTop: '20px' },
  saka: { position: 'absolute', fontSize: '50px', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, cursor: 'grab' },
  chuko: { position: 'absolute', width: '50px', height: '50px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', border: '2px solid #8d6e63', transition: 'all 0.5s ease-out', boxShadow: '0 8px 15px rgba(0,0,0,0.4)' },
  ordoLine: { position: 'absolute', left: '500px', height: '100%', width: '2px', background: 'rgba(255,255,255,0.1)', borderStyle: 'dashed' },
  trajectory: { position: 'absolute', height: '3px', transformOrigin: 'left center', zIndex: 5, borderBottom: '3px dashed rgba(255,255,255,0.6)' },
  overlay: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 100, borderRadius: '35px', textAlign: 'center' },
  resetBtn: { marginTop: '20px', padding: '15px 40px', fontSize: '20px', borderRadius: '15px', border: 'none', background: '#4299e1', color: '#fff', fontWeight: 'bold', cursor: 'pointer' },
  instructions: { marginTop: '30px', background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '25px', maxWidth: '700px', textAlign: 'center', color: '#a0aec0', fontSize: '14px', border: '1px solid rgba(255,255,255,0.05)' }
};

export default ChukoGame;