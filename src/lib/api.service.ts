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
      ? { ...this.defaultHeaders, 'Authorization': `Bearer ${token}` }
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

  private async request<T>(
    method: string,
    endpoint: string,
    body?: unknown,
    schema?: z.ZodType<T>
  ): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method,
        headers: this.getHeaders(),
        credentials: 'include',
        body: body ? JSON.stringify(body) : undefined
      })

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${await response.text()}`)
      }

      const data = await response.json()
      return schema ? schema.parse(data) : data as T
    } catch (error) {
      console.error(`API request failed: ${method} ${endpoint}`, error)
      throw error instanceof Error ? error : new Error('Unknown API error')
    }
  }
}
