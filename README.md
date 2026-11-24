# Caso Claro

Protótipo do Desafio de Inovação YouShop 2027 (Luan Figueiredo de Oliveira).

**Problema:** relatos vagos ("minha venda não apareceu") chegam incompletos a Atendimento, QA e Dev, gerando idas e vindas. A frequência real é hipótese a validar.
**Solução:** guia quem relata com perguntas, monta um caso reproduzível e deixa uma pessoa validar antes de ir à fila.

## O que é real e o que é simulado
- Real: interface, regras (categoria, completude, máscara de e-mail/CPF/telefone) e fila em memória.
- Simulado: a IA (textos por modelo fixo) e todos os dados. Nenhuma integração com a YouShop.
- Nenhum número do protótipo é resultado real.

## Arquivos
`index.html`, `styles.css`, `app.js` (protótipo), `apresentacao.html` (11 slides 16:9; imprimir em PDF, sem margens), `research.md` (pesquisa).

## Executar localmente
`python3 -m http.server 8000` na pasta, depois abrir http://localhost:8000.

## Publicar (GitHub Pages)
Repositório público > subir os arquivos > Settings > Pages > Deploy from a branch > main / root. Para remover: Pages > desativar, ou apagar o repositório. Não há chaves de API no projeto.

## Limitações
Sem backend, sem persistência, sem LLM. Um MVP exigiria servidor chamando um modelo de linguagem, com revisão de LGPD.
