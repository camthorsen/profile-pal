from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from PIL import Image
import torch
from transformers import CLIPProcessor, CLIPModel
import io

app = FastAPI()

TAGS = [
    "cat", "dog", "hamster", "rabbit", "bird", "fish", "turtle", "snake", "lizard",
    "long-hair", "short-hair", "medium-hair"
]

model = None
processor = None


@app.on_event("startup")
def load_model():
    global model, processor
    model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
    processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")


@app.post("/tag")
async def tag_image(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image.")

    image_data = await file.read()
    try:
        image = Image.open(io.BytesIO(image_data)).convert("RGB")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image: {e}")

    inputs = processor(text=TAGS, images=image, return_tensors="pt", padding=True)
    with torch.no_grad():
        outputs = model(**inputs)
        logits_per_image = outputs.logits_per_image  # shape: [1, len(TAGS)]
        scores = logits_per_image.softmax(dim=1).squeeze().tolist()

    results = [
        {"label": tag, "score": float(score)}
        for tag, score in sorted(zip(TAGS, scores), key=lambda x: x[1], reverse=True)
        if score > 0.01
    ]
    return JSONResponse(content=results)
