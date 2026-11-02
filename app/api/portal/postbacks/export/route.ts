import { NextRequest, NextResponse } from "next/server";
import { DaotraUnavailableError, fetchDaotraFile } from "@/lib/daotra-api";
import {
  exportQuery,
  parseExportFormat,
  parsePostbackFilters,
  postbackQuery,
  type ExportError,
} from "@/lib/portal-business";
import { publisherPortalPaths } from "@/lib/portal-paths";
import { SESSION_COOKIE } from "@/lib/portal-session";
import { clientIp } from "@/lib/request-guards";

export const runtime = "nodejs";

// The Postbacks Log export (Daotra BD-91 as amended 2026-11-02): the signed-in Publisher's
// own delivered postbacks the current filters match — every row, not the visible page — as
// CSV or Excel, produced by Daotra and passed through here as bytes.
//
// The browser sends only its session cookie; the token travels to Daotra as a bearer from
// this server and never back. The filters are re-read from the allowlist, so nothing else in
// the URL is forwarded, and Daotra applies the Publisher and every filter in its own query.
// A GET that changes nothing: a cross-site link can make a browser download its own file,
// and the page that linked cannot read it.

const FILE_TYPES = new Set([
  "text/csv; charset=utf-8",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
]);
const FILE_NAME = /^attachment; filename="daotra-postbacks-[0-9TZ]+\.(csv|xlsx)"$/;

function backToLog(
  req: NextRequest,
  paths: ReturnType<typeof publisherPortalPaths>,
  query: string,
  error: ExportError,
): NextResponse {
  const separator = query ? "&" : "?";
  return NextResponse.redirect(new URL(`${paths.postbacks}${query}${separator}export_error=${error}`, req.url), 303);
}

export async function GET(req: NextRequest) {
  const paths = publisherPortalPaths(req.headers.get("host"));
  const params = Object.fromEntries(req.nextUrl.searchParams.entries());
  const filters = parsePostbackFilters(params);
  const withoutPosition = { ...filters, cursor: undefined };
  const format = parseExportFormat(req.nextUrl.searchParams.get("format"));
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return NextResponse.redirect(new URL(paths.login, req.url), 303);
  if (!format) return backToLog(req, paths, postbackQuery(withoutPosition), "unavailable");

  let file;
  try {
    file = await fetchDaotraFile(`/portal/postbacks/export${exportQuery(withoutPosition, format)}`, {
      token,
      clientIp: clientIp(req.headers),
    });
  } catch (error) {
    // Unreachable, redirected, or a body that could not be read: temporary.
    if (!(error instanceof DaotraUnavailableError)) throw error;
    return backToLog(req, paths, postbackQuery(withoutPosition), "unavailable");
  }
  if (file.status === 401 || file.status === 403) return NextResponse.redirect(new URL(paths.login, req.url), 303);
  // Daotra's refusal of the export itself (beyond its row or time limit): narrow the filters.
  if (file.status === 422) return backToLog(req, paths, postbackQuery(withoutPosition), "too_large");
  // Anything else unexpected — an upstream error, an invalid or foreign response: temporary.
  // Never a truncated or foreign file, and nothing of the response is shown.
  if (
    file.status !== 200 ||
    !file.contentType ||
    !FILE_TYPES.has(file.contentType) ||
    !file.contentDisposition ||
    !FILE_NAME.test(file.contentDisposition)
  ) {
    return backToLog(req, paths, postbackQuery(withoutPosition), "unavailable");
  }
  return new NextResponse(file.body, {
    status: 200,
    headers: {
      "Content-Type": file.contentType,
      "Content-Disposition": file.contentDisposition,
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
