const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const API_TIMEOUT = 10000; // 10 seconds

interface SendMessageRequest {
  to: string;
  message: string;
}

interface SendMessageResponse {
  success: boolean;
  sid?: string;
  error?: string;
}

interface WebhookRequest {
  From: string;
  To: string;
  Body: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout: number = API_TIMEOUT
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError('Request timeout', 408);
    }
    throw error;
  }
}

export async function sendMessage(data: SendMessageRequest): Promise<SendMessageResponse> {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/send-message`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new ApiError(
        result.error || 'Failed to send message',
        response.status,
        result
      );
    }

    return result;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error occurred',
      0
    );
  }
}

export async function testWebhook(data: WebhookRequest): Promise<Response> {
  try {
    const formData = new URLSearchParams();
    formData.append('From', data.From);
    formData.append('To', data.To);
    formData.append('Body', data.Body);

    const response = await fetchWithTimeout(
      `${API_BASE_URL}/webhook`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      }
    );

    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error occurred',
      0
    );
  }
}

export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/swagger`,
      {
        method: 'GET',
      },
      5000 // Shorter timeout for health checks
    );

    return response.ok;
  } catch (error) {
    return false;
  }
}

export { API_BASE_URL };
