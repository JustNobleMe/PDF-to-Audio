import React, { useEffect, useState } from 'react';

interface VoiceSelectorProps {
    onVoiceChange: (voice: SpeechSynthesisVoice) => void;
}

const VoiceSelector: React.FC<VoiceSelectorProps> = ({ onVoiceChange }) => {
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [languages, setLanguages] = useState<string[]>([]);
    const [selectedLang, setSelectedLang] = useState<string>('');

    useEffect(() => {
        const loadVoices = () => {
            const voicesList = window.speechSynthesis.getVoices().filter(v => v.localService && v.voiceURI);
            // Get unique language codes
            const langs = Array.from(new Set(voicesList.map(v => v.lang.split('-')[0])));
            setLanguages(langs);

            // If no language selected, pick the first available
            setSelectedLang(prev => prev || langs[0] || '');

            // Filter voices by selected language (if set)
            setVoices(voicesList.filter(v => (selectedLang ? v.lang.startsWith(selectedLang) : true)));
        };
        window.speechSynthesis.onvoiceschanged = loadVoices;
        loadVoices();
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        const voicesList = window.speechSynthesis.getVoices().filter(v => v.localService && v.voiceURI);
        setVoices(voicesList.filter(v => (selectedLang ? v.lang.startsWith(selectedLang) : true)));
    }, [selectedLang]);

    const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedLang(e.target.value);
    };

    return (
        <div>
            <label>
                Language:&nbsp;
                <select value={selectedLang} onChange={handleLangChange}>
                    {languages.map(lang => (
                        <option key={lang} value={lang}>{lang}</option>
                    ))}
                </select>
            </label>
            <br />
            <label>
                Voice:&nbsp;
                <select onChange={(e) => onVoiceChange(voices[Number(e.target.value)])}>
                    {voices.map((voice, index) => (
                        <option key={index} value={index}>
                            {voice.name} ({voice.lang})
                        </option>
                    ))}
                </select>
            </label>
        </div>
    );
};

export default VoiceSelector;