# Restify Webhook RawBody (TypeScript)

Projeto de exemplo em **Node.js + Restify** escrito em **TypeScript**, para normalizar e inspecionar payloads recebidos via webhook.

O objetivo é garantir que, **independente do formato enviado pelo fornecedor** (JSON válido ou string JSON escapada), a aplicação sempre trabalhe com **um objeto JSON válido** e mantenha variáveis auxiliares para logging e auditoria.

---

## 🚀 Fluxo do `/webhook`

O endpoint `/webhook` garante consistência no processamento:

- Se chegar um JSON normal → continua sendo objeto.
- Se chegar uma string escapada → é convertida em objeto válido.
- Sempre retorna `application/json` com o objeto normalizado.

---

## Como rodar o projeto

```bash
# Instalar dependências
npm install

# Rodar em modo desenvolvimento
npm run dev

# Compilar e rodar em produção
npm run build
npm start
