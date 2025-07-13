import { useState, useEffect } from "react";
import { UserSchema, type User } from "@/types/user";
import type { CreateData } from "../shared/useApi";

type FormData = Omit<User, "id" | "createdAt" | "updatedAt">;

interface UseUserFormProps {
  mode: "create" | "edit";
  user?: User | null;
  onSubmit: (data: CreateData<User>) => Promise<void>;
}

export const useUserForm = ({ mode, user, onSubmit }: UseUserFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    role: "user",
    active: true,
    location: { latitude: 39.9334, longitude: 32.8597 },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setFormData({ ...user, password: "" });
    } else {
      // Reset form when no user (create mode)
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "user",
        active: true,
        location: { latitude: 39.9334, longitude: 32.8597 },
      });
    }
    setErrors({});
  }, [user, mode]);

  const updateField = (
    name: keyof FormData,
    value: FormData[keyof FormData]
  ) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const blurField = (name: keyof FormData) => {
    try {
      if (mode === "edit" && name === "password" && !formData.password) return;

      const schema = UserSchema.omit({
        id: true,
        createdAt: true,
        updatedAt: true,
      });
      schema.shape[name].parse(formData[name]);
      setErrors((prev) => ({ ...prev, [name]: "" }));
    } catch (error) {
      if (error instanceof Error) {
        setErrors((prev) => ({ ...prev, [name]: error.message }));
      }
    }
  };

  const handleSubmit = async () => {
    try {
      await onSubmit(formData);
    } catch (error) {
      setErrors({ submit: "Failed to save user" });
      throw error;
    }
  };

  const isValid =
    !Object.values(errors).some(Boolean) &&
    formData.name &&
    formData.email &&
    (mode === "edit" || formData.password);

  return {
    formData,
    errors,
    isValid,
    updateField,
    blurField,
    handleSubmit,
  };
};
