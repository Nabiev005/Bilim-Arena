import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Суроолор базасы деңгээлдерге бөлүндү
const QUESTION_BANK = {
  EASY: [
    { q: "5 + 7", a: 12 }, { q: "10 - 4", a: 6 }, { q: "3 * 4", a: 12 },
    { q: "15 + 5", a: 20 }, { q: "20 / 2", a: 10 }, { q: "9 - 3", a: 6 },
    { q: "8 + 8", a: 16 }, { q: "12 / 3", a: 4 }, { q: "6 * 2", a: 12 },
    { q: "18 + 2", a: 20 }, { q: "25 - 5", a: 20 }, { q: "7 * 3", a: 21 },
    { q: "30 / 5", a: 6 }, { q: "14 + 6", a: 20 }, { q: "16 - 8", a: 8 },
    { q: "4 * 5", a: 20 }, { q: "18 / 2", a: 9 }, { q: "11 + 9", a: 20 },
    { q: "50 / 10", a: 5 }, { q: "9 * 3", a: 27 }, { q: "13 + 7", a: 20 }
  ],
  MEDIUM: [
    { q: "12 * 4", a: 48 }, { q: "85 - 27", a: 58 }, { q: "9 * 9", a: 81 },
    { q: "150 / 3", a: 50 }, { q: "44 + 56", a: 100 }, { q: "7 * 8", a: 56 },
    { q: "120 - 45", a: 75 }, { q: "13 * 3", a: 39 }, { q: "64 / 4", a: 16 },
    { q: "16 * 5", a: 80 }, { q: "95 - 38", a: 57 }, { q: "12 * 12", a: 144 },
    { q: "200 / 8", a: 25 }, { q: "75 + 125", a: 200 }, { q: "6 * 15", a: 90 },
    { q: "180 / 9", a: 20 }, { q: "14 * 4", a: 56 }, { q: "300 / 15", a: 20 },
    { q: "45 * 2", a: 90 }, { q: "11 * 11", a: 121 }, { q: "88 / 4", a: 22 }
  ],
  HARD: [
    { q: "15 * 12", a: 180 }, { q: "225 / 15", a: 15 }, { q: "345 + 167", a: 512 },
    { q: "18 * 5", a: 90 }, { q: "500 - 123", a: 377 }, { q: "14 * 14", a: 196 },
    { q: "720 / 6", a: 120 }, { q: "25 * 25", a: 625 }, { q: "99 + 101 * 2", a: 301 },
    { q: "1000 / 8", a: 125 }, { q: "45 * 3 + 15", a: 150 }, { q: "625 / 25", a: 25 },
    { q: "12 * 15", a: 180 }, { q: "450 - 275", a: 175 }, { q: "17 * 3", a: 51 },
    { q: "840 / 12", a: 70 }, { q: "13 * 13", a: 169 }, { q: "250 * 4 / 10", a: 100 },
    { q: "19 * 3", a: 57 }, { q: "512 / 8", a: 64 }, { q: "1000 - 444", a: 556 }
  ]
};

