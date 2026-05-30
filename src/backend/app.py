from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import joblib
import os

app = Flask(__name__)
CORS(app)

GENE_ORDER = [
    "11762936_x_at", "200024_PM_at", "11762358_at",
    "11763188_a_at", "11757278_x_at", "11764118_at"
]

GENE_META = {
    "11762936_x_at": {"symbol": "AQP7", "role": "harmful", "coef": -0.598, "default": 3.75, "min_val": 2.5, "max_val": 5.5},
    "200024_PM_at": {"symbol": "RPS5", "role": "harmful", "coef": -0.447, "default": 11.25, "min_val": 9.5, "max_val": 13.0},
    "11762358_at": {"symbol": "CHD2", "role": "harmful", "coef": -0.293, "default": 8.25, "min_val": 6.0, "max_val": 11.0},
    "11763188_a_at": {"symbol": "SNX5", "role": "protective", "coef": 0.441, "default": 8.30, "min_val": 6.0, "max_val": 10.0},
    "11757278_x_at": {"symbol": "ASS1", "role": "harmful", "coef": -0.328, "default": 7.50, "min_val": 5.0, "max_val": 10.0},
    "11764118_at": {"symbol": "Unchar", "role": "harmful", "coef": -0.462, "default": 4.00, "min_val": 2.0, "max_val": 7.0},
}

COHORT_MEANS = {p: GENE_META[p]["default"] for p in GENE_ORDER}
COHORT_SDS   = {p: (GENE_META[p]["max_val"] - GENE_META[p]["min_val"]) / 6 for p in GENE_ORDER}

model_path = os.path.join(os.path.dirname(__file__), "six_gene_model.pkl")
if os.path.exists(model_path):
    model = joblib.load(model_path)
else:
    model = None
    print("⚠️ تحذير: ملف six_gene_model.pkl غير موجود، سيتم استخدام الحساب اليدوي.")

def get_risk_details(delta_mmse):
    if delta_mmse <= -2.0:
        return {
            "category": "High Risk", "code": "high", "color": "#EF4444",
            "description": "Predicted rapid cognitive decline (≥2 MMSE points over 12 months). Priority clinical review advised.",
            "monitoring": "3 months", "threshold": "< -2.0"
        }
    elif delta_mmse < 0.0:
        return {
            "category": "Moderate Risk", "code": "moderate", "color": "#F59E0B",
            "description": "Predicted mild cognitive decline. Standard monitoring and cognitive rehabilitation referral considered.",
            "monitoring": "6 months", "threshold": "-2.0 to 0.0"
        }
    else:
        return {
            "category": "Low Risk (Stable)", "code": "low", "color": "#10B981",
            "description": "Predicted cognitive stability. Annual review appropriate.",
            "monitoring": "12 months", "threshold": "≥ 0.0"
        }

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json
        expr_values = data.get("expression", [])
        
        if len(expr_values) != 6:
            return jsonify({"error": "يجب إرسال 6 قيم للجينات"}), 400

        X = np.array(expr_values, dtype=float).reshape(1, -1)

        if model is not None:
            raw_delta_mmse = float(model.predict(X)[0])
            scaler = model.steps[0][1] 
            X_scaled = scaler.transform(X)[0]
        else:
            X_scaled = np.array([
                (expr_values[i] - COHORT_MEANS[p]) / max(COHORT_SDS[p], 0.01)
                for i, p in enumerate(GENE_ORDER)
            ])
            coefs = np.array([GENE_META[p]["coef"] for p in GENE_ORDER])
            raw_delta_mmse = float(np.dot(X_scaled, coefs))

        delta_mmse = round(max(-30.0, min(10.0, raw_delta_mmse)), 3)
        
        coefs = np.array([GENE_META[p]["coef"] for p in GENE_ORDER])
        contribs = X_scaled * coefs
        
        gene_contributions = []
        for i, p in enumerate(GENE_ORDER):
            gene_contributions.append({
                "symbol": GENE_META[p]["symbol"],
                "contribution": float(contribs[i]),
                "weight": float(coefs[i]),
                "expression": float(expr_values[i])
            })

        risk_info = get_risk_details(delta_mmse)

        response_data = {
            "predicted_delta_mmse": delta_mmse,
            "composite_risk_score": abs(delta_mmse),
            "risk_stratification": risk_info,
            "gene_contributions": gene_contributions,
            "model_info": {
                "loocv_mae": 1.388,
                "training_cohort": "ADNI-GO (n=96)"
            },
            "status": "success"
        }

        return jsonify(response_data), 200

    except Exception as e:
        print("Error during prediction:", str(e))
        return jsonify({"error": "حدث خطأ داخلي في الخادم: " + str(e)}), 500

if __name__ == "__main__":
    app.run(port=5000, debug=True)