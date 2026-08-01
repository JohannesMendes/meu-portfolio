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

    container.innerHTML = testimonials.map((t) => `
        <div class="testimonial-card">
            <p class="testimonial-quote">"${escapeHTML(t.quote)}"</p>
            <div class="testimonial-author">${escapeHTML(t.author)}${t.role ? ` <span>${escapeHTML(t.role)}</span>` : ""}</div>
        </div>
    `).join("");
}

function escapeHTML(str) {
    const div = document.createElement("div");
    div.textContent = str || "";
    return div.innerHTML;
}
