from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
from PIL import Image
import io
import base64

app = Flask(__name__)
CORS(app)


# Load the trained model
model = load_model("model/model.h5")

def preprocess_image(image_data):
    image_bytes = base64.b64decode(image_data.split(',')[1])
    img = Image.open(io.BytesIO(image_bytes))
    img = img.resize((28, 28))
    img = img.convert('L')  
    img_array = np.array(img) / 255.0  
    img_array = np.expand_dims(img_array, axis=0)  
    return img_array

# Prediction route
@app.route('/predict', methods=['POST'])
def predict():
    image_data = request.json['image_data']
    preprocessed_image = preprocess_image(image_data)
    prediction = model.predict(preprocessed_image)
    prediction = prediction.flatten().tolist()
    return jsonify({'results': prediction})

# Test route
@app.route('/ping', methods=['GET'])
def ping():
    return jsonify({'message': 'Server is running'})

# Home route
@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
    # app.run(debug=True)
