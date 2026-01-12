"""Tests for resume endpoints"""

import io


def test_list_resumes_empty(client, auth_headers):
    """Test listing resumes when none exist"""
    response = client.get("/api/v1/resumes", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["resumes"] == []
    assert data["total"] == 0


def test_create_resume(client, auth_headers):
    """Test creating a resume"""
    response = client.post(
        "/api/v1/resumes",
        headers=auth_headers,
        json={"title": "My First Resume"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "My First Resume"
    assert data["ats_score"] == 0
    assert "id" in data
    assert "created_at" in data


def test_get_resume(client, auth_headers):
    """Test getting a specific resume"""
    # Create a resume first
    create_response = client.post(
        "/api/v1/resumes",
        headers=auth_headers,
        json={"title": "Test Resume"},
    )
    resume_id = create_response.json()["id"]

    # Get the resume
    response = client.get(f"/api/v1/resumes/{resume_id}", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Test Resume"


def test_get_resume_not_found(client, auth_headers):
    """Test getting a non-existent resume"""
    response = client.get("/api/v1/resumes/99999", headers=auth_headers)
    assert response.status_code == 404


def test_update_resume(client, auth_headers):
    """Test updating a resume"""
    # Create a resume first
    create_response = client.post(
        "/api/v1/resumes",
        headers=auth_headers,
        json={"title": "Original Title"},
    )
    resume_id = create_response.json()["id"]

    # Update the resume
    response = client.patch(
        f"/api/v1/resumes/{resume_id}",
        headers=auth_headers,
        json={"title": "Updated Title", "ats_score": 85},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Updated Title"
    assert data["ats_score"] == 85


def test_delete_resume(client, auth_headers):
    """Test deleting a resume"""
    # Create a resume first
    create_response = client.post(
        "/api/v1/resumes",
        headers=auth_headers,
        json={"title": "To Delete"},
    )
    resume_id = create_response.json()["id"]

    # Delete the resume
    response = client.delete(f"/api/v1/resumes/{resume_id}", headers=auth_headers)
    assert response.status_code == 204

    # Verify it's deleted
    get_response = client.get(f"/api/v1/resumes/{resume_id}", headers=auth_headers)
    assert get_response.status_code == 404


def test_get_stats(client, auth_headers):
    """Test getting dashboard stats"""
    # Create some resumes
    client.post(
        "/api/v1/resumes",
        headers=auth_headers,
        json={"title": "Resume 1"},
    )
    create_response = client.post(
        "/api/v1/resumes",
        headers=auth_headers,
        json={"title": "Resume 2"},
    )
    resume_id = create_response.json()["id"]

    # Update one with a score
    client.patch(
        f"/api/v1/resumes/{resume_id}",
        headers=auth_headers,
        json={"ats_score": 75},
    )

    # Get stats
    response = client.get("/api/v1/resumes/stats", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["total_resumes"] == 2
    assert data["highest_ats_score"] == 75


def test_upload_file(client, auth_headers):
    """Test uploading a file to a resume"""
    # Create a resume first
    create_response = client.post(
        "/api/v1/resumes",
        headers=auth_headers,
        json={"title": "Resume with File"},
    )
    resume_id = create_response.json()["id"]

    # Create a fake PDF file
    pdf_content = b"%PDF-1.4 fake pdf content"
    files = {"file": ("resume.pdf", io.BytesIO(pdf_content), "application/pdf")}

    # Upload the file
    response = client.post(
        f"/api/v1/resumes/{resume_id}/upload",
        headers=auth_headers,
        files=files,
    )
    assert response.status_code == 200
    data = response.json()
    assert data["file_type"] == "pdf"
    assert data["file_size"] == len(pdf_content)
    assert data["file_path"] is not None


def test_upload_invalid_file_type(client, auth_headers):
    """Test uploading an invalid file type"""
    # Create a resume first
    create_response = client.post(
        "/api/v1/resumes",
        headers=auth_headers,
        json={"title": "Resume with Invalid File"},
    )
    resume_id = create_response.json()["id"]

    # Try to upload a text file
    files = {"file": ("resume.txt", io.BytesIO(b"text content"), "text/plain")}

    response = client.post(
        f"/api/v1/resumes/{resume_id}/upload",
        headers=auth_headers,
        files=files,
    )
    assert response.status_code == 400


def test_unauthorized_access(client):
    """Test accessing resumes without auth"""
    response = client.get("/api/v1/resumes")
    # Returns 401 or 403 when no credentials are provided
    assert response.status_code in [401, 403]
