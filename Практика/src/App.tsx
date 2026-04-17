import { useState, useEffect } from 'react'; // useState жана useEffect кошулду
import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import GrammarGame from './pages/GrammarGame';
import ProverbsGame from './pages/ProverbsGame';
import MathGame from './pages/MathGame';
import RatingPage from './pages/RatingPage';
import AuthorPage from './pages/AuthorPage';
import HistoryGame from './pages/HistoryGame';
import NomadicEcho from './pages/NomadicEcho';
import WordHunter from './pages/WordHunter';
import ToguzKorgool from './pages/ToguzKorgool';
import ChukoGame from './pages/ChukoGame';
import ManasQuiz from './pages/ManasQuiz';
import WordGame from './pages/WordGame';
import ORTPrepPage from './pages/ORT/ORTPrepPage';
import Analogies from './pages/ORT/Analogies';
import MathSection from './pages/ORT/MathSection';
import KyrgyzLanguage from './pages/ORT/KyrgyzLanguage';
import Reading from './pages/ORT/Reading';
import Leaderboard from './pages/ORT/Leaderboard';
import AkTerekGame from './pages/AkTerekGame';
import AdminPage from './pages/YurtaGame';
import YurtaGame from './pages/YurtaGame';
import MathKokBoru from './pages/MathKokBoru';
import CyberShield from './pages/CyberShield';
import AlgorithmicPath from './pages/AlgorithmicPath';
import OrdoSQL from './pages/OrdoSQL';
import BeshTash from './pages/BeshTash';
import KyzKuumaiEncryption from './pages/KyzKuumaiEncryption';
import TurkishHome from './pages/Turkish/TurkishHome';
import VocabularyQuiz from './pages/Turkish/VocabularyQuiz';
import GrammarLesson from './pages/Turkish/GrammarLesson';

function App() {
  const location = useLocation();
  const isAdminPage = location.pathname === '/admin-panel';

  // --- МОБИЛДИК ЭКРАНДЫ АНЫКТОО ---
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768; // 768px'ден кичине болсо мобилдик деп эсептелет
  // --------------------------------

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: isMobile ? 'column' : 'row', // Телефондо Sidebar менен Main бири-биринин астында болот
      minHeight: '100vh',
      width: '100%',
      overflowX: 'hidden' 
    }}>
      
      {/* Эгер админ панелде эмес болсок ЖАНА экран компьютердики болсо Sidebar көрсөтүлөт */}
      {/* Мобилдик версияда Sidebar'ды өзүнчө меню катары (Burger menu) кылсаң болот, азырынча кысылбашы үчүн жашырдык */}
      {!isAdminPage && !isMobile && <Sidebar />}

      <main style={{ 
        flex: 1, 
        background: '#F8FAFC', 
        position: 'relative',
        width: '100%',
        minWidth: '0', // Маанилүү: Контенттин ичкерип кетүүсүн алдын алат
        padding: isMobile ? '0px' : '0px' // Кааласаң телефонго кошумча паддинг берсең болот
      }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/grammar" element={<GrammarGame />} />
          <Route path="/proverbs" element={<ProverbsGame />} />
          <Route path="/math" element={<MathGame />} />
          <Route path="/rating" element={<RatingPage />} />
          <Route path="/author" element={<AuthorPage />} />
          <Route path="/history" element={<HistoryGame />} />
          <Route path="/echo" element={<NomadicEcho />} />
          <Route path="/wordhunter" element={<WordHunter />} />
          <Route path="/toguz" element={<ToguzKorgool />} />
          <Route path="/chuko" element={<ChukoGame />} />
          <Route path="/manas-quiz" element={<ManasQuiz />} />
          <Route path="/wordgame" element={<WordGame />} />
          <Route path="/ort-prep" element={<ORTPrepPage />} />
          <Route path="/ort/analogies" element={<Analogies />} />
          <Route path="/ort/math" element={<MathSection />} />
          <Route path="/ort/kyrgyz-language" element={<KyrgyzLanguage />} />
          <Route path="/ort/reading" element={<Reading />} />
          <Route path="/ort/leaderboard" element={<Leaderboard />} />
          <Route path="/ak-terek" element={<AkTerekGame />} />
          <Route path="/yurta-game" element={<YurtaGame />} />
          <Route path="/kok-boru-game" element={<MathKokBoru />} />
          <Route path="/cyber-shield" element={<CyberShield />} />
          <Route path="/algorithmic-path" element={<AlgorithmicPath />} />
          <Route path="/ordo-sql" element={<OrdoSQL />} />
          <Route path="/besh-tash" element={<BeshTash />} />
          <Route path="/kyz-kuumai-encryption" element={<KyzKuumaiEncryption />} />
          <Route path="/turkish" element={<TurkishHome />} />
          <Route path="/turkish/vocabulary" element={<VocabularyQuiz />} />
          <Route path="/turkish/grammar" element={<GrammarLesson />} />
          <Route path="/admin-panel" element={<AdminPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;