import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// GET /api/slots — fetch available slots, optionally filtered by date
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  const all = searchParams.get("all") === "true";

  let query = supabaseAdmin.from("slots").select("*").order("date").order("start_time");

  if (date) {
    query = query.eq("date", date);
  } else if (!all) {
    // Public: only future available slots
    query = query.eq("is_available", true).gte("date", new Date().toISOString().split("T")[0]);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ slots: data });
}

// POST /api/slots — admin: create a slot
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { date, start_time, end_time } = body;

    if (!date || !start_time || !end_time) {
      return NextResponse.json(
        { error: "date, start_time, and end_time are required." },
        { status: 400 }
      );
    }

    // Check for overlap
    const { data: existing } = await supabaseAdmin
      .from("slots")
      .select("id")
      .eq("date", date)
      .or(
        `and(start_time.lte.${end_time},end_time.gte.${start_time})`
      );

    if (existing && existing.length > 0) {
      return NextResponse.json(
        { error: "A slot already exists that overlaps with this time range." },
        { status: 409 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("slots")
      .insert({ date, start_time, end_time, is_available: true })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ slot: data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
}
