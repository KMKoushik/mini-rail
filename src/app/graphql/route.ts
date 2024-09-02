// graphql proxy route to connect to railway api
import { NextRequest, NextResponse } from "next/server";
import { RAILWAY_GRAPHQL_URL } from "~/lib/constants";

export async function GET(request: NextRequest) {
  return handleProxy(request);
}

export async function POST(request: NextRequest) {
  return handleProxy(request);
}

async function handleProxy(request: NextRequest) {
  const url = new URL(request.url);
  const targetUrl = new URL(RAILWAY_GRAPHQL_URL);

  targetUrl.search = url.search;

  const headers = new Headers(request.headers);
  // headers.set("Origin", targetUrl.origin);

  try {
    const fetchOptions: RequestInit = {
      method: request.method,
      headers: headers,
    };

    // Only include body for POST requests
    if (request.method === "POST") {
      // TypeError: RequestInit: duplex option is required when sending a body
      fetchOptions.body = await request.text();
    }

    const response = await fetch(targetUrl.toString(), fetchOptions);

    const corsHeaders = new Headers(response.headers);
    corsHeaders.delete("Content-Encoding"); // nextjs handles the encoding so need to remove this

    const proxyResponse = new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: corsHeaders,
    });

    // Set CORS headers
    proxyResponse.headers.set("Access-Control-Allow-Origin", "*");
    proxyResponse.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS"
    );
    proxyResponse.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );

    return proxyResponse;
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
