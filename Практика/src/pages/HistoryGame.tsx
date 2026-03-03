import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

interface HistoryEvent {
  id: number;
  year: string;
  event: string;
  description: string;
  correct_order: number;
}

const HistoryGame: React.FC = () => {
  const navigate = useNavigate();
  const [shuffledEvents, setShuffledEvents] = useState<HistoryEvent[]>([]);
  const [correctIds, setCorrectIds] = useState<number[]>([]);
  const [isWon, setIsWon] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Маалыматты жүктөө
  const loadGame = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/history`);
      if (!response.ok) throw new Error('Network error');
      const data: HistoryEvent[] = await response.json();

      const sortedIds = [...data].sort((a, b) => a.correct_order - b.correct_order).map(e => e.id);
      setCorrectIds(sortedIds);
      setShuffledEvents([...data].sort(() => Math.random() - 0.5));
    } catch (error) {
      console.error("Ката кетти:", error);
      // Камдык маалыматтар (Fallback data)
      const fallbackData: HistoryEvent[] = [
        { id: 1, year: "1200", event: "Улуу Кыргыз Дөөлөтү", description: "Кыргыздардын гүлдөгөн доору", correct_order: 1 },
        { id: 2, year: "1924", event: "Кара-Кыргыз автономиялуу облусу", description: "Заманбап мамлекеттүүлүктүн башаты", correct_order: 2 },
        { id: 3, year: "1991", event: "Эгемендүүлүк күнү", description: "Кыргызстан өз алдынча мамлекет болду", correct_order: 3 },
        { id: 4, year: "2010", event: "Элдик революция", description: "Демократиялык өзгөрүүлөр", correct_order: 4 },
      ];
      setCorrectIds(fallbackData.map(e => e.id));
      setShuffledEvents([...fallbackData].sort(() => Math.random() - 0.5));
    } finally {
      setShowFeedback(false);
      setIsWon(false);
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    loadGame();
  }, [loadGame]);

  const moveEvent = (index: number, direction: 'up' | 'down') => {
    if (isWon) return;
    const newEvents = [...shuffledEvents];
    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (nextIndex < 0 || nextIndex >= newEvents.length) return;
    
    // Элементтердин ордун алмаштыруу
    [newEvents[index], newEvents[nextIndex]] = [newEvents[nextIndex], newEvents[index]];
    setShuffledEvents(newEvents);
    setShowFeedback(false); // Ордун алмаштырганда эскертүүнү өчүрүү
  };

  const checkResult = () => {
    const currentOrderIds = shuffledEvents.map(e => e.id);
    const win = JSON.stringify(correctIds) === JSON.stringify(currentOrderIds);
    setIsWon(win);
    setShowFeedback(true);
  };

  if (loading) return <div style={styles.loading}>Жүктөлүүдө...</div>;

  return (
    <div style={styles.container}>
      <Sidebar />
      <main style={styles.content}>
        <div style={styles.topActions}>
          <button onClick={() => navigate(-1)} style={styles.backBtn}>← Артка</button>
          <button onClick={loadGame} style={styles.resetBtn}>🔄 Жаңылоо</button>
        </div>

        <div style={styles.gameHeader}>
          <div style={styles.badge}>Тарыхый хронология</div>
          <h1 style={styles.title}>Тарых барактары 🏛️</h1>
          <p style={styles.subtitle}>Окуяларды эң эскисинен баштап ирети менен тизиңиз</p>
        </div>

        <div style={styles.gameBoard}>
          {shuffledEvents.map((item, index) => (
            <div 
              key={item.id} 
              style={{
                ...styles.eventCard,
                borderColor: showFeedback ? (isWon ? '#48BB78' : '#F56565') : '#E2E8F0',
                transform: showFeedback && !isWon ? 'translateX(0)' : 'none'
              }}
            >
              <div style={styles.controls}>
                <button 
                  onClick={() => moveEvent(index, 'up')} 
                  style={{...styles.moveBtn, opacity: index === 0 ? 0.3 : 1}}
                  disabled={index === 0 || isWon}
                >▲</button>
                <button 
                  onClick={() => moveEvent(index, 'down')} 
                  style={{...styles.moveBtn, opacity: index === shuffledEvents.length - 1 ? 0.3 : 1}}
                  disabled={index === shuffledEvents.length - 1 || isWon}
                >▼</button>
              </div>
              <div style={styles.eventInfo}>
                <h4 style={styles.eventTitle}>{item.event}</h4>
                <p style={styles.eventDesc}>{item.description}</p>
              </div>
              <div style={{
                ...styles.yearBadge,
                background: isWon ? '#F0FFF4' : '#F8FAFC',
                color: isWon ? '#48BB78' : '#94A3B8'
              }}>
                {isWon ? item.year : "????"}
              </div>
            </div>
          ))}
        </div>

        <div style={styles.footer}>
          {!isWon ? (
            <button onClick={checkResult} style={styles.checkBtn}>Текшерүү</button>
          ) : (
            <button onClick={() => window.location.reload()} style={{...styles.checkBtn, background: '#48BB78'}}>
              Кийинки деңгээл →
            </button>
          )}
          
          {showFeedback && (
            <div style={{
              ...styles.feedback, 
              background: isWon ? '#F0FFF4' : '#FFF5F5',
              color: isWon ? '#2F855A' : '#C53030',
              border: `1px solid ${isWon ? '#C6F6D5' : '#FED7D7'}`
            }}>
              {isWon ? "🎉 Азаматсыз! Тарыхты мыкты билет экенсиз!" : "❌ Катарда ката бар. Окуялардын убактысын кайра эстеп көрүңүз."}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: { display: 'flex', background: '#F8FAFC', minHeight: '100vh', fontFamily: "'Inter', sans-serif" },
  content: { flex: 1, padding: '40px 20px', maxWidth: '850px', margin: '0 auto' },
  loading: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '18px', color: '#64748B' },
  topActions: { display: 'flex', justifyContent: 'space-between', marginBottom: '30px' },
  backBtn: { background: '#FFF', border: '1px solid #E2E8F0', padding: '10px 20px', borderRadius: '12px', color: '#64748B', cursor: 'pointer', fontWeight: '600', transition: '0.2s' },
  resetBtn: { background: '#FFF', border: '1px solid #E2E8F0', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', fontWeight: '600' },
  gameHeader: { textAlign: 'center', marginBottom: '40px' },
  badge: { background: '#EBF4FF', color: '#3182CE', display: 'inline-block', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', marginBottom: '12px' },
  title: { fontSize: '32px', fontWeight: '800', color: '#1A202C', margin: 0 },
  subtitle: { color: '#718096', marginTop: '8px', fontSize: '16px' },
  gameBoard: { display: 'flex', flexDirection: 'column', gap: '12px' },
  eventCard: { background: '#FFF', padding: '20px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '20px', border: '2px solid #E2E8F0', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' },
  controls: { display: 'flex', flexDirection: 'column', gap: '8px' },
  moveBtn: { border: 'none', background: '#F7FAFC', borderRadius: '8px', cursor: 'pointer', padding: '8px 12px', fontSize: '14px', transition: '0.2s', color: '#4A5568' },
  eventInfo: { flex: 1 },
  eventTitle: { margin: '0 0 6px 0', fontSize: '18px', fontWeight: '700', color: '#2D3748' },
  eventDesc: { margin: 0, fontSize: '14px', color: '#718096', lineHeight: '1.5' },
  yearBadge: { padding: '8px 15px', borderRadius: '12px', fontWeight: '800', fontSize: '15px', minWidth: '70px', textAlign: 'center', border: '1px solid #EDF2F7' },
  footer: { marginTop: '40px', textAlign: 'center', paddingBottom: '40px' },
  checkBtn: { background: '#2D3748', color: '#FFF', padding: '16px 50px', borderRadius: '16px', border: 'none', cursor: 'pointer', fontSize: '18px', fontWeight: '700', transition: '0.3s', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' },
  feedback: { marginTop: '25px', padding: '20px', borderRadius: '16px', fontWeight: '600', fontSize: '15px', transition: '0.3s' }
};

export default HistoryGame;