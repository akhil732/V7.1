# Vāgdhenu Sanskrit Chant TTS Setup & Architecture Guide

## Overview
Vāgdhenu is a neural Sanskrit metered chant synthesis system developed by **Prof. Prathosh** at the Indian Institute of Science (IISc), Bengaluru. It converts classical Sanskrit verses (in Devanagari or Indic scripts) into tradition-faithful metrical recitation (pārāyaṇa) audio at 24kHz.

---

## 1. System Requirements
- **Python:** 3.10+
- **GPU:** NVIDIA GPU with CUDA 12.1+ (RTX 3090, RTX 4090, A100, V100 recommended with ≥10GB VRAM)
- **Disk Space:** ~6.5 GB for model weights

---

## 2. Installing Vagdhenu Backend
```bash
# Clone the official Vagdhenu repository
cd /opt
git clone https://github.com/prathoshap/vagdhenu.git
cd vagdhenu

# Install Python dependencies
pip install --no-cache-dir -r requirements.txt

# Download pre-trained model weights (IndicF5 DiT + BigVGAN-v2 + Vocab + Bank)
bash scripts/download_weights.py

# Verify local CLI render
python src/render.py --shard examples/sample_shard.json --outdir /tmp/test_out
```

---

## 3. Environment Variables
Add to your `.env` configuration:
```env
VAGDHENU_PATH=/opt/vagdhenu
VAGDHENU_WEIGHTS=/opt/vagdhenu/models
VAGDHENU_BANK=/opt/vagdhenu/src/reference_bank/bank.json
```

---

## 4. API Endpoints

### `POST /api/vagdhenu/chant`
- **Request Body:**
  ```json
  {
    "text": "वक्रतुण्ड महाकाय सूर्यकोटिसमप्रभ ।\nनिर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥",
    "meter": "AUTO",
    "seed": 60
  }
  ```
- **Response Headers:**
  - `Content-Type: audio/wav`
  - `x-detected-meter: anuṣṭubh`
- **Response Body:** Binary WAV audio stream (24kHz Mono 16-bit PCM).

### `POST /api/vagdhenu/detect-meter`
- **Request Body:**
  ```json
  {
    "text": "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन"
  }
  ```
- **Response JSON:**
  ```json
  {
    "meter": "anuṣṭubh",
    "syllables": 16,
    "lines": 1,
    "recognized": true
  }
  ```

---

## 5. Architecture Pipeline
1. **Script & Sandhi Normalization:** Devanagari is converted via Kannada phonemic routing to ensure no Hindi schwa-deletion occurs.
2. **Chandas Auto-Detection:** Analyzes syllable count (Laghu/Guru weight) and matches against the 20+ metrical patterns (Anuṣṭubh, Upajāti, Vasantatilakā, Śārdūlavikrīḍita, etc.).
3. **IndicF5 DiT Inference:** Diffusion Transformer with flow-matching generates high-resolution mel-spectrograms conditioned on the reference prosody bank.
4. **BigVGAN-v2 Vocoder:** Translates mel-spectrograms into 24kHz audio waveform.
5. **Fallback Resilience:** If running in an environment without GPU model weights, the system invokes a 24kHz Vedic chant acoustic synthesizer ensuring 100% uptime for end-user interactions.
