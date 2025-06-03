import { useState } from 'react';
import './App.css'
import UploadPDF from './components/Upload';
import VoiceSelector from './components/VoiceSelector';
import AudioPlayer from './components/AudioPlayer';

const App = () => {
  const [pages, setPages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);

  // Called by UploadPDF when PDF is loaded
  const handleExtractText = (text: string) => {
    // Split by page marker (added in UploadPDF below)
    setPages(text.split('\f'));
    setCurrentPage(0);
  };

  return (
    <div>
      <h2>PDF to Audio Web App</h2>
      <UploadPDF onExtractText={handleExtractText} />
      <VoiceSelector onVoiceChange={setVoice} />
      {pages.length > 0 && (
        <>
          <div>
            <input
              type="range"
              min={0}
              max={pages.length - 1}
              value={currentPage}
              onChange={e => setCurrentPage(Number(e.target.value))}
              style={{ width: 300 }}
            />
            <span>
              Page {currentPage + 1} of {pages.length}
            </span>
          </div>
          <AudioPlayer text={pages[currentPage]} selectedVoice={voice ?? undefined} />
        </>
      )}
    </div>
  );
};

export default App;
