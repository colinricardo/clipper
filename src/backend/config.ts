export const isProduction =
  process.env.NODE_ENV === "production" ? true : false;

export const BACKEND_API =
  process.env.BACKEND_API || "http://127.0.0.1:5000/v1";

export const ADMIN_EMAILS = ["colin@colin.fun", "colin@galactus.dev"];

export const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
export const LOGTAIL_TOKEN = "toVDCLvMbBMonfKCQGpUd7Q9";
export const GIT_COMMIT_SHA = process.env.VERCEL_GIT_COMMIT_SHA;
export const APP_NAME = "clipper";
