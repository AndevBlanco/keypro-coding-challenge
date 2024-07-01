from flask import Flask, jsonify
import psycopg2
import os

app = Flask(__name__)

DATABASE_URL = os.getenv('DATABASE_URL')

@app.route('/')
def hello():
    return jsonify(message="Hello, World!")

@app.route('/db')
def db_version():
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()
        cur.execute('SELECT version()')
        db_version = cur.fetchone()
        cur.close()
        conn.close()
        return jsonify(db_version=db_version)
    except Exception as e:
        return str(e)

if __name__ == '__main__':
    app.run()
