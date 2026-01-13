from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "API"
    API_V1_STR: str = "/api/v1"
    CORS_ORIGINS: list[str] = ["http://localhost:3000"]

    # Database
    SQLITE_DB_PATH: str = "app.db"

    @property
    def DATABASE_URL(self) -> str:
        return f"sqlite:///./{self.SQLITE_DB_PATH}"

    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours default
    ACCESS_TOKEN_EXPIRE_MINUTES_REMEMBER: int = 43200  # 30 days for "remember me"

    # Nebius AI
    NEBIUS_API_KEY: str = ""
    NEBIUS_BASE_URL: str = "https://api.tokenfactory.nebius.com/v1/"
    # VLM model for resume extraction (vision-language model)
    NEBIUS_VLM_MODEL: str = "google/gemma-3-27b-it-fast"
    # LLM model for template filling (text generation)
    NEBIUS_LLM_MODEL: str = "moonshotai/Kimi-K2-Instruct"

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
