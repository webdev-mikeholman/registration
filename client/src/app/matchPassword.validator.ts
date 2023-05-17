import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const matchPassword: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  let password = control.get('password');
  let confirmPassword = control.get('confirmPassword');

  if (
    password &&
    confirmPassword &&
    password.value !== null &&
    confirmPassword.value !== null &&
    password?.value.trim() !== confirmPassword?.value.trim()
  ) {
    return {
      passwordMatchError: true,
    };
  }
  return null;
};
