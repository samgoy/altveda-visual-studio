#!/bin/bash
# AltVeda Visual Studio — Kaggle Notebook Setup
# Run in Kaggle Notebook (GPU enabled)

set -e

echo "=== AltVeda Visual Studio Setup ==="

# System deps
apt-get update -qq
apt-get install -y -qq ffmpeg python3-pip git > /dev/null 2>&1

# Python deps
pip install -q torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
pip install -q diffusers transformers accelerate scipy pillow opencv-python
pip install -q cogvideox mochi-ltxtv 2>/dev/null || echo "Models not on pip, install from source"
pip install -q real-esrgan
pip install -q openai-whisper

# Node deps
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y -qq nodejs > /dev/null 2>&1
npm install -g remotion @remotion/cli ffmpeg

# Clone repo (optional — skip if running manually)
# git clone https://github.com/<your-org>/altveda-visual-studio.git /kaggle/working/altveda-visual-studio
# cd /kaggle/working/altveda-visual-studio
# npm install

echo "=== Setup Complete ==="
echo "GPU: $(nvidia-smi --query-gpu=name --format=csv,noheader)"
echo "VRAM: $(nvidia-smi --query-gpu=memory.total --format=csv,noheader)"