import uvicorn
from app.config import settings

if __name__ == "__main__":
    print("=" * 60)
    print("🧠 Mental Health Text Analysis API Server")
    print(f"📡 Provider: {settings.LLM_PROVIDER}")
    print(f"🤖 Model: {settings.get_default_model()}")
    print(f"🌐 Running at: http://localhost:{settings.PORT}")
    print(f"📖 Swagger Docs: http://localhost:{settings.PORT}/docs")
    print("=" * 60)
    uvicorn.run("app.api:app", host=settings.HOST, port=settings.PORT, reload=True)
