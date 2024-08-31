import modal
import numpy as np
from tensorflow.keras.models import load_model
from PIL import Image
import io
import base64
from flask import Flask, render_template, request, jsonify

# 创建 Modal stub
stub = modal.Stub()

# 定义一个 Modal 函数，用于加载模型并进行预测
@stub.function()
def load_and_predict(image_data):
    # 加载模型（假设模型已保存在某个公共存储位置）
    model = load_model("model/model.h5")
    
    # 处理图像数据
    image_bytes = base64.b64decode(image_data.split(',')[1])
    img = Image.open(io.BytesIO(image_bytes))
    img = img.resize((28, 28))
    img = img.convert('L')
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    
    # 模型预测
    prediction = model.predict(img_array)
    return prediction.flatten().tolist()

# 创建 Flask 应用
app = Flask(__name__)

# Flask 路由，用于处理预测请求
@app.route('/predict', methods=['POST'])
def predict():
    image_data = request.json['image_data']
    
    # 调用 Modal 函数进行预测
    with stub.run():
        prediction = load_and_predict.call(image_data)
    
    return jsonify({'results': prediction})

# Flask 路由，渲染主页
@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
