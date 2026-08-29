import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Music,
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
} from "lucide-react";

/**
 * MusicPlayer
 * ---------------------------------------------------------------------
 * A compact icon button that lives inline in the footer (between the
 * copyright line and the Admin link — not floating over the page, per
 * explicit placement feedback). Clicking it opens a popover above the
 * footer with the full player: a rotating "album art" disc (no real
 * artwork was supplied, so it's a styled disc with a music-note icon
 * instead of a photo), a seekable progress bar, shuffle/repeat toggles,
 * and prev/next across the 3-track playlist. Audio never autoplays —
 * playback only starts once the visitor clicks Play.
 */
const PLAYLIST = [
  { title: "Loser", artist: "Tame Impala", src: "/audio/track-1.mp3" },
  { title: "Stayin' Alive", artist: "Bee Gees", src: "/audio/track-2.mp3" },
  { title: "PTBR", artist: "Faixa 3", src: "/audio/track-3.mp3" },
];

function formatTime(t) {
  if (Number.isNaN(t)) return "00:00";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function MusicPlayer() {
  const [open, setOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);

  const track = PLAYLIST[trackIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [isPlaying, trackIndex]);

  function nextTrack() {
    if (shuffle) {
      let next = trackIndex;
      while (next === trackIndex && PLAYLIST.length > 1) {
        next = Math.floor(Math.random() * PLAYLIST.length);
      }
      setTrackIndex(next);
    } else {
      setTrackIndex((i) => (i + 1) % PLAYLIST.length);
    }
    setIsPlaying(true);
  }

  function prevTrack() {
    setTrackIndex((i) => (i - 1 + PLAYLIST.length) % PLAYLIST.length);
    setIsPlaying(true);
  }

  function handleEnded() {
    if (repeat) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else {
      nextTrack();
    }
  }

  function handleSeek(e) {
    const value = Number(e.target.value);
    if (audioRef.current) audioRef.current.currentTime = value;
    setCurrentTime(value);
  }

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="relative">
      <audio
        ref={audioRef}
        src={track.src}
        preload="metadata"
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onEnded={handleEnded}
      />

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="absolute bottom-full left-1/2 z-50 mb-4 w-72 -translate-x-1/2 rounded-2xl border border-hair bg-panel p-5 shadow-2xl"
          >
            <div className="flex flex-col items-center">
              <motion.div
                className="mb-4 flex h-24 w-24 items-center justify-center rounded-full border-4 border-signal/70 bg-panel-soft shadow-lg"
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Music size={32} className="text-signal" />
              </motion.div>

              <h4 className="text-base font-bold text-paper">{track.title}</h4>
              <p className="mb-4 text-xs text-mist">{track.artist}</p>

              <div className="mb-4 flex w-full items-center gap-2">
                <span className="w-10 text-right font-mono text-[10px] text-mist">
                  {formatTime(currentTime)}
                </span>
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  className="h-1.5 flex-grow cursor-pointer appearance-none rounded-full bg-hair accent-signal"
                  style={{
                    background: `linear-gradient(to right, var(--color-signal) ${progressPct}%, var(--color-hair) ${progressPct}%)`,
                  }}
                />
                <span className="w-10 font-mono text-[10px] text-mist">
                  {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setShuffle((s) => !s)}
                  aria-label="Ordem aleatória"
                  className={`transition-colors ${shuffle ? "text-signal" : "text-mist hover:text-paper"}`}
                >
                  <Shuffle size={16} />
                </button>
                <button
                  onClick={prevTrack}
                  aria-label="Faixa anterior"
                  className="text-paper transition-transform hover:scale-110"
                >
                  <SkipBack size={20} />
                </button>
                <button
                  onClick={() => setIsPlaying((p) => !p)}
                  aria-label={isPlaying ? "Pausar" : "Tocar"}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-signal text-ink shadow-lg transition-transform hover:scale-105 active:scale-95"
                >
                  {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
                </button>
                <button
                  onClick={nextTrack}
                  aria-label="Próxima faixa"
                  className="text-paper transition-transform hover:scale-110"
                >
                  <SkipForward size={20} />
                </button>
                <button
                  onClick={() => setRepeat((r) => !r)}
                  aria-label="Repetir faixa"
                  className={`transition-colors ${repeat ? "text-signal" : "text-mist hover:text-paper"}`}
                >
                  <Repeat size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Abrir player de música"
        aria-expanded={open}
        className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
          isPlaying
            ? "border-signal bg-signal/10 text-signal"
            : "border-hair text-mist hover:text-paper"
        }`}
      >
        <Music size={16} />
      </button>
    </div>
  );
}
