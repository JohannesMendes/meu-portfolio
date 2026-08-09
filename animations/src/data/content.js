export const WHATSAPP_LINK =
  "https://wa.me/553291260615?text=Ol%C3%A1,%20Johannes!%20Achei%20seu%20contato%20atrav%C3%A9s%20do%20seu%20portf%C3%B3lio%20e%20gostaria%20de%20conversar%20sobre%20um%20projeto.";

export const GITHUB_LINK = "https://github.com/JohannesMendes";
export const INSTAGRAM_LINK = "https://www.instagram.com/jocore.digital/";

export const NAV_LINKS = [
  { label: "Serviços", href: "/#servicos" },
  { label: "Sobre", href: "/#sobre" },
  { label: "Projetos", href: "/projetos", isRoute: true },
  { label: "Depoimentos", href: "/#depoimentos" },
];

export const STACK = [
  "React",
  "Next.js",
  "TypeScript",
  "Python",
  "FastAPI",
  "Flutter",
  "Tailwind CSS",
];

export const SERVICES = [
  {
    number: "01",
    title: "Frontend",
    description:
      "Interfaces rápidas e responsivas com React, Next.js e animações que dão vida à experiência do usuário.",
  },
  {
    number: "02",
    title: "Backend",
    description:
      "APIs e arquiteturas robustas com Python/FastAPI, integrações e persistência de dados pensadas para escalar.",
  },
  {
    number: "03",
    title: "UI/UX Design",
    description:
      "Design de produto com identidade própria — sem templates genéricos, priorizando clareza e conversão.",
  },
];

export const PROJECTS = [
  {
    id: "volta-motos",
    title: "Volta — Motos elétricas",
    description:
      "Landing page com foco em imagem premium, velocidade e uma experiência visual moderna para produtos de mobilidade.",
    image: "/volta.png",
    imageAlt: "Preview do site Volta — Motos elétricas de alta performance",
    link: "https://effulgent-marzipan-9adc10.netlify.app/",
    tags: ["React", "Landing Page", "E-commerce"],
  },
];

export const MILESTONES = [
  { number: "1", label: "Projeto em destaque" },
  { number: "Full-Stack", label: "Frontend + Backend + Mobile + Desktop" },
  { number: "Sob Medida", label: "Foco em performance & UX" },
  { number: "Desde 2025", label: "Em atividade contínua" },
];

export const ABOUT_PARAGRAPHS = [
  "Estudante de Engenharia de Software, desenvolvo aplicações completas integrando lógica robusta com experiências visuais fluidas e responsivas.",
  "Busco otimizar a arquitetura e a estabilidade de dados para construir sistemas modulares e limpos, prontos para solucionar desafios digitais reais de alto nível.",
];

export const ABOUT_PHILOSOPHY =
  "Código limpo e design com intenção — nada genérico, nada de template. Cada projeto nasce de um problema real que vale a pena resolver bem.";

export const CORE_STACK = [
  "React",
  "TypeScript",
  "Python",
  "FastAPI",
  "Flutter",
  "Tailwind CSS",
  "UI/UX Design",
  "Marketing Digital",
];

export const TESTIMONIALS_STORAGE_KEY = "jm_portfolio_testimonials";

// Depoimentos padrão — sempre visíveis para QUALQUER visitante do site,
// em qualquer navegador/dispositivo, sem depender do localStorage do
// admin.html (que só existe no navegador onde ele foi cadastrado).
// Para adicionar mais: use /admin.html > "Exportar JSON" e me envie o
// resultado que eu colo aqui.
export const DEFAULT_TESTIMONIALS = [
  {
    id: "855adc82-0ecf-4d55-bdcc-26259a5a51c6",
    quote:
      "Cara, o produto superou demais as minhas expectativas! A entrega foi rápida, a interface é extremamente fluida e me ajudou a otimizar o fluxo de trabalho aqui na agência. Recomendo de olhos fechados para quem busca qualidade profissional.",
    author: "Lucas Silveira",
    role: "",
  },
];
