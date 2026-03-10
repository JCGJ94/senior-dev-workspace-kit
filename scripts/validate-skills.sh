#!/usr/bin/env bash

# Use the platform-correct python command (preferring python over python3 on Windows)
if python --version >/dev/null 2>&1; then
    PYTHON_CMD="python"
elif python3 --version >/dev/null 2>&1; then
    PYTHON_CMD="python3"
else
    echo "❌ Error: Python not found. Please install Python to run validation."
    exit 1
fi

$PYTHON_CMD "$(dirname "$0")/validate-skills.py" "$@"
