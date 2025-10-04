import os
os.environ["HF_HOME"] = "/tmp"  # prevents huge cache issues on Render

from fastapi import FastAPI, Request
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

app = FastAPI()

model_name = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)

@app.post("/chat")
async def chat(request: Request):
    data = await request.json()
    inputs = tokenizer(data["message"], return_tensors="pt")
    outputs = model.generate(**inputs, max_length=100)
    reply = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return {"reply": reply}