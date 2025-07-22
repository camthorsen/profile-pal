from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any
import os
from llama_cpp import Llama
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Flexible LLM Service")

# Pydantic models for request/response
class GenerateRequest(BaseModel):
    prompt: str
    model: Optional[str] = "zephyr"  # Default model
    max_tokens: Optional[int] = 220
    temperature: Optional[float] = 0.2
    top_p: Optional[float] = 0.9
    stop: Optional[list[str]] = ["</s>", "[INST]"]
    system_prompt: Optional[str] = None

class GenerateResponse(BaseModel):
    text: str
    model: str
    tokens_used: Optional[int] = None

# Model configurations
MODEL_CONFIGS = {
    "zephyr": {
        "model_path": "/app/models/zephyr/zephyr-7b-beta.Q4_K_M.gguf",
        "n_ctx": 4096,
        "n_threads": max(1, os.cpu_count() - 1),
    },
    "mistral": {
        "model_path": "/app/models/mistral/mistral-7b-instruct-v0.2.Q4_K_M.gguf",
        "n_ctx": 4096,
        "n_threads": max(1, os.cpu_count() - 1),
    },
    "tiny": {
        "model_path": "/app/models/tiny/tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf",
        "n_ctx": 2048,
        "n_threads": max(1, os.cpu_count() - 1),
    }
}

# Global model instances
models: Dict[str, Llama] = {}

@app.on_event("startup")
async def load_models():
    """Load all configured models on startup"""
    logger.info("Loading LLM models...")

    for model_name, config in MODEL_CONFIGS.items():
        try:
            if os.path.exists(config["model_path"]):
                logger.info(f"Loading {model_name} model...")
                models[model_name] = Llama(
                    model_path=config["model_path"],
                    n_ctx=config["n_ctx"],
                    n_threads=config["n_threads"],
                    verbose=False,
                )
                logger.info(f"✅ {model_name} model loaded successfully")
            else:
                logger.warning(f"⚠️  Model file not found: {config['model_path']}")
        except Exception as e:
            logger.error(f"❌ Failed to load {model_name} model: {e}")

    if not models:
        logger.error("❌ No models loaded successfully!")
    else:
        logger.info(f"🎉 Loaded {len(models)} models: {list(models.keys())}")

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Flexible LLM Service",
        "available_models": list(models.keys()),
        "port": 7862
    }

@app.get("/models")
async def list_models():
    """List available models"""
    return {
        "available_models": list(models.keys()),
        "model_configs": MODEL_CONFIGS
    }

@app.post("/generate", response_model=GenerateResponse)
async def generate_text(request: GenerateRequest):
    """Generate text using the specified model"""

    # Validate model
    if request.model not in models:
        available_models = list(models.keys())
        raise HTTPException(
            status_code=400,
            detail=f"Model '{request.model}' not available. Available models: {available_models}"
        )

    model = models[request.model]

    try:
        # Build the prompt
        if request.system_prompt:
            full_prompt = f"<s>[INST] {request.system_prompt} [/INST] {request.prompt}"
        else:
            full_prompt = request.prompt

        # Generate response
        response = model(
            full_prompt,
            max_tokens=request.max_tokens,
            temperature=request.temperature,
            top_p=request.top_p,
            stop=request.stop,
        )

        generated_text = response["choices"][0]["text"].strip()

        return GenerateResponse(
            text=generated_text,
            model=request.model,
            tokens_used=response.get("usage", {}).get("total_tokens")
        )

    except Exception as e:
        logger.error(f"Error generating text with {request.model}: {e}")
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")

@app.post("/summarize")
async def summarize_profile(request: GenerateRequest):
    """Specialized endpoint for generating pet adoption profiles"""

    system_prompt = (
        "You are a helpful assistant that writes warm, professional third-person animal adoption profiles. "
        "Write 1-2 paragraphs that capture the animal's personality, appearance, and behavior. "
        "Be concise but engaging. Focus on what makes this animal special and adoptable."
    )

    # Override the request with profile-specific settings
    profile_request = GenerateRequest(
        prompt=request.prompt,
        model=request.model,
        max_tokens=200,  # Increased for better summaries
        temperature=0.3,  # Slightly higher for more creative writing
        top_p=0.9,
        stop=["</s>", "[INST]", "\n\n\n"],  # Stop on multiple newlines to prevent repetition
        system_prompt=system_prompt
    )

    return await generate_text(profile_request)

@app.post("/improve")
async def improve_text(request: GenerateRequest):
    """Specialized endpoint for improving text quality"""

    system_prompt = (
        "You are an expert editor. Rewrite the following text to read more naturally, "
        "with better grammar, spelling, and flow while preserving the original meaning."
    )

    # Override the request with improvement-specific settings
    improve_request = GenerateRequest(
        prompt=request.prompt,
        model=request.model,
        max_tokens=request.max_tokens or 128,
        temperature=0.3,
        top_p=0.9,
        stop=["</s>", "[INST]"],
        system_prompt=system_prompt
    )

    return await generate_text(improve_request)
