# Docker Flask PostgreSQL Project

This project includes a Flask application, a PostgreSQL database and a React application, all of them running in Docker containers.

## Requirements

- [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/install/).

## Instructions

### Clone the Repository

```sh
git clone https://github.com/AndevBlanco/keypro-coding-challenge.git
cd keypro-coding-challenge
```

### Run all
```sh
docker-compose up --build
```

### Run backend tests
python -m unittest ./app/test.py
