# Roteirizador Maiko Costa — deploy estático

## Conteúdo

- **`index.html`** — aplicação única (HTML + CSS + JS). Use este ficheiro como entrada no GitHub Pages ou qualquer hospedagem estática.
- **`roteirizador-maiko-costa-v1.15.html`** — cópia espelho do mesmo código (útil para histórico de versão).

O **logo já está incorporado** como SVG inline (`window.APP_LOGO_DATA_URL`): não é obrigatório enviar `logo-maiko-costa.png`. **Opcional:** coloque `logo-maiko-costa.png` na mesma pasta que `index.html`; ao abrir a app num servidor estático (HTTP/HTTPS), o ficheiro é lido e substitui o SVG; o nome pode ser alterado com `window.APP_LOGO_PNG_NAME` antes do carregamento. Em `file://` o `fetch` ao PNG pode falhar conforme o navegador — nesse caso defina `window.APP_LOGO_DATA_URL` no `<head>` ou sirva a pasta com um servidor local. Para outra marca sem PNG, substitua o valor no script em `<head>` e mantenha `data-app-logo="1"` nas tags `<img>` do logo para o export offline atualizar corretamente.

## GitHub Pages

1. Publique na raiz do branch `gh-pages` ou **Settings → Pages** com pasta `/ (root)` ou `/docs`.
2. Garanta que `index.html` está na pasta servida.

## Offline e rede

- **Fontes**: Google Fonts via `@import` (requer internet na primeira vista).
- **Import .docx / export PDF**: carrega scripts de CDN sob demanda.
- **IA** (opcional): chamadas a APIs externas; chaves podem ficar armazenadas em `localStorage` no navegador.

## Anónimo / primeiro uso

Sem dados prévios, o app inicializa estado vazio (ou exemplo conforme código). Persistência só no `localStorage` do domínio.

## Próximos passos sugeridos (login + backend)

1. Substituir `sGet` / `sSet` / `persistRoteiro` / `persistDocsStore` por um módulo `apiClient` (REST ou similar) mantendo o formato dos objetos.
2. Autenticação: token em `sessionStorage` ou cookie `HttpOnly` via backend.
3. Sanitização rica no servidor para conteúdos HTML guardados na base de dados.
4. Testes manuais em mobile (layout ainda depende de `overflow` global e viewports variados).
