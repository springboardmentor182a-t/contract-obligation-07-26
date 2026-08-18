// Client-side password strength check (length + variety of characters).
// Used by SignupForm to give instant feedback before submitting.
export default function useVerifyPassword() {
  function verify(password) {
    if (!password || password.length < 8) {
      return { valid: false, message: "Use at least 8 characters." };
    }
    const hasNumber = /\d/.test(password);
    const hasLetter = /[a-zA-Z]/.test(password);
    if (!hasNumber || !hasLetter) {
      return { valid: false, message: "Mix letters and numbers for a stronger password." };
    }
    return { valid: true, message: "Looks good." };
  }
  return { verify };
}
