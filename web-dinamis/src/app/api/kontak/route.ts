import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // In a real application, you might send an email here 
    // or insert into a messages table. 
    // Since we don't have a 'messages' table in the florist schema, 
    // we'll just mock a successful response.
    
    console.log("Pesan Kontak Diterima:", body);

    return NextResponse.json({ status: "ok", message: "Pesan terkirim" });
  } catch (error) {
    console.error("API /kontak error:", error);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}
