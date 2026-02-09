## 2024-05-23 - AI Endpoint Validation
**Vulnerability:** The `/api/ask` endpoint lacked input validation and rate limiting, potentially allowing DoS and token exhaustion attacks on the AI model.
**Learning:** AI endpoints are particularly vulnerable to large input attacks because of the computational cost and context window limits of LLMs. Standard web server limits are often insufficient.
**Prevention:** Always implement strict character limits on user input, clamp result limits, and sanitize inputs before passing them to AI models. Use stateless validation where possible if stateful rate limiting is unavailable.
