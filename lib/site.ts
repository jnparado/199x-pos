export function isMarketingPath(pathname: string) {
  return (
    pathname === "/" ||
    pathname.startsWith("/download") ||
    pathname.startsWith("/events") ||
    pathname.startsWith("/services") ||
    pathname.startsWith("/booking")
  );
}

export function isPublicPath(pathname: string) {
  return pathname === "/login" || isMarketingPath(pathname);
}
