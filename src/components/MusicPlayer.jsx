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
  Volume1,
  Volume2,
  VolumeX,
} from "lucide-react";

/**
 * MusicPlayer
 * ---------------------------------------------------------------------
 * A compact icon button inline in the footer. Clicking it opens a
 * popover with the full player: album art (falls back to a rotating
 * music-note disc when a track has no coverUrl), a seekable progress
 * bar, volume/mute, shuffle/repeat, and prev/next across the playlist.
 * Audio never autoplays — playback only starts once the visitor clicks.
 *
 * `coverUrl` is left null for all 3 tracks below (no artwork was
 * supplied yet) — drop image files in /public/covers/ and set the path
 * here to enable real album art; the icon fallback keeps working either
 * way. `lyrics` is intentionally left as a placeholder string, NOT the
 * real song lyrics — lyrics are copyrighted text, separate from owning
 * the audio file itself, and publishing them on a public site is its
 * own rights question. Fill `lyrics` in only for songs you have
 * permission to display the text of.
 */
const PLAYLIST = [
  {
    title: "Loser",
    artist: "Tame Impala",
    src: "/audio/track-1.mp3",
    coverUrl: null,
    lyrics: null,
  },
  {
    title: "Stayin' Alive",
    artist: "Bee Gees",
    src: "/audio/track-2.mp3",
    coverUrl: null,
    lyrics: null,
  },
  {
    title: "PTBR",
    artist: "Faixa 3",
    src: "/audio/track-3.mp3",
    coverUrl: null,
    lyrics: null,
  },
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
  const [volume, setVolume] = useState(0.7);
  const [muted, setMuted] = useState(false);
  const [coverFailed, setCoverFailed] = useState(false);
  const audioRef = useRef(null);

  const track = PLAYLIST[trackIndex];
  const showCover = track.coverUrl && !coverFailed;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [isPlaying, trackIndex]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = muted ? 0 : volume;
  }, [volume, muted]);

  useEffect(() => {
    setCoverFailed(false);
  }, [trackIndex]);

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

  function handleVolumeChange(e) {
    const value = Number(e.target.value);
    setVolume(value);
    if (value > 0 && muted) setMuted(false);
  }

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;
  const VolumeIcon = muted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

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

      {/* Lyrics side panel — fixed to the right edge of the viewport,
          independent of the footer's scroll position. Only visible while
          actually playing (fades in/out with isPlaying, never just
          display:none-toggled so the transition reads intentionally).
          Fully transparent background + a very soft blur, so it never
          reads as a solid card sitting on top of the page. Hidden below
          lg so it can't cover content on narrower screens. */}
      <AnimatePresence>
        {isPlaying && (
          <motion.aside
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16 }}
            transition={{ duration: 0.35 }}
            className="fixed right-6 top-1/2 z-40 hidden max-h-[65vh] w-72 -translate-y-1/2 overflow-y-auto rounded-2xl border border-hair/40 bg-transparent p-5 backdrop-blur-[2px] lg:block"
          >
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-signal">
              {track.title}
            </p>
            <p className="mb-4 text-[11px] text-mist">{track.artist}</p>
            {track.lyrics ? (
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-paper/90">
                {track.lyrics}
              </pre>
            ) : (
              <p className="text-sm italic text-mist">
                Letra não disponível para esta faixa.
              </p>
            )}
          </motion.aside>
        )}
      </AnimatePresence>

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
                className="mb-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-signal/70 bg-panel-soft shadow-lg"
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                {showCover ? (
                  <img
                    src={track.coverUrl}
                    alt={`Capa de ${track.title}`}
                    onError={() => setCoverFailed(true)}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Music size={32} className="text-signal" />
                )}
              </motion.div>

              <h4 className="text-base font-bold text-paper">{track.title}</h4>
              <p className="mb-4 text-xs text-mist">{track.artist}</p>

              <div className="mb-3 flex w-full items-center gap-2">
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

              <div className="mb-4 flex w-full items-center gap-2 px-10">
                <button
                  onClick={() => setMuted((m) => !m)}
                  aria-label={muted ? "Ativar som" : "Mutar"}
                  className="text-mist transition-colors hover:text-paper"
                >
                  <VolumeIcon size={16} />
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={muted ? 0 : volume}
                  onChange={handleVolumeChange}
                  aria-label="Volume"
                  className="h-1 flex-grow cursor-pointer appearance-none rounded-full bg-hair accent-signal"
                  style={{
                    background: `linear-gradient(to right, var(--color-mist) ${(muted ? 0 : volume) * 100}%, var(--color-hair) ${(muted ? 0 : volume) * 100}%)`,
                  }}
                />
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
        className={`flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border transition-colors ${
          isPlaying
            ? "border-signal bg-signal/10 text-signal"
            : "border-hair text-mist hover:text-paper"
        }`}
      >
        {showCover ? (
          <img src={track.coverUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <Music size={16} />
        )}
      </button>
    </div>
  );
}
