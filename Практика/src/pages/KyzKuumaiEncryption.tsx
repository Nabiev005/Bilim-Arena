import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const KyzKuumaiEncryption: React.FC = () => {
  const navigate = useNavigate();
  const [isGameActive, setIsGameActive] = useState(false);
  const [distance, setDistance] = useState(0); 
  const [encryptedKey, setEncryptedKey] = useState(0);
  const [answer, setAnswer] = useState("");
  const [mathQ, setMathQ] = useState({ q: "", a: 0 });
  const [message, setMessage] = useState("Маалыматты шифрлөө үчүн 'СТАРТ' басыңыз!");
  const [hackerPos, setHackerPos] = useState(-20);

  const generateLevel = () => {
    const n1 = Math.floor(Math.random() * 15) + 5;
    const n2 = Math.floor(Math.random() * 15) + 5;
    const secretKey = n1 + n2;
    setMathQ({ q: `${n1} + ${n2}`, a: secretKey });
    setEncryptedKey(Math.floor(Math.random() * 900) + 100);
    setIsGameActive(true);
    setDistance(0);
    setHackerPos(-20);
    setMessage("Жолдо хакерлер бар! Тез арада дешифрлөө ачкычын табыңыз!");
  };

  useEffect(() => {
    if (!isGameActive) return;

    const timer = setInterval(() => {
      setDistance(prev => {
        if (prev >= 90) {
          setIsGameActive(false);
          setMessage("КУТТУКТАЙБЫЗ! Маалымат серверге коопсуз жетти! 🎉");
          return 100;
        }
        return prev + 1;
      });

      setHackerPos(prev => prev + 1.5); 
    }, 100);

    return () => clearInterval(timer);
  }, [isGameActive]);

  useEffect(() => {
    if (isGameActive && hackerPos >= distance) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsGameActive(false);
      setMessage("DATA BREACH! Хакер маалыматты уурдап кетти! 🛑");
    }
  }, [hackerPos, distance, isGameActive]);

  const checkKey = () => {
    if (parseInt(answer) === mathQ.a) {
      setDistance(prev => Math.min(prev + 20, 100)); 
      setHackerPos(prev => prev - 15); 
      setAnswer("");
      setMessage("Ачкыч туура! Маалымат корголду.");
      
      const n1 = Math.floor(Math.random() * 20) + 10;
      const n2 = Math.floor(Math.random() * 20) + 10;
      setMathQ({ q: `${n1} + ${n2}`, a: n1 + n2 });
    } else {
      setAnswer("");
      setMessage("Ката ачкыч! Система бузулуу коркунучунда!");
    }
  };

  return (
    <div style={s.container}>
      <div style={s.header}>
        <button onClick={() => navigate('/')} style={s.backBtn}>← Артка</button>
        <h1 style={s.title}>КЫЗ КУУМАЙ: DATA ENCRYPTION 🔐</h1>
      </div>

      <div style={s.raceTrack}>
        {/* Финиш (Сервер) */}
        <div style={s.server}>
          <div style={s.icon}>☁️</div>
          <div style={s.label}>SERVER</div>
        </div>

        {/* Жигит (Data Packet) - Оңго каратылды */}
        <div style={{...s.rider, left: `${distance}%`, zIndex: 2, transform: 'scaleX(-1) translateX(50%)'}}>
          <div style={s.icon}>🏇</div>
          {/* Текст тескери болбошу үчүн кайра scaleX(-1) */}
          <div style={{...s.dataLabel, transform: 'scaleX(-1)'}}>
            DATA: {isGameActive ? `*${encryptedKey}*` : 'SECURE'}
        </div>
        </div>

        {/* Кыз (Destination) */}
        <div style={{...s.target, left: '95%'}}>
          <div style={s.icon}>💃</div>
        </div>

        {/* Хакер (Malware) - Оңго каратылды */}
        <div style={{...s.hacker, left: `${hackerPos}%`, opacity: hackerPos < 0 ? 0 : 1, transform: 'scaleX(-1)'}}>
          <div style={s.icon}>🏇</div> 
          <div style={{...s.hackerLabel, transform: 'scaleX(-1)'}}>HACKER</div>
        </div>

        <div style={s.ground} />
      </div>

      <div style={s.decryptionBox}>
        <h3 style={s.boxTitle}>DECRYPTION PANEL</h3>
        <p style={s.qText}>Ачкычты табыңыз (Private Key): <b>{mathQ.q}</b></p>
        
        <div style={s.inputRow}>
          <input
            type="number"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={!isGameActive}
            placeholder="Key..."
            style={s.input}
            onKeyPress={(e) => e.key === 'Enter' && checkKey()}
          />
          <button onClick={checkKey} style={s.decryptBtn}>DECRYPT</button>
        </div>

        <p style={s.statusMsg}>{message}</p>

        {!isGameActive && (
          <button onClick={generateLevel} style={s.startBtn}>
            {distance >= 100 ? "КАЙРА БАШТОО" : "СТАРТ: ПАКЕТТИ ЖӨНӨТҮҮ"}
          </button>
        )}
      </div>
    </div>
  );
};

