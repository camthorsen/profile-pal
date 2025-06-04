# FastAPI server: Whisper-tiny + CLIP + Mistral-7B-Instruct
from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel
import io, os, torch
from PIL import Image

from transformers import (
    WhisperProcessor, WhisperForConditionalGeneration,
    CLIPProcessor, CLIPModel,
    AutoTokenizer
)
from llama_cpp import Llama, LlamaGrammar

# ---------- model paths ----------
BASE_DIR = os.path.join(os.path.dirname(__file__), "..", "models")
WHS_PATH  = os.path.join(BASE_DIR, "whisper")
CLIP_PATH = os.path.join(BASE_DIR, "clip")
LLM_PATH  = os.path.join(BASE_DIR, "mistral", "mistral-7b-instruct-v0.2.Q4_K_M.gguf")

# ---------- load Whisper ----------
whisper_processor = WhisperProcessor.from_pretrained(WHS_PATH)
whisper_model = WhisperForConditionalGeneration.from_pretrained(WHS_PATH, use_safetensors=True)

# ---------- load CLIP ----------
clip_processor    = CLIPProcessor.from_pretrained(CLIP_PATH)
clip_model = CLIPModel.from_pretrained(CLIP_PATH, use_safetensors=True)


# ---------- load llama-cpp (Mistral 7B Q4_K) ----------
llm = Llama(
    model_path = LLM_PATH,
    n_ctx      = 4096,
    n_threads  = max(1, os.cpu_count() - 1),
    verbose    = False,
)

app = FastAPI(title="Local Whisper+CLIP+Mistral-7B")

# ---------- response models ----------
class TranscriptionOut(BaseModel):
    text: str
class TagsOut(BaseModel):
    tags: list[str]
class SummaryIn(BaseModel):
    transcription: str
    tags: list[str]
class SummaryOut(BaseModel):
    summary: str

# ---------- endpoints ----------
@app.post("/transcribe", response_model=TranscriptionOut)
async def transcribe(audio_file: UploadFile = File(...)):
    data = await audio_file.read()
    try:
        inputs = whisper_processor(
            data, sampling_rate=16000, return_tensors="pt"
        ).input_features
    except Exception as e:
        raise HTTPException(400, f"Unsupported audio: {e}")
    ids = whisper_model.generate(inputs)
    text = whisper_processor.decode(ids[0], skip_special_tokens=True)
    return {"text": text}

@app.post("/clip_tags", response_model=TagsOut)
async def clip_tags(image_file: UploadFile = File(...)):
    img_bytes = await image_file.read()
    try:
        image = Image.open(io.BytesIO(img_bytes)).convert("RGB")
    except Exception as e:
        raise HTTPException(400, f"Unsupported image: {e}")
    inputs  = clip_processor(images=image, return_tensors="pt")
    logits  = clip_model(**inputs).logits_per_image
    _, idx  = logits.topk(5)
    tags    = [clip_processor.tokenizer.decode([i]) for i in idx[0]]
    return {"tags": tags}

@app.post("/summarize", response_model=SummaryOut)
async def summarize(req: SummaryIn):
    prompt = (
        "<s>[INST] You are a helpful assistant that writes warm, "
        "professional third-person animal adoption profiles (≈2 paragraphs). "
        f"Transcription: \"{req.transcription.strip()}\" "
        f"Tags: {', '.join(req.tags)} "
        "Write the profile now. [/INST]"
    )
    res = llm(
        prompt,
        max_tokens   = 220,
        temperature  = 0.2,
        top_p        = 0.9,
        stop         = ["</s>", "[INST]"],
    )
    summary = res["choices"][0]["text"].strip()
    return {"summary": summary}
