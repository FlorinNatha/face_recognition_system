Deployment notes
===============

Problem: Railway buildpack error "Railpack could not determine how to build the app." usually means the repo lacks a recognisable build manifest (e.g. `requirements.txt`, `package.json`, `Dockerfile`, or Procfile).

What I added
- `requirements.txt` — lets Railway detect a Python app and install packages.
- `Procfile` — tells Railway how to run the web process: `gunicorn app:app`.
- `runtime.txt` — pins a Python version for buildpacks.
- `Dockerfile` — a full container build (recommended for `dlib` since it requires native build tools).

Recommended deployment options
1) Railway using buildpack (quick)
   - Railway will detect `requirements.txt` and `Procfile` and should build automatically.
   - WARNING: `face_recognition` depends on `dlib`, which often requires heavy native builds (CMake, build tools). Railway's build environment may fail building `dlib` (long build time or missing packages).

2) Railway using Docker (recommended for this project)
   - Use the included `Dockerfile`. In Railway create a new service and choose "Deploy using Dockerfile" or configure their Docker deploy.
   - Dockerfile installs needed apt packages and then pip installs dependencies so `dlib` can be built.

3) Alternative hosts
   - Render, Fly.io, or Google Cloud Run: they support Docker deployments and provide more predictable build environments for native packages.

If build fails for `dlib`
- Option A: use a prebuilt wheel for your platform (not always available). Try installing `dlib` with a wheel or use `conda` based images.
- Option B: Use a smaller alternative to `face_recognition` (e.g., `face_recognition_models` or a lightweight model) if you only need basic detection.

Quick test commands (locally)
```powershell
# build docker image locally
docker build -t face-rec-app .

# run container (map port 5000)
docker run -p 5000:5000 face-rec-app
```

If you want, I can:
- Try to deploy a Docker image to Railway for you (I can provide exact Railway steps), or
- Adjust `requirements.txt` to use specific versions or switch to `dlib` wheel instructions.
