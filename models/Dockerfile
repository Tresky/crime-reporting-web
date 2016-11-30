from library/postgres

ENV POSTGRES_USER crime_user
ENV POSTGRES_DB crime
EXPOSE 5432


# RUN pg_createcluster 9.3 main --start
# RUN /etc/init.d/postgresql start

# USER postgres
# RUN ls /var/run/postgresql
 # bash

# RUN echo "host all  all    0.0.0.0/0  md5" >> /etc/postgresql/9.3/main/pg_hba.conf
# RUN echo "listen_addresses='*'" >> /etc/postgresql/9.3/main/postgresql.conf
# EXPOSE 5432

# COPY ./db-init.sh   /docker-entrypoint-initdb.d/db-init.sh
# COPY ./db-init.sql   /docker-entrypoint-initdb.d/db-init.sql


# RUN psql --command "CREATE USER crime_user WITH SUPERUSER PASSWORD '';"

# RUN createuser -s crime_user &&\
    # createdb -O crime_user crime

# RUN createuser -s crime_user
# COPY ./db-init.sql   /docker-entrypoint-initdb.d/db-init.sql
