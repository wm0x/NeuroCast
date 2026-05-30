# NeuroCast 🧠

![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)

**Real-Time Prediction of Alzheimer's Disease Progression Using Multimodal Clinical Data**

## 📖 Project Overview

**NeuroCast** is an advanced multimodal deep learning system developed to address the critical challenge of managing Alzheimer's disease. The platform predicts the progression of the disease—specifically forecasting the **Delta MMSE** (Mini-Mental State Examination) score—to indicate cognitive decline or stability over time.

Unlike standard clinical assessments, NeuroCast fuses diverse clinical and genetic biomarkers through a sophisticated deep learning architecture to provide neurologists with personalized progression trajectories. 

### ✨ Key Features

* **Multimodal Fusion Architecture:** Integrates diverse datasets including patient demographics (age, gender, education) and specific gene expressions (AQP7, RPS5, CHD2, SNX5, ASS1).
* **Advanced Deep Learning Models:** Utilizes a combination of CNN and LSTM networks to process complex longitudinal data, optimized with custom loss functions and rigorous dataset merging using Pandas.
* **Clinical Dashboard:** A responsive, real-time interface for doctors to input patient visit data, track historical MMSE scores, and generate AI-driven clinical trends.
* **Delta Prediction:** Focuses on predicting the *change* in cognitive capability (Delta MMSE), providing a clear clinical trend rather than just a static diagnostic classification.
* **Seamless API Integration:** Connects the interactive Next.js frontend to a dedicated AI backend for real-time inference and database syncing via Prisma.

---

## 🛠️ Tech Stack

**Frontend & Dashboard:**
* **Framework:** [Next.js](https://nextjs.org) (React)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **Database ORM:** Prisma

**AI & Data Science Backend:**
* **Architecture:** Multimodal Deep Learning (CNN & LSTM)
* **Data Processing:** Python & Pandas 
* **API:** RESTful architecture for model inference

---

## 🎓 Academic Context

NeuroCast was developed as a comprehensive university graduation project bridging the gap between Artificial Intelligence, Software Engineering, and healthcare. The project was completed under the academic supervision of **Dr. Syed**.

---

## 🚀 Getting Started

This is a [Next.js](https://nextjs.org) project bootstrapped with `create-next-app`.

### Prerequisites

Ensure you have one of the following package managers installed: `npm`, `yarn`, `pnpm`, or `bun`.

### Installation

1. **Clone the repository:**
```bash

   npm install
   # or yarn install / pnpm install

   npx prisma generate
   npx prisma db push