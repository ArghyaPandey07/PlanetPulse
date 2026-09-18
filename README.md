# 🌍 PlanetPulse

PlanetPulse is an AI-ready carbon footprint tracking application that helps users monitor daily activities, understand their environmental impact, and stay within weekly CO₂ targets.

## ✨ Features

- Log activities such as car travel, bus travel, flights, electricity usage, and meals.
- Automatic CO₂ calculation using fixed emission factors.
- Dashboard with total emissions and category breakdown.
- Weekly CO₂ target and progress tracking.
- Notifications when the weekly target is exceeded.
- Activity history with type and date filters.
- Input validation for unrealistic quantities.

## 🛠️ Tech Stack

### Frontend
- React
- TypeScript
- Vite

### Backend
- Node.js
- Express
- TypeScript
- Vitest

## 📊 Emission Factors

| Activity | Factor |
|---|---:|
| Car | 0.20 kg/km |
| Bus | 0.08 kg/km |
| Flight | 0.25 kg/km |
| Electricity | 0.80 kg/kWh |
| Vegetarian meal | 0.5 kg/meal |
| Non-vegetarian meal | 2.0 kg/meal |

## 🚀 Running Locally

### Backend

```bash
cd backend
npm install
npm run dev
```

Backend runs at:

`http://localhost:3001`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## 🔌 API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Health check |
| POST | `/api/activities` | Log activity |
| GET | `/api/activities` | Get activity history |
| GET | `/api/dashboard` | Dashboard summary |
| GET | `/api/weekly` | Weekly progress |
| PUT | `/api/settings/target` | Update weekly target |

## 🧠 Design Decisions

1. **Target exceeded:** Show a supportive warning and progress information rather than blocking users.
2. **Unrealistic quantities:** Reject absurd values and ask users to split genuine large journeys into multiple entries.
3. **Weekly tracking:** Use a Monday–Sunday week to calculate progress consistently.

## 🧪 Testing

The backend includes unit and integration tests covering:

- CO₂ calculations
- Input validation
- Aggregation
- Weekly progress
- API endpoints

## 🏆 Hackathon

**Hackathon ID:** `[ADD OFFICIAL HACKATHON ID HERE]`

Track: Real-World AI Products — PlanetPulse

## 📄 License

This project was created for a hackathon.