const s: { [key: string]: React.CSSProperties } = {
  container: { height: '100vh', background: '#0a192f', color: '#64ffda', padding: '20px', fontFamily: '"Fira Code", monospace', overflowY: 'auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' },
  backBtn: { padding: '8px 15px', background: 'transparent', color: '#64ffda', border: '1px solid #64ffda', borderRadius: '4px', cursor: 'pointer' },
  title: { margin: 0, fontSize: '24px', textShadow: '0 0 10px #64ffda' },
  raceTrack: { height: '220px', background: '#112240', borderRadius: '10px', position: 'relative', overflow: 'hidden', marginBottom: '40px', borderBottom: '4px solid #233554' },
  ground: { position: 'absolute', bottom: '20px', left: 0, right: 0, height: '2px', background: '#233554' },
  rider: { position: 'absolute', bottom: '30px', transition: 'left 0.3s linear', textAlign: 'center' },
  icon: { fontSize: '45px' },
  dataLabel: { fontSize: '10px', background: '#64ffda', color: '#0a192f', padding: '2px 4px', borderRadius: '3px', marginTop: '5px', fontWeight: 'bold' },
  target: { position: 'absolute', bottom: '30px' },
  server: { position: 'absolute', right: '10px', top: '10px', textAlign: 'center', zIndex: 1 },
  label: { fontSize: '12px' },
  hacker: { position: 'absolute', bottom: '30px', transition: 'left 0.3s linear', filter: 'sepia(1) saturate(5) hue-rotate(-50deg)' },
  hackerLabel: { fontSize: '10px', background: '#f43f5e', color: '#fff', padding: '2px 4px', borderRadius: '3px', fontWeight: 'bold' },
  decryptionBox: { maxWidth: '500px', margin: '0 auto', background: '#112240', padding: '30px', borderRadius: '20px', textAlign: 'center', border: '1px solid #233554', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' },
  boxTitle: { color: '#8892b0', fontSize: '14px', marginBottom: '20px', letterSpacing: '2px' },
  qText: { fontSize: '22px', marginBottom: '20px', color: '#ccd6f6' },
  inputRow: { display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' },
  input: { padding: '12px', fontSize: '18px', width: '140px', background: '#0a192f', border: '1px solid #64ffda', color: '#64ffda', borderRadius: '5px', outline: 'none', textAlign: 'center' },
  decryptBtn: { padding: '10px 25px', background: '#64ffda', color: '#0a192f', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s' },
  statusMsg: { color: '#8892b0', minHeight: '24px', fontStyle: 'italic' },
  startBtn: { marginTop: '20px', padding: '12px 40px', background: 'transparent', color: '#64ffda', border: '2px solid #64ffda', borderRadius: '30px', cursor: 'pointer', fontWeight: 'bold', transition: '0.3s' }
};

export default KyzKuumaiEncryption;