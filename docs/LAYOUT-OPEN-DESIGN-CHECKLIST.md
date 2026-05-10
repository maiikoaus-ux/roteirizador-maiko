# Checklist: aplicar o layout do template (Open Design) ao Roteirizador

Objetivo: **só visual** (cores, tipografia, espaçamentos, hierarquia, estados hover/focus). **Não** alterar lógica de auth, Supabase, `localStorage`, rotas ou nomes de funções — apenas CSS e, quando necessário, **markup mínimo** (classes/`data-*` wrappers) para suportar o layout.

---

## Onde fazer o quê (decisão)

| Onde | O quê |
|------|--------|
| **Open Design** | Iterar o **template** (variações, direção visual, export HTML/ZIP). Usar como **referência** e “mood board” executável. |
| **Cursor / este repo** | **Aplicar** o estilo ao `index.html` real: o teu app tem ~11k linhas, estado, Supabase e `#main` preenchido por JS — isso **não** se substitui por colar o HTML exportado do OD sem quebrar tudo. |

**Conclusão:** faz o polish visual **no OD** se quiseres; **implementa sempre aqui** no Cursor, por secções, copiando **tokens e padrões** (variáveis `:root`, classes utilitárias, blocos de layout) do export do OD, não o ficheiro inteiro por cima do `index.html`.

**Sobre o link `blob:http://127.0.0.1:...`:** é temporário (sessão do browser). **Guarda a referência:** no Open Design usa **Export / Save to disk / ZIP** (ou copia o HTML do artefacto) e coloca no repo, por exemplo:

- `docs/design-reference/template-login.html` (ou o nome que exportares)

Assim o Cursor (e tu) tens ficheiros estáveis para comparar lado a lado.

---

## Pré-requisitos (uma vez)

- [ ] Exportar do Open Design o HTML (ou ZIP) do template desejado para `docs/design-reference/` (nomes claros por ecrã).
- [ ] Abrir o export no browser + abrir o app com `python3 -m http.server` (ou equivalente) para **comparar** visualmente.
- [ ] No `index.html`, identificar blocos por área: auth (`auth-shell`), workspace (`#main` + trello), docs, beat board, cards/colunas — **só anotar**, ainda sem mudar tudo de uma vez.

---

## Ordem sugerida (por partes)

### 1. Design tokens globais (base para tudo)

- [ ] Copiar do template para `:root` (ou bloco equivalente no teu `<style>`): **cores**, **raios**, **sombras**, **fontes** (família, pesos, tamanhos base).
- [ ] Alinhar **body** / fundo geral / texto base com o template.
- [ ] Garantir que **sidebar** e **topbar** herdam os novos tokens sem regressões óbvias.
- [ ] Testar no browser: login (se visível), workspace, scroll — **só olhar**, sem testar integrações.

### 2. Área de login (`auth-shell`)

- [ ] Comparar markup do template de login vs `renderAuthScreen()` / `#auth-shell` no teu ficheiro.
- [ ] Ajustar **CSS** (`.auth-shell`, cartões, inputs, botões primários/secundários, erros).
- [ ] Evitar renomear IDs usados pelo JS de auth; preferir **classes** novas + estilos.
- [ ] Validar: teclado, foco visível, contraste.

### 3. Workspace (lista / board — vista “roteiros”)

- [ ] Toolbar superior do workspace, **breadcrumb** se existir no design.
- [ ] **Colunas** (`.b-col`, headers, “adicionar coluna”).
- [ ] **Cards** no board (borda, sombra, hover, drag handle se estiver só no CSS).
- [ ] **Barra lateral** (`#sidebar`, `.sb-btn`) alinhada ao template (largura expandida, ícones, labels).
- [ ] Testar só layout: grid não partido em larguras 680px / 900px / desktop.

### 4. Docs

- [ ] Shell docs (`.docs-shell`, sidebar de lista, área principal, toolbar).
- [ ] Folha / página (`.docs-page`, sombras de “papel”) conforme template.
- [ ] Estados vazios (“welcome”) com o mesmo tom visual do template.

### 5. Beat Board

- [ ] `.bb-wrap`, toolbar, cartões no canvas — cores e espaçamentos do template.
- [ ] Não alterar a lógica de `renderBeatBoard`; só strings de classes/CSS se o template exigir wrappers mínimos.

### 6. Cards de roteiro / editor (dentro do workspace)

- [ ] Cards na home/lista (`.r-card`, meta, ações).
- [ ] **Editor** / blocos (`.be-card`, `.be-header`, `.rich-editor`, fases início/meio/fim) — alinhar ao design system do template.
- [ ] Botões globais (`.btn`, `.btn-primary`, `.btn-ghost`, `.btn-sm`) para bater certo com o template **em todo o app**.

### 7. Fecho

- [ ] Passar **mobile** (breakpoints já existentes no teu CSS) e ajustar só o necessário.
- [ ] **Print** / PDF: verificar `@media print` não ficou feio com cores novas.
- [ ] Commit por área (`style: auth shell from OD template`, `style: workspace columns`, …) para facilitar revert.

---

## Em cada “parte”, repetir este mini-ciclo

1. **Olhar** o ficheiro em `docs/design-reference/` (ou screenshot do OD).
2. **Extrair** só o necessário: variáveis CSS + regras dos seletores que mapeiam para o teu DOM.
3. **Colar/adaptar** no `index.html` (bloco `<style>`), reutilizando seletores existentes sempre que possível.
4. **Validar** no servidor local (não no preview blob do OD).
5. **Commit** pequeno.

---

## O que **não** fazer nesta fase

- Não trocar o fluxo de **Supabase** / `bootstrapAuth` / `showAuthScreen`.
- Não renomear funções globais usadas em `onclick="..."`.
- Não substituir o `index.html` inteiro pelo export do OD.
- Não contar com o preview do OD para validar cliques ou dados.

---

## Se ficares bloqueado

- Falta referência estável: exporta de novo do OD para `docs/design-reference/`.
- Algum bloco não tem classe estável: adiciona **uma** classe wrapper sem mexer em handlers (ex.: `class="od-theme-workspace"` no container já existente).

Quando tiveres os ficheiros em `docs/design-reference/`, podes pedir no Cursor: “aplica a secção X deste HTML ao meu `index.html`, só CSS”.
