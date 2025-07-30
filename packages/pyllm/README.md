# Python LLM service

TODO: Finalize which LLM (Zephyr, Mistral, etc.) I want to use


### To start the service

```shell
docker compose up --build
```

### To stop the service

```shell
docker compose down
```

Requests should be made to http://localhost:7862.

The expected format is multipart form data.
An example request is shown in `scripts/test-llm.sh`
