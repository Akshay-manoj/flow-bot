import { NextResponse } from "next/server";
import { pool, initDb } from "@/lib/db";

export async function GET() {
  try {
    await initDb();
    const res = await pool.query("SELECT * FROM flows WHERE id = $1", ["lead-gen"]);
    if (res.rows.length === 0) {
      return NextResponse.json({ error: "Flow not found" }, { status: 404 });
    }
    return NextResponse.json(res.rows[0]);
  } catch (error: any) {
    console.error("GET /api/flows error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch flows" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await initDb();
    const body = await request.json();
    const { title, nodes, links, isPublished } = body;
    
    await pool.query(
      `INSERT INTO flows (id, title, nodes, links, is_published, updated_at) 
       VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
       ON CONFLICT (id) DO UPDATE 
       SET title = $2, nodes = $3, links = $4, is_published = $5, updated_at = CURRENT_TIMESTAMP`,
      ["lead-gen", title, JSON.stringify(nodes), JSON.stringify(links), isPublished]
    );
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("POST /api/flows error:", error);
    return NextResponse.json({ error: error.message || "Failed to save flow" }, { status: 500 });
  }
}
