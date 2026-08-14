from fastapi import FastAPI
from app.routes import router

app = FastAPI(title='Smart Internship Finder AI Service', version='0.1.0')
app.include_router(router)

@app.get('/health', tags=['Health'])
def health_check():
    return {'status': 'ok', 'service': 'smart-internship-finder-ai', 'message': 'AI service is healthy'}
