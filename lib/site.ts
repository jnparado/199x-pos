export function isMarketingPath(pathname: string) {
  return pathname === "/" || pathname.startsWith("/download");
}

export function isPublicPath(pathname: string) {
  return pathname === "/login" || isMarketingPath(pathname);
}
