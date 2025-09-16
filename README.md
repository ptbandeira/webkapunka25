# Kapunka — CMS & Guardrails

## Editar conteúdo
- Aceder a `/admin` (Decap).
- Editar Home (títulos/textos/imagens) — preview fiel no painel.
- Sem alterações de layout: apenas conteúdo.

## Preview fiel
O preview carrega a homepage real num iframe e injeta dados com `site/js/cms-preview.js`.
Em produção o loader não atua, a menos que se use `?cms-preview=1`.

## Guardrails
- Alterações em `site/index.html`, `site/about.html`, `site/shop.html`, `site/contact.html`, `site/style.css`, `site/css/*`, `site/js/components.js`, `site/js/script.js` são bloqueadas.
- Para mudar o visual, abrir PR com título começado por `VISUAL:` e anexar antes/depois.

## Rollback rápido
- Existem tags `visual-safe-*`. Para reverter, usar `git revert` ou reset para a tag (apenas com aprovação).

## Estado
- Baseline estável; Decap configurado para Home (safe mapping) e lists (Products, FAQs).
- Próximos passos: About/Shop/Contact no CMS, depois i18n por pastas `site/content/<lang>/pages/`.

## Feature flags & fallbacks
- `learn`, `training`, `clinics`: ligados por defeito em dev, podem ser desligados por env var (`NEXT_PUBLIC_FEATURE_*`).
- `decapPages`: agora ativo por defeito (inclusive em produção) — páginas usam o JSON do Decap quando existe e recuam para o HTML legado / conteúdo markdown quando falta.
- `reviews`: reservado (desligado por defeito).
- `policies` e `cart`: mantêm-se ligados por defeito.

### Painel de dev
- Apenas em dev (`npm run dev`), surge um botão “Dev Flags” no canto inferior direito.
- Permite mudar qualquer flag por browser (grava em `localStorage` + cookie) e força reload para ver o fallback imediatamente.
- “Reset overrides” limpa e volta ao comportamento padrão.
- Em produção o painel não aparece e os overrides ignorados.
