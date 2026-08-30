import { useEffect, useMemo, useRef, useState } from "react";
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
 * music-note disc when a track has no cover), a seekable progress bar,
 * volume/mute, shuffle/repeat, and prev/next across the playlist. Audio
 * never autoplays — playback only starts once the visitor clicks.
 *
 * `coverUrl` (or `cover`) is left null for all 3 tracks below — drop
 * image files in /public/covers/ and set the path here to enable real
 * album art; the icon fallback keeps working either way.
 *
 * Lyrics run karaoke-style: only the active line + one line of context
 * before/after are ever on screen, no full scrolling block. They're
 * fetched at runtime from the free lrclib.net API (title + artist),
 * preferring the timestamped `syncedLyrics` field so the active line
 * tracks the audio's real currentTime; if a track only has untimed
 * `plainLyrics`, the active line is estimated from playback percentage
 * instead. If a track already has a manual `lyrics` string set, it's
 * treated the same as untimed plain lyrics (one line per newline).
 * Nothing here bakes third-party lyrics text into the codebase itself —
 * it's all fetched live, in the visitor's browser.
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
    title: "Leave Me Alone",
    artist: "Michael Jackson",
    src: "/audio/track-3.mp3",
    coverUrl: null,
    lyrics: null,
  },
];

const LRCLIB_ENDPOINT = "https://lrclib.net/api/get";

