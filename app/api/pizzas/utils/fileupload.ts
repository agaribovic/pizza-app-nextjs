import { createClient } from "@supabase/supabase-js";

/**
 * Uploads a file to Supabase Storage (optionally in a subfolder)
 * and returns the public URL of the uploaded file.
 *
 * @param file - File object from FormData
 * @param folder - Optional subfolder inside the Supabase bucket
 * @returns string - Public URL of the uploaded file
 */

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function saveFile(file: File, folder = ""): Promise<string> {
  if (!file) throw new Error("No file provided");

  try {
    const ext = file.name.split(".").pop();
    const base = file.name.replace(/\s+/g, "_").replace(/\.[^/.]+$/, "");
    const uniqueName = `${base}-${Date.now()}.${ext}`;
    const bucket = process.env.SUPABASE_BUCKET!;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(`${folder ? folder + "/" : ""}${uniqueName}`, file);

    if (error) {
      console.error("Supabase upload error:", error);
      throw new Error(`Supabase upload failed: ${error.message}`);
    }

    const { publicUrl } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path).data;

    if (!publicUrl) throw new Error("Failed to get public URL");

    return publicUrl;
  } catch (err) {
    console.error("Error in saveFile:", err);
    throw new Error("Failed to upload file to Supabase");
  }
}
