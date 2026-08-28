import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Lock, Star } from "lucide-react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { db, firebaseReady, storage } from "../lib/firebase";
import { TESTIMONIAL_FORM_PASSWORD } from "../data/content";

export default function EnviarDepoimento() {
  const [rating, setRating] = useState(5);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  // In-memory only, on purpose: no localStorage/sessionStorage. A refresh
  // (or reopening the page) must always start unauthenticated, requiring
  // the password again before a testimonial can be submitted.
  const [unlocked, setUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  function handleUnlock(e) {
    e.preventDefault();
    if (passwordInput === TESTIMONIAL_FORM_PASSWORD) {
      setUnlocked(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!firebaseReady) return;

    const form = e.target;
    const author = form.author.value.trim();
    const role = form.role.value.trim();
    const quote = form.quote.value.trim();
    const photoFile = form.photo.files?.[0];
    if (!author || !quote) return;

    setStatus("sending");

    try {
      let photoUrl = "";
      if (photoFile && storage) {
        const path = `testimonials-photos/${Date.now()}-${photoFile.name}`;
        const fileRef = ref(storage, path);
        await uploadBytes(fileRef, photoFile);
        photoUrl = await getDownloadURL(fileRef);
      }

      await addDoc(collection(db, "testimonials"), {
        author,
        role,
        quote,
        rating,
        photo: photoUrl,
        createdAt: serverTimestamp(),
      });

      setStatus("sent");
      form.reset();
      setRating(5);
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-ink">
      <Navbar />
      <main className="px-5 pb-24 pt-28 sm:px-8 sm:pt-32 lg:px-16">
        <div className="mx-auto max-w-2xl">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 font-mono text-sm text-mist transition-colors hover:text-paper"
          >
            <ArrowLeft size={16} />
            Voltar para a home
          </Link>

          <h1 className="mt-6 font-display text-[clamp(2rem,5vw,3rem)] font-extrabold tracking-tight text-paper">
            Deixe seu <span className="text-signal">depoimento</span>
          </h1>
          <p className="mt-4 text-base leading-relaxed text-mist sm:text-lg">
            Trabalhamos juntos? Conta como foi a experiência. Seu depoimento aparece
            no site assim que você enviar.
          </p>

          {!unlocked ? (
            <form
              onSubmit={handleUnlock}
              className="mt-10 flex flex-col gap-4 rounded-2xl border border-hair bg-panel p-6 sm:p-8"
            >
              <div className="flex items-center gap-2 text-mist">
                <Lock size={18} />
                <span className="text-sm">Página protegida por senha</span>
              </div>
              <p className="text-sm text-mist">
                Peça a senha para o Johannes antes de continuar.
              </p>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setPasswordError(false);
                }}
                autoFocus
                placeholder="Digite a senha"
                className="w-full rounded-lg border border-hair bg-ink px-4 py-3 text-paper outline-none focus:border-white/30"
              />
              {passwordError ? (
                <p className="text-sm text-signal">Senha incorreta. Tenta de novo.</p>
              ) : null}
              <button
                type="submit"
                className="mt-1 inline-flex items-center justify-center rounded-full bg-paper px-7 py-3.5 text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5 sm:text-base"
              >
                Entrar
              </button>
            </form>
          ) : !firebaseReady ? (
            <div className="mt-10 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-6 text-sm leading-relaxed text-mist">
              Formulário ainda não configurado. Preencha{" "}
              <code className="text-paper">FIREBASE_CONFIG</code> em{" "}
              <code className="text-paper">src/data/content.js</code> com as chaves
              do seu projeto Firebase para ativar o envio.
            </div>
          ) : status === "sent" ? (
            <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl border border-hair bg-panel p-10 text-center">
              <CheckCircle2 className="text-signal" size={32} />
              <p className="font-display text-lg font-bold text-paper">
                Depoimento enviado!
              </p>
              <p className="max-w-sm text-sm text-mist">
                Obrigado por dedicar um tempinho — já apareceu na seção de
                depoimentos do site.
              </p>
              <Link
                to="/#depoimentos"
                className="mt-2 text-sm text-paper underline underline-offset-4 hover:text-signal"
              >
                Ver na página
              </Link>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mt-10 flex flex-col gap-5 rounded-2xl border border-hair bg-panel p-6 sm:p-8"
            >
              <div>
                <label htmlFor="author" className="mb-1.5 block text-sm text-mist">
                  Seu nome
                </label>
                <input
                  id="author"
                  name="author"
                  required
                  className="w-full rounded-lg border border-hair bg-ink px-4 py-3 text-paper outline-none focus:border-white/30"
                  placeholder="Ex: Maria Silva"
                />
              </div>

              <div>
                <label htmlFor="role" className="mb-1.5 block text-sm text-mist">
                  O que você faz / empresa (opcional)
                </label>
                <input
                  id="role"
                  name="role"
                  className="w-full rounded-lg border border-hair bg-ink px-4 py-3 text-paper outline-none focus:border-white/30"
                  placeholder="Ex: CEO da Empresa X"
                />
              </div>

              <div>
                <label htmlFor="quote" className="mb-1.5 block text-sm text-mist">
                  Seu depoimento
                </label>
                <textarea
                  id="quote"
                  name="quote"
                  required
                  rows={5}
                  className="w-full resize-y rounded-lg border border-hair bg-ink px-4 py-3 text-paper outline-none focus:border-white/30"
                  placeholder="Conta como foi trabalhar comigo, o que foi feito e o resultado..."
                />
              </div>

              <div>
                <span className="mb-1.5 block text-sm text-mist">Avaliação</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRating(value)}
                      aria-label={`${value} estrela${value > 1 ? "s" : ""}`}
                      className="p-0.5"
                    >
                      <Star
                        size={26}
                        style={{
                          fill: value <= rating ? "var(--color-signal)" : "transparent",
                          color: value <= rating ? "var(--color-signal)" : "var(--color-mist)",
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="photo" className="mb-1.5 block text-sm text-mist">
                  Sua foto (opcional)
                </label>
                <input
                  id="photo"
                  name="photo"
                  type="file"
                  accept="image/*"
                  className="w-full rounded-lg border border-hair bg-ink px-4 py-3 text-sm text-mist file:mr-4 file:rounded-full file:border-0 file:bg-white/10 file:px-4 file:py-1.5 file:text-paper"
                />
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="mt-2 inline-flex items-center justify-center rounded-full bg-paper px-7 py-3.5 text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5 disabled:opacity-60 sm:text-base"
              >
                {status === "sending" ? "Enviando..." : "Enviar depoimento"}
              </button>

              {status === "error" ? (
                <p className="text-sm text-signal">
                  Não consegui enviar agora. Tenta de novo em instantes.
                </p>
              ) : null}
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
