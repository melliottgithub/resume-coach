from pynamodb.models import Model
from pynamodb.attributes import UnicodeAttribute, UTCDateTimeAttribute
from pynamodb.indexes import AllProjection, GlobalSecondaryIndex

TABLE_NAME = "resume-coach"
TABLE_REGION = "us-east-1"

# Define the Global Secondary Index
class GSI1(GlobalSecondaryIndex):
    class Meta:
        index_name = "GSI1"
        projection = AllProjection()  # Project all attributes

    GSI1_PK = UnicodeAttribute(hash_key=True)  # GSI Partition Key
    GSI1_SK = UnicodeAttribute(range_key=True)  # GSI Sort Key

class SingleTableModel(Model):
    class Meta:
        table_name = TABLE_NAME
        region = TABLE_REGION

    PK = UnicodeAttribute(hash_key=True)  # Partition Key
    SK = UnicodeAttribute(range_key=True)  # Sort Key
    GSI1_PK = UnicodeAttribute()  # Attribute to be used as GSI Partition Key
    GSI1_SK = UnicodeAttribute()  # Attribute to be used as GSI Sort Key

    # Attach the GSI to the model
    gsi1 = GSI1()
    
class UserModel(SingleTableModel):
    user_id = UnicodeAttribute()
    name = UnicodeAttribute()
    email = UnicodeAttribute()
    password = UnicodeAttribute()
    
    @staticmethod
    def get_pk(user_id):
        return f"USER#{user_id}", "USER#"

class JobModel(SingleTableModel):
    job_id = UnicodeAttribute()
    company = UnicodeAttribute()
    job_title = UnicodeAttribute()
    country = UnicodeAttribute()
    city = UnicodeAttribute()
    state = UnicodeAttribute()
    location = UnicodeAttribute()
    last_updated = UTCDateTimeAttribute()
    apply_url = UnicodeAttribute(null=True)
    source_id = UnicodeAttribute(null=True)
    
    @staticmethod
    def get_pk(job_id):
        return f"JOB#{job_id}", "JOB#"
    
class JobApplicationModel(SingleTableModel):
    title = UnicodeAttribute()
    job_app_id = UnicodeAttribute()
    user_id = UnicodeAttribute()
    status = UnicodeAttribute()
    job_id = UnicodeAttribute()
    created_at = UTCDateTimeAttribute()
    
    @staticmethod
    def get_pk(job_app_id):
        return f"JOB_APP#{job_app_id}", "JOB_APP#"
    
    @staticmethod
    def get_gsi1_pk(user_id, created_at, job_app_id):
        sk2 = "JOB_APP#"
        if created_at is not None and job_app_id is not None:
            sk2 = f"JOB_APP#{created_at}#{job_app_id}"
        return f"USER#{user_id}", sk2
