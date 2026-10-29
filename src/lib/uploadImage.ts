import { api } from "../store/site";
export async function uploadImage(file: File): Promise<string> {
  if (file.size > 2_000_000) throw new Error("Image must be 2 MB or smaller.");
  const data = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] || "");
    reader.onerror = () => reject(new Error("Could not read image"));
    reader.readAsDataURL(file);
  });
  return (await api<{ url: string }>("/admin/uploads", "POST", { data })).url;
}
