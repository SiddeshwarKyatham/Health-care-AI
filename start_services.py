import os
import subprocess
import sys
import time

def main():
    root_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.join(root_dir, "backend")
    frontend_dir = os.path.join(root_dir, "frontend")

    print("==========================================================")
    print("  Starting Clinical Decision Support System (5-Agent CDSS)")
    print("==========================================================")

    print("\n[1/2] Launching FastAPI Backend on http://localhost:8000 ...")
    backend_cmd = [sys.executable, "-m", "uvicorn", "app.main:app", "--reload", "--port", "8000"]
    backend_proc = subprocess.Popen(backend_cmd, cwd=backend_dir)

    time.sleep(2)

    print("\n[2/2] Launching Next.js Frontend on http://localhost:3000 ...")
    npm_bin = "npm.cmd" if os.name == "nt" else "npm"
    frontend_cmd = [npm_bin, "run", "dev"]
    frontend_proc = subprocess.Popen(frontend_cmd, cwd=frontend_dir)

    print("\n==========================================================")
    print("  ✓ Both services are actively running!")
    print("  • Frontend App:      http://localhost:3000")
    print("  • Backend API Docs:  http://localhost:8000/docs")
    print("==========================================================")
    print("Press Ctrl+C in this window to stop both servers gracefully.\n")

    try:
        backend_proc.wait()
        frontend_proc.wait()
    except KeyboardInterrupt:
        print("\n[!] Stopping backend and frontend servers...")
        backend_proc.terminate()
        frontend_proc.terminate()
        print("✓ Both servers stopped cleanly.")

if __name__ == "__main__":
    main()
