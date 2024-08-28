export const ALLOWED_FILE_TYPES = [
  "text/plain",
  "application/pdf",
  "image/png",
  "image/jpeg",
];

export const ACCEPT_STRING = ALLOWED_FILE_TYPES.map((type) => {
  if (type === "text/plain") return ".txt";
  if (type === "application/pdf") return ".pdf";
  return type;
}).join(",");
