# DotEnv

Items suffixed with `_DEV` will automatically replace the non-dev
version of the same item internally

```config
NODE_ENV=dev/prod

PORT=port
PORT_DEV=port

LOG_LEVEL=verbose/debug/warn/info
LOG_CONSOLE=true
LOG_FILE=logs.log
LOG_NET_HOST=xxx.xxx.xxx.xxx
LOG_NET_PORT=xxxx

DATABASE_HOST=host/path
DATABASE_HOST_DEV=host/path
DATABASE_PORT=5432
DATABASE_DB=legolog
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
```
