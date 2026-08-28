export class ApiResponse {
  static success(res, data = {}, message = 'Operation successful', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      data,
      message,
      requestId: res.req?.id || undefined,
    });
  }

  static paginated(res, data = [], pagination = {}, message = 'Operation successful', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      data,
      pagination: {
        page: Number(pagination.page) || 1,
        limit: Number(pagination.limit) || 20,
        total: Number(pagination.total) || data.length,
        totalPages: Math.ceil((Number(pagination.total) || data.length) / (Number(pagination.limit) || 20)) || 1,
      },
      message,
      requestId: res.req?.id || undefined,
    });
  }

  static error(res, code = 'INTERNAL_ERROR', message = 'An unexpected error occurred', statusCode = 500, details = null) {
    const payload = {
      success: false,
      error: {
        code,
        message,
      },
      requestId: res.req?.id || undefined,
    };

    if (details && process.env.NODE_ENV !== 'production') {
      payload.error.details = details;
    }

    return res.status(statusCode).json(payload);
  }
}
