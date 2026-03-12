import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ToguzKorgool: React.FC = () => {
  const navigate = useNavigate();
  
  const [p1Holes, setP1Holes] = useState<number[]>(Array(9).fill(9));
  const [p2Holes, setP2Holes] = useState<number[]>(Array(9).fill(9));
  const [kazan, setKazan] = useState({ p1: 0, p2: 0 });
  const [tuz, setTuz] = useState<{ p1: number | null, p2: number | null }>({ p1: null, p2: null });
  const [isP1Turn, setIsP1Turn] = useState(true);
  const [message, setMessage] = useState("1-оюнчунун кадамы");

  // Экрандын өлчөмүн көзөмөлдөө (адаптивдүүлүк үчүн)
  const [, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const makeMove = (index: number, isP1: boolean) => {
    if (isP1 !== isP1Turn) return;
    
    const currentSide = isP1 ? [...p1Holes] : [...p2Holes];
    const opponentSide = isP1 ? [...p2Holes] : [...p1Holes];
    
    if (currentSide[index] === 0) {
      setMessage("Бул үй бош!");
      return;
    }

    let remaining = currentSide[index];
    currentSide[index] = remaining === 1 ? 0 : 1;
    if (remaining > 1) remaining--;

    let pos = index + 1;
    let onCurrentSide = true;

    while (remaining > 0) {
      if (onCurrentSide) {
        if (pos < 9) {
          currentSide[pos]++;
          remaining--;
          pos++;
        } else {
          onCurrentSide = false;
          pos = 0;
        }
      } else {
        if (pos < 9) {
          const opponentTuzIndex = isP1 ? tuz.p2 : tuz.p1;
          if (pos === opponentTuzIndex) {
            setKazan(prev => ({ ...prev, [isP1 ? 'p2' : 'p1']: prev[isP1 ? 'p2' : 'p1' as keyof typeof prev] + 1 }));
          } else {
            opponentSide[pos]++;
          }
          remaining--;

          if (remaining === 0) {
            const count = opponentSide[pos];
            if (count % 2 === 0) {
              const gain = count;
              opponentSide[pos] = 0;
              setKazan(prev => ({ 
                ...prev, 
                [isP1 ? 'p1' : 'p2']: prev[isP1 ? 'p1' : 'p2' as keyof typeof prev] + gain 
              }));
              setMessage(`Уттуңуз! +${gain}`);
            } else if (count === 3) {
              const myTuz = isP1 ? tuz.p1 : tuz.p2;
              const opponentTuz = isP1 ? tuz.p2 : tuz.p1;
              if (myTuz === null && pos !== 8 && pos !== opponentTuz) {
                setTuz(prev => ({ ...prev, [isP1 ? 'p1' : 'p2']: pos }));
                opponentSide[pos] = 0;
                setKazan(prev => ({ ...prev, [isP1 ? 'p1' : 'p2']: prev[isP1 ? 'p1' : 'p2' as keyof typeof prev] + 3 }));
                setMessage("Сиз ТУЗ алдыңыз!");
              }
            }
          }
          pos++;
        } else {
          onCurrentSide = true;
          pos = 0;
        }
      }
    }

    if (isP1) { setP1Holes(currentSide); setP2Holes(opponentSide); } 
    else { setP2Holes(currentSide); setP1Holes(opponentSide); }
    setIsP1Turn(!isP1Turn);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => navigate('/')} style={styles.backBtn}>←</button>
        <h1 style={styles.title}>Тогуз Коргоол</h1>
        <div style={{width: '40px'}} /> 
      </div>
      
      <div style={styles.gameInfo}>
        <div style={{...styles.playerBadge, opacity: !isP1Turn ? 1 : 0.5}}>P2 (Атаандаш)</div>
        <div style={styles.messageBox}>{message}</div>
        <div style={{...styles.playerBadge, opacity: isP1Turn ? 1 : 0.5}}>P1 (Сиз)</div>
      </div>

      <div style={styles.boardWrapper}>
        <div style={styles.board}>
          {/* P2 Row */}
          <div style={styles.row}>
            {[...p2Holes].reverse().map((count, i) => {
              const idx = 8 - i;
              const isTuz = tuz.p1 === idx;
              return (
                <div key={`p2-${idx}`} onClick={() => makeMove(idx, false)} 
                     style={{...styles.hole, ...styles.p2Hole, borderColor: isTuz ? '#FFD700' : '#8d6e63'}}>
                  <span style={{...styles.count, color: isTuz ? '#FFD700' : '#f3e5ab'}}>{isTuz ? "Т" : count}</span>
                  <div style={styles.holeLabel}>{9-idx}</div>
                </div>
              );
            })}
          </div>

          {/* Kazans */}
          <div style={styles.kazanArea}>
            <div style={{...styles.kazanBox, borderBottom: '4px solid #3B82F6'}}>
              <span style={styles.kazanLabel}>P2</span>
              <div style={styles.kazanCount}>{kazan.p2}</div>
            </div>
            <div style={{...styles.kazanBox, borderBottom: '4px solid #48BB78'}}>
              <span style={styles.kazanLabel}>P1</span>
              <div style={styles.kazanCount}>{kazan.p1}</div>
            </div>
          </div>

          {/* P1 Row */}
          <div style={styles.row}>
            {p1Holes.map((count, i) => {
              const isTuz = tuz.p2 === i;
              return (
                <div key={`p1-${i}`} onClick={() => makeMove(i, true)} 
                     style={{...styles.hole, ...styles.p1Hole, borderColor: isTuz ? '#FFD700' : '#8d6e63'}}>
                  <span style={{...styles.count, color: isTuz ? '#FFD700' : '#f3e5ab'}}>{isTuz ? "Т" : count}</span>
                  <div style={styles.holeLabel}>{i+1}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={styles.instructions}>
        * Телефондо ойносоңуз, уячаларды көрүү үчүн тактаны оңго-солго жылдырыңыз.
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: { 
    minHeight: '100vh', 
    background: '#1a0f0a', 
    color: '#f3e5ab', 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    padding: '10px',
    fontFamily: 'sans-serif'
  },
  header: { width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  backBtn: { background: '#3e2723', color: '#f3e5ab', border: 'none', width: '40px', height: '40px', borderRadius: '10px', fontSize: '20px', cursor: 'pointer' },
  title: { fontSize: '22px', fontWeight: 'bold', margin: 0, color: '#FFD700' },
  
  gameInfo: { width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', gap: '10px' },
  playerBadge: { background: '#3e2723', padding: '5px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold' },
  messageBox: { flex: 1, textAlign: 'center', fontSize: '14px', color: '#fff', background: 'rgba(255,255,255,0.1)', padding: '5px', borderRadius: '5px' },

  boardWrapper: { 
    width: '100%', 
    overflowX: 'auto', // Мобилдикте скролл болушу үчүн
    padding: '10px 0',
    WebkitOverflowScrolling: 'touch',
  },
  board: { 
    minWidth: '650px', // Телефондо такта кысылып калбашы үчүн минималдуу өлчөм
    background: '#4e342e', 
    padding: '20px', 
    borderRadius: '15px', 
    margin: '0 auto',
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
  },
  row: { display: 'flex', gap: '8px', justifyContent: 'center' },
  hole: { 
    width: '60px', 
    height: '80px', 
    borderRadius: '12px', 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center', 
    cursor: 'pointer', 
    border: '2px solid',
    position: 'relative',
    transition: 'transform 0.1s'
  },
  p1Hole: { background: '#3e2723' },
  p2Hole: { background: '#2c1810' },
  count: { fontSize: '22px', fontWeight: 'bold' },
  holeLabel: { fontSize: '9px', position: 'absolute', bottom: '5px', color: '#8d6e63' },
  
  kazanArea: { display: 'flex', justifyContent: 'center', gap: '20px', margin: '15px 0' },
  kazanBox: { width: '120px', height: '70px', background: '#1a0f0a', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  kazanCount: { fontSize: '28px', fontWeight: 'bold', color: '#fff' },
  kazanLabel: { fontSize: '10px', color: '#8d6e63' },
  
  instructions: { marginTop: '20px', fontSize: '12px', color: '#8d6e63', textAlign: 'center', fontStyle: 'italic' }
};

export default ToguzKorgool;