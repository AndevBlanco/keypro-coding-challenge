import unittest
import requests

class TestSignUp(unittest.TestCase):

    def setUp(self):
        self.base_url = 'http://localhost:5000'
        self.test_data = {
            'name': 'Test',
            'lastName': 'User',
            'email': 'test@example.com',
            'password': 'password'
        }

    def test_signup_success(self):
        response = requests.post(f'{self.base_url}/signup', json=self.test_data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()['message'], 'User created successfully')

    def test_signup_user_exists(self):
        response = requests.post(f'{self.base_url}/signup', json=self.test_data)
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json()['message'], 'User already exists')


class TestAddMarker(unittest.TestCase):

    def setUp(self):
        self.base_url = 'http://localhost:5000'
        self.test_data = {
            'longitude': '10.1234',
            'latitude': '20.5678',
            'description': 'Test marker',
            'userId': 1 
        }

    def test_add_marker(self):
    
        response = requests.post(f'{self.base_url}/addMarker', json=self.test_data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()['message'], 'Marker added successfully')


class TestEditMarker(unittest.TestCase):

    def setUp(self):
        self.base_url = 'http://localhost:5000'
        self.marker_id = 1 
        self.test_data = {
            'description': 'Updated marker description'
        }

    def test_edit_marker(self):
        response = requests.put(f'{self.base_url}/editMarker/{self.marker_id}', json=self.test_data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], 'Marker updated successfully')


class TestDeleteMarker(unittest.TestCase):

    def setUp(self):
        self.base_url = 'http://localhost:5000'
        self.marker_id = 1 

    def test_delete_marker(self):
        response = requests.delete(f'{self.base_url}/deleteMarker/{self.marker_id}')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], 'Marker deleted successfully')


if __name__ == '__main__':
    unittest.main()
