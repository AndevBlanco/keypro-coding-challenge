FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy requirements.txt and then install the dependencies
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy all the content of the app folder to the working directory in the container
COPY . .

# Command to run the Flask application
CMD ["flask", "run", "--host=0.0.0.0"]
