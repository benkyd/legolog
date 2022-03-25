# DotEnv

Items suffixed with `_DEV` will automatically replace the non-dev
version of the same item internally

```config
NODE_ENV=dev/prod

PORT=port
PORT_DEV=port

LOG_LEVEL=verbose/debug/warn/info
LOG_TARGET=console/filesystem/network
LOG_PATH=network ip/path

DATABASE_HOST=host/path
DATABASE_HOST_DEV=host/path
```
