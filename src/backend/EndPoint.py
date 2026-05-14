from flask import Flask, request, jsonify
import joblib
import json
import numpy as np

app = Flask(__name__)

# Load model and gene order once at startup
model = joblib.load('six_gene_model.pkl')
with open('six_gene_order.json') as f:
    gene_order = json.load(f)

def get_risk_category(delta_mmse):
    if delta_mmse <= -2:
        return 'High'
    elif delta_mmse < 0:
        return 'Moderate'
    else:
        return 'Low'

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    # Expect a dictionary with key 'expression' containing a list of six values
    expr = data['expression']
    # Convert to numpy array and reshape
    X = np.array(expr).reshape(1, -1)
    # Predict
    delta = model.predict(X)[0]
    risk = get_risk_category(delta)
    return jsonify({
        'predicted_delta_mmse': delta,
        'risk_category': risk
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
