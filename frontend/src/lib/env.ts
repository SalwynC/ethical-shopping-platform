const REQUIRED_ENV_VARS = ["NEXT_PUBLIC_API_BASE_URL"] as const;

type RequiredEnvKey = (typeof REQUIRED_ENV_VARS)[number];

function loadEnv() {
  return {
    NEXT_PUBLIC_API_BASE_URL:
      process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000",
  };
}

const parsedEnv = loadEnv();

REQUIRED_ENV_VARS.forEach((key: RequiredEnvKey) => {
  if (!parsedEnv[key]) {
    throw new Error(`Missing environment variable: ${key}`);
  }
});

export const env = parsedEnv;

