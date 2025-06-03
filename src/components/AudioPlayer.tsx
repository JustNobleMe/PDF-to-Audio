import { useRef, useState } from "react";

type AudioPlayerProps = {
    text: string;
    selectedVoice?: SpeechSynthesisVoice;
};

const AudioPlayer = ({ text, selectedVoice }: AudioPlayerProps) => {
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    const playAudio = () => {
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        }
        const utterance = new SpeechSynthesisUtterance(text);
        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);
        utteranceRef.current = utterance;
        speechSynthesis.speak(utterance);

        setIsPlaying(true);
        setIsPaused(false);

        // Save the text + voice in localstorage
        localStorage.setItem('lastText', text);
        localStorage.setItem('lastVoice', selectedVoice?.name || "");
    };

    const pauseAudio = () => {
        if (speechSynthesis.speaking && !speechSynthesis.paused) {
            speechSynthesis.pause();
            setIsPaused(true);
        }
    };

    const resumeAudio = () => {
        if (speechSynthesis.paused) {
            speechSynthesis.resume();
            setIsPaused(false);
        }
    };

    const stopAudio = () => {
        speechSynthesis.cancel();
        setIsPlaying(false);
        setIsPaused(false);
    };

    return (
        <div>
            <button onClick={playAudio} disabled={!text || isPlaying}>
                Play
            </button>
            <button onClick={pauseAudio} disabled={!isPlaying || isPaused}>
                Pause
            </button>
            <button onClick={resumeAudio} disabled={!isPlaying || !isPaused}>
                Resume
            </button>
            <button onClick={stopAudio} disabled={!isPlaying}>
                Stop
            </button>
        </div>
    );
};

export default AudioPlayer;