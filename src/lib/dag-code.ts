export const heroCode = `from polyris import DAG, task

with DAG("daily-analytics") as dag:

    @task.lambda_function(function_name="ingest")
    def ingest(): ...

    @task.glue_job(job_name="clean")
    def clean(): ...

    @task.athena_query(database="analytics")
    def aggregate(): ...

    ingest() >> clean() >> aggregate()`
