import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { yurtaParts } from '../data/yurtaData'; 
import Босого from "../assets/Босого.png";
import Кереге from "../assets/Кереге.png";
import Түндүк from "../assets/Түндүк.png";
import Уук from "../assets/Уук.png";

const YurtaGame: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [assembledParts, setAssembledParts] = useState<string[]>([]);
  const [shake, setShake] = useState(false);

  const handlePartClick = (partId: string, step: number) => {
    if (step === currentStep) {
      setAssembledParts([...assembledParts, partId]);
      setCurrentStep(currentStep + 1);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const isFinished = assembledParts.length === yurtaParts.length;

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.topBar}>
          <button onClick={() => navigate('/')} style={styles.backBtn}>← Артка</button>
          <div style={styles.gameInfo}>Кадам: {assembledParts.length}/{yurtaParts.length}</div>
        </div>

        <div style={styles.header}>
          <h1 style={styles.title}>Боз үй куруу</h1>
          <p style={styles.subtitle}>Бөлүктөрдү ирети менен тандап, боз үйдү тигиңиз</p>
        </div>

        <div style={{
          ...styles.yurtaView,
          animation: shake ? 'shake 0.5s' : 'none'
        }}>
          <div style={styles.landscape}></div>
          
          <div style={styles.layersContainer}>
            {/* Сүрөттөрдү бири-бирине так келтирүү үчүн inset: 0 колдонулду.
              objectFit: 'contain' сүрөттөрдү контейнердин ичине пропорциясын бузбай борборлойт.
            */}
            
            {assembledParts.includes('kerege') && (
              <img src={Кереге} style={{ ...styles.layer, zIndex: 2 }} alt="кереге" />
            )}
            
            {assembledParts.includes('uuk') && (
              <img src={Уук} style={{ ...styles.layer, zIndex: 3 }} alt="уук" />
            )}

            {assembledParts.includes('tyndyk') && (
              <img src={Түндүк} style={{ ...styles.layer, zIndex: 4 }} alt="түндүк" />
            )}

            {assembledParts.includes('bosogo') && (
              <img src={Босого} style={{ ...styles.layer, zIndex: 5 }} alt="босого" />
            )}
            
            {assembledParts.length === 0 && (
              <div style={styles.placeholder}>Пайдубалын түптөөнү баштаңыз...</div>
            )}
          </div>
        </div>

        {isFinished ? (
          <div style={styles.resultCard}>
            <h2 style={{color: '#2D3748'}}>Керемет! 🎉</h2>
            <p>Сиз боз үйдү бардык эрежелерге ылайык тиктиңиз. Эми ичинде конок тоссо болот!</p>
            <button onClick={() => window.location.reload()} style={styles.retryBtn}>Кайра баштоо</button>
          </div>
        ) : (
          <div style={styles.panel}>
            <h3 style={styles.panelTitle}>Кийинки бөлүктү тандаңыз:</h3>
            <div style={styles.grid}>
              {yurtaParts.map((part) => {
                const isAssembled = assembledParts.includes(part.id);
                const isNext = part.step === currentStep;
                
                return (
                  <button 
                    key={part.id} 
                    disabled={isAssembled}
                    onClick={() => handlePartClick(part.id, part.step)}
                    style={{
                      ...styles.partCard,
                      opacity: isAssembled ? 0.5 : 1,
                      borderColor: isNext ? '#3182CE' : '#E2E8F0',
                      boxShadow: isNext ? '0 0 10px rgba(49, 130, 206, 0.3)' : 'none'
                    }}
                  >
                    <img src={part.image} style={styles.partImg} alt={part.name} />
                    <span style={styles.partName}>{part.name}</span>
                    {isAssembled && <span style={styles.checkBadge}>✓</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-5px); }
          40%, 80% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: { minHeight: '100vh', background: '#F1F5F9', padding: '15px', display: 'flex', justifyContent: 'center', fontFamily: '"Segoe UI", Roboto, sans-serif' },
  content: { width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  topBar: { width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
  backBtn: { padding: '8px 16px', background: '#fff', border: '1px solid #CBD5E1', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', color: '#475569' },
  gameInfo: { background: '#DBEAFE', padding: '8px 14px', borderRadius: '12px', fontWeight: 'bold', color: '#1E40AF', fontSize: '14px' },
  header: { textAlign: 'center', marginBottom: '20px' },
  title: { fontSize: '26px', fontWeight: '800', color: '#1E293B', marginBottom: '5px' },
  subtitle: { fontSize: '14px', color: '#64748B', margin: 0 },
  
  yurtaView: { 
    width: '100%', height: '350px', background: '#fff', borderRadius: '24px', 
    position: 'relative', overflow: 'hidden', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
    marginBottom: '20px', border: '4px solid #fff'
  },
  landscape: {
    position: 'absolute', bottom: 0, width: '100%', height: '30%', background: '#DEF7EC', zIndex: 0
  },
  layersContainer: {
    position: 'absolute', 
    inset: 0, // Контейнердин бардык тарабын бирдей ээлейт (top:0, left:0, right:0, bottom:0)
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  layer: {
    position: 'absolute', 
    width: '100%', 
    height: '100%', 
    objectFit: 'contain', // Сүрөттүн формасын бузбай, борборго так жайгаштырат
    padding: '40px', // Сүрөттөр чекесине тийбеши үчүн
    transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
  },
  placeholder: { color: '#94A3B8', fontSize: '14px', fontStyle: 'italic', zIndex: 1 },

  panel: { width: '100%', background: '#fff', padding: '20px', borderRadius: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' },
  panelTitle: { fontSize: '16px', fontWeight: '700', color: '#334155', marginBottom: '15px', textAlign: 'center' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  partCard: {
    position: 'relative', padding: '12px', background: '#F8FAFC', border: '2px solid #E2E8F0', 
    borderRadius: '16px', cursor: 'pointer', display: 'flex', flexDirection: 'column', 
    alignItems: 'center', gap: '8px', transition: 'all 0.2s'
  },
  partImg: { width: '50px', height: '50px', objectFit: 'contain' },
  partName: { fontSize: '13px', fontWeight: '600', color: '#475569' },
  checkBadge: { position: 'absolute', top: '5px', right: '5px', background: '#10B981', color: '#fff', borderRadius: '50%', width: '20px', height: '20px', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' },

  resultCard: { padding: '30px', background: '#fff', borderRadius: '24px', textAlign: 'center', width: '100%', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' },
  retryBtn: { marginTop: '15px', width: '100%', padding: '12px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', fontSize: '16px' }
};

export default YurtaGame;