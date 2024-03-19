export function navigateTo(navigate, pageSize, currentPage, sortBy, sortDirection) {
    navigate({
        pathname: '/communities',
        search: `?pageSize=${pageSize}&page=${currentPage}&sortBy=${sortBy}&sortDirection=${sortDirection}`,
    });
    return { currentPage, pageSize, sortBy, sortDirection };
}
