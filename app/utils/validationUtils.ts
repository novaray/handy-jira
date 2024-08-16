export class ValidationUtils {
  static isRequired(value: string, message: string) {
    return !!value || message;
  }

  static isEmail(email: string, message: string) {
    // prettier-ignore
    const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return reg.test(email) || message;
  }
}
