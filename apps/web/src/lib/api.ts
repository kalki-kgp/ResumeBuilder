const API_BASE_URL = "http://localhost:8000/api/v1";

// Auth types
export interface SignupRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  remember_me: boolean;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface User {
  id: number;
  email: string;
  is_active: boolean;
  created_at: string;
}

// Resume types
export interface Resume {
  id: number;
  user_id: number;
  title: string;
  file_path: string | null;
  file_type: string | null;
  file_size: number | null;
  extracted_data_path: string | null;
  ats_score: number;
  thumbnail_color: string;
  created_at: string;
  updated_at: string;
}

export interface ResumeListResponse {
  resumes: Resume[];
  total: number;
}

export interface DashboardStats {
  total_resumes: number;
  average_ats_score: number;
  highest_ats_score: number;
  resumes_this_week: number;
}

export interface ResumeCreateRequest {
  title: string;
}

export interface ResumeUpdateRequest {
  title?: string;
  ats_score?: number;
  thumbnail_color?: string;
}

// ATS Analysis types
export interface ATSBreakdown {
  contact_info: number;
  summary: number;
  experience: number;
  skills: number;
  education: number;
  formatting: number;
  keywords: number;
}

export interface ATSAnalysis {
  score: number;
  breakdown: ATSBreakdown;
  strengths: string[];
  improvements: string[];
  missing_sections: string[];
  error?: string;
}

// AI Suggestions types
export interface AISuggestion {
  category: "experience" | "skills" | "summary" | "formatting" | "other";
  priority: "high" | "medium" | "low";
  current: string;
  suggested: string;
  example?: string;
}

export interface AISuggestionsResponse {
  suggestions: AISuggestion[];
  overall_impression: string;
  top_priority: string;
}

// Extracted Resume Data types
export interface ContactInfo {
  full_name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
  other_links: string[];
}

export interface WorkExperience {
  job_title: string;
  company: string;
  location: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  description: string;
  bullet_points: string[];
  technologies: string[];
}

export interface Education {
  degree: string;
  institution: string;
  location: string;
  start_date: string;
  end_date: string;
  gpa: string;
  honors: string[];
  relevant_coursework: string[];
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  url: string;
  bullet_points: string[];
}

export interface ExtractedResumeData {
  extraction_version: string;
  extracted_at: string;
  contact: ContactInfo;
  summary: string;
  work_experience: WorkExperience[];
  education: Education[];
  technical_skills: string[];
  soft_skills: string[];
  skills_by_category: Record<string, string[]>;
  projects: Project[];
  certifications: { name: string; issuer: string; date_obtained: string }[];
  languages: { language: string; proficiency: string }[];
  publications: string[];
  awards: string[];
  interests: string[];
  error?: string;
}

export interface TemplateSchema {
  template_id: string;
  template_name: string;
  version: string;
  sections: {
    key: string;
    label: string;
    type: string;
    fields: { key: string; label: string; type: string; required: boolean }[];
  }[];
}

export interface FilledTemplateData {
  template_id: string;
  filled_at: string;
  data: Record<string, any>;
  error?: string;
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "An error occurred" }));
    throw new ApiError(response.status, error.detail || "An error occurred");
  }
  return response.json();
}

function authHeaders(token: string): HeadersInit {
  return { Authorization: `Bearer ${token}` };
}

export const authApi = {
  async signup(data: SignupRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<AuthResponse>(response);
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<AuthResponse>(response);
  },

  async getCurrentUser(token: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: authHeaders(token),
    });
    return handleResponse<User>(response);
  },
};

export const resumeApi = {
  async list(token: string): Promise<ResumeListResponse> {
    const response = await fetch(`${API_BASE_URL}/resumes`, {
      headers: authHeaders(token),
    });
    return handleResponse<ResumeListResponse>(response);
  },

  async getStats(token: string): Promise<DashboardStats> {
    const response = await fetch(`${API_BASE_URL}/resumes/stats`, {
      headers: authHeaders(token),
    });
    return handleResponse<DashboardStats>(response);
  },

  async get(token: string, resumeId: number): Promise<Resume> {
    const response = await fetch(`${API_BASE_URL}/resumes/${resumeId}`, {
      headers: authHeaders(token),
    });
    return handleResponse<Resume>(response);
  },

  async create(token: string, data: ResumeCreateRequest): Promise<Resume> {
    const response = await fetch(`${API_BASE_URL}/resumes`, {
      method: "POST",
      headers: {
        ...authHeaders(token),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return handleResponse<Resume>(response);
  },

  async update(token: string, resumeId: number, data: ResumeUpdateRequest): Promise<Resume> {
    const response = await fetch(`${API_BASE_URL}/resumes/${resumeId}`, {
      method: "PATCH",
      headers: {
        ...authHeaders(token),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return handleResponse<Resume>(response);
  },

  async delete(token: string, resumeId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/resumes/${resumeId}`, {
      method: "DELETE",
      headers: authHeaders(token),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: "An error occurred" }));
      throw new ApiError(response.status, error.detail || "An error occurred");
    }
  },

  async uploadFile(token: string, resumeId: number, file: File): Promise<Resume> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE_URL}/resumes/${resumeId}/upload`, {
      method: "POST",
      headers: authHeaders(token),
      body: formData,
    });
    return handleResponse<Resume>(response);
  },

  getDownloadUrl(resumeId: number): string {
    return `${API_BASE_URL}/resumes/${resumeId}/download`;
  },

  async getATSAnalysis(token: string, resumeId: number): Promise<ATSAnalysis> {
    const response = await fetch(`${API_BASE_URL}/resumes/${resumeId}/ats`, {
      headers: authHeaders(token),
    });
    return handleResponse<ATSAnalysis>(response);
  },

  async reanalyzeATS(token: string, resumeId: number): Promise<Resume> {
    const response = await fetch(`${API_BASE_URL}/resumes/${resumeId}/ats/reanalyze`, {
      method: "POST",
      headers: authHeaders(token),
    });
    return handleResponse<Resume>(response);
  },

  async getAISuggestions(token: string, resumeId: number): Promise<AISuggestionsResponse> {
    const response = await fetch(`${API_BASE_URL}/resumes/${resumeId}/suggestions`, {
      headers: authHeaders(token),
    });
    return handleResponse<AISuggestionsResponse>(response);
  },

  async getExtractedData(token: string, resumeId: number): Promise<ExtractedResumeData> {
    const response = await fetch(`${API_BASE_URL}/resumes/${resumeId}/extracted`, {
      headers: authHeaders(token),
    });
    return handleResponse<ExtractedResumeData>(response);
  },

  async reextractData(token: string, resumeId: number): Promise<ExtractedResumeData> {
    const response = await fetch(`${API_BASE_URL}/resumes/${resumeId}/extracted/reextract`, {
      method: "POST",
      headers: authHeaders(token),
    });
    return handleResponse<ExtractedResumeData>(response);
  },

  async fillTemplate(token: string, resumeId: number, templateSchema: TemplateSchema): Promise<FilledTemplateData> {
    const response = await fetch(`${API_BASE_URL}/resumes/${resumeId}/fill-template`, {
      method: "POST",
      headers: {
        ...authHeaders(token),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(templateSchema),
    });
    return handleResponse<FilledTemplateData>(response);
  },
};
