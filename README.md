# Sentinel AI

A production-grade anomaly detection pipeline for identifying fake reviews using machine learning and rule-based heuristics. Built with FastAPI backend, React frontend, and scikit-learn ML models.

## 🚀 Features

- **Real-time Review Analysis**: Instant detection of suspicious review patterns
- **Hybrid Detection Engine**: Combines ML predictions with rule-based checks for high accuracy
- **Modern Web Interface**: Interactive React frontend with 3D visualizations
- **RESTful API**: Clean FastAPI endpoints for easy integration
- **Docker Deployment**: Containerized backend for seamless deployment
- **Scalable Architecture**: Modular design supporting multiple ML models

## 🛠 Tech Stack

### Backend
- **FastAPI**: High-performance async web framework
- **scikit-learn**: Machine learning models for anomaly detection
- **Joblib**: Model serialization and loading
- **Pydantic**: Data validation and settings management

### Frontend
- **React 19**: Modern UI framework with hooks
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Three.js**: 3D graphics and animations
- **Framer Motion**: Smooth animations and transitions

### ML Engine
- **scikit-learn**: SVM classifier with TF-IDF vectorization
- **Pandas**: Data manipulation and preprocessing
- **NumPy**: Numerical computations

## 📋 Prerequisites

- Python 3.12+
- Node.js 18+
- Docker (optional, for containerized deployment)

## 🔧 Installation & Setup

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the FastAPI server:
   ```bash
   python main.py
   ```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:3000`

### Docker Deployment

For the backend:
```bash
cd backend
docker build -t sentinel-ai .
docker run -p 8000:8000 sentinel-ai
```

## 📖 Usage

### Web Interface

1. Open the frontend at `http://localhost:3000`
2. Enter a review text in the input field
3. Click "Analyze" to get instant results
4. View the anomaly score and verdict

### API Usage

Send a POST request to `/api/v1/analyze`:

```bash
curl -X POST "http://localhost:8000/api/v1/analyze" \
     -H "Content-Type: application/json" \
     -d '{"review_text": "Amazing product! Best ever! Buy now!"}'
```

Response:
```json
{
  "is_anomaly": true,
  "anomaly_score": 0.9924,
  "verdict": "Deceptive Content Detected"
}
```

## 🏗 Project Structure

```
fake-review/
├── backend/
│   ├── Dockerfile
│   ├── main.py                 # FastAPI application entry point
│   ├── requirements.txt
│   ├── api/
│   │   └── v1/
│   │       ├── endpoints.py    # API routes and logic
│   │       └── schema.py       # Pydantic models
│   ├── core/
│   │   ├── config.py           # Application settings
│   │   └── security.py         # CORS and security setup
│   └── ml-engine/
│       ├── artifacts/          # Trained models and preprocessors
│       └── src/
│           ├── predict.py      # Prediction utilities
│           ├── preprocess.py   # Data preprocessing
│           └── train.py        # Model training scripts
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── public/
│   └── src/
│       ├── App.tsx             # Main React component
│       ├── index.css
│       ├── main.tsx            # React entry point
│       └── ...
└── README.md
```

## 🔍 API Documentation

### Endpoints

- `GET /` - Health check
- `POST /api/v1/analyze` - Analyze review text

### Request/Response Schemas

**ReviewRequest:**
```typescript
{
  review_text: string
}
```

**ReviewResponse:**
```typescript
{
  is_anomaly: boolean,
  anomaly_score: number,
  verdict: string
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with FastAPI, React, and scikit-learn
- Inspired by the need for trustworthy online reviews
- Special thanks to the open-source ML community</content>
<parameter name="filePath">c:\Users\Akash\OneDrive\Desktop\fake-review\README.md