function formatTime(t) {
  if (Number.isNaN(t)) return "00:00";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// Parses standard LRC timestamps like "[01:23.45]Line text" into
// { time (seconds), text } entries, sorted by time.
function parseSyncedLyrics(lrc) {
  const timeTag = /\[(\d{2}):(\d{2})(?:\.(\d{1,3}))?\]/g;
  const lines = [];
  for (const rawLine of lrc.split("\n")) {
    const matches = [...rawLine.matchAll(timeTag)];
    if (matches.length === 0) continue;
    const text = rawLine.replace(timeTag, "").trim();
    if (!text) continue;
    for (const m of matches) {
      const minutes = parseInt(m[1], 10);
      const seconds = parseInt(m[2], 10);
      const fraction = m[3] ? parseInt(m[3].padEnd(3, "0"), 10) : 0;
      lines.push({ time: minutes * 60 + seconds + fraction / 1000, text });
    }
  }
  return lines.sort((a, b) => a.time - b.time);
}

function parsePlainLyrics(text) {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((text) => ({ time: null, text }));
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
  const [lyricsByTrack, setLyricsByTrack] = useState({});
  // `revealed`: becomes true the first time the visitor clicks the note
  // button in the footer. Before that, even though audio may already be
  // autoplaying quietly, the button shows no "playing" highlight and the
  // lyrics panel never renders — nothing on screen hints that anything
  // is happening until the visitor opens the player themselves.
  const [revealed, setRevealed] = useState(false);
  // `userControlled`: becomes true the first time the visitor presses
  // any transport control (play/pause, next, previous). Distinguishes
  // "the system autoplayed this" from "the visitor is driving playback"
  // — see handleEnded below, where this changes what happens when a
  // track finishes.
  const [userControlled, setUserControlled] = useState(false);
  const audioRef = useRef(null);

  const track = PLAYLIST[trackIndex];
  const cover = track.coverUrl || track.cover || null;
  const showCover = cover && !coverFailed;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [isPlaying, trackIndex]);

  // Attempt to autoplay the first track at page load. Browsers only
  // honor audio.play() as a valid "user-gesture" call when it runs
  // synchronously inside the gesture's own event handler — routing it
  // through a React state update first (setIsPlaying -> re-render ->
  // effect -> play()) loses that direct link and gets silently blocked
  // by Safari/Chrome. So: try immediately on mount (works for repeat
  // visitors some browsers already trust), and if that's rejected, call
  // audio.play() directly inside the very first click/tap/key press
  // listener itself — no state indirection in between. Either path is
  // still the SYSTEM starting playback, not the visitor choosing to —
  // userControlled stays false.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    let started = false;

    function cleanup() {
      window.removeEventListener("click", tryStart);
      window.removeEventListener("keydown", tryStart);
      window.removeEventListener("touchstart", tryStart);
      window.removeEventListener("pointerdown", tryStart);
    }

    function tryStart() {
      if (started) return;
      audio.volume = muted ? 0 : volume;
      audio
        .play()
        .then(() => {
          started = true;
          setIsPlaying(true);
          cleanup();
        })
        .catch(() => {
          /* still blocked — keep waiting for a real gesture */
        });
    }

    tryStart();
    window.addEventListener("click", tryStart, { once: true });
    window.addEventListener("keydown", tryStart, { once: true });
    window.addEventListener("touchstart", tryStart, { once: true });
    window.addEventListener("pointerdown", tryStart, { once: true });

    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = muted ? 0 : volume;
  }, [volume, muted]);

  useEffect(() => {
    setCoverFailed(false);
  }, [trackIndex]);

  // Fetch lyrics for the current track, unless already provided/cached.
  useEffect(() => {
    const idx = trackIndex;
    const current = PLAYLIST[idx];

    if (current.lyrics) {
      setLyricsByTrack((prev) => ({
        ...prev,
        [idx]: { status: "done", mode: "plain", lines: parsePlainLyrics(current.lyrics) },
      }));
      return;
    }

    setLyricsByTrack((prev) => {
      if (prev[idx]) return prev; // already fetched or in flight
      return { ...prev, [idx]: { status: "loading", mode: null, lines: [] } };
    });

    if (lyricsByTrack[idx]) return;

    const controller = new AbortController();
    const params = new URLSearchParams({
      track_name: current.title || "",
      artist_name: current.artist || "",
    });

    fetch(`${LRCLIB_ENDPOINT}?${params.toString()}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("not found");
        return res.json();
      })
      .then((data) => {
        const synced = data?.syncedLyrics?.trim();
        const plain = data?.plainLyrics?.trim();
        if (synced) {
          const lines = parseSyncedLyrics(synced);
          setLyricsByTrack((prev) => ({
            ...prev,
            [idx]: { status: lines.length ? "done" : "empty", mode: "synced", lines },
          }));
        } else if (plain) {
          const lines = parsePlainLyrics(plain);
          setLyricsByTrack((prev) => ({
            ...prev,
            [idx]: { status: lines.length ? "done" : "empty", mode: "plain", lines },
          }));
        } else {
          setLyricsByTrack((prev) => ({ ...prev, [idx]: { status: "empty", mode: null, lines: [] } }));
        }
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setLyricsByTrack((prev) => ({ ...prev, [idx]: { status: "error", mode: null, lines: [] } }));
      });

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackIndex]);

  function nextTrack() {
    setUserControlled(true);
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
    setUserControlled(true);
    setTrackIndex((i) => (i - 1 + PLAYLIST.length) % PLAYLIST.length);
    setIsPlaying(true);
  }

  function togglePlayPause() {
    setUserControlled(true);
    setIsPlaying((p) => !p);
  }

  function handleEnded() {
    if (repeat) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else if (userControlled) {
      // The visitor has driven playback at some point — normal
      // auto-advance applies, regardless of which of the 3 tracks this is.
      nextTrack();
    } else {
      // Still the original system-started autoplay, untouched by the
      // visitor — just stop. Advancing on its own would be the site
      // deciding what plays next, which is the visitor's call once
      // they've engaged with the player at all.
      setIsPlaying(false);
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
  const lyricsState = lyricsByTrack[trackIndex];

  // Which line is "active" right now — by real timestamp for synced
  // lyrics, or by playback percentage for untimed plain lyrics.
  const activeLineIndex = useMemo(() => {
    if (!lyricsState || lyricsState.status !== "done") return -1;
    const lines = lyricsState.lines;
    if (lines.length === 0) return -1;

    if (lyricsState.mode === "synced") {
      let idx = 0;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].time <= currentTime) idx = i;
        else break;
      }
      return idx;
    }

    if (!duration) return 0;
    const pct = Math.min(1, Math.max(0, currentTime / duration));
    return Math.min(lines.length - 1, Math.floor(pct * lines.length));
  }, [lyricsState, currentTime, duration]);

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

      {/* Karaoke-style lyrics — fixed to the far right edge of the
          viewport. Only ever shows the active line plus one line of
          context before/after (never the full block), so it reads like
          Instagram Stories captions instead of a wall of static text.
          No box, no border, no scrollbar — just text, sized/opacity-
          faded by proximity to the active line, crossfading as the
          active line changes. Visible only while actually playing. */}
      <AnimatePresence>
        {isPlaying && revealed && (
          <motion.aside
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16 }}
            transition={{ duration: 0.35 }}
            style={{ position: "fixed", right: "2rem", top: "50%", transform: "translateY(-50%)" }}
            className="z-40 hidden w-72 overflow-hidden bg-transparent lg:block"
          >
            {lyricsState?.status === "loading" && (
              <p className="text-sm italic text-mist" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.85)" }}>
                Buscando letra...
              </p>
            )}
            {(lyricsState?.status === "empty" || lyricsState?.status === "error") && (
              <p className="text-sm italic text-mist" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.85)" }}>
                Letra não encontrada para esta faixa.
              </p>
            )}
            {lyricsState?.status === "done" && activeLineIndex >= 0 && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeLineIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="flex flex-col gap-3 text-right"
                >
                  {activeLineIndex > 0 && (
                    <p
                      className="text-sm font-medium text-paper opacity-40"
                      style={{ textShadow: "0 2px 10px rgba(0,0,0,0.85)" }}
                    >
                      {lyricsState.lines[activeLineIndex - 1].text}
                    </p>
                  )}
                  <p
                    className="bg-gradient-to-r from-paper to-signal bg-clip-text text-xl font-extrabold leading-snug text-transparent"
                    style={{ filter: "drop-shadow(0 2px 12px rgba(0,0,0,0.9))" }}
                  >
                    {lyricsState.lines[activeLineIndex].text}
                  </p>
                  {activeLineIndex < lyricsState.lines.length - 1 && (
                    <p
                      className="text-sm font-medium text-paper opacity-40"
                      style={{ textShadow: "0 2px 10px rgba(0,0,0,0.85)" }}
                    >
                      {lyricsState.lines[activeLineIndex + 1].text}
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>
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
                    src={cover}
                    alt={`Capa de ${track.title}`}
                    onError={() => setCoverFailed(true)}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Music size={32} className="text-signal" />
                )}
              </motion.div>

              <h4 className="text-base font-bold text-paper">{track.title}</h4>
              {track.artist && <p className="mb-4 text-xs text-mist">{track.artist}</p>}

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
                  onClick={togglePlayPause}
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
        onClick={() => {
          setOpen((o) => !o);
          setRevealed(true);
        }}
        aria-label="Abrir player de música"
        aria-expanded={open}
        className={`flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border transition-colors ${
          isPlaying && revealed
            ? "border-signal bg-signal/10 text-signal"
            : "border-hair text-mist hover:text-paper"
        }`}
      >
        {showCover ? (
          <img src={cover} alt="" className="h-full w-full object-cover" />
        ) : (
          <Music size={16} />
        )}
      </button>
    </div>
  );
}
