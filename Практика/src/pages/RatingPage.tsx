import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from '../components/Sidebar';

interface LeaderboardEntry {
  id: number;
  name: string;
  score: number;
  level: string;
}

const RatingPage: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const staticBackup: LeaderboardEntry[] = [
    { id: 1, name: "Айбек Набиев", score: 1250, level: "Тулпар" },
    { id: 2, name: "Мээрим Осмонова", score: 1100, level: "Аргымак" },
    { id: 3, name: "Бакыт Нуров", score: 950, level: "Көчмөн" },
    { id: 4, name: "Айсулуу Таштанбекова", score: 820, level: "Көчмөн" },
    { id: 5, name: "Эркин Кадыров", score: 700, level: "Жорго" },
    { id: 6, name: "Нуриза Алмазова", score: 650, level: "Жорго" },
  ];

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/global-leaderboard');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setLeaderboard(data.length > 0 ? data : staticBackup);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setLeaderboard(staticBackup);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Издөө логикасы
  const filteredLeaderboard = useMemo(() => {
    return leaderboard
      .filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => b.score - a.score);
  }, [leaderboard, searchTerm]);

  const getLevelBadge = (level: string) => {
    switch(level) {
      case 'Тулпар': return { bg: '#E6FFFA', color: '#047481', border: '#B2F5EA', icon: '🐎' };
      case 'Аргымак': return { bg: '#EBF8FF', color: '#2B6CB0', border: '#BEE3F8', icon: '🏇' };
      case 'Жорго': return { bg: '#FFF5F5', color: '#C53030', border: '#FED7D7', icon: '👞' };
      default: return { bg: '#F7FAFC', color: '#4A5568', border: '#E2E8F0', icon: '🏕️' };
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <Sidebar />

      <main style={styles.mainContent}>
        <div style={styles.container}>
          
          {/* 1. Header & Stats */}
          <header style={styles.header}>
            <div style={styles.titleGroup}>
              <h1 style={styles.title}>Лидерлер тактасы</h1>
              <p style={styles.subtitle}>Платформанын эң мыкты билимдүүлөрү</p>
            </div>
            <div style={styles.searchBox}>
              <input 
                type="text" 
                placeholder="Издөө..." 
                style={styles.searchInput}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </header>

          {loading ? (
            <div style={styles.loader}>Маалымат жүктөлүүдө...</div>
          ) : (
            <>
              {/* 2. Podium (Top 3) - Издөө жок учурда гана көрсөтүлөт */}
              {searchTerm === '' && filteredLeaderboard.length >= 3 && (
                <div style={styles.podiumContainer}>
                  {[1, 0, 2].map((idx) => {
                    const user = filteredLeaderboard[idx];
                    return (
                      <div key={user.id} style={{
                        ...styles.podiumCard,
                        height: idx === 0 ? '220px' : '180px',
                        order: idx === 1 ? 1 : idx === 0 ? 2 : 3
                      }}>
                        <div style={styles.podiumRank}>{idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}</div>
                        <div style={styles.podiumAvatar}>{user.name[0]}</div>
                        <div style={styles.podiumName}>{user.name}</div>
                        <div style={styles.podiumScore}>{user.score} упай</div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* 3. Таблица */}
              <div style={styles.tableCard}>
                <div style={styles.scrollContainer}>
                  {filteredLeaderboard.length > 0 ? (
                    <table style={styles.table}>
                      <thead>
                        <tr style={styles.theadRow}>
                          <th style={styles.th}>Орун</th>
                          <th style={styles.th}>Колдонуучу</th>
                          <th style={styles.th}>Деңгээл</th>
                          <th style={{...styles.th, textAlign: 'right'}}>Упай</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredLeaderboard.map((user, index) => {
                          const badge = getLevelBadge(user.level);
                          return (
                            <tr key={user.id} style={styles.tr} className="table-row">
                              <td style={styles.td}>
                                <div style={{
                                  ...styles.rankCircle,
                                  background: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : '#F1F5F9',
                                  color: index < 3 ? '#fff' : '#64748B',
                                }}>
                                  {index + 1}
                                </div>
                              </td>
                              <td style={styles.td}>
                                <div style={styles.userWrapper}>
                                  <div style={styles.avatar}>{user.name[0]}</div>
                                  <span style={styles.userName}>{user.name}</span>
                                </div>
                              </td>
                              <td style={styles.td}>
                                <span style={{
                                  ...styles.badge,
                                  backgroundColor: badge.bg,
                                  color: badge.color,
                                  border: `1px solid ${badge.border}`
                                }}>
                                  <span style={{marginRight: '5px'}}>{badge.icon}</span>
                                  {user.level}
                                </span>
                              </td>
                              <td style={{...styles.td, textAlign: 'right'}}>
                                <span style={styles.scoreText}>{user.score.toLocaleString()}</span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  ) : (
                    <div style={styles.noResults}>Колдонуучу табылган жок 🔍</div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* CSS Анимациялар */}
      <style>{`
        .table-row { transition: 0.3s; }
        .table-row:hover { background-color: #F8FAFC; transform: scale(1.005); }
      `}</style>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  // ... (Сиздин мурунку стилдериңиз сакталды)
  pageWrapper: { display: 'flex', minHeight: '100vh', background: '#F8FAFC', width: '100%' },
  mainContent: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 24px', overflowY: 'auto' },
  container: { width: '100%', maxWidth: '1000px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' },
  titleGroup: { textAlign: 'left' },
  title: { fontSize: '32px', fontWeight: '850', color: '#1E293B', margin: 0 },
  subtitle: { color: '#64748B', fontSize: '16px', marginTop: '6px' },
  
  // Жаңы стилдер
  searchBox: { position: 'relative' },
  searchInput: { padding: '12px 20px', borderRadius: '12px', border: '1px solid #E2E8F0', width: '250px', outline: 'none', fontSize: '14px' },
  
  podiumContainer: { display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '20px', marginBottom: '40px', padding: '20px' },
  podiumCard: { 
    background: '#fff', width: '200px', borderRadius: '24px', display: 'flex', 
    flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', border: '1px solid #E2E8F0'
  },
  podiumRank: { fontSize: '40px', marginBottom: '10px' },
  podiumName: { fontWeight: '700', color: '#1E293B', textAlign: 'center' },
  podiumScore: { color: '#2563EB', fontWeight: '800', marginTop: '5px' },
  podiumAvatar: { width: '50px', height: '50px', background: '#F1F5F9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px', fontSize: '20px', fontWeight: 'bold' },

  tableCard: { background: '#fff', borderRadius: '24px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  theadRow: { background: '#F8FAFC' },
  th: { padding: '20px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' },
  tr: { borderBottom: '1px solid #F1F5F9' },
  td: { padding: '16px 20px' },
  rankCircle: { width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' },
  userWrapper: { display: 'flex', alignItems: 'center', gap: '12px' },
  avatar: { width: '36px', height: '36px', background: '#EDF2F7', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' },
  userName: { fontWeight: '600', color: '#1E293B' },
  badge: { padding: '6px 14px', borderRadius: '100px', fontSize: '11px', fontWeight: '700' },
  scoreText: { fontWeight: '800', color: '#2563EB', fontSize: '17px' },
  noResults: { padding: '40px', textAlign: 'center', color: '#94A3B8', fontWeight: '600' },
  loader: { padding: '100px', textAlign: 'center', color: '#94A3B8' }
};

export default RatingPage;