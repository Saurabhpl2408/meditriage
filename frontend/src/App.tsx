import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/layout/Layout';
import Home from './pages/Home';
import SymptomChecker from './pages/SymptomChecker';
import TriageResults from './pages/TriageResults';
import MedicalKnowledge from './pages/MedicalKnowledge';
import About from './pages/About';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/symptom-checker" element={<SymptomChecker />} />
            <Route path="/triage-results" element={<TriageResults />} />
            <Route path="/medical-knowledge" element={<MedicalKnowledge />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;