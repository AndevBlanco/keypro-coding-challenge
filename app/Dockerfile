FROM python:3.9-slim

RUN apt-get update && apt-get install -y netcat-traditional

# Set the working directory in the container
WORKDIR /app

# Copy requirements.txt and then install the dependencies
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy all the content of the app folder to the working directory in the container
COPY . .

ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0

# Command to run the Flask application
CMD ["./entrypoint.sh"]
