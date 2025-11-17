// Common type definitions for the application

export interface ApiResponse<T> {
    data: T
    message?: string
    success: boolean
}

export interface ErrorResponse {
    message: string
    code?: string
    details?: unknown
}
