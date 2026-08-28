export function paginate(items = [], page = 1, limit = 20) {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
  const total = items.length;
  const totalPages = Math.ceil(total / limitNum) || 1;
  const offset = (pageNum - 1) * limitNum;
  const paginatedData = items.slice(offset, offset + limitNum);

  return {
    data: paginatedData,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages,
    },
  };
}
