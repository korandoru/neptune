# Neptune

A dashboard to show GitHub events insight.

## Usage

1. Star backend:

```shell
cd neptune-backend
./gradlew bootRun
```

2. Query repo affinity order by cross repos popularity:

```shell
curl -H "Content-Type: application/json" -X GET http://127.0.0.1:8080/api/affinity/famous -d '{"origins": ["apache/pulsar"]}'
```

3. Query repo affinity order by relation ratio:

```shell
curl -H "Content-Type: application/json" -X GET http://127.0.0.1:8080/api/affinity/ratio -d '{"origins": ["apache/pulsar"]}'
```
