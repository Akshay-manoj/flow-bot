import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL || "postgres://user:password@postgres:5432/flowbot";

export const pool = new Pool({
  connectionString,
});

let dbInitialized = false;

// Helper to initialize database schema
export async function initDb() {
  if (dbInitialized) return;
  
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS flows (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        nodes JSONB NOT NULL,
        links JSONB NOT NULL,
        is_published BOOLEAN DEFAULT false,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Seed default flow if none exists
    const res = await client.query("SELECT COUNT(*) FROM flows");
    if (parseInt(res.rows[0].count) === 0) {
      const defaultNodes = [
        { id: "n_start", type: "start", title: "START", description: "", left: 40, top: 10, colorClass: "bg-primary" },
        { id: "n1", type: "message", title: "Welcome Message", description: "\"Hi there! I'm FlowBot. How can I assist you today?\"", left: 240, top: 160, colorClass: "bg-primary" },
        { id: "n2", type: "question", title: "Ask Name", description: "Input: Full Name", details: "Waiting for response...", left: 440, top: 270, colorClass: "bg-secondary" },
        { id: "n3", type: "question", title: "Ask Email", description: "Input: Email Address", details: "Validation: Email", left: 640, top: 380, colorClass: "bg-primary" },
        { id: "n4", type: "delay", type_label: "Delay", title: "Delay", description: "Wait time: 5 seconds", details: "Pausing flow...", left: 840, top: 380, colorClass: "bg-gray-500" },
        { id: "n5", type: "condition", title: "Has Email?", description: "If/Else checks", left: 840, top: 220, colorClass: "bg-amber-500" },
        { id: "n6", type: "api", title: "Sync to Salesforce", description: "POST /leads/sync", details: "{ \"email\": \"{var_email}\" }", left: 1040, top: 80, colorClass: "bg-blue-500" },
        { id: "n7", type: "message", title: "Success Msg", description: "\"Thanks {var_name}! We'll be in touch.\"", left: 1240, top: 220, colorClass: "bg-primary" }
      ];
      const defaultLinks = [
        { from: "n_start", to: "n1" },
        { from: "n1", to: "n2" },
        { from: "n2", to: "n3" },
        { from: "n3", to: "n4" },
        { from: "n4", to: "n7" },
        { from: "n3", to: "n5" },
        { from: "n5", to: "n6" }
      ];
      await client.query(
        "INSERT INTO flows (id, title, nodes, links, is_published) VALUES ($1, $2, $3, $4, $5)",
        ["lead-gen", "Lead Gen - Q4 Campaign", JSON.stringify(defaultNodes), JSON.stringify(defaultLinks), true]
      );
    }
    dbInitialized = true;
  } catch (err) {
    console.error("Failed to initialize database schema:", err);
  } finally {
    client.release();
  }
}
