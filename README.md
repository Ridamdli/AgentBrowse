---
description: 
globs: 
alwaysApply: true
---
### **📌 Project Rules for Cursor AI – Backend Development**  

#### **📝 Project Overview:**  
This project is a **web-based AI agent platform**, inspired by **Bolt.new**, that enables users to interact with AI models and visualize their actions in real time.  

#### **🔹 How It Works:**  
1. **Users select an AI agent** (e.g., OpenAI GPT-4o, Claude 3.5, Gemini) via a dropdown menu.  
2. **They enter a task prompt**, and the system processes it through the chosen AI model.  
3. **The left side of the UI** displays the AI's responses and thought process.  
4. **The right side** visualizes the AI's actions (e.g., opening web pages, clicking, scrolling).  

#### **🎯 Backend Responsibilities (Cursor AI's Role):**  
- **User Authentication & Management**  
  - Implement **signup/login with email & OAuth**.  
  - Store **user API keys securely** (e.g., OpenAI, Anthropic).  
  - Maintain a **user dashboard** for managing history and settings.  

- **AI Model Integration & Execution**  
  - Handle **requests to OpenAI, Anthropic, Gemini, etc.**  
  - Validate API keys and **route requests to the selected model**.  
  - Manage **temperature & prompt engineering** for optimal responses.  

- **Task Execution & Action Simulation**  
  - Process tasks and **simulate AI behavior on web pages**.  
  - Use **headless browsers or controlled environments** to render AI actions.  
  - Log actions taken by the AI and provide real-time feedback.  

- **Database & Storage**  
  - Store **user chat history** for later review.  
  - Maintain logs of **AI interactions & browsing actions**.  
  - Ensure **fast retrieval & optimized database queries**.  

- **Scalability & Performance**  
  - Optimize **API requests and caching** for performance.  
  - Implement **asynchronous processing** for real-time AI responses.  
  - Ensure **secure and efficient data handling**.  

### **🔹 Goal:**  
To create a **fast, scalable, and secure backend** that seamlessly connects AI models, executes tasks, and provides real-time action visualization.
