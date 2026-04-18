# AI-Integrated Air Monitoring System

An advanced air quality monitoring platform leveraging AI and real-time data to ensure environmental health and safety. This project uses Supabase for backend storage and a web-based frontend to display air quality indicators.

---

## Features

- Real-Time Air Quality Monitoring – Displays live AQI data from sensors  
- AI-Powered Analytics – Uses machine learning models to predict and analyze trends  
- Supabase Integration – Cloud database support with authentication  
- Interactive Dashboard – Real-time charts and sensor data visualizations  
- Historical Data Tracking – Access past air quality records and trends  
- Health Alert Notifications – Alerts when AQI crosses hazardous levels  

---

## Database & SQL Usage

The system uses Supabase (PostgreSQL) as the backend database to store and manage real-time sensor data.

- Designed relational schema for:
  - Sensor readings (PM2.5, PM10, temperature, gas levels)  
  - Device metadata  
  - AQI prediction outputs  
- Implemented SQL queries for:
  - Real-time data insertion from IoT devices  
  - Time-based filtering (latest readings, hourly/daily trends)  
  - Aggregation using AVG, MAX, MIN for AQI analysis  
- Used JOIN operations to combine sensor data with AI predictions  
- Enabled efficient querying for dashboard visualization and analytics  

This ensures scalable, structured, and efficient handling of environmental data.

---

##  AI / Machine Learning Integration

The system integrates machine learning models for predictive analytics:

- AQI prediction using regression models  
- Trend analysis on historical sensor data  
- Anomaly detection for sudden pollution spikes  

Planned integration:
- Flask-based API for real-time ML inference  
- Model retraining using incoming sensor data  

Libraries used:
- Scikit-learn  
- Pandas  
- NumPy  

---

##  Cloud & Deployment Approach

The system is designed with cloud scalability in mind:

- Backend services can be deployed on AWS EC2 for compute  
- Sensor and historical data storage can be extended using AWS S3  
- Supabase provides managed PostgreSQL with REST APIs for fast integration  
- Architecture supports real-time data flow from IoT devices to cloud backend  

**Note:** Full AWS deployment is planned as a future enhancement.

---

##  System Architecture

IoT Sensors (ESP32)  
→ Data Collection  
→ Backend API  
→ Supabase (PostgreSQL Database)  
→ AI Processing Layer  
→ Frontend Dashboard (Visualization)

This pipeline enables real-time monitoring, prediction, and visualization of air quality data.

---

##  Tech Stack

- Frontend: HTML, CSS, JavaScript  
- Backend: Supabase (PostgreSQL, Auth, API)  
- ML/AI: Python (Scikit-learn, Pandas, NumPy)  
- Tools: Node.js, ESLint, Bun  

---

## 📁 Project Structure

```
ai-integrated-air-monitoring-system/
│
├── public/                # Public assets (images, scripts)
├── src/                   # Source code (components, logic)
├── supabase/              # Supabase backend configs
│
├── .gitignore             # Ignored files
├── README.md              # Documentation
├── bun.lockb              # Bun package lock file
├── components.json        # UI components
├── eslint.config.js       # ESLint settings
├── index.html             # Main HTML entry point
├── package-lock.json      # NPM package lock file
```

## ⚙️ Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/VictorVikram007/ai-integrated-air-monitoring-system
cd ai-integrated-air-monitoring-system
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Supabase Setup
- Create a free account at https://supabase.com  
- Create a new project  
- Get your URL and anon key  

Create a `.env` file and add:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
```

### 4. Run the Application
```bash
npm run dev
```

---

## 🔮 Future Improvements

- Mobile-responsive design  
- MQTT / WebSocket real-time streaming  
- Advanced ML inference models  
- Report generation and export  
- Progressive Web App (PWA) support  

---

## 👨‍💻 Contributor

**Vikram Balaji** – Developer, Designer, AI Research  

---

## 🙌 Acknowledgements

- Supabase  
- OpenAQ  
- OpenAI  
- Community sensor datasets and APIs  

---

> “Clean air is not a luxury. It's a right. Let’s monitor it smartly.”
