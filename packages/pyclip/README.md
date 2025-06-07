# Python CLIP service

### To start the service

```shell
docker compose up --build
```

### To stop the service

```shell
docker compose down
```

Requests should be made to http://localhost:7860.

The expected format is multipart form data.
An example request is shown in `scripts/test-clip.sh`
