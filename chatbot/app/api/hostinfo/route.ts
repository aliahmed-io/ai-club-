import os from "os";
import { NextResponse } from "next/server";

function getLANAddress() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      if (net && typeof net === "object" && "family" in net) {
        if ((net as any).family === "IPv4" && !(net as any).internal) {
          return (net as any).address as string;
        }
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


