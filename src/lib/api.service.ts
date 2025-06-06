import { z } from 'zod'
import AuthTokenService from './auth-token.service'

export class ApiService {
  private baseUrl: string
  private defaultHeaders: Record<string, string>

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }

  private getHeaders(): Record<string, string> {
    const token = AuthTokenService.getToken()
    return token
      ? {
          ...this.defaultHeaders,
          'Authorization': `Bearer ${token}`,
          'X-Requested-With': 'XMLHttpRequest',
          'X-Audience': 'zen-app'
        }
      : this.defaultHeaders
  }

  async get<T>(endpoint: string, schema: z.ZodType<T>): Promise<T> {
    return this.request<T>('GET', endpoint, undefined, schema)
  }

  async post<T>(endpoint: string, body: unknown, schema: z.ZodType<T>): Promise<T> {
    return this.request<T>('POST', endpoint, body, schema)
  }

  async put<T>(endpoint: string, body: unknown, schema: z.ZodType<T>): Promise<T> {
    return this.request<T>('PUT', endpoint, body, schema)
  }

  async delete<T>(endpoint: string, schema: z.ZodType<T>): Promise<T> {
    return this.request<T>('DELETE', endpoint, undefined, schema)
  }

  private buildRequestOptions(method: string, body?: unknown): RequestInit {
    return {
      method,
      headers: this.getHeaders(),
      credentials: 'include',
      body: body ? JSON.stringify(body) : undefined
    }
  }

  private async handleResponse<T>(response: Response, schema?: z.ZodType<T>): Promise<T> {
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}: ${await response.text()}`)
    }
    const data = await response.json()
    return this.validateData(data, schema)
  }

  private validateData<T>(data: unknown, schema?: z.ZodType<T>): T {
    return schema ? schema.parse(data) : data as T
  }

  private handleUnauthorized(): never {
    AuthTokenService.clearToken()
    throw new Error('Session expired. Please login again.')
  }

  private handleError(method: string, endpoint: string, error: unknown): never {
    console.error(`API request failed: ${method} ${endpoint}`, error)

    if (error instanceof Error) {
      if (error.message.includes('401')) {
        this.handleUnauthorized()
      }
      throw error
    }

    throw new Error(`API request failed: ${error}`)
  }

  private async request<T>(
    method: string,
    endpoint: string,
    body?: unknown,
    schema?: z.ZodType<T>
  ): Promise<T> {
    try {
      const options = this.buildRequestOptions(method, body)
      const response = await fetch(`${this.baseUrl}${endpoint}`, options)
      return await this.handleResponse(response, schema)
    } catch (error) {
      this.handleError(method, endpoint, error)
    }
  }
}
