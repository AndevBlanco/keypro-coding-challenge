from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_bcrypt import Bcrypt
import psycopg2
import psycopg2.extras
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)
bcrypt = Bcrypt(app)

db_conn = psycopg2.connect(
    host=os.getenv('DB_HOST'),
    port=os.getenv('DB_PORT'),
    user=os.getenv('DB_USER'),
    password=os.getenv('DB_PASSWORD'),
    database=os.getenv('DB_NAME')
)

db_conn.autocommit = True
cursor = db_conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(120) UNIQUE NOT NULL,
        password_hash VARCHAR(128) NOT NULL
    )
""")

cursor.execute("""
    CREATE TABLE markers (
        id SERIAL PRIMARY KEY,
        description VARCHAR(200) NOT NULL,
        date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        longitude VARCHAR(200) NOT NULL,
        latitude VARCHAR(200) NOT NULL,
        user_id INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )
""")

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    email = data['email']
    password = data['password']
    name = data['name']
    last_name = data['lastName']


    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    existing_user = cursor.fetchone()
    if existing_user:
        return jsonify({'successful': False, 'message': 'User already exists'}), 401


    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    cursor.execute("INSERT INTO users (name, last_name, email, password_hash) VALUES (%s, %s, %s, %s)",
                   (name, last_name, email, hashed_password))
    db_conn.commit()
    
    return jsonify({'successful': False, 'message': 'User created successfully'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data['email']
    password = data['password']


    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()

    if user and bcrypt.check_password_hash(user['password_hash'], password):
        return jsonify({'user_id': user['id'], 'successful': True, 'message': 'Login successful'}), 200

    return jsonify({'successful': False, 'message': 'Invalid email or password'}), 401

@app.route('/getMarkers', methods=['GET'])
def get_markers():
    try:
        cursor.execute("SELECT m.id, m.longitude, m.latitude, m.description, m.date, m.user_id, CONCAT(u.name, ' ', u.last_name) AS user_name FROM markers m JOIN users u ON m.user_id = u.id")
        markers = cursor.fetchall()
        return jsonify({'markers': markers})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/addMarker', methods=['POST'])
def add_marker():
    data = request.get_json()
    longitude = data['longitude']
    latitude = data['latitude']
    description = data['description']
    date = datetime.now().strftime('%a, %d %b %Y %H:%M:%S GMT')
    user_id = data['userId']

    cursor.execute("INSERT INTO markers (longitude, latitude, description, date, user_id) VALUES (%s, %s, %s, %s, %s)", (longitude, latitude, description, date, user_id))
    db_conn.commit()

    return jsonify({'message': 'Marker added successfully', 'data': data}), 201

@app.route('/editMarker/<int:marker_id>', methods=['PUT'])
def edit_marker(marker_id):
    data = request.get_json()
    description = data['description']

    cursor.execute("UPDATE markers SET description = %s WHERE id = %s", (description, marker_id))
    db_conn.commit()
    cursor.execute("SELECT * FROM markers WHERE id = %s", (marker_id,))
    updated_marker = cursor.fetchone()

    if updated_marker:
        return jsonify({'message': 'Marker updated successfully', 'data': updated_marker}), 200
    else:
        return jsonify({'message': 'Marker not found', 'data': {}}), 404

@app.route('/deleteMarker/<int:marker_id>', methods=['DELETE'])
def delete_marker(marker_id):
    try:
        cursor.execute("DELETE FROM markers WHERE id = %s", (marker_id,))
        db_conn.commit()
        return jsonify({'message': 'Marker deleted successfully'}), 200

    except mysql.connector.Error as err:
        db_conn.rollback()
        return jsonify({'message': f'Database error: {err}'}), 500

    except Exception as e:
        return jsonify({'message': f'Unexpected error: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True)
