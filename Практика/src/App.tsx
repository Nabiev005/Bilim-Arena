import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar'; // Sidebar импорттоону унутпаңыз
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

function App() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* 1. Sidebar ар дайым сол жакта турат */}
      <Sidebar />

      {/* 2. Негизги мазмун оң жакта турат */}
      <main style={{ flex: 1, background: '#F8FAFC', position: 'relative' }}>
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
        </Routes>
      </main>
    </div>
  );
}

export default App;