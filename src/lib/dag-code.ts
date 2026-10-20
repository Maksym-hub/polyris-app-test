export const heroCode = `from polyris import DAG, task

with DAG("daily-analytics", schedule="@daily") as dag:

    @task.lambda_(function_name="ingest")
    def ingest(): ...

    @task.glue(job_name="clean")
    def clean(): ...

    @task.athena(
        database="analytics",
        query_string="SELECT count(*) FROM clean_events",
    )
    def aggregate(): ...

    ingest >> clean >> aggregate`
