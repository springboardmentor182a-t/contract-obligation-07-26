FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .

RUN python -m pip install --upgrade pip

# Install CPU-only PyTorch (no NVIDIA/CUDA packages)
RUN pip install --default-timeout=1000 --retries=10 \
    --index-url https://download.pytorch.org/whl/cpu \
    torch

# Install remaining dependencies
RUN pip install --default-timeout=1000 --retries=10 -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]