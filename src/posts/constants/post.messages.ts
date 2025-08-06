export const POST_MESSAGES = {
    POST: {
        CREATED: 'Post created successfully.',
        NOT_FOUND: 'Post not found',
        DELETED: 'Post deleted successfully.',
        FETCHED: 'Post fetched successfully.',
        LIST_FETCHED: 'Posts fetched successfully.',
        UPDATED: 'Post updated successfully.',
    },
    ERROR: {
        SOMETHING_WENT_WRONG: 'Something went wrong',
        UNAUTHORIZED: 'Unauthorized access to this post',
        USER_NOT_FOUND: 'User not found for this post',
    },
    VALIDATION: {
        INVALID_TITLE: 'Title is required',
        INVALID_CONTENT: 'Content is required',
        INVALID_USER_ID: 'User ID is required',
    },
} as const; 