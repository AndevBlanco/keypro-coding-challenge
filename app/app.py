from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
import psycopg2.extras
import os

app = Flask(__name__)
CORS(app)

# Configuración de la conexión a PostgreSQL
db_conn = psycopg2.connect(
    host=os.getenv('DB_HOST'),
    port=os.getenv('DB_PORT'),
    user=os.getenv('DB_USER'),
    password=os.getenv('DB_PASSWORD'),
    database=os.getenv('DB_NAME')
)

# Habilitar el acceso a diccionarios en psycopg2 para obtener resultados como dicts
db_conn.autocommit = True
cursor = db_conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

# Creación de tablas si no existen
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
    CREATE TABLE IF NOT EXISTS markers (
        id SERIAL PRIMARY KEY,
        description VARCHAR(200) NOT NULL,
        date DATE NOT NULL DEFAULT CURRENT_DATE,
        uid INTEGER NOT NULL
    )
""")

# Endpoints de la API
@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    email = data['email']
    password = data['password']
    name = data['name']
    last_name = data['lastName']

    # Verificar si el usuario ya existe
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    existing_user = cursor.fetchone()
    if existing_user:
        return jsonify({'successful': False, 'message': 'User already exists'}), 401

    # Crear nuevo usuario
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    cursor.execute("INSERT INTO users (name, last_name, email, password_hash) VALUES (%s, %s, %s, %s)",
                   (name, last_name, email, hashed_password))
    db_conn.commit()
    
    return jsonify({'message': 'User created successfully'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data['email']
    password = data['password']

    # Buscar usuario por email
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()

    if user and bcrypt.check_password_hash(user['password_hash'], password):
        return jsonify({'user_id': user['id'], 'successful': True, 'message': 'Login successful'}), 200

    return jsonify({'successful': False, 'message': 'Invalid email or password'}), 401

@app.route('/getUsers', methods=['GET'])
def getUsers():
    cursor.execute("SELECT id, name, email FROM users")
    users = cursor.fetchall()
    return jsonify({'users': users})

@app.route('/getMarkers', methods=['GET'])
def get_markers():
    try:
        cursor.execute("SELECT id, description, date, uid FROM markers")
        markers = cursor.fetchall()
        return jsonify({'markers': markers})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/addMarker', methods=['POST'])
def add_marker():
    data = request.get_json()
    description = data['description']
    uid = data['uid']

    cursor.execute("INSERT INTO markers (description, uid) VALUES (%s, %s)", (description, uid))
    db_conn.commit()

    return jsonify({'message': 'Marker added successfully', 'data': data}), 201

if __name__ == '__main__':
    app.run(debug=True)
