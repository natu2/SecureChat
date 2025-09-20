:: There is still an issue with pycryptodome installation on Windows. Not sure if the issue is with my machine or with the script.
@echo off
echo 🚀 Setting up SecureChat Backend...

:: Check if uv is installed
where uv >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo 📦 uv not found. Installing uv via pip...
    pip install uv
    if %ERRORLEVEL% neq 0 (
        echo ❌ Failed to install uv. Please install it manually.
        exit /b 1
    )
    echo ✅ uv installed successfully!
) else (
    echo ✅ uv is already installed
)

:: Install dependencies
echo 📚 Installing dependencies...
uv sync
pip install pycryptodome

echo 🎉 Setup complete! You can now run the backend with:
echo    uv run python run.py
echo.
echo Or using uvicorn directly:
echo    uv run uvicorn main:app --reload --host 0.0.0.0 --