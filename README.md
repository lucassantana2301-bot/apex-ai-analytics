# 🏆 Apex AI Analytics

<p align="center">
  <img src="https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Chart.js-4.5-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white" alt="Chart.js" />
  <img src="https://img.shields.io/badge/Style-Royal%20Espresso%20%26%20Gold-d4af37?style=for-the-badge" alt="Style" />
</p>

> **Apex AI Analytics** é uma plataforma de inteligência preditiva de dados e telemetria de alta performance com resumos executivos automáticos gerados por IA, previsões de tendências com margem de confiança, narração por voz sintética, streaming em tempo real e exportador de apresentações.

---

## 🌟 Principais Funcionalidades

### 1. 🔮 Previsão Preditiva de Tendências (AI Forecast Engine)
- Algoritmo estatístico de regressão linear para projeção de métricas futuras (+1, +2, +3, +4 períodos).
- Cálculo automático de **bandas de confiança superiores e inferiores** para mitigação de riscos.

### 2. 🔊 Narração por Voz da IA (Web Speech Audio Briefing)
- Síntese de voz em tempo real utilizando a API Web Speech para narrar o resumo executivo, anomalias e diretrizes estratégicas.

### 3. 📡 Streaming de Telemetria ao Vivo (Real-Time Simulator)
- Simulação contínua de pacotes de telemetria recebidos em tempo real (atualizando métricas, pontuação de saúde dos dados e gráficos ao vivo).

### 4. 📺 Exportador de Apresentação em Slides (Executive Slide Deck)
- Geração instantânea com 1 clique de apresentações completas em formato HTML/CSS responsivo prontas para reuniões de diretoria.

### 5. 🔀 Studio de Mesclagem de Múltiplos CSVs (Multi-CSV Join)
- Carregamento de duas ou mais tabelas CSV com junção automática (*Inner/Left Join*) com base em chaves compartilhadas (ex: `Order_ID`, `Customer_ID`, `Date`).

### 6. 🤖 Resumo Executivo Autónomo & Chat com IA ("Ask AI")
- Identificação automática de anomalias estatísticas e segmentos dominantes de dados.
- Assistente de chat conversacional para perguntas e respostas em linguagem natural sobre o dataset.

---

## 👑 Estética & Design System

- **Tema Royal Espresso & Imperial Gold**: Fundo profundo em marrom ébano com detalhes e destaques em dourado champagne metálico.
- **Tipografia de Alta Precisão**: Formatação em linha única para métricas financeiras sem quebras indesejadas de texto.
- **Navegação com Scroll Suave**: Scrollbar personalizada em dourado imperial e navegação fluida (*smooth scroll*).

---

## 🏗️ Arquitetura do Projeto

```
ai-data-insights/
├── public/                # Favicon e ativos estáticos
├── src/
│   ├── assets/            # Imagens e logotipos
│   ├── components/        # Componentes reutilizáveis
│   │   ├── Header.tsx             # Barra superior e controles globais
│   │   ├── IntroHero.tsx          # Apresentação estilo Apple/Netflix/F1
│   │   ├── DatasetSelector.tsx    # Seletor e upload de arquivos CSV/JSON
│   │   ├── OverviewCards.tsx      # Cartões de métricas principais
│   │   ├── AiExecutiveSummary.tsx # Resumo executivo e anomalias
│   │   ├── ChartStudio.tsx        # Estúdio visual de gráficos e previsão
│   │   ├── DataGridTable.tsx      # Tabela de registros com busca e ordenação
│   │   ├── DataQualityStudio.tsx  # Auditoria e limpeza automática de dados
│   │   ├── MultiCsvMerger.tsx     # Mesclador de múltiplos CSVs
│   │   └── AiChatDrawer.tsx       # Assistente de chat conversacional
│   ├── data/
│   │   └── sampleDatasets.ts      # Datasets de demonstração pré-carregados
│   ├── services/          # Motores e serviços de lógica
│   │   ├── aiEngine.ts            # Gerador de resumos e respostas IA
│   │   ├── aiVoice.ts             # Síntese de voz Web Speech
│   │   ├── csvParser.ts           # Leitor de arquivos CSV/JSON
│   │   ├── csvMerger.ts           # Algoritmo de cruzamento de tabelas
│   │   ├── forecastEngine.ts      # Motor estatístico de previsão preditiva
│   │   └── slideExporter.ts       # Gerador de slides de apresentação
│   ├── types/
│   │   └── dataset.ts             # Definições de tipos TypeScript
│   ├── App.tsx            # Layout principal e estado global da aplicação
│   ├── index.css          # Design System e temas de cores
│   └── main.tsx           # Ponto de entrada do React
├── index.html             # Estrutura do documento HTML
├── package.json           # Configuração de dependências
├── tsconfig.json          # Configurações do TypeScript
└── vite.config.ts         # Configuração de build do Vite
```

---

## ⚡ Como Executar o Projeto Localmente

### Pré-requisitos
- Node.js (versão 18.x ou superior)
- npm ou yarn

### Passos

1. **Clonar o repositório:**
   ```bash
   git clone https://github.com/lucassantana2301-bot/apex-ai-analytics.git
   cd apex-ai-analytics
   ```

2. **Instalar as dependências:**
   ```bash
   npm install
   ```

3. **Iniciar o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Acessar no navegador:**
   - Abra [http://127.0.0.1:5173/](http://127.0.0.1:5173/)

5. **Construir para produção:**
   ```bash
   npm run build
   ```

---

## 📄 Licença

Este projeto foi desenvolvido com foco em alta performance e design premium.
Sinta-se à vontade para utilizar, modificar e contribuir!

---

<p align="center">
  Desenvolvido com 💛 e IA por <strong>Lucas Santana</strong>
</p>
