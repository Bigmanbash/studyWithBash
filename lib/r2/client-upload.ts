/**
 * Client-side file upload utility for browser environments.
 * Calls /api/upload to securely perform the R2 PutObject via server credentials.
 */
export const uploadFileClient = async (path: string, file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("path", path);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Upload failed");
  }

  const data = await res.json();
  return data.filePath;
};
