import { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { turkishVocab, categories } from '../../data/turkishData';
import { useNavigate } from 'react-router-dom';

const VocabularyQuiz = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [flippedIds, setFlippedIds] = useState<number[]>([]);

  const toggleFlip = (id: number) => {
    setFlippedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const filteredWords = turkishVocab.filter(item =>
    selectedCategory === 'all' || item.category === selectedCategory
  );

  return (
    <Container>
      <Header>
        <BackBtn onClick={() => navigate('/turkish')}>
          <span>←</span> Артка кайтуу
        </BackBtn>
        <TitleSection>
          <h1>Kelime Dünyası</h1>
          <p>Түрк тилиндеги жаңы сөздөрдү интерактивдүү карталар менен жаттаңыз</p>
        </TitleSection>
      </Header>

      <CategoryFilters>
        <FilterBtn
          $active={selectedCategory === 'all'}
          onClick={() => setSelectedCategory('all')}
        >
          Бардыгы
        </FilterBtn>
        {categories.map(cat => (
          <FilterBtn
            key={cat.id}
            $active={selectedCategory === cat.id}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.title}
          </FilterBtn>
        ))}
      </CategoryFilters>

      <Grid>
        {filteredWords.map(item => {
          const isFlipped = flippedIds.includes(item.id);
          return (
            <CardWrapper key={item.id} onClick={() => toggleFlip(item.id)}>
              <CardInner $isFlipped={isFlipped}>
                {/* FRONT SIDE */}
                <CardFront>
                  <CardGlass />
                  <Tag>{item.category}</Tag>
                  <MainWord>{item.word}</MainWord>
                  <TapHint>
                    <TapIcon /> Таптап котормосун көрүңүз
                  </TapHint>
                </CardFront>

                {/* BACK SIDE */}
                <CardBack>
                  <CardGlass />
                  <Tag className="back-tag">{item.category}</Tag>
                  <OriginalWord>{item.word}</OriginalWord>
                  <Divider />
                  <TranslationText>{item.translation}</TranslationText>
                </CardBack>
              </CardInner>
            </CardWrapper>
          );
        })}
      </Grid>
    </Container>
  );
};

export default VocabularyQuiz;

/* --- ANIMATIONS --- */
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); opacity: 0.6; }
`;

/* --- STYLES --- */
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  min-height: 100vh;
  background: radial-gradient(circle at top right, #f8fafc, #e2e8f0);
  animation: ${fadeIn} 0.8s ease-out;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 50px;
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
`;

const TitleSection = styled.div`
  h1 { 
    font-size: clamp(24px, 5vw, 36px); 
    font-weight: 900; 
    background: linear-gradient(90deg, #1e293b, #22c55e);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: 0;
  }
  p { font-size: 14px; color: #64748b; margin-top: 8px; font-weight: 500; }
`;

const BackBtn = styled.button`
  padding: 12px 24px;
  border-radius: 16px;
  border: 2px solid #e2e8f0;
  background: white;
  color: #1e293b;
  cursor: pointer;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  &:hover {
    border-color: #22c55e;
    background: #f0fdf4;
    transform: scale(1.05);
  }
`;

const CategoryFilters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  margin-bottom: 50px;
`;

const FilterBtn = styled.button<{ $active: boolean }>`
  padding: 10px 20px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  font-weight: 800;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${p => (p.$active ? '#0f172a' : 'white')};
  color: ${p => (p.$active ? 'white' : '#64748b')};
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.1);
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
`;

const CardWrapper = styled.div`
  height: 240px;
  perspective: 2000px;
  cursor: pointer;
`;

const CardInner = styled.div<{ $isFlipped: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform: ${p => (p.$isFlipped ? 'rotateY(180deg)' : 'rotateY(0)')};
`;

const CardBase = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 32px;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 20px 40px rgba(0,0,0,0.08);
  overflow: hidden;
`;

const CardGlass = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%);
  z-index: 1;
`;

const CardFront = styled(CardBase)`
  background: white;
`;

const CardBack = styled(CardBase)`
  transform: rotateY(180deg);
  background: #0f172a;
  color: white;
`;

const Tag = styled.div`
  position: absolute;
  top: 20px;
  font-size: 11px;
  font-weight: 800;
  padding: 6px 14px;
  border-radius: 10px;
  background: #f1f5f9;
  color: #22c55e;
  text-transform: uppercase;
  z-index: 2;
  &.back-tag { background: rgba(34, 197, 94, 0.2); }
`;

const MainWord = styled.h2`
  font-size: 32px;
  font-weight: 900;
  color: #1e293b;
  margin: 0;
  z-index: 2;
`;

const OriginalWord = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: #94a3b8;
  margin: 0;
  z-index: 2;
`;

const Divider = styled.div`
  width: 50px;
  height: 4px;
  background: #22c55e;
  border-radius: 2px;
  margin: 15px 0;
  z-index: 2;
`;

const TranslationText = styled.p`
  font-size: 28px;
  font-weight: 800;
  color: white;
  text-align: center;
  z-index: 2;
`;

const TapHint = styled.div`
  position: absolute;
  bottom: 20px;
  font-size: 12px;
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 6px;
  z-index: 2;
`;

const TapIcon = styled.div`
  width: 8px;
  height: 8px;
  background: #22c55e;
  border-radius: 50%;
  animation: ${pulse} 1.5s infinite;
`;