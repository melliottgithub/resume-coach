# Indeed Jobs Posting Dataset


## EDA and Data Cleaning

Before importing the Indeed dataset into the system, an **Exploratory Data Analysis (EDA)** and **Data Cleaning** process was conducted to ensure the dataset's quality and usability. This analysis was performed in the attached Jupyter Notebook: [`eda.ipynb`](indeed/eda.ipynb).

### Key Objectives
- Analyze the dataset's structure and contents to understand the data distribution and potential issues.
- Identify and handle missing values, duplicates, and irrelevant columns.
- Standardize text data for consistent processing during imports.
- Ensure compatibility with the downstream import process, including token limits and required fields.

### Steps in the Notebook
1. **Data Inspection**:
   - Initial preview of the dataset to understand its structure.
   - Examination of column types, unique values, and missing data.

2. **Data Cleaning**:
   - Dropped unnecessary columns that are not required for import.
   - Imputed or removed rows with missing critical information.
   - Standardized US state names for consistency.

3. **Token Analysis**:
   - Counted tokens in job descriptions using `tiktoken` to verify they fit within the defined token limit (2048).
   - Parsing HTML to Markdown for better text processing.
   - Flagged and removed records exceeding the token limit to prevent processing issues.

4. **Output**:
   - Cleaned dataset saved in CSV format, ready for the CLI import process.

### Usage
To run the notebook:
1. Ensure Jupyter Notebook is installed in your environment.
2. Open the notebook using:
   ```bash
   jupyter notebook eda.ipynb
   ```
3. Execute the cells step by step to review the EDA and cleaning process.

### Prerequisites
- Python dependencies specified in `requirements.txt`.
- The raw Indeed dataset in CSV format.

### Notes
- The cleaned dataset produced by the notebook can be directly used with the CLI tool for importing into the system.
- Visualization and analysis can be extended based on specific requirements.

# CLI for Dataset Import

The **Import CLI** tool allows you to import job postings from an Indeed dataset (in CSV format) into the system. This CLI handles populates DynamoDB table, uploading data to S3, and ensuring the imported text complies with token limits for processing.

### Usage
To run the Import CLI, use the following command:

```bash
python import_cli.py <file_path>
```

### Parameters
- **`file_path`**: The path to the CSV file containing the Indeed job postings to be imported.

### Example
```bash
python import_cli.py data/data_cleaned.csv
```

### Prerequisites
- Ensure AWS credentials are configured for accessing S3 and DynamoDB.
- Install dependencies listed in `requirements.txt` using:
  ```bash
  pip install -r requirements.txt
  ```
- The CSV file should be correctly formatted and contain job descriptions.

### Notes
- The token limit for job descriptions is set to `2048` tokens. Any job exceeding this limit will be skipped.
- Ensure your AWS credentials are valid and complete to avoid runtime errors.