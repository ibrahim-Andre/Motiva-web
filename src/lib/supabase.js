import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ktlphycqxjupnbjuebeo.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0bHBoeWNxeGp1cG5ianVlYmVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0ODc0NjgsImV4cCI6MjA5NTA2MzQ2OH0.xpE77EsPmun6vCSzYMiSo68m7QtetaT03NXYyI32Pxs";

export const supabase = createClient(
    supabaseUrl,
    supabaseKey
);