type PaginationConfig = {
  page: number;
  perPage: number;
  total: number;
  maxVisible?: number;
};

export function getPagination(config: PaginationConfig) {
  const { page, perPage, total, maxVisible = 7 } = config;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, total);

  let pages: (number | string)[] = [];
  if (totalPages <= maxVisible) {
    pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else {
    const half = Math.floor(maxVisible / 2);
    let startPage = Math.max(2, page - half);
    let endPage = Math.min(totalPages - 1, page + half);

    if (page <= half + 1) endPage = Math.min(totalPages - 1, maxVisible - 1);
    if (page >= totalPages - half)
      startPage = Math.max(2, totalPages - maxVisible + 2);

    pages.push(1);
    if (startPage > 2) pages.push("...");
    for (let i = startPage; i <= endPage; i++) pages.push(i);
    if (endPage < totalPages - 1) pages.push("...");
    if (totalPages > 1) pages.push(totalPages);
  }

  return {
    start,
    end,
    totalPages,
    pages,
    canPrev: page > 1,
    canNext: page < totalPages,
    canFirst: page > 1,
    canLast: page < totalPages,
    goTo: (target: number, onPrev: () => void, onNext: () => void) => {
      if (target < page) Array.from({ length: page - target }).forEach(onPrev);
      if (target > page) Array.from({ length: target - page }).forEach(onNext);
    },
  };
}
