import React, { useState, } from 'react';
import { useNavigate } from 'react-router-dom';

const ToguzKorgool: React.FC = () => {
  const navigate = useNavigate();
  
  const [p1Holes, setP1Holes] = useState<number[]>(Array(9).fill(9));
  const [p2Holes, setP2Holes] = useState<number[]>(Array(9).fill(9));
  const [kazan, setKazan] = useState({ p1: 0, p2: 0 });
  const [tuz, setTuz] = useState<{ p1: number | null, p2: number | null }>({ p1: null, p2: null });
  const [isP1Turn, setIsP1Turn] = useState(true);
  const [message, setMessage] = useState("Оюн башталды! 1-оюнчунун кадамы.");

  const makeMove = (index: number, isP1: boolean) => {
    if (isP1 !== isP1Turn) return;
    
    const currentSide = isP1 ? [...p1Holes] : [...p2Holes];
    const opponentSide = isP1 ? [...p2Holes] : [...p1Holes];
    
    if (currentSide[index] === 0) {
      setMessage("Бул үй бош! Башка үй тандаңыз.");
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
          // ТУЗ ТЕКШЕРҮҮ: Эгер бул үй атаандаштын тузу болсо, коргоол түз анын казанына кетет
          const opponentTuzIndex = isP1 ? tuz.p2 : tuz.p1;
          
          if (pos === opponentTuzIndex) {
            setKazan(prev => ({ ...prev, [isP1 ? 'p2' : 'p1']: prev[isP1 ? 'p2' : 'p1' as keyof typeof prev] + 1 }));
          } else {
            opponentSide[pos]++;
          }
          
          remaining--;

          // АКЫРКЫ КОРГООЛ ТҮШКӨНДӨГҮ ЭРЕЖЕЛЕР
          if (remaining === 0) {
            const count = opponentSide[pos];
            // 1. Жуп болсо уттуу
            if (count % 2 === 0) {
              const gain = count;
              opponentSide[pos] = 0;
              setKazan(prev => ({ 
                ...prev, 
                [isP1 ? 'p1' : 'p2']: prev[isP1 ? 'p1' : 'p2' as keyof typeof prev] + gain 
              }));
              setMessage(`Уттуңуз! ${gain} коргоол казанга!`);
            } 
            // 2. ТУЗ АЛУУ (Эгер 3 коргоол болсо жана шарттар туура келсе)
            else if (count === 3) {
              const myTuz = isP1 ? tuz.p1 : tuz.p2;
              const opponentTuz = isP1 ? tuz.p2 : tuz.p1;
              
              // Туз алуу шарттары: мурда алынган эмес, 9-үй эмес, атаандаштын тузу менен бирдей эмес
              if (myTuz === null && pos !== 8 && pos !== opponentTuz) {
                setTuz(prev => ({ ...prev, [isP1 ? 'p1' : 'p2']: pos }));
                const gain = 3;
                opponentSide[pos] = 0;
                setKazan(prev => ({ 
                  ...prev, 
                  [isP1 ? 'p1' : 'p2']: prev[isP1 ? 'p1' : 'p2' as keyof typeof prev] + gain 
                }));
                setMessage("КУТТУКТАЙБЫЗ! Сиз ТУЗ алдыңыз!");
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

    // Состояниени жаңыртуу
    if (isP1) {
      setP1Holes(currentSide);
      setP2Holes(opponentSide);
    } else {
      setP2Holes(currentSide);
      setP1Holes(opponentSide);
    }
    setIsP1Turn(!isP1Turn);
  };

  return (
    <div style={styles.container}>
      <button onClick={() => navigate('/')} style={styles.backBtn}>← Артка</button>
      <h1 style={styles.title}>Тогуз Коргоол</h1>
      
      

      <div style={styles.board}>
        {/* Атаандаш (P2) */}
        <div style={styles.row}>
          {[...p2Holes].reverse().map((count, i) => {
            const idx = 8 - i;
            const isTuz = tuz.p1 === idx; // P1дин P2ден алган тузу
            return (
              <div key={`p2-${idx}`} onClick={() => makeMove(idx, false)} 
                   style={{...styles.hole, borderColor: isTuz ? '#FFD700' : '#8d6e63', background: isTuz ? '#5d4037' : '#3e2723'}}>
                <span style={{...styles.count, color: isTuz ? '#FFD700' : '#f3e5ab'}}>{isTuz ? "Т" : count}</span>
                <div style={styles.holeLabel}>№{9-idx}</div>
              </div>
            );
          })}
        </div>

        <div style={styles.kazanArea}>
          <div style={{...styles.kazanBox, borderColor: !isP1Turn ? '#FFD700' : '#f3e5ab'}}>
            <div style={styles.kazanCount}>{kazan.p2}</div>
            <div style={styles.kazanLabel}>Оюнчу 2 (Казан)</div>
          </div>
          <div style={{...styles.kazanBox, borderColor: isP1Turn ? '#FFD700' : '#f3e5ab'}}>
            <div style={styles.kazanCount}>{kazan.p1}</div>
            <div style={styles.kazanLabel}>Оюнчу 1 (Казан)</div>
          </div>
        </div>

        {/* Оюнчу (P1) */}
        <div style={styles.row}>
          {p1Holes.map((count, i) => {
            const isTuz = tuz.p2 === i; // P2нин P1ден алган тузу
            return (
              <div key={`p1-${i}`} onClick={() => makeMove(i, true)} 
                   style={{...styles.hole, borderColor: isTuz ? '#FFD700' : '#8d6e63', background: isTuz ? '#5d4037' : '#3e2723'}}>
                <span style={{...styles.count, color: isTuz ? '#FFD700' : '#f3e5ab'}}>{isTuz ? "Т" : count}</span>
                <div style={styles.holeLabel}>№{i+1}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={styles.turnIndicator}>
        {message}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: { minHeight: '100vh', background: '#1a0f0a', color: '#f3e5ab', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' },
  backBtn: { alignSelf: 'flex-start', background: 'none', color: '#f3e5ab', border: '1px solid #f3e5ab', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' },
  title: { fontSize: '36px', margin: '20px 0', textShadow: '2px 2px #000' },
  board: { background: '#4e342e', padding: '30px', borderRadius: '20px', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' },
  row: { display: 'flex', gap: '10px', marginBottom: '15px' },
  hole: { width: '60px', height: '85px', borderRadius: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '2px solid', transition: 'all 0.3s ease' },
  count: { fontSize: '24px', fontWeight: 'bold' },
  holeLabel: { fontSize: '10px', marginTop: '5px', color: '#8d6e63' },
  kazanArea: { display: 'flex', justifyContent: 'space-between', gap: '40px', margin: '20px 0' },
  kazanBox: { flex: 1, height: '100px', background: '#2c1810', borderRadius: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '3px solid' },
  kazanCount: { fontSize: '36px', fontWeight: 'bold' },
  kazanLabel: { fontSize: '12px' },
  turnIndicator: { marginTop: '30px', fontSize: '20px', fontWeight: 'bold', color: '#fff' }
};

export default ToguzKorgool;