import React, { useState,} from 'react';
import { useNavigate } from 'react-router-dom';

const BeshTash: React.FC = () => {
  const navigate = useNavigate();
  const [mainStoneY, setMainStoneY] = useState(0); // Ыргытылган таштын бийиктиги
  const [isJumping, setIsJumping] = useState(false);
  const [tasks, setTasks] = useState<{ id: number, q: string, a: number }[]>([]);
  const [score, setScore] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [message, setMessage] = useState("Баштоо үчүн 'Ыргыт' баскычын басыңыз!");

  // Жаңы тапшырмаларды (мисалдарды) жаратуу
  const generateTasks = () => {
    const newTasks = [];
    for (let i = 0; i < 3; i++) {
      const n1 = Math.floor(Math.random() * 10) + 1;
      const n2 = Math.floor(Math.random() * 10) + 1;
      newTasks.push({ id: i, q: `${n1} + ${n2}`, a: n1 + n2 });
    }
    setTasks(newTasks);
  };

  // Ташты ыргытуу (Main Thread Process)
  const throwStone = () => {
    if (isJumping) return;
    setIsJumping(true);
    setMainStoneY(0);
    setInputValue("");
    generateTasks();
    setMessage("Процесс иштеп жатат! Мисалдарды тезирээк чечиңиз!");

    // Таштын өйдө-төмөн анимациясы (3 секунд)
    let startTime: number | null = null;
    const duration = 3000;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const t = progress / duration;

      // Парабола траекториясы: h = -4 * t * (t - 1)
      const height = -4 * t * (t - 1) * 200; 
      setMainStoneY(height);

      if (progress < duration) {
        requestAnimationFrame(animate);
      } else {
        setIsJumping(false);
        setMainStoneY(0);
        checkFinalStatus();
      }
    };
    requestAnimationFrame(animate);
  };

  const checkFinalStatus = () => {
    setTasks(prev => {
      if (prev.length > 0) {
        setMessage("Кечигип калдыңыз! Таш жерге түшүп кетти (Timeout Error)");
        setScore(s => Math.max(0, s - 5));
      } else {
        setMessage("Сонун! Бардык процесстерди ийгиликтүү бүтүрдүңүз!");
        setScore(s => s + 10);
      }
      return [];
    });
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setInputValue(e.target.value);

    const correctTask = tasks.find(t => t.a === val);
    if (correctTask) {
      setTasks(prev => prev.filter(t => t.id !== correctTask.id));
      setInputValue("");
    }
  };

  return (
    <div style={s.container}>
      <div style={s.header}>
        <button onClick={() => navigate('/')} style={s.backBtn}>← Артка</button>
        <h1 style={s.title}>БЕШ ТАШ: MULTITHREADING 🧵</h1>
      </div>

      <div style={s.arena}>
        {/* Негизги процесс (Ыргытылган таш) */}
        <div style={{...s.mainStone, bottom: `${50 + mainStoneY}px`}}>
          💎
          <div style={s.threadLabel}>Main Thread</div>
        </div>

        {/* Жердеги таштар (Фондук тапшырмалар) */}
        <div style={s.ground}>
          {tasks.map(t => (
            <div key={t.id} style={s.subTask}>
              <div style={s.taskIcon}>📦</div>
              <div style={s.taskText}>{t.q}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={s.controls}>
        <div style={s.stats}>Упай: {score}</div>
        <p style={{color: isJumping ? '#4ec9b0' : '#ef4444'}}>{message}</p>
        
        <input
          type="number"
          value={inputValue}
          onChange={handleInput}
          disabled={!isJumping}
          placeholder={isJumping ? "Жоопту жаз..." : "Алгач ыргытыңыз"}
          style={s.input}
          autoFocus
        />

        <button 
          onClick={throwStone} 
          disabled={isJumping} 
          style={{...s.throwBtn, opacity: isJumping ? 0.5 : 1}}
        >
          ТАШТЫ ЫРГЫТУУ (START PROCESS)
        </button>
      </div>

      <div style={s.footer}>
        <p>💡 <b>Логика:</b> Негизги таш (Main Thread) абада турганда, 
        төмөнкү тапшырмаларды (Async Tasks) бүтүрүп жетишиңиз керек.</p>
      </div>
    </div>
  );
};

const s: { [key: string]: React.CSSProperties } = {
  container: { height: '100vh', background: '#0f172a', color: '#fff', padding: '20px', fontFamily: 'monospace', display: 'flex', flexDirection: 'column' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  backBtn: { padding: '8px 15px', background: '#1e293b', color: '#fff', border: '1px solid #334155', borderRadius: '5px', cursor: 'pointer' },
  title: { color: '#38bdf8', fontSize: '24px' },
  arena: { flex: 1, position: 'relative', margin: '40px 0', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px dashed #334155' },
  mainStone: { position: 'absolute', left: '50%', transform: 'translateX(-50%)', fontSize: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  threadLabel: { fontSize: '12px', background: '#38bdf8', color: '#000', padding: '2px 6px', borderRadius: '4px', marginTop: '5px' },
  ground: { position: 'absolute', bottom: '20px', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '20px' },
  subTask: { textAlign: 'center', background: '#1e293b', padding: '10px', borderRadius: '10px', border: '1px solid #38bdf8' },
  taskIcon: { fontSize: '24px' },
  taskText: { fontSize: '18px', fontWeight: 'bold', marginTop: '5px' },
  controls: { textAlign: 'center', padding: '20px', background: '#1e293b', borderRadius: '20px' },
  stats: { fontSize: '20px', marginBottom: '10px', color: '#fbbf24' },
  input: { padding: '12px', fontSize: '18px', borderRadius: '8px', border: 'none', width: '200px', textAlign: 'center', marginBottom: '15px', outline: 'none' },
  throwBtn: { display: 'block', margin: '0 auto', padding: '15px 30px', background: '#38bdf8', color: '#000', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' },
  footer: { marginTop: '20px', fontSize: '14px', color: '#94a3b8', textAlign: 'center' }
};

export default BeshTash;