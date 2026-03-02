
import { URL } from "url";

export interface ParsedRequest {
    pathname: string;
    params: Record<string, string>;      // Route params  → /user/:id
    query: Record<string, string>;       // Query string  → /user?sort=asc
}

export function parseUrl(rawUrl: string, routePattern: string): ParsedRequest {
    const base = "http://localhost"; // needed to parse relative URLs
    const url = new URL(rawUrl, base);

    return {
        pathname: url.pathname,
        params: extractParams(routePattern, url.pathname),
        query: extractQuery(url.searchParams),
    };
}

function extractParams(pattern: string, pathname: string): Record<string, string> {
    const params: Record<string, string> = {};

    const patternParts = pattern.split("/");
    const pathParts = pathname.split("/");
    console.log("params")
    if (patternParts.length !== pathParts.length) return params;

    patternParts.forEach((segment, i) => {
        if (segment.startsWith(":")) {
            params[segment.slice(1)] = decodeURIComponent(pathParts[i]??"");
        }
    });

    return params;
}

function extractQuery(searchParams: URLSearchParams): Record<string, string> {
    const query: Record<string, string> = {};
    searchParams.forEach((value, key) => {
        query[key] = value;
    });
    console.log(query)
    return query;
}
