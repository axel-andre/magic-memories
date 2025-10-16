export class AppError extends Error {
  public readonly userMessage: string;
  public readonly details?: Record<string, unknown>;

  constructor(
    message: string,
    userMessage?: string,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = this.constructor.name;
    this.userMessage = userMessage || message;
    this.details = details;
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string,
    userMessage?: string,
    details?: Record<string, unknown>
  ) {
    super(message, userMessage || "Validation failed", details);
  }
}

export class AuthorizationError extends AppError {
  constructor(
    message: string,
    userMessage?: string,
    details?: Record<string, unknown>
  ) {
    super(
      message,
      userMessage || "You don't have permission to perform this action",
      details
    );
  }
}

export class NotFoundError extends AppError {
  constructor(
    message: string,
    userMessage?: string,
    details?: Record<string, unknown>
  ) {
    super(
      message,
      userMessage || "The requested resource was not found",
      details
    );
  }
}

export class FileUploadError extends AppError {
  constructor(
    message: string,
    userMessage?: string,
    details?: Record<string, unknown>
  ) {
    super(message, userMessage || "File upload failed", details);
  }
}

export class DatabaseError extends AppError {
  constructor(
    message: string,
    userMessage?: string,
    details?: Record<string, unknown>
  ) {
    super(message, userMessage || "A database error occurred", details);
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function getUserErrorMessage(error: unknown): string {
  if (isAppError(error)) {
    return error.userMessage;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred";
}
