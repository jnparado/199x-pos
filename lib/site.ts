export function isMarketingPath(pathname: string) {
  return (
    pathname === "/" ||
    pathname.startsWith("/download") ||
    pathname.startsWith("/events") ||
    pathname.startsWith("/services") ||
    pathname.startsWith("/booking") ||
    pathname.startsWith("/menu") ||
    pathname.startsWith("/about") ||
    pathname.startsWith("/contact")
  );
}

export function isPublicPath(pathname: string) {
  return pathname === "/login" || isMarketingPath(pathname);
}
