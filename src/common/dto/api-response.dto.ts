import { ApiProperty } from '@nestjs/swagger';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  statusCode?: number;
}

export interface PaginatedApiResponse<T = any> {
  success: boolean;
  message: string;
  data: {
    total: number;
    totalPages: number;
    page: number;
    limit: number;
    results: T[];
  };
  error?: string;
  statusCode?: number;
}

export class ApiResponseDto<T = any> {
  @ApiProperty({ description: 'Indicates if the request was successful' })
  success: boolean;

  @ApiProperty({ description: 'Response message' })
  message: string;

  @ApiProperty({ description: 'Response data' })
  data?: T;

  @ApiProperty({ description: 'Error details if any' })
  error?: string;

  constructor(success: boolean, message: string, data?: T, error?: string) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.error = error;
  }

  /**
   * Create a successful response
   */
  static success<T>(data: T, message: string = 'Operation completed successfully'): ApiResponseDto<T> {
    return new ApiResponseDto<T>(true, message, data);
  }

  /**
   * Create an error response
   */
  static error(message: string, error?: string): ApiResponseDto {
    return new ApiResponseDto(false, message, undefined, error);
  }
} 