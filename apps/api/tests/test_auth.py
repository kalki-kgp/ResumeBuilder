"""Tests for authentication endpoints"""


def test_signup_success(client):
    """Test successful user signup"""
    response = client.post(
        "/api/v1/auth/signup",
        json={"email": "test@example.com", "password": "password123"},
    )
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
