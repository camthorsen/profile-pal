# app/main.py
from fastapi import FastAPI, UploadFile, File
import whisper
import tempfile

app = FastAPI()

# Load tiny model once at startup.
# The 'tiny' Whisper model will automatically be downloaded if it is not already present in the cache
# (usually ~/.cache/huggingface).
model = whisper.load_model("tiny")

@app.post("/audio/transcribe")
async def transcribe_audio(audio: UploadFile = File(...)):
    # Save uploaded file to a temporary file
    with tempfile.NamedTemporaryFile(delete=True, suffix=".webm") as tmp:
        tmp.write(await audio.read())
        tmp.flush()

        # Run transcription
        result = model.transcribe(tmp.name)
        return {"transcript": result["text"]}
