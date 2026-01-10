"use client";

import { cn } from "@/lib/utils";

interface PasswordStrengthProps {
  password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const getStrength = (pwd: string): number => {
    if (pwd.length === 0) return 0;

    let strength = 0;

    // Length
    if (pwd.length >= 8) strength++;
    if (pwd.length >= 12) strength++;

    // Contains lowercase
    if (/[a-z]/.test(pwd)) strength++;

    // Contains uppercase
    if (/[A-Z]/.test(pwd)) strength++;

    // Contains number
    if (/[0-9]/.test(pwd)) strength++;

    // Contains special character
    if (/[^a-zA-Z0-9]/.test(pwd)) strength++;

    return Math.min(strength, 4); // Max 4 levels
  };

  const strength = getStrength(password);

  const getColor = () => {
    if (strength === 0) return "bg-gray-600";
    if (strength === 1) return "bg-red-500";
    if (strength === 2) return "bg-orange-500";
    if (strength === 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getLabel = () => {
    if (strength === 0) return "";
    if (strength === 1) return "Weak";
    if (strength === 2) return "Fair";
    if (strength === 3) return "Good";
    return "Strong";
  };

  if (password.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={cn(
              "h-1 flex-1 rounded-full transition-all",
              level <= strength ? getColor() : "bg-gray-700"
            )}
          />
        ))}
      </div>
      <p className={cn("text-xs", strength >= 3 ? "text-green-400" : "text-gray-400")}>
        {getLabel()}
      </p>
    </div>
  );
}
