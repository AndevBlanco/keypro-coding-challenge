from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from models import User
import os

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY') 

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    new_user = User(
        name=data['name'],
        last_name=data['lastName'],
        email=data['email']
    )
    new_user.set_password(data['password']) 
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User created successfully'}), 201

if __name__ == '__main__':
    app.run(debug=True)
