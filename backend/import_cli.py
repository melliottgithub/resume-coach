import boto3
from botocore.exceptions import PartialCredentialsError
import tiktoken
import argparse
from dynamodb.repositories import create_tables
import object_storage_s3.repositories as object_storage
from indeed.importer import import_indeed_jobs

def create_s3_client():
    try:
        return boto3.client('s3')
    except PartialCredentialsError:
        print('Incomplete credentials provided.')
        exit(1)

def token_counter(text: str) -> int:
    encoding = tiktoken.encoding_for_model('gpt-4o-mini')
    return len(encoding.encode(text))

TOKEN_LIMIT = 2048

def main():
    create_s3_client()
    parser = argparse.ArgumentParser(description='Import Indeed jobs from a CSV file.')
    parser.add_argument('file_path', type=str, help='Path to the CSV file to import')
    args = parser.parse_args()
    
    create_tables()

    import_indeed_jobs(args.file_path, TOKEN_LIMIT, token_counter)
    
if __name__ == '__main__':
    main()