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
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30  # Standard expiry
    ACCESS_TOKEN_EXPIRE_MINUTES_REMEMBER: int = 43200  # 30 days for "remember me"

    # Nebius AI
    NEBIUS_API_KEY: str = ""
    NEBIUS_BASE_URL: str = "https://api.tokenfactory.nebius.com/v1/"
    NEBIUS_MODEL: str = "nvidia/Nemotron-Nano-V2-12b"

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
