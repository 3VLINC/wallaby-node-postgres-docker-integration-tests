# Docker Wallaby Node / Postgres Integration Tests

This example repository shows an example configuration for using Wallaby test runner to execute integration tests in real time against an ephemeral PostGres docker container.

This project attempts to overcome issues related to table locking by:

- Spawning a new postgres container for each Wallaby worker
- Destroying the database connection and manually issue a command to drop any other connections to the database to remove connections that are idle due to being abandoned in the middle of a transaction
- Running a cleanup and migration script in between each test

You can connect to the postgres container to monitor whats going on by connecting with:

host: 127.0.0.1:543[x = wallaby worker id]
username: docker
password: docker
database: app | postgres

## Next steps

The code in src/test should be made more generic and configurable and could be bundled into a package and distributed via npm.