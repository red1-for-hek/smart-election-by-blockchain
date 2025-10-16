const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface VerificationData {
  nidFront: string;
  nidBack: string;
  face: string;
}

export interface VerificationResponse {
  nid_verified: boolean;
  face_verified: boolean;
  overall_verified: boolean;
  nid_confidence: number;
  face_confidence: number;
  message: string;
}

export async function verifyIdentity(data: VerificationData): Promise<VerificationResponse> {
  const response = await fetch(`${API_BASE_URL}/api/verify/verify-identity`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      nid_front: data.nidFront,
      nid_back: data.nidBack,
      face: data.face,
    }),
  });

  if (!response.ok) {
    throw new Error('Verification failed');
  }

  return response.json();
}
