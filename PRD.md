# 📄 **UPDATED PRD (Principal Engineer Level)**

---

# 1. 🎯 **Problem Statement**

Users struggle to:

* Understand customer datasets
* Extract insights without technical skills
* Get intelligent recommendations

---

# 2. 💡 **Solution Overview**

InsightCart AI Copilot is a **frontend-only AI analytics assistant** that:

* Accepts CSV datasets
* Converts them into structured context
* Feeds data into an LLM via LangChain
* Enables conversational querying + recommendations

👉 Acts like a **“ChatGPT for your dataset”**

---

# 3. 🧠 **Core Concept (IMPORTANT)**

## 🔥 Data → Context → LLM → Memory → Insights

```id="9u06iz"
CSV → Parser → Structured Summary → LangChain → LLM → Response
                               ↑
                           Memory Store
```

---

# 4. 🧱 **System Architecture**

## High-Level

```id="d2q6c3"
React (Vite)
│
├── CSV Upload / Default Dataset
├── Data Processing Layer
├── Context Builder
├── LangChain Wrapper (LLM + Memory)
└── UI (Dashboard + Chat)
```

---

# 5. 🧩 **Key Features**

---

## 5.1 Dataset Handling

### Inputs:

* CSV Upload
* Preloaded Sample Dataset

### Processing:

* Parse using `papaparse`
* Store in memory (JS state + localStorage)

---

## 5.2 Context Builder (CRITICAL COMPONENT)

This is the **brain before LLM**

### Converts raw data → structured insights:

Example output:

```json
{
  "top_products": ["Shoes", "Laptop"],
  "avg_spending_by_age": {
    "20-30": 2500,
    "30-40": 5000
  },
  "gender_distribution": {
    "Male": 60,
    "Female": 40
  }
}
```

👉 This is what you send to LLM (NOT raw CSV)

---

## 5.3 LangChain Integration

### Responsibilities:

* Wrap LLM calls
* Inject context
* Maintain conversation memory

---

## 5.4 Memory System (Frontend)

Use:

* In-memory JS state
* localStorage backup

### Stores:

* Chat history
* Previous queries
* Context summaries

---

## 5.5 Conversational AI (Main Feature)

User can ask:

* “Which product is most popular?”
* “What age group spends the most?”
* “Recommend similar products to Shoes”

---

## 5.6 Recommendation via LLM (NEW APPROACH)

Instead of hardcoding logic:

👉 Let LLM generate recommendations using:

* Context
* Patterns

Prompt example:

```text id="d6oq1y"
Based on the dataset summary, recommend 3 products similar to {product}.
```

---

## 5.7 Visualization Layer

Use:

* `recharts` / `chart.js`

Charts:

* Product popularity
* Age vs spending
* Gender distribution

---

## 5.8 Authentication (Local Only)

* Signup/Login
* Store in localStorage

---

# 6. 🧑‍💻 **User Flow (Updated)**

```id="1bbkzd"
1. User Login
2. Load Default Dataset OR Upload CSV
3. System Processes Data
4. Context Builder Generates Summary
5. User sees Dashboard (charts)
6. User opens AI Chat
7. User asks questions
8. LangChain injects context + memory
9. LLM responds with insights/recommendations
10. Conversation continues
```

---

# 7. 🧠 **Prompt Engineering Design**

## System Prompt:

```text id="ud42of"
You are a data analyst AI assistant.
You are given structured dataset insights.

Answer user queries accurately using ONLY the provided data.
If unsure, say "insufficient data".
```

---

## Input to LLM:

```json
{
  "context": "...summary...",
  "question": "...user query...",
  "history": "...chat memory..."
}
```

---

# 8. 📦 **Tech Stack**

## Frontend:

* Vite + React JS

## Libraries:

* papaparse → CSV parsing
* recharts → visualization
* langchain → LLM orchestration

## Storage:

* localStorage

---

# 9. 📁 **Folder Structure**

```id="9j7z7d"
src/
├── components/
├── pages/
│   ├── Auth.jsx
│   ├── Dashboard.jsx
│   ├── Chat.jsx
├── utils/
│   ├── parser.js
│   ├── contextBuilder.js
├── services/
│   ├── langchainService.js
├── store/
│   ├── useAppState.js
```

---

# 10. ⚠️ **Constraints**

* No backend
* No database
* LLM context size limited
* Large CSV must be summarized

---

# 11. ⚡ **Performance Strategy**

* Limit dataset size (~200 rows)
* Precompute summaries
* Avoid sending full CSV to LLM

---

# 12. 🧪 **Edge Cases**

* Empty dataset
* Invalid CSV
* LLM hallucination → restrict via prompt
* Missing fields

---

# 13. 📈 **Future Scope**

* Vector DB (RAG)
* Backend integration
* Real-time streaming data
* Advanced recommendation models

---

# 14. 🏁 **Success Criteria**

* CSV → processed correctly ✅
* Context generated correctly ✅
* LLM answers correctly using context ✅
* Chat memory works ✅

---


