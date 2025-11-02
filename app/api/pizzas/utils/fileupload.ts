import { createClient } from "@supabase/supabase-js";

export async function saveFile(file: File, folder = ""): Promise<string> {
  if (!file) throw new Error("No file provided");

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const bucket = process.env.SUPABASE_BUCKET!;
    const { data: listData, error: listError } = await supabase.storage
      .from(bucket)
      .list("", { limit: 1 });

    if (listError) {
      console.error("Storage list error (auth/permission):", listError);
      throw listError;
    }
    console.log("Storage list OK, entries:", listData?.length ?? 0);

    const ext = String(file.name).split(".").pop();
    const base = String(file.name)
      .replace(/\s+/g, "_")
      .replace(/\.[^/.]+$/, "");
    const uniqueName = `${base}-${Date.now()}.${ext}`;
    const path = `${folder ? folder + "/" : ""}${uniqueName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file);

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      throw uploadError;
    }

    const publicResult = supabase.storage
      .from(bucket)
      .getPublicUrl(uploadData?.path);
    const publicUrl = publicResult?.data?.publicUrl;
    if (publicUrl) return publicUrl;

    const { data: signedData, error: signedError } = await supabase.storage
      .from(bucket)
      .createSignedUrl(uploadData?.path, 60 * 60);

    if (signedError) {
      console.error("createSignedUrl error:", signedError);
      throw signedError;
    }

    return signedData.signedUrl;
  } catch (err) {
    console.error("Error in saveFile:", err);
    throw err;
  }
}
