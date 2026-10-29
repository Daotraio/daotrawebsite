// Server-side client for the Daotra API — the website's ONLY identity backend.
//
// The website stores no Publisher, no password and no session of its own: every
// registration, login, logout and password reset is forwarded to Daotra's
// `/public` and `/portal` routes from these server routes (see
// docs/DAOTRA_INTEGRATION.md). Never import this from a client component — it
// reads the gateway secret.
//
// What it sends besides the request itself:
//   X-Daotra-Gateway-Auth  the shared gateway secret, proving the call comes
//                          from this server (Daotra ADR-0030)
//   X-Daotra-Client-IP     the browser's address as Cloudflare saw it, so
//                          Daotra's per-address limits apply per browser rather
//                          than to the website as a whole. Daotra ignores it
//                          without a matching secret.
//
// What it never does: log a request or response body (they carry passwords,
// session tokens and personal data), follow a redirect, or cache.

if (typeof window !== "undefined") {
  throw new Error("lib/daotra-api is server-only");
}

const TIMEOUT_MS = 10_000;

export class DaotraUnavailableError extends Error {
  constructor(reason: string) {
    super(reason);
    this.name = "DaotraUnavailableError";
  }
}

export interface DaotraResponse {
  status: number;
  /** Parsed JSON, or null when the body was empty or not JSON. */
  body: unknown;
}

function baseUrl(): string {
  const raw = process.env.DAOTRA_API_BASE_URL?.trim();
  if (!raw) throw new DaotraUnavailableError("DAOTRA_API_BASE_URL is not set");
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new DaotraUnavailableError("DAOTRA_API_BASE_URL is not a URL");
  }
  // Passwords and session tokens travel on this connection.
  if (process.env.NODE_ENV === "production" && url.protocol !== "https:") {
    throw new DaotraUnavailableError("DAOTRA_API_BASE_URL must be https");
  }
  return url.toString().replace(/\/+$/, "");
}

export async function callDaotra(
  path: `/${string}`,
  options: {
    method?: "GET" | "POST";
    json?: unknown;
    /** A Daotra portal session token, sent as a bearer credential. */
    token?: string;
    /** The browser's address, from Cloudflare's CF-Connecting-IP. */
    clientIp?: string | null;
  } = {},
): Promise<DaotraResponse> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (options.json !== undefined) headers["Content-Type"] = "application/json";
  if (options.token) headers.Authorization = `Bearer ${options.token}`;
  const secret = process.env.DAOTRA_WEBSITE_GATEWAY_SECRET;
  if (secret) {
    headers["X-Daotra-Gateway-Auth"] = secret;
    if (options.clientIp) headers["X-Daotra-Client-IP"] = options.clientIp;
  }

  let response: Response;
  try {
    response = await fetch(`${baseUrl()}${path}`, {
      method: options.method ?? "GET",
      headers,
      body: options.json === undefined ? undefined : JSON.stringify(options.json),
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (error) {
    if (error instanceof DaotraUnavailableError) throw error;
    // The path and the error's kind only — never a body or a header.
    console.error("[daotra-api] request failed", { path, kind: (error as Error)?.name });
    throw new DaotraUnavailableError("Daotra API unreachable");
  }

  let body: unknown = null;
  const text = await response.text();
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = null;
    }
  }
  if (response.status >= 500) {
    console.error("[daotra-api] upstream error", { path, status: response.status });
  }
  return { status: response.status, body };
}

/** Daotra's error code (`{"error": "<code>", "message": ...}`), if any. */
export function errorCode(body: unknown): string | null {
  if (body && typeof body === "object" && "error" in body) {
    const code = (body as { error: unknown }).error;
    return typeof code === "string" ? code : null;
  }
  return null;
}
