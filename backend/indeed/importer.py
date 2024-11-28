import csv
import time
from typing import Callable
from domain.jobs import Address
from services.service import JobApplicationService
from . import parsing

def filter_by_job_title(job_title: str) -> bool:
    keywords = ['software', 'engineer', 'product manager', 'data', 'developer']
    return any(term in job_title.lower() for term in keywords)

def import_indeed_jobs(file_path: str, token_limit: int, token_counter: Callable):
    job_service = JobApplicationService()

    row_count = 0
    skip_count = 0
    start_time = time.time()

    with open(file_path, mode='r', encoding='utf-8') as file:
        csv_reader = csv.reader(file)
        headers = next(csv_reader)  # Skip the header row
        
        for row in csv_reader:
            record, html_content = parsing.parse_row(row, headers)
          
            """
            if not filter_by_job_title(record['job_title']):
                skip_count += 1
                continue
            """
            
            markdown = parsing.html_to_markdown(html_content)
            tokens = token_counter(markdown)
            
            if tokens > token_limit:
                record_id = record.get('id', 'unknown')
                print(f'Record ID {record_id} exceeded token limit: {tokens}')
                skip_count += 1
                continue
            
            # create a new job
            job = job_service.add_or_update_job(
                company=record['company'],
                job_title=record['job_title'],
                address=Address(
                    country=record['country'],
                    city=record['city'],
                    state=record['state'],
                    location=record['location']
                ),
                apply_url=record['apply_url'],
                source_id=f"indeed-{record['id']}",
                last_updated=record['last_updated'],
                description=markdown
            )

            row_count += 1
            if row_count % 1000 == 0:
                print(f'Processed {row_count} rows')

    print(f'\nProcessed {row_count} rows, skipped {skip_count} rows')
    print(f'Time taken: {time.time() - start_time:.2f} seconds')
