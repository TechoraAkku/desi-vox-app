// Demo auth. When the backend is ready, replace the body of verifyOtp
// (and add sendOtp) with the real API calls. Screens will not need changes.
export const DEMO_OTP = '1111';

export type VerifyResult = { ok: boolean; message?: string };

export async function verifyOtp(phone: string, code: string): Promise<VerifyResult> {
  // TODO: POST /auth/verify-otp { phone, code }
  await new Promise((r) => setTimeout(r, 600)); // fake network delay
  return code === DEMO_OTP ? { ok: true } : { ok: false, message: 'Invalid OTP. Please try again.' };
}
