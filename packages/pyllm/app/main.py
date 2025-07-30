from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any
import os
from llama_cpp import Llama
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Pet Profile LLM Service")

# Pydantic models for request/response
class SummarizeRequest(BaseModel):
    prompt: str
    model: Optional[str] = "tiny" # Default to tiny for speed, but can be overridden in ai-host
    max_tokens: Optional[int] = 150
    temperature: Optional[float] = 0.5
    top_p: Optional[float] = 0.85

class SummarizeResponse(BaseModel):
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
        "service": "Pet Profile LLM Service",
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

@app.post("/summarize", response_model=SummarizeResponse)
async def summarize_profile(request: SummarizeRequest):
    """Generate high-quality pet adoption profiles in a single LLM call"""
    
    # Validate model
    if request.model not in models:
        available_models = list(models.keys())
        raise HTTPException(
            status_code=400,
            detail=f"Model '{request.model}' not available. Available models: {available_models}"
        )

    model = models[request.model]

    try:
        # Enhanced system prompt for high-quality profile generation
        system_prompt = (
            "You are an expert content writer who is creating a brief, engaging pet adoption profile for a pet adoption website. "
            "Do not make assumptions about the animal. Use ONLY the specific facts about the animal provided in the description. "
            "Write a bio for the animal in roughly 2-3 sentences using the third person perspective. Be specific and avoid repetition. "
            "Avoid generic stand-alone descriptions like, 'She is looking for a home where she can be pampered'. "
            "Focus on what makes this animal unique based on the given details. "
            "Do not use the word 'she likes' or 'he likes' in the profile, unless it is explicitly mentioned in the description. "
            "Do not use the word 'she does not like' or 'he does not like' in the profile, unless it is explicitly mentioned in the description. "
        )

        # Build the full prompt with system instruction
        full_prompt = f"<s>[INST] {system_prompt} [/INST] Animal information: {request.prompt}"

        # Generate response with optimized parameters
        response = model(
            full_prompt,
            max_tokens=request.max_tokens,
            temperature=request.temperature,
            top_p=request.top_p,
            stop=["</s>", "[INST]", "\n\n", "\n\n\n", "###"],  # Better stop tokens
        )

        generated_text = response["choices"][0]["text"].strip()

        return SummarizeResponse(
            text=generated_text,
            model=request.model,
            tokens_used=response.get("usage", {}).get("total_tokens")
        )

    except Exception as e:
        logger.error(f"Error generating profile with {request.model}: {e}")
        raise HTTPException(status_code=500, detail=f"Profile generation failed: {str(e)}")
