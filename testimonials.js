/**
 * testimonials.js
 * ---------------------------------------------------------------------
 * Camada de dados dos depoimentos, compartilhada entre:
 *  - index.html   (apenas lê e renderiza os depoimentos cadastrados)
 *  - admin.html   (lê, adiciona, edita e remove depoimentos)
 *
 * IMPORTANTE — leia antes de usar em produção:
 * Este site é 100% estático (sem backend), então os depoimentos ficam
 * salvos no localStorage do NAVEGADOR onde você usou o /admin.html.
 * Isso significa que só você vê o que cadastrou ali — os visitantes do
 * site não vão ver automaticamente, porque cada navegador tem seu
 * próprio localStorage isolado.
 *
 * Para publicar os depoimentos para todo mundo, use o botão "Exportar
 * JSON" no painel admin e cole o resultado na constante
 * DEFAULT_TESTIMONIALS abaixo — esses sim aparecem para qualquer
 * visitante, em qualquer navegador. Se no futuro você quiser que o
 * cadastro pelo /admin.html já valha para todos os visitantes sem essa
 * etapa manual, é necessário um backend (ex: FastAPI + banco de dados)
 * para guardar os depoimentos num servidor em vez do navegador.
 * ---------------------------------------------------------------------
 */

const TESTIMONIALS_STORAGE_KEY = "jm_portfolio_testimonials";

// Depoimentos padrão, visíveis para QUALQUER visitante do site.
// Vazio até que você cole aqui um export real do painel /admin.html.
const DEFAULT_TESTIMONIALS = [];

function getTestimonials() {
    try {
        const raw = localStorage.getItem(TESTIMONIALS_STORAGE_KEY);
        if (!raw) return [...DEFAULT_TESTIMONIALS];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [...DEFAULT_TESTIMONIALS];
    } catch (err) {
        console.error("Não foi possível ler os depoimentos salvos:", err);
        return [...DEFAULT_TESTIMONIALS];
    }
}

function saveTestimonials(list) {
    localStorage.setItem(TESTIMONIALS_STORAGE_KEY, JSON.stringify(list));
}

function addTestimonial({ quote, author, role }) {
    const list = getTestimonials();
    list.push({
        id: (crypto.randomUUID ? crypto.randomUUID() : String(Date.now())),
        quote: quote.trim(),
        author: author.trim(),
        role: (role || "").trim()
    });
    saveTestimonials(list);
    return list;
}

function deleteTestimonial(id) {
    const list = getTestimonials().filter((t) => t.id !== id);
    saveTestimonials(list);
    return list;
}

// ---------------------------------------------------------------------
// Curtidas dos depoimentos (botão de like)
// Assim como os depoimentos, o site é estático: o "curti" de cada
// visitante fica salvo só no localStorage do navegador dele. Não existe
// uma contagem global compartilhada entre visitantes sem um backend.
// ---------------------------------------------------------------------
const TESTIMONIAL_LIKES_STORAGE_KEY = "jm_portfolio_testimonial_likes";

function getLikedTestimonialIds() {
    try {
        const raw = localStorage.getItem(TESTIMONIAL_LIKES_STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : {};
        return (parsed && typeof parsed === "object" && !Array.isArray(parsed)) ? parsed : {};
    } catch (err) {
        console.error("Não foi possível ler as curtidas salvas:", err);
        return {};
    }
}

function setTestimonialLiked(id, liked) {
    const likes = getLikedTestimonialIds();
    if (liked) {
        likes[id] = true;
    } else {
        delete likes[id];
    }
    localStorage.setItem(TESTIMONIAL_LIKES_STORAGE_KEY, JSON.stringify(likes));
}

/**
 * Renderiza os depoimentos dentro de um container no index.html.
 * Se não houver nenhum cadastrado, mostra um estado vazio elegante
 * em vez de depoimentos fictícios.
 */
function renderTestimonials(containerSelector, emptyStateSelector) {
    const container = document.querySelector(containerSelector);
    const emptyState = document.querySelector(emptyStateSelector);
    if (!container) return;

    const testimonials = getTestimonials();

    if (testimonials.length === 0) {
        container.innerHTML = "";
        if (emptyState) emptyState.style.display = "block";
        return;
    }

    if (emptyState) emptyState.style.display = "none";

    const likedIds = getLikedTestimonialIds();

    container.innerHTML = testimonials.map((t) => {
        const baseCount = Number.isFinite(t.likes) ? t.likes : 0;
        const liked = likedIds[t.id] === true;
        const heartId = `heart-${t.id}`;

        return `
        <div class="testimonial-card">
            <p class="testimonial-quote">"${escapeHTML(t.quote)}"</p>
            <div class="testimonial-footer">
                <div class="testimonial-author">${escapeHTML(t.author)}${t.role ? ` <span>${escapeHTML(t.role)}</span>` : ""}</div>
                <div class="testimonial-like-button">
                    <input class="on" id="${heartId}" data-testimonial-id="${t.id}" type="checkbox" ${liked ? "checked" : ""} />
                    <label class="like" for="${heartId}">
                        <svg class="testimonial-like-icon" fill-rule="nonzero" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z"></path>
                        </svg>
                        <span class="testimonial-like-text">Curtir</span>
                    </label>
                    <span class="testimonial-like-count one">${baseCount}</span>
                    <span class="testimonial-like-count two">${baseCount + 1}</span>
                </div>
            </div>
        </div>
    `;
    }).join("");

    container.querySelectorAll(".testimonial-like-button input[type=\"checkbox\"]").forEach((input) => {
        input.addEventListener("change", () => {
            setTestimonialLiked(input.dataset.testimonialId, input.checked);
        });
    });
}

function escapeHTML(str) {
    const div = document.createElement("div");
    div.textContent = str || "";
    return div.innerHTML;
}
