export const USER_MESSAGES = {
    USER: {
        CREATED: 'User created successfully.',
        NOT_FOUND: 'User not found',
        DELETED: 'User deleted successfully.',
        FETCHED: 'User fetched successfully.',
        LIST_FETCHED: 'Users fetched successfully.',
        UPDATED: 'User updated successfully.',
    },
    ERROR: {
        SOMETHING_WENT_WRONG: 'Something went wrong',
        ALREADY_EXISTS: 'User with this email already exists',
        INVALID_CREDENTIALS: 'Invalid credentials',
        UNAUTHORIZED: 'Unauthorized access',
    },
    VALIDATION: {
        INVALID_EMAIL: 'Please provide a valid email address',
        INVALID_PASSWORD: 'Password must be at least 6 characters long',
        INVALID_NAME: 'Name is required',
    },
} as const; 