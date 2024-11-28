# Resume Coach Services

This backend service includes the following capabilities:

- **API Development** using **FastAPI** with JWT-based authentication.
- **DynamoDB Integration** for data storage and retrieval.
- **Object Storage** using AWS S3 for handling file uploads and downloads.

## Setup and Installation

### Prerequisites

- Python 3.11+ (howerver older versions could work)
- Docker (for containerized deployment)

### Installation Steps

1. Install dependencies:

    ```bash
    pip install -r requirements.txt
    ```
3. Set up environment variables (see [Environment Variables](#environment-variables)).

4. Run the application in development mode:

    ```bash
    fastapi dev main
    ```

5. Access the API at [http://127.0.0.1:8000](http://127.0.0.1:8000).

## Environment Variables

The project requires the following environment variables:

- `JWT_SECRET`: A secret key used for signing JWT tokens.
- `AWS_ACCESS_KEY_ID`: AWS access key for DynamoDB and S3 operations.
- `AWS_SECRET_ACCESS_KEY`: AWS secret key.
- `AWS_REGION`: AWS region for services.

## Indeed Jobs Posting Dataset

The project includes a Notebook for Exploratory Data Analysis (EDA) and cleaning of the Indeed dataset. The cleaned dataset can be imported using the CLI tool provided.

See [Indeed Jobs Posting Dataset](Indeed-dataset.md) for more details.

## Project Structure

```python
├── agents                # Logic for agents and chatbot functionality
├── api                   # API routes, models, and authentication logic
├── conf                  # Configuration files (YAML)
├── domain                # Business logic for application features
├── dynamodb              # DynamoDB models and repositories
├── indeed                # Logic for handling Indeed datasets and import functionality
├── object_storage_s3     # S3 storage repository
├── services              # Service for business logic
├── import_cli.py         # CLI tool for importing Indeed jobs
├── main.py               # Application entry point
├── requirements.txt      # Python dependencies
├── Dockerfile            # Containerization setup
```
