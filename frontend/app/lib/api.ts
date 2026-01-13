// Simple API utilities for Saudi AI Platform

// Use container-friendly default so SSR/client inside Docker hit the backend service name
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://backend:8000';

export interface QueryRequest {
  query: string;
  conversation_id?: string;
}

export interface QueryResponse {
  response: string;
  confidence: number;
  sources: string[];
  conversation_id: string;
  processing_time: number;
}

export async function query(request: QueryRequest): Promise<QueryResponse> {
  const response = await fetch(`${BACKEND_URL}/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

export async function uploadFile(file: File): Promise<any> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${BACKEND_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

export async function getConversations(userId?: string): Promise<any[]> {
  const url = userId
    ? `${BACKEND_URL}/user/conversations?user_id=${encodeURIComponent(userId)}`
    : `${BACKEND_URL}/user/conversations`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  return data.conversations || [];
}
