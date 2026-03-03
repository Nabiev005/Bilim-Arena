import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../components/Sidebar';

// Бекендден келе турган маалыматтардын тиби
interface AuthorStats {
  projectStatus: number;
  totalGames: number;
  activeUsers: number;
  serverStatus: string;
  version: string;
  activityData: number[];
  notifications: { id: number; text: string }[];
}

const AuthorPage: React.FC = () => {
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const [stats, setStats] = useState<AuthorStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Оптимизация: Терезе өлчөмүн көзөмөлдөө
  const handleResize = useCallback(() => {
    setWindowWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    window.addEventListener('resize', handleResize);

    const fetchStats = async () => {
      // API URL'ди чөйрө өзгөртмөсүнөн алуу (Коопсуздук үчүн)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const API_URL = (window as any).__env__?.REACT_APP_API_URL || 'http://localhost:5000/api/author-stats';

      try {
        const response = await fetch(API_URL, { 
          signal: controller.signal,
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (!response.ok) throw new Error('Серверден туура эмес жооп келди');
        
        const data: AuthorStats = await response.json();
        setStats(data);
      } catch (error: unknown) {
        // TypeScript катасы ушул жерде оңдолду: 'any' ордуна 'unknown' колдонулду
        if (error instanceof Error) {
          if (error.name !== 'AbortError') {
            console.error("Fetch error:", error.message);
            // Камдык маалыматтар (Fallback)
            setStats({
              projectStatus: 85,
              totalGames: 7,
              activeUsers: 150,
              serverStatus: "Туруктуу",
              version: "v1.0.8",
              activityData: [40, 70, 45, 90, 65, 80, 50],
              notifications: [
                { id: 1, text: "Система ийгиликтүү иштеп жатат." },
                { id: 2, text: "Жаңы жаңыртуулар ийгиликтүү жүктөлдү." }
              ]
            });
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    return () => {
      window.removeEventListener('resize', handleResize);
      controller.abort();
    };
  }, [handleResize]);

  const isMobile = windowWidth <= 992;

  if (loading) {
    return (
      <div style={styles.loaderContainer}>
        <style>{`
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
        <div style={styles.spinner}></div>
        <p style={{ fontWeight: '600', color: '#64748b' }}>Система жүктөлүүдө...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Sidebar />
      
      <main style={{
        ...styles.content,
        padding: isMobile ? '20px' : '40px 60px'
      }}>
        {/* TOP BAR */}
        <header style={{
          ...styles.topBar,
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'flex-start' : 'center',
          gap: isMobile ? '20px' : '0'
        }}>
          <div>
            <h1 style={styles.pageTitle}>Башкаруу панели</h1>
            <p style={styles.pageSubtitle}>Версия: {stats?.version} | Абалы: {stats?.serverStatus}</p>
          </div>
          <div style={styles.topActions}>
            <button style={styles.secondaryBtn} onClick={() => window.print()}>💾 Отчёт жүктөө</button>
            <button style={styles.primaryBtn}>⚙️ Жөндөөлөр</button>
          </div>
        </header>

        {/* DASHBOARD GRID */}
        <div style={{
          ...styles.dashboardGrid,
          gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr'
        }}>
          
          <div style={styles.leftCol}>
            {/* Main Card */}
            <section style={styles.mainCard}>
              <div style={styles.profileHeader}>
                <div style={styles.avatarLarge}>Ai</div>
                <div style={styles.nameSection}>
                  <h2 style={styles.name}>AiNabi Dev Team</h2>
                  <p style={styles.role}>Кыргыз тилдүү билим берүү экосистемасы</p>
                  <div style={styles.badgeRow}>
                    <span style={styles.verifiedBadge}>● Verified System</span>
                    <span style={styles.activeBadge}>● Online</span>
                  </div>
                </div>
              </div>

              <div style={styles.divider} />

              <div style={styles.section}>
                <h3 style={styles.sectionHeading}>Биз тууралуу</h3>
                <p style={styles.text}>
                  AiNabi — бул санариптик контентти кыргыз тилинде өнүктүрүүгө багытталган инновациялык платформа. 
                </p>
              </div>

              <div style={styles.section}>
                <h3 style={styles.sectionHeading}>Долбоордун даярдыгы</h3>
                <div style={styles.progressContainer}>
                  <div style={styles.progressLabel}>
                    <span>Жалпы иштеп чыгуу</span>
                    <span>{stats?.projectStatus}%</span>
                  </div>
                  <div style={styles.progressBarBg}>
                    <div style={{...styles.progressBarFill, width: `${stats?.projectStatus}%`}} />
                  </div>
                </div>
              </div>
            </section>

            {/* Chart */}
            <section style={styles.chartCard}>
              <h3 style={styles.sectionHeading}>Акыркы жумадагы активдүүлүк</h3>
              <div style={styles.chartPlaceholder}>
                {stats?.activityData.map((h, i) => (
                  <div key={i} style={{
                    ...styles.chartBar,
                    height: `${h}%`,
                    background: h > 75 ? '#4299e1' : '#BEE3F8'
                  }} />
                ))}
              </div>
              <div style={styles.chartLabels}>
                {['Дүй','Шей','Шар','Бей','Жум','Ишем','Жек'].map(day => <span key={day}>{day}</span>)}
              </div>
            </section>
          </div>

          <aside style={styles.sideColumn}>
            <div style={styles.statCard}>
              <h3 style={styles.statTitle}>Көрсөткүчтөр</h3>
              <div style={styles.statItem}>
                <span>Жалпы оюндар</span>
                <span style={styles.statVal}>{stats?.totalGames}</span>
              </div>
              <div style={styles.statItem}>
                <span>Активдүү колдонуучулар</span>
                <span style={styles.statVal}>{stats?.activeUsers}</span>
              </div>
            </div>

            <div style={styles.notifCard}>
              <h3 style={styles.statTitle}>Билдирүүлөр</h3>
              {stats?.notifications.map(n => (
                <div key={n.id} style={styles.notifItem}>
                  <div style={styles.notifDot} />
                  <p style={styles.notifText}>{n.text}</p>
                </div>
              ))}
            </div>

            <div style={styles.contactCard}>
              <h3 style={{...styles.statTitle, color: '#a0aec0'}}>Колдоо</h3>
              <p style={styles.contactEmail}>ajbeknabiev90@gmail.com</p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

// Стилдер (Styles)
const styles: { [key: string]: React.CSSProperties } = {
  container: { display: 'flex', background: '#f8fafc', minHeight: '100vh', width: '100%' },
  content: { flex: 1, transition: 'all 0.3s ease' },
  loaderContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' },
  spinner: { width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #4299e1', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '15px' },
  topBar: { display: 'flex', justifyContent: 'space-between', marginBottom: '30px' },
  pageTitle: { fontSize: '28px', color: '#1e293b', fontWeight: '850' },
  pageSubtitle: { color: '#64748b', fontSize: '14px' },
  topActions: { display: 'flex', gap: '12px' },
  primaryBtn: { padding: '12px 24px', background: '#4299e1', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '600', cursor: 'pointer' },
  secondaryBtn: { padding: '12px 24px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', fontWeight: '600', cursor: 'pointer' },
  dashboardGrid: { display: 'grid', gap: '24px' },
  leftCol: { display: 'flex', flexDirection: 'column', gap: '24px' },
  mainCard: { background: '#fff', borderRadius: '24px', padding: '32px', border: '1px solid #e2e8f0' },
  profileHeader: { display: 'flex', gap: '24px', alignItems: 'center' },
  avatarLarge: { width: '80px', height: '80px', background: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)', borderRadius: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '28px', fontWeight: 'bold' },
  nameSection: { flex: 1 },
  name: { fontSize: '22px', color: '#1e293b', fontWeight: '800', margin: 0 },
  role: { color: '#64748b', fontSize: '15px', margin: '4px 0' },
  badgeRow: { display: 'flex', gap: '8px' },
  verifiedBadge: { fontSize: '11px', background: '#EBF8FF', color: '#2B6CB0', padding: '4px 12px', borderRadius: '8px', fontWeight: '700' },
  activeBadge: { fontSize: '11px', background: '#F0FFF4', color: '#2F855A', padding: '4px 12px', borderRadius: '8px', fontWeight: '700' },
  divider: { height: '1px', background: '#f1f5f9', margin: '30px 0' },
  sectionHeading: { fontSize: '12px', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '16px', fontWeight: '800' },
  text: { color: '#475569', lineHeight: '1.7' },
  progressContainer: { marginTop: '12px' },
  progressLabel: { display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '10px' },
  progressBarBg: { height: '10px', background: '#f1f5f9', borderRadius: '20px', overflow: 'hidden' },
  progressBarFill: { height: '100%', background: '#4299e1', transition: 'width 1s ease-in-out' },
  chartCard: { background: '#fff', borderRadius: '24px', padding: '32px', border: '1px solid #e2e8f0' },
  chartPlaceholder: { height: '140px', display: 'flex', alignItems: 'flex-end', gap: '12px' },
  chartBar: { flex: 1, borderRadius: '4px 4px 0 0' },
  chartLabels: { display: 'flex', justifyContent: 'space-between', marginTop: '15px', fontSize: '12px', color: '#94a3b8' },
  sideColumn: { display: 'flex', flexDirection: 'column', gap: '24px' },
  statCard: { background: '#fff', borderRadius: '24px', padding: '28px', border: '1px solid #e2e8f0' },
  statTitle: { fontSize: '13px', color: '#94a3b8', fontWeight: '800', textTransform: 'uppercase', marginBottom: '20px' },
  statItem: { display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid #f1f5f9' },
  statVal: { fontWeight: '800' },
  notifCard: { background: '#fff', borderRadius: '24px', padding: '28px', border: '1px solid #e2e8f0' },
  notifItem: { display: 'flex', gap: '12px', marginBottom: '18px' },
  notifDot: { width: '8px', height: '8px', background: '#4299e1', borderRadius: '50%', marginTop: '6px' },
  notifText: { fontSize: '13px', margin: 0, color: '#475569' },
  contactCard: { background: '#1e293b', borderRadius: '24px', padding: '28px', color: '#fff' },
  contactEmail: { fontSize: '16px', fontWeight: '600', color: '#e2e8f0', marginTop: '10px' }
};

export default AuthorPage;