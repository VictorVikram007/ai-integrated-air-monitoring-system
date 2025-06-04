
#  AI-Integrated Air Monitoring System

An advanced air quality monitoring platform leveraging AI and real-time data to ensure environmental health and safety. This project uses **Supabase** for backend storage and a web-based frontend to display air quality indicators.

---



##  Features

-  **Real-Time Air Quality Monitoring** – Displays live AQI data from sensors.
-  **AI-Powered Analytics** – Uses machine learning models to predict and analyze trends.
-  **Supabase Integration** – Cloud database support with authentication.
-  **Interactive Dashboard** – Real-time charts and sensor data visualizations.
-  **Historical Data Tracking** – Access past air quality records and trends.
-  **Health Alert Notifications** – Get alerts when AQI crosses hazardous levels.

---

##  Project Structure

```

.
├── public/                # Public assets (images, scripts)
├── src/                   # Source code (components, logic)
├── supabase/              # Supabase backend configs
├── .gitignore             # Ignored files
├── README.md              # This file
├── bun.lockb              # Bun package lock file
├── components.json        # UI components
├── eslint.config.js       # ESLint settings
├── index.html             # Main HTML entry point
├── package-lock.json      # NPM package lock file

````

---

##  Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/VictorVikram007/ai-integrated-air-monitoring-system.git
cd ai-integrated-air-monitoring-system
````

### 2. Install Dependencies

```bash
npm install
```

### 3. Supabase Setup

* Create a free account at [Supabase](https://supabase.com)
* Create a new project
* Get your `URL` and `anon key` from the API section

Create a `.env` file in the root directory and add:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
```

### 4. Run the Application

```bash
npm run dev
```

---

##  AI Integration

The system is designed to support Python-based machine learning models that can:

* Predict AQI levels
* Detect pollution patterns
* Recommend ventilation actions

*ML model integration is under development using Flask API support.*

---

##  Tech Stack

* **Frontend**: HTML, CSS, JavaScript
* **Backend**: Supabase (PostgreSQL, Auth, API)
* **ML/AI**: Python (Scikit-learn, Pandas)
* **Tools**: Node.js, ESLint, Bun

---

##  Future Improvements

*  Mobile-responsive design
*  MQTT or WebSocket sensor data streaming
*  Advanced ML inference model
*  Report generation and export
*  PWA (Progressive Web App) support

---

##  Contributors

* [Victor Vikram](https://github.com/VictorVikram007) – Developer, Designer, AI Research

---

##  License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

##  Acknowledgements

* [Supabase](https://supabase.com)
* [OpenAQ](https://openaq.org)
* [OpenAI](https://openai.com)
* Community sensor data libraries and APIs

---

> *“Clean air is not a luxury. It's a right. Let’s monitor it smartly.”*

```

