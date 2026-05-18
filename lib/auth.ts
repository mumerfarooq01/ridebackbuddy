import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);
const COOKIE = "rb_admin_token";
const DRIVER_COOKIE = "rb_driver_token";
const CUSTOMER_COOKIE = "rb_customer_token";

export interface JwtPayload {
  id: string;
  email: string;
  name: string;
  role: string;
}

export async function signToken(payload: JwtPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(SECRET);
}

export async function verifyToken(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as JwtPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<JwtPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function getDriverSession(): Promise<JwtPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(DRIVER_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function getCustomerSession(): Promise<JwtPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(CUSTOMER_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export { COOKIE, DRIVER_COOKIE, CUSTOMER_COOKIE };
