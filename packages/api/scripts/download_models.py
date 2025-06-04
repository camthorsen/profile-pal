"""
Downloads all three models to ./models/
Run:  poetry run python download_models.py
"""
from huggingface_hub import snapshot_download
from pathlib import Path

MODELS = {
    # FIXME? Exact GGUF file for Mistral-7B-Instruct-v0.2, 4-bit K-quant.
    "mistral":  "TheBloke/Mistral-7B-Instruct-v0.2-GGUF",
    "whisper":  "openai/whisper-tiny.en",
    "clip":     "openai/clip-vit-base-patch32",
}

dest = Path("models")
dest.mkdir(exist_ok=True)

for name, repo in MODELS.items():
    print(f"⏬  downloading {name}: {repo}")
    snapshot_download(
      repo_id=repo, local_dir=dest / name,
      revision="main",
    )
print("✅  all done")
