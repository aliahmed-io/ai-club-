import os from "os";
import { NextResponse } from "next/server";

function getLANAddress() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    const netInterfaces = nets[name];
    if (!netInterfaces) continue;
    for (const net of netInterfaces) {
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
  }
  return "127.0.0.1";
}

export async function GET() {
  const ip = getLANAddress();
  const port = Number(process.env.PORT || process.env.NEXT_PUBLIC_PORT || 3000);
  const protocol = process.env.VERCEL ? "https" : "http";
  const lanUrl = `${protocol}://${ip}:${port}/image`;
  return NextResponse.json({ ip, port, lanUrl });
}