const MathKokBoru: React.FC = () => {
  const navigate = useNavigate();
  const [level, setLevel] = useState<null | 'EASY' | 'MEDIUM' | 'HARD'>(null);
  const [ulakPos, setUlakPos] = useState(50);
  const [q1Idx, setQ1Idx] = useState(0);
  const [q2Idx, setQ2Idx] = useState(1);
  const [in1, setIn1] = useState("");
  const [in2, setIn2] = useState("");
  const [winner, setWinner] = useState<string | null>(null);

  const questions = level ? QUESTION_BANK[level] : [];

  const handleNumpad = (n: string, team: number) => {
    if (winner) return;
    if (n === "C") {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      team === 1 ? setIn1("") : setIn2("");
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      team === 1 ? setIn1(p => (p.length < 5 ? p + n : p)) : setIn2(p => (p.length < 5 ? p + n : p));
    }
  };

  const check = (team: number) => {
    const input = team === 1 ? in1 : in2;
    const currentQ = team === 1 ? questions[q1Idx] : questions[q2Idx];

    if (parseInt(input) === currentQ.a) {
      if (team === 1) {
        setUlakPos(p => {
          const newP = p - 10;
          if (newP <= 10) setWinner("КӨК ТОП ЖЕҢДИ! 🏆");
          return newP;
        });
        setQ1Idx(p => (p + 2) % questions.length);
        setIn1("");
      } else {
        setUlakPos(p => {
          const newP = p + 10;
          if (newP >= 90) setWinner("КЫЗЫЛ ТОП ЖЕҢДИ! 🏆");
          return newP;
        });
        setQ2Idx(p => (p + 2) % questions.length);
        setIn2("");
      }
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      team === 1 ? setIn1("") : setIn2("");
    }
  };

  // Деңгээл тандоо экраны
  if (!level) {
    return (
      <div style={s.levelOverlay}>
        <div style={s.levelCard}>
          <h2 style={{color: '#064e3b', marginBottom: '30px'}}>ДЕҢГЭЭЛДИ ТАНДАҢЫЗ</h2>
          <button onClick={() => setLevel('EASY')} style={{...s.lvlBtn, background: '#10b981'}}>ЖӨНӨКӨЙ (1-4 класс)</button>
          <button onClick={() => setLevel('MEDIUM')} style={{...s.lvlBtn, background: '#f59e0b'}}>ОРТО (5-9 класс)</button>
          <button onClick={() => setLevel('HARD')} style={{...s.lvlBtn, background: '#ef4444'}}>КЫЙЫН (10-11 класс)</button>
          <button onClick={() => navigate('/')} style={s.backToMenu}>Башкы бетке</button>
        </div>
      </div>
    );
  }

  return (
    <div style={s.container}>
      <div style={s.header}>
        <button onClick={() => setLevel(null)} style={s.backBtn}>← Деңгээлге</button>
        <h1 style={s.title}>КӨК-БӨРҮ: {level === 'EASY' ? 'Жөнөкөй' : level === 'MEDIUM' ? 'Орто' : 'Кыйын'}</h1>
      </div>

      <div style={s.arena}>
        <div style={{...s.kazan, left: '15px', borderColor: '#3b82f6'}}>🔵</div>
        <div style={s.trackLine}>
            <div style={{...s.ulakWrapper, left: `${ulakPos}%`}}>
                <span style={s.ulakEmoji}>🏆</span>
                <div style={s.ulakShadow}></div>
            </div>
        </div>
        <div style={{...s.kazan, right: '15px', borderColor: '#ef4444'}}>🔴</div>
      </div>

      <div style={s.battleArea}>
        {[1, 2].map(team => (
          <div key={team} style={{...s.card, borderTop: `10px solid ${team === 1 ? '#3b82f6' : '#ef4444'}`}}>
            <h3 style={{color: team === 1 ? '#3b82f6' : '#ef4444'}}>{team === 1 ? 'Көк Топ' : 'Кызыл Топ'}</h3>
            <div style={s.qBox}>{team === 1 ? questions[q1Idx].q : questions[q2Idx].q}</div>
            <div style={s.inputBox}>{team === 1 ? in1 || "?" : in2 || "?"}</div>
            <div style={s.numpad}>
              {["1","2","3","4","5","6","7","8","9","C","0"].map(n => (
                <button key={n} onClick={() => handleNumpad(n, team)} style={{...s.numBtn, gridColumn: n === "0" ? "span 2" : "auto"}}>{n}</button>
              ))}
              <button onClick={() => check(team)} style={{...s.actionBtn, background: team === 1 ? '#3b82f6' : '#ef4444'}}>АЛГА!</button>
            </div>
          </div>
        ))}
      </div>

      {winner && (
        <div style={s.overlay}>
          <div style={s.winModal}>
            <h2 style={{fontSize: '32px'}}>{winner}</h2>
            <button onClick={() => window.location.reload()} style={s.retryBtn}>Кайра баштоо</button>
          </div>
        </div>
      )}
    </div>
  );
};

const s: { [key: string]: React.CSSProperties } = {
  container: { minHeight: '100vh', background: '#064e3b', padding: '20px', color: '#fff' },
  levelOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: '#064e3b', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  levelCard: { background: '#fff', padding: '40px', borderRadius: '30px', textAlign: 'center', width: '90%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '15px' },
  lvlBtn: { padding: '18px', border: 'none', borderRadius: '15px', color: '#fff', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s' },
  backToMenu: { marginTop: '10px', background: 'none', border: 'none', color: '#666', cursor: 'pointer', textDecoration: 'underline' },
  header: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' },
  backBtn: { background: '#065f46', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '10px', cursor: 'pointer' },
  title: { fontSize: '20px', color: '#fbbf24', margin: 0 },
  arena: { background: '#059669', height: '160px', borderRadius: '40px', border: '4px solid #fbbf24', marginBottom: '30px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  trackLine: { width: '75%', height: '2px', background: 'rgba(255,255,255,0.3)', position: 'relative' },
  ulakWrapper: { position: 'absolute', top: '-40px', transform: 'translateX(-50%)', transition: '0.5s', textAlign: 'center' },
  ulakEmoji: { fontSize: '55px', display: 'block' },
  ulakShadow: { width: '40px', height: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '50%', margin: '0 auto' },
  kazan: { position: 'absolute', width: '80px', height: '80px', border: '6px solid', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' },
  battleArea: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '20px' },
  card: { background: '#fff', borderRadius: '25px', padding: '20px', color: '#333', textAlign: 'center' },
  qBox: { fontSize: '38px', fontWeight: 'bold', margin: '15px 0' },
  inputBox: { fontSize: '30px', background: '#f8fafc', padding: '10px', borderRadius: '15px', border: '2px solid #e2e8f0', marginBottom: '20px' },
  numpad: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' },
  numBtn: { padding: '15px', fontSize: '22px', borderRadius: '12px', border: '1px solid #ddd', cursor: 'pointer', background: '#fdfdfd', fontWeight: 'bold' },
  actionBtn: { gridColumn: 'span 3', padding: '15px', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer' },
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 },
  winModal: { background: '#fff', padding: '40px', borderRadius: '30px', textAlign: 'center', color: '#333' },
  retryBtn: { marginTop: '20px', padding: '12px 30px', background: '#fbbf24', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }
};

export default MathKokBoru;