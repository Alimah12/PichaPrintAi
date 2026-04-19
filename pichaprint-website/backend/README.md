Quickstart

1. Create a virtual env and install dependencies:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

2. Run the app:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The SQLite DB will be created at `pichaprint.db` in the backend folder.

Endpoints:
- POST /auth/signup {email,password}
- POST /auth/login {email,password}
- GET /me (bearer token)
- POST /designs (bearer token)
- GET /designs (bearer token)
- GET /designs/{id} (bearer token)

Environment file
-------------

For local development you can edit the `.env` file in the `backend/` folder (it contains placeholders).

For production with a hosted Postgres, set the `DATABASE_URL` env var or update `.env` with the connection string. Example formats:

```bash
# Basic Postgres: 
DATABASE_URL=postgresql://username:password@db-host.example.com:5432/pichaprint

# If SSL is required by your provider:
DATABASE_URL=postgresql://username:password@db-host.example.com:5432/pichaprint?sslmode=require
```

Generate a secure `SECRET_KEY` for production, for example:

```bash
python - <<'PY'
import secrets
print(secrets.token_urlsafe(32))
PY
```

If you plan to use Postgres or another hosted DB, set `DATABASE_URL` in your `.env` (or export it in the environment) to the connection string before starting the app.

Note: `psycopg2-binary` is included in `requirements.txt` so the app can connect to Postgres.
