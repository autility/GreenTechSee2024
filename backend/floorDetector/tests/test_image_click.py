import pytest
from flask import Flask

from ..image_click import app


@pytest.fixture
def client():
    with app.test_client() as client:
        yield client


def test_root(client):
    response = client.get('/')
    assert response.status_code == 200
    assert response.data == b'Hello, World!'


def test_handle_click(client):
    response = client.post('/handle_click')
    assert response.status_code == 200
    # Add additional assertions as needed


if __name__ == '__main__':
    pytest.main()
