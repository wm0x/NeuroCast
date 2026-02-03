from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import torch
import torch.nn as nn
import numpy as np

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

app = FastAPI()


class NeuroCastModel(nn.Module):
    def __init__(self):
        super(NeuroCastModel, self).__init__()
        self.static_fc = nn.Linear(5, 16) 
        self.lstm = nn.LSTM(input_size=3, hidden_size=16, batch_first=True) # افترضنا 3 ميزات
        # 3. Notes Branch
        self.notes_fc = nn.Linear(512, 16) 
        
        # الدمج
        self.regressor = nn.Linear(16+16+16, 1)

    def forward(self, static, series, notes):
        # --- (مثال تقريبي - استبدله بالخاص بك) ---
        x1 = torch.relu(self.static_fc(static))
        
        _, (h_n, _) = self.lstm(series)
        x2 = h_n[-1] # آخر حالة
        
        x3 = torch.relu(self.notes_fc(notes.float())) # مجرد مثال
        
        combined = torch.cat((x1, x2, x3), dim=1)
        return self.regressor(combined)

# =========================================================
# 2. تحميل الموديل عند بدء التشغيل (Startup Event)
# =========================================================
model = None # المتغير العام

@app.on_event("startup")
def load_trained_model():
    global model
    try:
        print("🔄 Loading model weights...")
        # 1. تهيئة الموديل (تأكد أنك استبدلت الكلاس أعلاه بالكلاس الحقيقي)
        model = NeuroCastModel().to(device)
        
        # 2. تحميل ملف الأوزان المحدد
        weights_path = "NeuroCast_Regression_MAE_1.96.pth"
        checkpoint = torch.load(weights_path, map_location=device)
        
        # التعامل مع طرق الحفظ المختلفة (state_dict vs full model)
        if isinstance(checkpoint, dict) and 'state_dict' in checkpoint:
            model.load_state_dict(checkpoint['state_dict'])
        else:
            model.load_state_dict(checkpoint)
            
        model.eval() # وضع التوقع (مهم جداً)
        print(f"✅ Model loaded successfully from {weights_path}")
        
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        print("⚠️ Please ensure 'NeuroCastModel' class matches your training code exactly.")

# =========================================================
# 3. تعريفات البيانات (Pydantic Models)
# =========================================================

class StaticFeatures(BaseModel):
    age: float
    education_years: float
    gender: int          
    apoe4_carrier: int   
    family_history: int  
    # تأكد أن عدد الحقول هنا يطابق ما يتوقعه الموديل

class VisitData(BaseModel):
    mmse: float
    cdr_sob: float
    hippocampal_vol: float

class PatientRequest(BaseModel):
    static_data: StaticFeatures 
    longitudinal_data: List[VisitData] 
    clinical_notes: str 

# =========================================================
# 4. الـ Endpoint للتوقع
# =========================================================

@app.post("/predict")
async def predict_progression(patient: PatientRequest):
    global model
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded. Check server logs.")

    try:
        # --- (أ) معالجة البيانات الثابتة (Static) ---
        static_input = [
            patient.static_data.age,
            patient.static_data.education_years,
            patient.static_data.gender,
            patient.static_data.apoe4_carrier,
            patient.static_data.family_history
        ]
        # تحويل للقائمة ثم لتينسور
        t_static = torch.tensor([static_input], dtype=torch.float32).to(device)

        # --- (ب) معالجة البيانات الزمنية (Time-Series) ---
        received_visits = patient.longitudinal_data
        processed_data = []
        
        for visit in received_visits:
            processed_data.append([
                visit.mmse, 
                visit.cdr_sob, 
                visit.hippocampal_vol
            ])

        # Padding Logic (تكرار البيانات عند النقص)
        required_visits = 3
        if len(processed_data) < required_visits:
            missing_count = required_visits - len(processed_data)
            first_available_visit = processed_data[0] 
            for _ in range(missing_count):
                processed_data.insert(0, first_available_visit)

        t_series = torch.tensor([processed_data], dtype=torch.float32).to(device)

        # --- (ج) معالجة الملاحظات (Notes) ---
        # ملاحظة: هنا نستخدم أرقام عشوائية كمثال
        # في المشروع الحقيقي يجب استخدام Tokenizer مثل:
        # tokens = tokenizer(patient.clinical_notes, ... )
        t_notes = torch.randint(0, 1000, (1, 512)).float().to(device) 

        # --- (د) التوقع ---
        with torch.no_grad():
            output = model(t_static, t_series, t_notes)
            predicted_value = output.item()

        return {
            "prediction_type": "MMSE Decline Prediction",
            "predicted_value": predicted_value,
            "status": "success",
            "message": "Calculated based on NeuroCast Regression Model"
        }

    except Exception as e:
        # طباعة الخطأ في التيرمينال للمساعدة في الحل
        print(f"Prediction Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))