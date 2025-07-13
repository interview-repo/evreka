import { z } from "zod";
import { UserSchema, type User } from "@/types/user";

export type FormData = Omit<User, "id" | "createdAt" | "updatedAt">;
export type FormMode = "create" | "edit";

export const getInitialFormData = (): FormData => ({
  name: "",
  email: "",
  password: "",
  role: "user",
  active: true,
  location: { latitude: 39.9334, longitude: 32.8597 },
});

export const userToFormData = (user: User): FormData => ({
  ...user,
  password: "",
});

export const createValidationSchema = (mode: FormMode) => {
  const baseSchema = UserSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  });

  if (mode === "edit") {
    return baseSchema.extend({
      password: z.string().optional().or(z.literal("")),
    });
  }

  return baseSchema;
};

export const validateField = (
  field: keyof FormData,
  value: any,
  mode: FormMode
): string | null => {
  try {
    const schema = createValidationSchema(mode);

    if (field === "password" && mode === "edit" && !value) {
      return null;
    }

    const fieldSchema = schema.shape[field as keyof typeof schema.shape];
    if (fieldSchema) {
      fieldSchema.parse(value);
    }

    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.issues[0]?.message || "Invalid value";
    }
    return "Invalid value";
  }
};

export const validateForm = (
  formData: FormData,
  mode: FormMode
): Record<string, string> => {
  const errors: Record<string, string> = {};

  Object.keys(formData).forEach((key) => {
    const field = key as keyof FormData;
    const error = validateField(field, formData[field], mode);
    if (error) {
      errors[field] = error;
    }
  });

  return errors;
};

export const isFormValid = (
  formData: FormData,
  mode: FormMode,
  errors: Record<string, string>
): boolean => {
  if (Object.values(errors).some(Boolean)) {
    return false;
  }

  if (!formData.name?.trim() || !formData.email?.trim()) {
    return false;
  }

  if (mode === "create" && !formData.password) {
    return false;
  }

  return true;
};

export const prepareSubmitData = (
  formData: FormData,
  mode: FormMode
): FormData => {
  const submitData = { ...formData };

  if (mode === "edit" && !submitData.password) {
    delete (submitData as any).password;
  }

  return submitData;
};
