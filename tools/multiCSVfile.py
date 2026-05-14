import polars as pl
import glob
import os

path = '/Users/wm/Desktop/website/neurocast/dataset/Tables_11Feb2026'
all_files = glob.glob(os.path.join(path, "All_Subjects_*.csv"))

key_column = 'RID'

# نبدأ بـ None
combined_lf = None
processed_columns = set()

print(f"Found {len(all_files)} files. Starting Lazy Merge with Streaming...")

for file in all_files:
    filename = os.path.basename(file)
    print(f"Planning: {filename}")
    
    # 1. استخدام scan_csv بدلاً من read_csv (هذا لا يستهلك الذاكرة الآن)
    next_lf = pl.scan_csv(file, ignore_errors=True, infer_schema_length=0)
    
    # الحصول على أسماء الأعمدة فقط (خفيف جداً على الذاكرة)
    next_cols = next_lf.collect_schema().names()
    
    if combined_lf is None:
        combined_lf = next_lf
        processed_columns.update(next_cols)
    else:
        # 2. منطق استبعاد الأعمدة المكررة
        # نحدد الأعمدة التي نريد الاحتفاظ بها (الجديدة فقط + المفتاح)
        cols_to_keep = [key_column]
        for col in next_cols:
            if col not in processed_columns and col != key_column:
                cols_to_keep.append(col)
                processed_columns.add(col)
        
        # نختار الأعمدة المطلوبة فقط من الملف الجديد
        next_lf = next_lf.select(cols_to_keep)
        
        # 3. الدمج باستخدام الصيغة الجديدة (لحل مشكلة DeprecationWarning)
        # نستخدم join مع coalesce=True لدمج مفاتيح الربط
        combined_lf = combined_lf.join(
            next_lf, 
            on=key_column, 
            how="full", 
            coalesce=True
        )

print("-" * 30)
print("Processing and Saving... (This might take a moment)")

output_path = '/Users/wm/Desktop/website/neurocast/dataset/Alzheimers_Multimodal_Combined.csv'

# 4. التغيير الجوهري: sink_csv
# هذه الدالة تقوم بتنفيذ الخطة وحفظ الملف مباشرة للقرص
# دون تحميل الجدول كاملاً في الذاكرة!
combined_lf.sink_csv(output_path)

print(f"Success! Saved to: {output_path}")