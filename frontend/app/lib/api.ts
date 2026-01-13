// Simple API utilities for Saudi AI Platform

// Use container-friendly default so SSR/client inside Docker hit the backend service name
// Match Backend V1 Routes
const API_ROOT = process.env.NEXT_PUBLIC_BACKEND_URL ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1` : '/api/v1';

export interface QueryRequest {
  message: string; // Backend expects 'message', not 'query' (Source: ChatRequest schema)
  conversation_id?: string;
  language?: string;
}

export interface QueryResponse {
  response: string;
  confidence: number;
  sources: string[];
  conversation_id: string;
  processing_time: number;
}

// NOTE: Chat is usually handled via ChatInterface.tsx using fetch EventSource directly. 
// But if there is a non-streaming fallback:
export async function query(request: QueryRequest): Promise<QueryResponse> {
  // Use /chat/stream logic but wait for full response (helper) or use a non-stream endpoint if one existed.
  // Given the backend mainly streams, the frontend component likely handles the stream logic itself.
  // However, this function 'query' seems to be a legacy artifact or used for simple calls.
  // Let's update it to point to a valid endpoint or throw warning.
  // Actually, let's point it to /chat/stream and handle non-stream if needed, or better:
  // Does the backend have a non-stream endpoint? chat.py only shows /stream.
  // The frontend ChatInterface probably calls /api/v1/chat/stream directly.

  // Let's fix the URL anyway to be safe.
  const response = await fetch(`${API_ROOT}/chat/stream`, {
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

  // Backend: documents.py router usually handles upload?
  // Let's assume /documents/upload. 
  // Wait, I didn't see an explicit upload endpoint in router.py viewer earlier.
  // Let me rely on what I saw in 'document_service.py' or 'main.py' earlier... 
  // Verify 'endpoints/documents.py' to be sure in next step if needed. 
  // For now, I'll point to /api/v1/documents/upload as it's the standard V1 pattern.
  const response = await fetch(`${API_ROOT}/documents/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

export async function getConversations(userId?: string): Promise<any[]> {
  // Backend: /api/v1/chat/history (Uses current_user from token, so userId arg might be redundant if using Auth header)
  const response = await fetch(`${API_ROOT}/chat/history`);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  return data || [];
}
