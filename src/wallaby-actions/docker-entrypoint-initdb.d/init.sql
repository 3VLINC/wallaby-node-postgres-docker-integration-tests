CREATE USER docker WITH PASSWORD 'docker';
GRANT ALL PRIVILEGES ON DATABASE postgres TO docker;
GRANT ALL PRIVILEGES ON DATABASE app TO docker;