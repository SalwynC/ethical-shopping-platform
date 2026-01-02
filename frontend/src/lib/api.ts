import { env } from './env';
import type {
  AnalyzeRequest,
  AnalyzeResponse,
  AlternativesResponse,
  HealthResponse,
  PredictPriceRequest,
  PredictPriceResponse,
  RulesResponse,
} from '@/types/api';

const JSON_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(
      errorBody?.message ?? `Request failed with status ${response.status}`,
    );
  }

  return response.json() as Promise<T>;
}

async function fetchWithErrorHandling<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return handleResponse<T>(res);
  } catch (error) {
    // Handle network errors (connection refused, timeout, etc.)
    if (
      error instanceof TypeError &&
      (error.message.includes('fetch') ||
        error.message.includes('Failed to fetch') ||
        error.message.includes('NetworkError'))
    ) {
      // Network error - backend is likely not running
      throw new Error(
        'Unable to connect to the server. Please ensure the backend is running.',
      );
    }
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    // Re-throw other errors as-is
    throw error;
  }
}

export function getApiBaseUrl() {
  return env.NEXT_PUBLIC_API_BASE_URL.replace(/\/$/, '');
}

export async function analyzeProduct(
  payload: AnalyzeRequest,
): Promise<AnalyzeResponse> {
  const res = await fetch(`${getApiBaseUrl()}/api/analyze`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(payload),
    cache: 'no-store',
  });

  return handleResponse<AnalyzeResponse>(res);
}

export async function predictPrice(
  payload: PredictPriceRequest,
): Promise<PredictPriceResponse> {
  const res = await fetch(`${getApiBaseUrl()}/api/predict`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(payload),
  });

  return handleResponse<PredictPriceResponse>(res);
}

export async function fetchAlternatives(
  query: URLSearchParams,
): Promise<AlternativesResponse> {
  const res = await fetch(
    `${getApiBaseUrl()}/api/alternatives?${query.toString()}`,
    {
      method: 'GET',
      headers: JSON_HEADERS,
      cache: 'no-store', // Force dynamic fetching
    },
  );

  return handleResponse<AlternativesResponse>(res);
}

export async function fetchRules(): Promise<RulesResponse> {
  const res = await fetch(`${getApiBaseUrl()}/api/rules`, {
    method: 'GET',
    headers: JSON_HEADERS,
    cache: 'no-store', // Force dynamic fetching
  });

  return handleResponse<RulesResponse>(res);
}

export async function fetchHealth(): Promise<HealthResponse> {
  return fetchWithErrorHandling<HealthResponse>(
    `${getApiBaseUrl()}/api/health`,
    {
      method: 'GET',
      headers: JSON_HEADERS,
      cache: 'no-store',
    },
  );
}

export async function fetchLiveStats(): Promise<{
  success: boolean;
  data?: {
    analyzing: number;
    processed: number;
    saved: number;
    timestamp: string;
  };
  error?: string;
}> {
  return fetchWithErrorHandling(`${getApiBaseUrl()}/api/live-stats`, {
    method: 'GET',
    headers: JSON_HEADERS,
    cache: 'no-store',
  });
}
