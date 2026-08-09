# Portfólio — Johannes Mendes

Site reconstruído em **React 19 + Vite + Tailwind CSS v4**, mantendo 100% do conteúdo textual original (textos, títulos, descrições e seções) e corrigindo os problemas de responsividade mobile (overflow horizontal, zoom desregulado e faixas brancas laterais).

## Rodar localmente

```bash
npm install
npm run dev
```

## Gerar build de produção

```bash
npm run build
```
Os arquivos finais ficam em `dist/`. Para publicar, é só arrastar essa pasta para o Netlify (ou qualquer host estático) — ou usar `netlify deploy`.

## Estrutura

```
src/
  components/   -> Navbar, Hero, Marquee, Services, Projects, Milestones, About, Testimonials, Contact, Footer
  data/         -> content.js (todo o texto do site, centralizado — edite aqui para atualizar textos)
  hooks/        -> useReveal.js (animação de entrada ao rolar a página)
public/
  admin.html    -> painel de depoimentos (mantido como estava, sem alterações)
  testimonials.js
```

## O que foi corrigido / melhorado

- **Mobile**: `overflow-x: hidden` em `html` e `body`, `max-width: 100%` em mídia, viewport travado (`maximum-scale=1.0, user-scalable=no`), grid/flex sempre fluido — sem larguras fixas que estourem a tela.
- **Acessibilidade**: foco visível (`:focus-visible`), `aria-label`/`aria-expanded` no menu mobile, `prefers-reduced-motion` respeitado.
- **Design**: sistema de tokens único (cores, tipografia Space Grotesk + Syne + JetBrains Mono), elemento de assinatura (painel "terminal" no hero), grid de projetos ao invés de carrossel (mais robusto em telas pequenas), microinterações discretas.
- **Depoimentos**: continuam lendo o mesmo `localStorage` (`jm_portfolio_testimonials`) usado pelo `/admin.html`, então o painel administrativo continua funcionando sem alterações.
