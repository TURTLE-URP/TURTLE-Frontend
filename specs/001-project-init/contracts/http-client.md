# Contract: HTTP Client

**Feature**: Project Init | **Date**: 2026-08-02

Defines how the SPA talks to backends over the network. The contract is
implemented by `src/lib/http/http.ts` using the native browser `fetch` API
(no HTTP client dependency, per the Technology Stack section).

## Conventions

- Requests are made with the native `fetch` API; no third-party HTTP client.
- JSON is assumed for request bodies and responses.
- A timeout applies to every request; timeouts and network failures resolve to
  a standardized error (never an unhandled rejection).
- Non-2xx responses are normalized into the same error shape as network
  failures, carrying the HTTP status when available.
- Error messages are user-safe (no secrets, no stack traces) and log-safe
  (details to console only in development).
- No tokens are stored in code; authentication is out of scope for this
  feature and will be specified with the first backend integration.

## Request

```
method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
url: string            (resolved against VITE_API_BASE_URL when set)
body?: unknown         (JSON-serializable)
headers?: HeadersInit  (merged over defaults)
signal?: AbortSignal
timeoutMs?: number     (default 10_000)
```

## Response

```
Success: parsed JSON body (or void for 204)
Error: HttpError { kind: 'timeout' | 'network' | 'http', status?: number, message: string }
```

## Reference

`src/lib/http/http.ts` is the implementation; its logic tests are part of the
feature's test plan. Reuse this wrapper for all backend calls in future
features.
