download-models:
	poetry run python scripts/download_models.py

serve:
	poetry run uvicorn api_app.main:app --host 0.0.0.0 --port 8000

MISTRAL_DIR=models/mistral
MISTRAL_BASE=https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.2-GGUF/resolve/main

.PHONY: remove-bins
remove-bins:
	rm -f models/mistral/pytorch_model.bin
	rm -f models/whisper/pytorch_model.bin
	rm -f models/clip/pytorch_model.bin

.PHONY: mistral-download
mistral-download:
	mkdir -p $(MISTRAL_DIR)
	cd $(MISTRAL_DIR) && \
  curl -L -H "Accept: application/octet-stream" -O $(MISTRAL_BASE)/model.safetensors

WHISPER_DIR=models/whisper
WHISPER_BASE=https://huggingface.co/openai/whisper-tiny/resolve/main

.PHONY: whisper-download
whisper-download:
	mkdir -p $(WHISPER_DIR)
	cd $(WHISPER_DIR) && \
  curl -L -H "Accept: application/octet-stream" -O $(CLIP_BASE)/model.safetensors && \
	curl -O $(WHISPER_BASE)/config.json && \
	curl -O $(WHISPER_BASE)/preprocessor_config.json && \
	curl -O $(WHISPER_BASE)/tokenizer.json && \
	curl -O $(WHISPER_BASE)/vocab.json && \
	curl -O $(WHISPER_BASE)/merges.txt

CLIP_DIR=models/clip
CLIP_BASE=https://huggingface.co/laion/CLIP-ViT-B-32-laion2B-s34B-b79K/resolve/main

.PHONY: clip-download
clip-download:
	mkdir -p $(CLIP_DIR)
	cd $(CLIP_DIR) && \
  curl -L -H "Accept: application/octet-stream" -O $(CLIP_BASE)/model.safetensors && \
	curl -O $(CLIP_BASE)/config.json && \
	curl -O $(CLIP_BASE)/preprocessor_config.json && \
	curl -O $(CLIP_BASE)/tokenizer.json && \
	curl -O $(CLIP_BASE)/vocab.json && \
	curl -O $(CLIP_BASE)/merges.txt
