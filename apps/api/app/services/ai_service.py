"""AI Service for resume analysis using Nebius API"""

import base64
import io
import json
import logging
import re
from pathlib import Path

from openai import OpenAI
from pdf2image import convert_from_path
from PIL import Image

from app.core.config import settings

logger = logging.getLogger(__name__)

# System prompts for different AI tasks
ATS_SYSTEM_PROMPT = """You are an expert ATS (Applicant Tracking System) analyzer. Your job is to evaluate resumes and provide an ATS compatibility score.

Analyze the resume image and evaluate it based on these criteria:
1. **Contact Information** (10 points): Name, email, phone, LinkedIn/portfolio
2. **Professional Summary** (10 points): Clear, concise summary or objective
3. **Work Experience** (25 points): Relevant experience with quantifiable achievements, action verbs
4. **Skills Section** (15 points): Relevant technical and soft skills, keywords
5. **Education** (10 points): Degrees, certifications, relevant coursework
6. **Formatting** (15 points): Clean layout, consistent fonts, proper sections, no tables/graphics that ATS can't read
7. **Keywords** (15 points): Industry-relevant keywords, job-specific terminology

You MUST respond with ONLY a valid JSON object in this exact format, no other text:
{
  "score": <number 0-100>,
  "breakdown": {
    "contact_info": <number 0-10>,
    "summary": <number 0-10>,
    "experience": <number 0-25>,
    "skills": <number 0-15>,
    "education": <number 0-10>,
    "formatting": <number 0-15>,
    "keywords": <number 0-15>
  },
  "strengths": ["strength1", "strength2", "strength3"],
  "improvements": ["improvement1", "improvement2", "improvement3"],
  "missing_sections": ["section1", "section2"]
}"""

RESUME_SUGGESTIONS_PROMPT = """You are an expert resume coach. Analyze the resume image and provide specific, actionable suggestions to improve it.

Focus on:
1. Content improvements (better action verbs, quantifiable achievements)
2. Missing information that should be added
3. Sections that need expansion or reduction
4. Keyword optimization for ATS systems
5. Professional tone and clarity

Respond with ONLY a valid JSON object:
{
  "suggestions": [
    {
      "category": "experience|skills|summary|formatting|other",
      "priority": "high|medium|low",
      "current": "what's currently there or missing",
      "suggested": "specific improvement suggestion",
      "example": "example of improved text if applicable"
    }
  ],
  "overall_impression": "brief overall assessment",
  "top_priority": "single most important thing to fix"
}"""

RESUME_EXTRACTION_PROMPT = """You are an expert resume parser. Extract ALL information from this resume image into a structured JSON format.

Be thorough and extract every piece of information you can find. If a field is not present in the resume, use an empty string or empty array.

You MUST respond with ONLY a valid JSON object in this exact format:
{
  "contact": {
    "full_name": "Person's full name",
    "email": "email@example.com",
    "phone": "+1-234-567-8900",
    "location": "City, State/Country",
    "linkedin": "linkedin.com/in/username",
    "github": "github.com/username",
    "portfolio": "portfolio-url.com",
    "other_links": ["other relevant links"]
  },
  "summary": "Professional summary or objective statement",
  "work_experience": [
    {
      "job_title": "Job Title",
      "company": "Company Name",
      "location": "City, State",
      "start_date": "Jan 2020",
      "end_date": "Present",
      "is_current": true,
      "description": "Overall role description",
      "bullet_points": ["Achievement 1", "Achievement 2"],
      "technologies": ["Tech1", "Tech2"]
    }
  ],
  "education": [
    {
      "degree": "Bachelor of Science in Computer Science",
      "institution": "University Name",
      "location": "City, State",
      "start_date": "2016",
      "end_date": "2020",
      "gpa": "3.8",
      "honors": ["Magna Cum Laude"],
      "relevant_coursework": ["Data Structures", "Algorithms"]
    }
  ],
  "technical_skills": ["Python", "JavaScript", "React"],
  "soft_skills": ["Leadership", "Communication"],
  "skills_by_category": {
    "Programming Languages": ["Python", "JavaScript"],
    "Frameworks": ["React", "FastAPI"],
    "Tools": ["Git", "Docker"]
  },
  "projects": [
    {
      "name": "Project Name",
      "description": "What the project does",
      "technologies": ["Tech1", "Tech2"],
      "url": "project-url.com",
      "bullet_points": ["Feature 1", "Feature 2"],
      "start_date": "",
      "end_date": ""
    }
  ],
  "certifications": [
    {
      "name": "Certification Name",
      "issuer": "Issuing Organization",
      "date_obtained": "2023",
      "expiry_date": "",
      "credential_id": "",
      "url": ""
    }
  ],
  "languages": [
    {"language": "English", "proficiency": "Native"},
    {"language": "Spanish", "proficiency": "Professional"}
  ],
  "publications": ["Publication 1", "Publication 2"],
  "awards": ["Award 1", "Award 2"],
  "volunteer": [
    {"organization": "Org Name", "role": "Volunteer Role", "description": "What you did"}
  ],
  "interests": ["Interest 1", "Interest 2"]
}

Extract ALL information visible in the resume. Be precise with dates, names, and details."""

