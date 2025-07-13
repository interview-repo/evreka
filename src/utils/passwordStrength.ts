export default function calculatePasswordStrength(password: string) {
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    numbers: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const strength = Object.values(checks).filter(Boolean).length;
  const levels = [
    "weak",
    "weak",
    "medium",
    "medium",
    "strong",
    "very-strong",
  ] as const;

  return {
    strength,
    checks,
    level: levels[strength],
  } as const;
}
