import React, { useEffect, useState, useMemo } from 'react';
import { FaArrowLeft, FaTrophy, FaMedal, FaUserCircle, FaSpinner, FaFilter, FaUsers, FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

interface ScoreEntry {
  id: number;
  username: string;
  subject: string;
  score: number;
  total: number;
  created_at: string;
}

const Leaderboard: React.FC = () => {
  const navigate = useNavigate();
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Баары');

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/ort/leaderboard');
      const data = await response.json();
      if (data.success) {
        // Упайларды жогорудан төмөн карай сорттоо
        const sortedData = data.data.sort((a: ScoreEntry, b: ScoreEntry) => b.score - a.score);
        setScores(sortedData);
      }
    } catch (error) {
      console.error("Маалымат алууда ката кетти:", error);
    } finally {
      setLoading(false);
    }
  };

  // Чыпкаланган маалыматтар
  const filteredScores = useMemo(() => {
    return filter === 'Баары' 
      ? scores 
      : scores.filter(s => s.subject === filter);
  }, [scores, filter]);

  return (
    <div style={styles.container}>
      <button onClick={() => navigate('/ort-prep')} style={styles.backBtn}>
        <FaArrowLeft /> ЖРТ Менюсуна кайтуу
      </button>

      {/* Жогорку Статистика Панели */}
      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <FaUsers color="#3B82F6" size={24} />
          <div>
            <div style={styles.statLabel}>Катышуучулар</div>
            <div style={styles.statValue}>{filteredScores.length}</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <FaStar color="#F59E0B" size={24} />
          <div>
            <div style={styles.statLabel}>Эң жогорку упай</div>
            <div style={styles.statValue}>{filteredScores[0]?.score || 0}</div>
          </div>
        </div>
      </div>

      <div style={styles.header}>
        <div style={styles.titleGroup}>
          <FaTrophy size={40} color="#F59E0B" />
          <h1 style={styles.title}>Рейтинг тактасы</h1>
        </div>
        
        <div style={styles.filterBox}>
          <FaFilter color="#64748B" />
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            style={styles.select}
          >
            <option value="Баары">Бардык предметтер</option>
            <option value="Математика">Математика</option>
            <option value="Аналогиялар">Аналогиялар</option>
            <option value="Кыргыз тили">Кыргыз тили</option>
            <option value="Текстти түшүнүү">Текстти түшүнүү</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div style={styles.loaderBox}>
          <FaSpinner className="spinner" size={40} color="#3B82F6" />
          <p style={{marginTop: '15px', fontWeight: '600', color: '#64748B'}}>Жүктөлүүдө...</p>
        </div>
      ) : (
        <div style={styles.tableCard}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thr}>
                <th style={styles.th}>Орун</th>
                <th style={styles.th}>Колдонуучу</th>
                <th style={styles.th}>Предмет</th>
                <th style={styles.th}>Упай</th>
                <th style={styles.th}>Дата</th>
              </tr>
            </thead>
            <tbody>
              {filteredScores.length > 0 ? (
                filteredScores.map((entry, index) => (
                  <tr key={entry.id} style={{
                    ...styles.tr,
                    background: index === 0 ? '#FFFBEB' : index === 1 ? '#F8FAFC' : index === 2 ? '#FFF7ED' : '#fff'
                  }}>
                    <td style={styles.td}>
                      {index === 0 && <FaMedal color="#FFD700" size={22} title="1-орун" />}
                      {index === 1 && <FaMedal color="#C0C0C0" size={22} title="2-орун" />}
                      {index === 2 && <FaMedal color="#CD7F32" size={22} title="3-орун" />}
                      {index > 2 && <span style={styles.rankNum}>{index + 1}</span>}
                    </td>
                    <td style={styles.td}>
                      <div style={styles.userCell}>
                        <FaUserCircle color={index < 3 ? '#94A3B8' : '#CBD5E1'} size={28} />
                        <span style={styles.username}>{entry.username}</span>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <span style={{...styles.subjectBadge, background: getSubjectColor(entry.subject)}}>
                        {entry.subject}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.scoreText}>{entry.score}</span>
                      <span style={styles.totalText}> / {entry.total}</span>
                    </td>
                    <td style={styles.td}>
                      {new Date(entry.created_at).toLocaleDateString('ky-KG')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={styles.noData}>Азырынча маалымат жок</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const getSubjectColor = (subject: string) => {
  switch (subject) {
    case 'Математика': return '#10B981';
    case 'Аналогиялар': return '#F59E0B';
    case 'Кыргыз тили': return '#3B82F6';
    case 'Текстти түшүнүү': return '#EF4444';
    default: return '#64748B';
  }
};

const styles: { [key: string]: React.CSSProperties } = {
  container: { padding: '30px 20px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif' },
  backBtn: { display: 'flex', alignItems: 'center', gap: '10px', border: 'none', background: 'none', cursor: 'pointer', color: '#64748B', fontWeight: '700', marginBottom: '20px' },
  statsRow: { display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' },
  statCard: { flex: 1, minWidth: '200px', background: '#fff', padding: '20px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: '15px', border: '1px solid #F1F5F9' },
  statLabel: { fontSize: '14px', color: '#64748B', fontWeight: '600' },
  statValue: { fontSize: '24px', fontWeight: '900', color: '#1E293B' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' },
  titleGroup: { display: 'flex', alignItems: 'center', gap: '15px' },
  title: { fontSize: '28px', fontWeight: '900', color: '#1E293B', margin: 0 },
  filterBox: { display: 'flex', alignItems: 'center', gap: '10px', background: '#fff', padding: '10px 18px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' },
  select: { border: 'none', outline: 'none', fontSize: '14px', fontWeight: '700', color: '#1E293B', cursor: 'pointer', background: 'transparent' },
  tableCard: { background: '#fff', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 15px 35px rgba(0,0,0,0.05)', border: '1px solid #F1F5F9' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  thr: { background: '#F8FAFC', borderBottom: '2px solid #F1F5F9' },
  th: { padding: '18px 20px', fontSize: '12px', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' },
  tr: { borderBottom: '1px solid #F8FAFC', transition: '0.2s cubic-bezier(0.4, 0, 0.2, 1)' },
  td: { padding: '16px 20px', fontSize: '15px', color: '#334155', fontWeight: '600' },
  userCell: { display: 'flex', alignItems: 'center', gap: '12px' },
  username: { fontWeight: '700', color: '#1E293B' },
  rankNum: { fontWeight: '800', color: '#CBD5E1', fontSize: '16px' },
  subjectBadge: { padding: '4px 10px', borderRadius: '8px', color: '#fff', fontSize: '11px', fontWeight: '800' },
  scoreText: { fontWeight: '900', color: '#3B82F6', fontSize: '18px' },
  totalText: { color: '#94A3B8', fontSize: '13px' },
  loaderBox: { textAlign: 'center', padding: '80px 0' },
  noData: { textAlign: 'center', padding: '60px', color: '#94A3B8', fontWeight: '600', fontSize: '16px' }
};

export default Leaderboard;