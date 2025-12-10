# How to Run ConvoSpan Locally with Docker

Now that Docker is configured, you can easily run the entire application (Database, App, and Worker) with a single command.

## Prerequisites
- Docker Desktop installed and running.

## 1. Start the Application
Open your terminal in the project root (`d:\Convo\extracted\convospan-final`) and run:

```powershell
docker compose up --build
```

- **--build**: Ensures the images are rebuilt with your latest code changes.
- The first time you run this, it may take a few minutes to download images and install dependencies.

## 2. Access the Application
Once the logs show that the server is running (you'll see a message like `Ready in ...`), open your web browser and go to:

**[http://localhost:3000](http://localhost:3000)**

## 3. Stop the Application
To stop the application, press `Ctrl+C` in the terminal where it's running.

To remove the containers and network (clean up), run:
```powershell
docker compose down
```

## Troubleshooting
- **Command not found**: If you see "The term 'docker' is not recognized", ensure Docker Desktop is installed and running. If you just installed it, **restart your terminal** or computer.
- **Port Conflicts**: If port 3000 or 5432 is already in use, you may need to stop other services or change the ports in `docker-compose.yml`.
- **Database Issues**: If you need to reset the database completely, run `docker compose down -v` (this **deletes** all data).
