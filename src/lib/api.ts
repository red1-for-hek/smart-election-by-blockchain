const API_BASE_URL = 'http://localhost:8000/api';

export interface VerificationRequest {
  nid_front: string;
  nid_back: string;
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

export const api = {
  async verifyIdentity(data: VerificationRequest): Promise<VerificationResponse> {
    const response = await fetch(`${API_BASE_URL}/verify/verify-identity`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Verification failed');
    }

    return response.json();
  },

  async healthCheck(): Promise<{ status: string }> {
    const response = await fetch('http://localhost:8000/health');
    return response.json();
  }
};