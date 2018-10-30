FROM postgres
ENV POSTGRES_PASSWORD password
COPY schema.sql /docker-entrypoint-initdb.d
COPY users.csv /docker-entrypoint-initdb.d
COPY tasks.csv /docker-entrypoint-initdb.d
COPY bid_task.csv /docker-entrypoint-initdb.d
EXPOSE 5432
