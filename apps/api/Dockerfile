FROM python:3.12-slim

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install uv
RUN curl -LsSf https://astral.sh/uv/install.sh | env UV_INSTALL_DIR="/usr/local/bin" sh

# Set working directory
WORKDIR /app

# Copy dependency files
COPY pyproject.toml uv.lock ./

# Install dependencies using uv
RUN uv sync --frozen --no-dev

# Copy the rest of the application
COPY . .

# Expose port 7860 (required by Hugging Face Spaces)
EXPOSE 7860

# Run alembic migrations and start the server
CMD uv run alembic upgrade head && uv run uvicorn app.main:app --host 0.0.0.0 --port 7860
