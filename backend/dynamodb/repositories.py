from typing import List, Optional, Tuple
from uuid import UUID
from domain.applications import JobApplication, JobApplicationRepository
from inject import Injector
from domain.jobs import Address, Job, JobRepository
from domain.users import User, UserRepository
from .models import SingleTableModel, JobApplicationModel, UserModel, JobModel

def create_tables():
    if not SingleTableModel.exists():
        print(f"Creating DynamoDB table: {SingleTableModel.Meta.table_name}",
              f"in region {SingleTableModel.Meta.region}...")
        SingleTableModel.create_table(billing_mode='PAY_PER_REQUEST', wait=True)

class UserRepositoryImpl(UserRepository):
    def save(self, user: User) -> None:
        PK, SK = UserModel.get_pk(user.id.hex)
        user_model = UserModel(
            PK=PK,
            SK=SK,
            GSI1_PK=user.email,
            GSI1_SK="USER#",
            user_id=user.id.hex,
            name=user.name,
            email=user.email,
            password=user.password
        )
        user_model.save()
        
    def _map_from_model(self, user_model: UserModel) -> User:
        return User(
            id=UUID(user_model.user_id),
            name=user_model.name,
            email=user_model.email,
            password=user_model.password
        )

    def get_by_id(self, user_id: str) -> User:
        PK, SK = UserModel.get_pk(user_id)
        user_model = UserModel.get(PK, SK)
        return self._map_from_model(user_model)

    def update(self, user: User) -> None:
        PK, SK = UserModel.get_pk(user.id.hex)
        user_model = UserModel.get(PK, SK)
        user_model.update(actions=[
            UserModel.password.set(user.password),
        ])

    def delete_by_id(self, user_id: str) -> None:
        PK, SK = UserModel.get_pk(user_id)
        user_model = UserModel.get(PK, SK)
        user_model.delete()
        
    def get_by_email(self, email: str) -> User:
        user_models = UserModel.gsi1.query(email, UserModel.GSI1_SK == "USER#")
        for user_model in user_models:
            return self._map_from_model(user_model)
        return None
    
class JobRepositoryImpl(JobRepository):
    def save(self, job: Job) -> None:
        PK, SK = JobModel.get_pk(job.id.hex)
        job_model = JobModel(
            PK=PK,
            SK=SK,
            GSI1_PK=job.source_id,
            GSI1_SK="JOB#",
            job_id=job.id.hex,
            company=job.company,
            job_title=job.job_title,
            country=job.address.country,
            city=job.address.city,
            state=job.address.state,
            location=job.address.location,
            last_updated=job.last_updated,
            apply_url=job.apply_url,
            source_id=job.source_id
        )
        job_model.save()
        
    def _map_from_model(self, job_model: JobModel) -> Job:
        return Job(
            id=UUID(job_model.job_id),
            company=job_model.company,
            job_title=job_model.job_title,
            address=Address(
                country=job_model.country,
                city=job_model.city,
                state=job_model.state,
                location=job_model.location
            ),
            last_updated=job_model.last_updated,
            apply_url=job_model.apply_url,
            source_id=job_model.source_id
        )

    def get_job_by_id(self, job_id: str) -> Job:
        PK, SK = JobModel.get_pk(job_id)
        job_model = JobModel.get(PK, SK)
        return self._map_from_model(job_model)

    def list_jobs(self, limit, last_key_value: Optional[str] = None) -> Tuple[List[Job], Optional[str]]:
        last_evaluated_key = {"PK": {"S": last_key_value}, "SK": {'S': 'JOB#'}} if last_key_value else None
        filter_condition = JobModel.SK == "JOB#"
        job_models = JobModel.scan(filter_condition=filter_condition, limit=limit,
                                   last_evaluated_key=last_evaluated_key)
        jobs = list([self._map_from_model(job_model) for job_model in job_models])
        last_evaluated_key = job_models.last_evaluated_key['PK']['S'] if job_models.last_evaluated_key else None
        return jobs, last_evaluated_key

    def delete_job_by_id(self, job_id: str) -> bool:
        PK, SK = JobModel.get_pk(job_id)
        job_model = JobModel.get(PK, SK)
        job_model.delete()
        return True

    def get_by_source_id(self, source_id: str) -> Job:
        job_models = JobModel.gsi1.query(source_id, JobModel.GSI1_SK == "JOB#")
        for job_model in job_models:
            return self._map_from_model(job_model)
        return None
    
class JobApplicationRepositoryImpl(JobApplicationRepository):
    def save(self, job_application: JobApplication) -> None:
        PK, SK = JobApplicationModel.get_pk(job_app_id=job_application.id.hex)
        GSI1_PK, GSI1_SK = JobApplicationModel.get_gsi1_pk(user_id=job_application.user_id.hex,
                                                           created_at=job_application.created_at,
                                                           job_app_id=job_application.id.hex)
        job_application_model = JobApplicationModel(
            PK=PK,
            SK=SK,
            GSI1_PK=GSI1_PK,
            GSI1_SK=GSI1_SK,
            title=job_application.title,
            job_app_id=job_application.id.hex,
            user_id=job_application.user_id.hex,
            status=job_application.status.value,
            job_id=job_application.job_id.hex,
            created_at=job_application.created_at
        )
        job_application_model.save()
        
    def _map_from_model(self, job_application_model: JobApplicationModel) -> JobApplication:
        return JobApplication(
            id=UUID(job_application_model.job_app_id),
            title=job_application_model.title,
            job_id=UUID(job_application_model.job_id),
            user_id=UUID(job_application_model.user_id),
            status=job_application_model.status,
            created_at=job_application_model.created_at
        )

    def get_by_id(self, job_application_id: UUID) -> Optional[JobApplication]:
        PK, SK = JobApplicationModel.get_pk(job_app_id=job_application_id.hex)
        job_application_model = JobApplicationModel.get(PK, SK)
        return self._map_from_model(job_application_model)

    def list_applications(self, user_id: UUID, limit) -> List[JobApplication]:
        GSI1_PK, GSI1_SK = JobApplicationModel.get_gsi1_pk(user_id=user_id.hex, created_at=None, job_app_id=None)
        SK_filter = JobApplicationModel.GSI1_SK.startswith(GSI1_SK)
        job_application_models = JobApplicationModel.gsi1.query(GSI1_PK, SK_filter,
                                                                scan_index_forward=False, limit=limit)
        return [self._map_from_model(job_application_model) for job_application_model in job_application_models]

    def delete_by_id(self, job_application_id: UUID) -> bool:
        job_application_model = JobApplicationModel.get(job_application_id)
        job_application_model.delete()
        return True
    
Injector.register(UserRepository, UserRepositoryImpl)
Injector.register(JobRepository, JobRepositoryImpl)
Injector.register(JobApplicationRepository, JobApplicationRepositoryImpl)