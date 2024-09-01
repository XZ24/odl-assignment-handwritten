from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
from PIL import Image
import io
import base64

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this if you want to restrict the allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the trained model
model = load_model("model/model.h5")

def preprocess_image(image_data: str):
    image_bytes = base64.b64decode(image_data.split(',')[1])
    img = Image.open(io.BytesIO(image_bytes))
    img = img.resize((28, 28))
    img = img.convert('L')
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

# Prediction route
@app.post("/predict")
async def predict(request: Request):
    data = await request.json()
    if 'image_data' not in data:
        raise HTTPException(status_code=400, detail="Image data is required")
    
    image_data = data['image_data']
    preprocessed_image = preprocess_image(image_data)
    prediction = model.predict(preprocessed_image)
    prediction = prediction.flatten().tolist()
    return JSONResponse(content={'results': prediction})

# Test route
@app.get("/ping")
async def ping():
    return {"message": "Server is running"}

# Home route (for serving a static HTML page)
@app.get("/")
async def index():
    return {"message": "Welcome to FastAPI!"}

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=5000)
