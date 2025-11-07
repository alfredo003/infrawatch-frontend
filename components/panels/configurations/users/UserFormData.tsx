import { useState } from 'react';

interface UserFormData {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'operator' | 'viewer' | '';
}

export function useUserForm(
  initialData: UserFormData = {
    username: '',
    email: '',
    password: '123456789',
    role: '',
  },
) {
  const [formData, setFormData] = useState<UserFormData>(initialData);
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof UserFormData, string>>
  >({});

  const updateForm = (data: Partial<UserFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const resetForm = (data: UserFormData = initialData) => {
    setFormData(data);
    setFormErrors({});
  };

  const validateForm = (isEdit = false): boolean => {
    const errors: Partial<Record<keyof UserFormData, string>> = {};

    if (!formData.username) {
      errors.username = 'Nome de usuário é obrigatório';
    } else if (formData.username.length < 3) {
      errors.username = 'Nome deve ter pelo menos 3 caracteres';
    }

    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email válido é obrigatório';
    }

    if (!isEdit && (!formData.password || formData.password.length < 6)) {
      errors.password = 'Senha deve ter pelo menos 6 caracteres';
    } else if (isEdit && formData.password && formData.password.length < 6) {
      errors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (!formData.role) {
      errors.role = 'Função é obrigatória';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return {
    formData,
    formErrors,
    updateForm,
    resetForm,
    validateForm,
    setFormErrors,
  };
}
