import { useState, useEffect } from "react";
import { type User } from "@/types/user";
import type { CreateData } from "../shared/useApi";
import {
  type FormData,
  type FormMode,
  getInitialFormData,
  userToFormData,
  validateField,
  validateForm,
  isFormValid,
  prepareSubmitData,
} from "@/utils/userFormValidation";

interface UseUserFormProps {
  mode: FormMode;
  user?: User | null;
  onSubmit: (data: CreateData<User>) => Promise<void>;
}

export const useUserForm = ({ mode, user, onSubmit }: UseUserFormProps) => {
  const [formData, setFormData] = useState<FormData>(getInitialFormData());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (user) {
      setFormData(userToFormData(user));
    } else {
      setFormData(getInitialFormData());
    }
    setErrors({});
    setTouched({});
  }, [user, mode]);

  const updateField = (name: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const blurField = (name: keyof FormData) => {
    setTouched((prev) => ({ ...prev, [name]: true }));

    const fieldError = validateField(name, formData[name], mode);
    setErrors((prev) => ({ ...prev, [name]: fieldError || "" }));
  };

  const handleSubmit = async () => {
    const allTouched = Object.keys(formData).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    );
    setTouched(allTouched);

    const formErrors = validateForm(formData, mode);

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      const submitData = prepareSubmitData(formData, mode);
      await onSubmit(submitData);
    } catch (error) {
      setErrors({ submit: "Failed to save user" });
      throw error;
    }
  };

  return {
    formData,
    errors,
    touched,
    isValid: isFormValid(formData, mode, errors),
    updateField,
    blurField,
    handleSubmit,
  };
};
