import { Routes, Route, useLocation } from 'react-router-dom'; // useLocation кошулду
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

function App() {
  // 1. Учурдагы даректи аныктайбыз
  const location = useLocation();
  
  // 2. Эгер дарек '/admin-panel' болсо, isAdminPage true болот
  const isAdminPage = location.pathname === '/admin-panel';

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* 3. Эгер админ панелде эмес болсок гана Sidebar көрсөтүлөт */}
      {!isAdminPage && <Sidebar />}

      {/* 4. Негизги мазмун оң жакта турат. Админ панелде marginLeft болбойт */}
      <main style={{ 
        flex: 1, 
        background: '#F8FAFC', 
        position: 'relative',
        width: '100%' 
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
          
          {/* Админ панель */}
          <Route path="/admin-panel" element={<AdminPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;