




## If no CPU for torch is available, you can use the following command to install the CPU version of PyTorch:

```bash
$ poetry add torch --platform macosx_10_9_x86_64
```
(Replace `macosx_10_9_x86_64` with your platform)

or 

```bash
pip install --upgrade torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
```

## Run the FastAPI Server on port 8000:

```bash
poetry run uvicorn api_app.main:app --host 0.0.0.0 --port 8000
```
