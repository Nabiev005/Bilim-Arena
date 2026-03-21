import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AlgorithmicPath: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // Кайсы этапта экени
  const [charPos, setCharPos] = useState({ x: 10, y: 50 }); // Каармандын орду
  const [question, setQuestion] = useState({ q: "25 + 30", a: 55, condition: "Жооп > 50 болсо ОҢГО, болбосо СОЛГО" });
  const [message, setMessage] = useState("Алгоритмди баштаңыз!");
  const [isMoving, setIsMoving] = useState(false);

  // Жаңы суроо жаратуу
  const nextLevel = () => {
    const n1 = Math.floor(Math.random() * 40);
    const n2 = Math.floor(Math.random() * 40);
    const sum = n1 + n2;
    const threshold = 40;
    
    setQuestion({
      q: `${n1} + ${n2}`,
      a: sum,
      condition: `Эгер жооп > ${threshold} болсо ОҢГО (Right), болбосо СОЛГО (Left)`
    });
    setIsMoving(false);
  };

  const handleMove = (direction: 'LEFT' | 'RIGHT') => {
    if (isMoving) return;
    
    const isCorrectRight = direction === 'RIGHT' && question.a > 40;
    const isCorrectLeft = direction === 'LEFT' && question.a <= 40;

    if (isCorrectRight || isCorrectLeft) {
      setIsMoving(true);
      setMessage("ТУУРА! Алгоритм иштеп жатат...");
      
      // Каарманды жылдыруу анимациясы
      setTimeout(() => {
        setCharPos(prev => ({ ...prev, x: prev.x + 20 }));
        setStep(s => s + 1);
        nextLevel();
        if (step >= 4) setMessage("КУТТУКТАЙБЫЗ! Сиз көздөгөн чекитке жеттиңиз! 🎉");
      }, 1000);
    } else {
      setMessage("КАТА! Шартты кайрадан текшериңиз (Syntax Error)");
      setCharPos({ x: 10, y: 50 }); // Башына кайтаруу
      setStep(0);
    }
  };

  return (
    <div style={s.container}>
      <div style={s.header}>
        <button onClick={() => navigate('/')} style={s.backBtn}>← Артка</button>
        <h1 style={s.title}>КОД КӨЧҮ: IF/ELSE ЛОГИКАСЫ</h1>
      </div>

      <div style={s.gameBoard}>
        {/* Жолдун сызыгы */}
        <div style={s.pathLine} />
        
        {/* Максат (Finish) */}
        <div style={s.finishFlag}>🏁 SERVER</div>

        {/* Каарман (Программист бала) */}
        <div style={{...s.character, left: `${charPos.x}%`, top: `${charPos.y}%`}}>
          👨‍💻
          <div style={s.charLabel}>Dev</div>
        </div>

        {/* Дарбаза (If/Else Gate) */}
        <div style={{...s.gate, left: `${charPos.x + 15}%`}}>
          <div style={s.gateText}>if (answer &gt; 40)</div>
        </div>
      </div>

      <div style={s.controlPanel}>
        <div style={s.questionBox}>
          <div style={s.conditionText}>{question.condition}</div>
          <div style={s.mathQ}>{question.q} = ?</div>
        </div>

        <div style={s.btnGroup}>
          <button onClick={() => handleMove('LEFT')} style={{...s.actionBtn, background: '#ef4444'}}>
            LEFT (else)
          </button>
          <button onClick={() => handleMove('RIGHT')} style={{...s.actionBtn, background: '#3b82f6'}}>
            RIGHT (if)
          </button>
        </div>
        <p style={s.statusMsg}>{message}</p>
      </div>
    </div>
  );
};

const s: { [key: string]: React.CSSProperties } = {
  container: { height: '100vh', background: '#1e1e1e', color: '#fff', padding: '20px', fontFamily: 'monospace' },
  header: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' },
  backBtn: { padding: '8px 15px', background: '#333', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  title: { color: '#4ec9b0', margin: 0 },
  gameBoard: { height: '300px', background: '#252526', borderRadius: '15px', position: 'relative', border: '2px solid #333', overflow: 'hidden', marginBottom: '30px' },
  pathLine: { position: 'absolute', top: '55%', left: 0, right: 0, height: '4px', background: '#333' },
  character: { position: 'absolute', fontSize: '40px', transition: 'all 0.8s ease', textAlign: 'center' },
  charLabel: { fontSize: '12px', background: '#4ec9b0', color: '#000', padding: '1px 4px', borderRadius: '3px' },
  finishFlag: { position: 'absolute', right: '20px', top: '45%', fontSize: '24px', color: '#fbbf24' },
  gate: { position: 'absolute', top: '30%', width: '2px', height: '150px', background: '#4ec9b0', boxShadow: '0 0 10px #4ec9b0' },
  gateText: { position: 'absolute', top: '-30px', left: '-50px', width: '100px', textAlign: 'center', color: '#4ec9b0', fontSize: '14px' },
  controlPanel: { textAlign: 'center', maxWidth: '500px', margin: '0 auto', background: '#2d2d2d', padding: '20px', borderRadius: '20px', border: '1px solid #444' },
  questionBox: { marginBottom: '20px' },
  conditionText: { color: '#ce9178', fontSize: '16px', marginBottom: '10px' },
  mathQ: { fontSize: '40px', fontWeight: 'bold', color: '#dcdcdc' },
  btnGroup: { display: 'flex', gap: '15px', justifyContent: 'center' },
  actionBtn: { padding: '15px 30px', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' },
  statusMsg: { marginTop: '20px', color: '#9cdcfe' }
};

export default AlgorithmicPath;