// Mock signup — TODO: replace with a real call to POST /auth/signup once
// the server implements it (see server/src/auth/controller.py).
export async function signup(name, email, password) {
  await new Promise((r) => setTimeout(r, 400));
  if (!name || !email || !password) throw new Error("Fill in every field to create an account.");
  return { name, email, role: "Administrator" };
}

export default signup;