TEMPLATE_FILL_PROMPT = """You are an expert resume data mapper. Your job is to take extracted resume data and intelligently map it to fill a template's required fields.

You will receive:
1. EXTRACTED DATA: Structured data from the user's resume
2. TEMPLATE SCHEMA: The fields required by the target template

Your task:
- Map the extracted data to the template fields
- If a template field has no direct match, find the best alternative or leave empty
- Preserve the original content as much as possible
- Format dates consistently
- Ensure all required fields are filled if data is available

Respond with ONLY a valid JSON object containing the filled template data."""


class AIService:
    """Service for AI-powered resume analysis"""

    def __init__(self):
        if not settings.NEBIUS_API_KEY:
            self.client = None
        else:
            self.client = OpenAI(
                base_url=settings.NEBIUS_BASE_URL,
                api_key=settings.NEBIUS_API_KEY,
            )

    def _pdf_to_images(self, pdf_path: str) -> list[Image.Image]:
        """Convert PDF to list of PIL Images"""
        return convert_from_path(pdf_path)

    def _image_to_base64(self, image: Image.Image, format: str = "PNG") -> str:
        """Convert PIL Image to base64 string"""
        buffer = io.BytesIO()
        image.save(buffer, format=format)
        return base64.b64encode(buffer.getvalue()).decode("utf-8")

    def _file_to_base64_images(self, file_path: str) -> list[str]:
        """Convert file (PDF or image) to list of base64 images"""
        path = Path(file_path)
        suffix = path.suffix.lower()

        if suffix == ".pdf":
            images = self._pdf_to_images(file_path)
            return [self._image_to_base64(img) for img in images]
        elif suffix in [".png", ".jpg", ".jpeg"]:
            with Image.open(file_path) as img:
                return [self._image_to_base64(img)]
        else:
            raise ValueError(f"Unsupported file type: {suffix}")

    def _parse_json_response(self, response_text: str) -> dict:
        """Parse JSON from AI response, handling potential formatting issues"""
        # Try to extract JSON from the response
        # Sometimes the model might wrap it in markdown code blocks
        json_match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", response_text)
        if json_match:
            response_text = json_match.group(1)

        # Try to find JSON object in the response
        json_match = re.search(r"\{[\s\S]*\}", response_text)
        if json_match:
            response_text = json_match.group(0)

        try:
            return json.loads(response_text)
        except json.JSONDecodeError:
            # Return a default response if parsing fails
            return {"error": "Failed to parse AI response", "raw": response_text}

    def analyze_resume_ats(self, file_path: str) -> dict:
        """
        Analyze a resume for ATS compatibility.

        Returns:
            dict with score, breakdown, strengths, improvements, missing_sections
        """
        if not self.client:
            return {
                "score": 0,
                "error": "AI service not configured. Set NEBIUS_API_KEY in .env",
                "breakdown": {},
                "strengths": [],
                "improvements": ["Configure NEBIUS_API_KEY to enable ATS analysis"],
                "missing_sections": [],
            }

        try:
            # Convert file to base64 images
            base64_images = self._file_to_base64_images(file_path)

            # Build message content with images
            content = [{"type": "text", "text": "Analyze this resume for ATS compatibility:"}]
            for b64_img in base64_images:
                content.append({
                    "type": "image_url",
                    "image_url": {"url": f"data:image/png;base64,{b64_img}"},
                })

            # Call Nebius API
            response = self.client.chat.completions.create(
                model=settings.NEBIUS_VLM_MODEL,
                messages=[
                    {"role": "system", "content": ATS_SYSTEM_PROMPT},
                    {"role": "user", "content": content},
                ],
                max_tokens=1000,
                temperature=0.3,
            )

            # Parse response
            result = self._parse_json_response(response.choices[0].message.content or "")

            # Ensure score is valid
            if "score" in result:
                result["score"] = max(0, min(100, int(result["score"])))

            return result

        except Exception as e:
            return {
                "score": 0,
                "error": str(e),
                "breakdown": {},
                "strengths": [],
                "improvements": ["Error analyzing resume"],
                "missing_sections": [],
            }

    def get_resume_suggestions(self, file_path: str) -> dict:
        """
        Get AI-powered suggestions for improving a resume.

        Returns:
            dict with suggestions, overall_impression, top_priority
        """
        if not self.client:
            return {
                "suggestions": [],
                "overall_impression": "AI service not configured",
                "top_priority": "Set NEBIUS_API_KEY in .env to enable AI suggestions",
            }

        try:
            # Convert file to base64 images
            base64_images = self._file_to_base64_images(file_path)

            # Build message content with images
            content = [{"type": "text", "text": "Analyze this resume and provide improvement suggestions:"}]
            for b64_img in base64_images:
                content.append({
                    "type": "image_url",
                    "image_url": {"url": f"data:image/png;base64,{b64_img}"},
                })

            # Call Nebius API
            response = self.client.chat.completions.create(
                model=settings.NEBIUS_VLM_MODEL,
                messages=[
                    {"role": "system", "content": RESUME_SUGGESTIONS_PROMPT},
                    {"role": "user", "content": content},
                ],
                max_tokens=1500,
                temperature=0.5,
            )

            # Parse response
            return self._parse_json_response(response.choices[0].message.content or "")

        except Exception as e:
            return {
                "suggestions": [],
                "overall_impression": f"Error: {str(e)}",
                "top_priority": "Fix the error and try again",
            }

    def generate_text(
        self, system_prompt: str, user_message: str, image_path: str | None = None
    ) -> str:
        """
        General purpose text generation with optional image input.

        Args:
            system_prompt: System instructions for the AI
            user_message: User's message/question
            image_path: Optional path to an image file

        Returns:
            Generated text response
        """
        if not self.client:
            return "AI service not configured. Set NEBIUS_API_KEY in .env"

        try:
            # Build user content
            if image_path:
                base64_images = self._file_to_base64_images(image_path)
                content = [{"type": "text", "text": user_message}]
                for b64_img in base64_images:
                    content.append({
                        "type": "image_url",
                        "image_url": {"url": f"data:image/png;base64,{b64_img}"},
                    })
            else:
                content = user_message

            # Use VLM if image provided, otherwise LLM
            model = settings.NEBIUS_VLM_MODEL if image_path else settings.NEBIUS_LLM_MODEL
            response = self.client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": content},
                ],
                max_tokens=2000,
                temperature=0.7,
            )

            return response.choices[0].message.content or ""

        except Exception as e:
            return f"Error: {str(e)}"

    def extract_resume_data(self, file_path: str) -> dict:
        """
        Extract structured data from a resume.

        Returns:
            dict with all extracted resume data (contact, experience, education, etc.)
        """
        if not self.client:
            return {
                "error": "AI service not configured. Set NEBIUS_API_KEY in .env",
                "contact": {"full_name": "", "email": "", "phone": "", "location": ""},
                "summary": "",
                "work_experience": [],
                "education": [],
                "technical_skills": [],
                "soft_skills": [],
                "skills_by_category": {},
                "projects": [],
                "certifications": [],
                "languages": [],
                "publications": [],
                "awards": [],
                "volunteer": [],
                "interests": [],
            }

        try:
            logger.info(f"Extracting data from: {file_path}")
            # Convert file to base64 images
            base64_images = self._file_to_base64_images(file_path)
            logger.info(f"Converted to {len(base64_images)} image(s)")

            # Build message content with images
            content = [{"type": "text", "text": "Extract all information from this resume:"}]
            for b64_img in base64_images:
                content.append({
                    "type": "image_url",
                    "image_url": {"url": f"data:image/png;base64,{b64_img}"},
                })

            logger.info(f"Calling VLM ({settings.NEBIUS_VLM_MODEL}) for extraction...")
            # Call Nebius API
            response = self.client.chat.completions.create(
                model=settings.NEBIUS_VLM_MODEL,
                messages=[
                    {"role": "system", "content": RESUME_EXTRACTION_PROMPT},
                    {"role": "user", "content": content},
                ],
                max_tokens=4000,
                temperature=0.2,  # Lower temperature for more consistent extraction
            )
            logger.info("Extraction complete, parsing response...")

            # Parse response
            result = self._parse_json_response(response.choices[0].message.content or "")

            # Add extraction metadata
            from datetime import datetime
            result["extraction_version"] = "1.0"
            result["extracted_at"] = datetime.utcnow().isoformat()

            return result

        except Exception as e:
            logger.error(f"Extraction failed: {e}")
            return {
                "error": str(e),
                "contact": {"full_name": "", "email": "", "phone": "", "location": ""},
                "summary": "",
                "work_experience": [],
                "education": [],
                "technical_skills": [],
                "soft_skills": [],
                "skills_by_category": {},
                "projects": [],
                "certifications": [],
                "languages": [],
                "publications": [],
                "awards": [],
                "volunteer": [],
                "interests": [],
            }

    def fill_template(self, extracted_data: dict, template_schema: dict) -> dict:
        """
        Map extracted resume data to fill a template's fields.

        Args:
            extracted_data: The extracted resume data JSON
            template_schema: The template's field schema

        Returns:
            dict with filled template data
        """
        if not self.client:
            return {
                "error": "AI service not configured. Set NEBIUS_API_KEY in .env",
                "data": {},
            }

        try:
            user_message = f"""
EXTRACTED RESUME DATA:
{json.dumps(extracted_data, indent=2)}

TEMPLATE SCHEMA:
{json.dumps(template_schema, indent=2)}

Map the extracted data to fill the template fields. Return only the filled data JSON.
"""

            logger.info(f"Filling template '{template_schema.get('template_id')}' using LLM ({settings.NEBIUS_LLM_MODEL})...")
            response = self.client.chat.completions.create(
                model=settings.NEBIUS_LLM_MODEL,
                messages=[
                    {"role": "system", "content": TEMPLATE_FILL_PROMPT},
                    {"role": "user", "content": user_message},
                ],
                max_tokens=4000,
                temperature=0.3,
            )
            logger.info("Template filling complete")

            result = self._parse_json_response(response.choices[0].message.content or "")

            # Add metadata
            from datetime import datetime
            return {
                "template_id": template_schema.get("template_id", ""),
                "filled_at": datetime.utcnow().isoformat(),
                "data": result,
            }

        except Exception as e:
            logger.error(f"Template filling failed: {e}")
            return {
                "error": str(e),
                "data": {},
            }


# Singleton instance
ai_service = AIService()
