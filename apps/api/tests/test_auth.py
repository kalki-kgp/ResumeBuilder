import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.database import Base, get_db
from app.main import app
from app.models.user import User  # noqa: F401 - Import to register model with Base

# Test database (in-memory SQLite) with StaticPool to ensure single connection
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,  # Use single connection for in-memory database
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables once at module level
Base.metadata.create_all(bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture
def client():
    yield TestClient(app)
    # Clean up data after each test
    with engine.begin() as conn:
        for table in reversed(Base.metadata.sorted_tables):
            conn.execute(table.delete())


def test_signup_success(client):
    """Test successful user signup"""
    response = client.post(
        "/api/v1/auth/signup",
        json={"email": "test@example.com", "password": "password123"},
    )
    if response.status_code != 201:
        print(f"Error response: {response.json()}")
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_signup_duplicate_email(client):
    """Test signup with duplicate email fails"""
    # First signup
    client.post(
        "/api/v1/auth/signup",
        json={"email": "test@example.com", "password": "password123"},
    )

    # Duplicate signup
    response = client.post(
        "/api/v1/auth/signup",
        json={"email": "test@example.com", "password": "password456"},
    )
    assert response.status_code == 400


def test_login_success(client):
    """Test successful login"""
    # Signup first
    client.post(
        "/api/v1/auth/signup",
        json={"email": "test@example.com", "password": "password123"},
    )

    # Login
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "test@example.com", "password": "password123", "remember_me": False},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data


def test_login_wrong_password(client):
    """Test login with wrong password fails"""
    # Signup
    client.post(
        "/api/v1/auth/signup",
        json={"email": "test@example.com", "password": "password123"},
    )

    # Login with wrong password
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "test@example.com", "password": "wrongpassword", "remember_me": False},
    )
    assert response.status_code == 401


def test_get_current_user(client):
    """Test getting current user info with valid token"""
    # Signup
    signup_response = client.post(
        "/api/v1/auth/signup",
        json={"email": "test@example.com", "password": "password123"},
    )
    token = signup_response.json()["access_token"]

    # Get current user
    response = client.get(
        "/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@example.com"


def test_get_current_user_invalid_token(client):
    """Test getting current user with invalid token fails"""
    response = client.get(
        "/api/v1/auth/me", headers={"Authorization": "Bearer invalid_token"}
    )
    assert response.status_code == 401
