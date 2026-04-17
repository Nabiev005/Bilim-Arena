import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FaArrowLeft, FaGraduationCap } from 'react-icons/fa';
// 1. МААЛЫМАТТЫ ИМПОРТТОО
import { GRAMMAR_DATA } from '../../data/turkgrammarData'; 

const GrammarLesson: React.FC = () => {
  const navigate = useNavigate();
  // 2. БИРИНЧИ ТЕМАНЫ ДЕФОЛТ КЫЛЫП КОЮУ
  const [activeTopic, setActiveTopic] = useState(GRAMMAR_DATA[0]);

  return (
    <Container>
      <header style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
        <BackBtn onClick={() => navigate('/turkish')}>← Артка</BackBtn>
        <h1 style={{ fontSize: '24px', fontWeight: '800' }}>Грамматика</h1>
      </header>

      <Layout>
        {/* Сол тарап - Темалардын тизмеси */}
        <Sidebar>
          {GRAMMAR_DATA.map((topic) => (
            <TopicCard 
              key={topic.id} 
              $active={activeTopic.id === topic.id}
              onClick={() => setActiveTopic(topic)}
            >
              {topic.title}
            </TopicCard>
          ))}
        </Sidebar>

        {/* Оң тарап - Мазмуну */}
        <MainContent>
          <div style={{ marginBottom: '30px' }}>
            <span style={styles.badge}>{activeTopic.level}</span>
            <h2 style={{ fontSize: '28px', margin: '15px 0' }}>{activeTopic.title}</h2>
            <p style={{ color: '#64748b', lineHeight: '1.6' }}>{activeTopic.description}</p>
          </div>

          <Section>
            <h3>Эрежелер</h3>
            <RulesGrid>
              {activeTopic.rules.map((rule, index) => (
                <div key={index} style={styles.ruleItem}>
                  <strong style={{ display: 'block' }}>{rule.type}</strong>
                  <span style={{ color: '#64748b', fontSize: '14px' }}>{rule.items}</span>
                </div>
              ))}
            </RulesGrid>
          </Section>

          <Section>
            <h3>Мисалдар</h3>
            <Table>
              <tbody>
                {activeTopic.examples.map((ex, index) => (
                  <tr key={index}>
                    <td style={{ fontWeight: 'bold', color: '#3B82F6' }}>{ex.turkish}</td>
                    <td>{ex.kyrgyz}</td>
                    <td style={{ fontSize: '12px', color: '#94a3b8' }}>{ex.note}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Section>
        </MainContent>
      </Layout>
    </Container>
  );
};

// Стилдер (Styled Components)
const Layout = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 30px;
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TopicCard = styled.div<{ $active: boolean }>`
  padding: 15px 20px;
  background: ${props => props.$active ? '#3B82F6' : 'white'};
  color: ${props => props.$active ? 'white' : '#1e293b'};
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  border: 1px solid ${props => props.$active ? '#3B82F6' : '#f1f5f9'};
  transition: 0.2s;
  &:hover { transform: translateX(5px); }
`;

const MainContent = styled.div`
  background: white;
  padding: 40px;
  border-radius: 24px;
  border: 1px solid #f1f5f9;
`;

const Section = styled.div` margin-top: 30px; h3 { margin-bottom: 15px; } `;

const RulesGrid = styled.div` display: grid; grid-template-columns: 1fr 1fr; gap: 15px; `;

const Table = styled.table`
  width: 100%;
  td { padding: 15px; border-bottom: 1px solid #f8fafc; }
`;

const Container = styled.div` padding: 40px; max-width: 1200px; margin: 0 auto; `;
const BackBtn = styled.button` padding: 10px 20px; border-radius: 10px; border: none; cursor: pointer; `;

const styles = {
  badge: { background: '#E3F2FD', color: '#3B82F6', padding: '5px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' },
  ruleItem: { background: '#f8fafc', padding: '15px', borderRadius: '12px' }
};

export default GrammarLesson;