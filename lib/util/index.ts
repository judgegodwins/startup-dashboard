const getKey = (url: string) => (pageIndex: number, previousPageData: any[]) => {
  if (previousPageData && !previousPageData.length) return null // reached the end
  return `${url}?page=${pageIndex}&limit=10`                    // SWR key
}