from flask import Flask, render_template, request, jsonify
import numpy as np
from PIL import Image
import io
import base64
import pickle
import tensorflow as tf

app = Flask(__name__)

# 从 pickle 文件中加载模型架构和权重
with open("model/model.pkl", "rb") as f:
    model_data = pickle.load(f)

# 重新构建模型
model = tf.keras.models.model_from_json(model_data["model_json"])
model.set_weights(model_data["model_weights"])

def preprocess_image(image_data):
    image_bytes = base64.b64decode(image_data.split(',')[1])
    img = Image.open(io.BytesIO(image_bytes))
    img = img.resize((28, 28))
    img = img.convert('L')
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

# 预测路由
@app.route('/predict', methods=['POST'])
def predict():
    image_data = request.json['image_data']
    preprocessed_image = preprocess_image(image_data)
    prediction = model.predict(preprocessed_image)
    prediction = prediction.flatten().tolist()
    return jsonify({'results': prediction})

# 主页路由
@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
