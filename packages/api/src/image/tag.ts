import { execFile } from "node:child_process";
import { resolve } from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

// Path to your tag.sh script
const SCRIPT_PATH = resolve(__dirname, "../../../scripts/clip/tag.sh");

/**
 * Runs the tag.sh script on a given image file and returns type, coat, and breed.
 */
export async function getImageTags(imagePath: string): Promise<{
  type: string;
  coat: string;
  breed: string;
}> {
  try {
    const { stdout } = await execFileAsync(SCRIPT_PATH, [imagePath]);
    const lines = stdout.trim().split("\n");

    // Extract the classification lines
    const typeLine = lines.find((line) => line.startsWith("🔹 Type:"));
    const coatLine = lines.find((line) => line.startsWith("🔹 Coat:"));
    const breedLine = lines.find((line) => line.startsWith("🔹 Breed:"));

    if (!typeLine || !coatLine || !breedLine) {
      throw new Error("Unexpected tag.sh output format.");
    }

    return {
      type: typeLine.replace("🔹 Type: ", "").trim(),
      coat: coatLine.replace("🔹 Coat: ", "").trim(),
      breed: breedLine.replace("🔹 Breed: ", "").trim(),
    };
  } catch (error: any) {
    console.error("❌ Failed to classify image:", error.message);
    throw new Error(`CLIP tag error: ${error.message}`);
  }
}
