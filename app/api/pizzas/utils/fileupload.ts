import fs from "fs";
import path from "path";

/**
 * Saves an uploaded file to /public/images (optionally in a subfolder)
 * and returns the public path.
 *
 * @param file - File object from FormData
 * @param folder - Optional subfolder under /public/images
 * @returns string - public path to the saved file, e.g., /images/filename-123456.jpg
 */
export async function saveFile(file: File, folder = ""): Promise<string> {
  if (!file) throw new Error("No file provided");

  try {
    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadDir = path.join(process.cwd(), "public", "images", folder);
    fs.mkdirSync(uploadDir, { recursive: true });

    const ext = path.extname(file.name);
    const base = path.basename(file.name, ext).replace(/\s+/g, "_");
    const uniqueName = `${base}-${Date.now()}${ext}`;

    const filePath = path.join(uploadDir, uniqueName);
    fs.writeFileSync(filePath, buffer);

    const publicPath = `/images${folder ? `/${folder}` : ""}/${uniqueName}`;
    return publicPath;
  } catch (err) {
    console.error("Error saving file:", err);
    throw new Error("Failed to save file");
  }
}
