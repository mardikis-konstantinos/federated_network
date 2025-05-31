import pandas as pd

csv_path = "healthcare_dataset.csv"
df = pd.read_csv(csv_path)

chunk_size = 1
for i in range(0, 100, chunk_size):
    chunk = df.iloc[i : i + chunk_size]
    file_num = i // chunk_size + 1
    excel_filename = f"dataset{file_num}.xlsx"
    chunk.to_excel(excel_filename, index=False)
