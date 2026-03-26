import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Chuko {
  id: number;
  name: string;
  age: number;
  color: string;
  x: number;
  y: number;
  isOut: boolean;
}

const OrdoSQL: React.FC = () => {
  const navigate = useNavigate();
  const [chukos, setChukos] = useState<Chuko[]>([]);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("Тапшырма: Жашы 20дан чоң чүкөлөрдү өчүрүңүз (DELETE)");
  const [level, setLevel] = useState(1);

  // Оюн башталганда чүкөлөрдү чөйрөгө тизүү
  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    initOrdo();
  }, [level]);

  const initOrdo = () => {
    const names = ["Aibek", "Bektur", "Asel", "Damir", "Aiperi", "Murat"];
    const colors = ["#ef4444", "#3b82f6", "#fbbf24", "#10b981"];
    const newChukos: Chuko[] = [];

    for (let i = 0; i < 10; i++) {
      newChukos.push({
        id: i,
        name: names[Math.floor(Math.random() * names.length)],
        age: Math.floor(Math.random() * 30) + 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        x: Math.random() * 60 + 20, // 20% - 80% аралыгында
        y: Math.random() * 60 + 20,
        isOut: false
      });
    }
    setChukos(newChukos);
    setQuery("DELETE FROM chukos WHERE age > 20");
  };

  const executeQuery = () => {
    // SQL логикасын симуляциялоо
    // Жөнөкөй текшерүү: биздин мисалда 'age > 20' шартын карайбыз
    const updatedChukos = chukos.map(c => {
      if (query.includes("age > 20") && c.age > 20) {
        return { ...c, isOut: true };
      }
      if (query.includes("name = 'A'") && c.name.startsWith("A")) {
        return { ...c, isOut: true };
      }
      return c;
    });

    setChukos(updatedChukos);
    
    const countOut = updatedChukos.filter(c => c.isOut).length;
    if (countOut > 0) {
      setMessage(`Сонун! ${countOut} чүкө чөйрөдөн атылып чыкты!`);
      setTimeout(() => {
        if (level < 3) setLevel(l => l + 1);
      }, 2000);
    } else {
      setMessage("Ката! SQL шарты эч бир чүкөгө туура келген жок.");
    }
  };

  return (
    <div style={s.container}>
      <div style={s.header}>
        <button onClick={() => navigate('/')} style={s.backBtn}>← Меню</button>
        <h1 style={s.title}>ОРДО: SQL QUERY 🎯</h1>
      </div>

      <div style={s.gameSection}>
        {/* Ордо чөйрөсү */}
        <div style={s.ordoCircle}>
          <div style={s.centerPoint}>+</div>
          {chukos.map(c => (
            <div
              key={c.id}
              style={{
                ...s.chuko,
                left: `${c.x}%`,
                top: `${c.y}%`,
                background: c.color,
                transform: c.isOut ? 'scale(0) translate(200px, 200px)' : 'scale(1)',
                opacity: c.isOut ? 0 : 1,
              }}
            >
              <span style={s.chukoLabel}>{c.name[0]}{c.age}</span>
            </div>
          ))}
        </div>

        {/* SQL Терминалы */}
        <div style={s.terminal}>
          <div style={s.terminalHeader}>SQL Query Editor</div>
          <p style={s.taskText}>{message}</p>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={s.sqlInput}
            spellCheck={false}
          />
          <button onClick={executeQuery} style={s.runBtn}>EXECUTE QUERY (Атуу)</button>
        </div>
      </div>
      
      <div style={s.infoCard}>
        <strong>Маалымат базасы:</strong> 
        <div style={s.dbGrid}>
          {chukos.filter(c => !c.isOut).map(c => (
            <span key={c.id} style={s.dbItem}>[{c.name}, {c.age}]</span>
          ))}
        </div>
      </div>
    </div>
  );
};

const s: { [key: string]: React.CSSProperties } = {
  container: { minHeight: '100vh', background: '#121212', color: '#e0e0e0', padding: '20px', fontFamily: 'monospace' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  backBtn: { background: '#333', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' },
  title: { color: '#fbbf24', margin: 0 },
  gameSection: { display: 'flex', gap: '30px', flexWrap: 'wrap', justifyContent: 'center' },
  ordoCircle: { 
    width: '400px', height: '400px', border: '5px solid #555', borderRadius: '50%', 
    position: 'relative', background: '#1a1a1a', boxShadow: 'inset 0 0 50px #000' 
  },
  centerPoint: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#333', fontSize: '24px' },
  chuko: { 
    position: 'absolute', width: '35px', height: '35px', borderRadius: '8px', 
    display: 'flex', alignItems: 'center', justifyContent: 'center', 
    transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)', border: '2px solid rgba(255,255,255,0.2)' 
  },
  chukoLabel: { fontSize: '10px', fontWeight: 'bold', color: '#000' },
  terminal: { width: '400px', background: '#1e1e1e', padding: '20px', borderRadius: '10px', border: '1px solid #333' },
  terminalHeader: { color: '#fbbf24', marginBottom: '10px', borderBottom: '1px solid #333', paddingBottom: '5px' },
  taskText: { color: '#9cdcfe', fontSize: '14px', marginBottom: '15px' },
  sqlInput: { 
    width: '100%', height: '100px', background: '#000', color: '#4ec9b0', 
    border: '1px solid #444', borderRadius: '5px', padding: '10px', 
    fontSize: '16px', outline: 'none', resize: 'none' 
  },
  runBtn: { 
    width: '100%', marginTop: '15px', padding: '12px', background: '#fbbf24', 
    color: '#000', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' 
  },
  infoCard: { marginTop: '30px', background: '#1a1a1a', padding: '15px', borderRadius: '10px' },
  dbGrid: { display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' },
  dbItem: { background: '#333', padding: '3px 8px', borderRadius: '4px', fontSize: '12px' }
};

export default OrdoSQL;