import { Argon2id } from "oslo/password";

export async function hash(value: string) {
  const argon2 = new Argon2id()
  return argon2.hash(value);
}

export function verify(hashedValue: string, value: string) {
  return new Argon2id().verify(hashedValue, value);
}
