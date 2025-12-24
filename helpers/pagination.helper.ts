export const paginationHelper = (page:number = 1, skip:number = 0, limit:number = 5, totalTask:number) => {
  const totalPage = Math.ceil(totalTask / limit);
  if(page < 0 || page > totalPage) {
    page = 1
  };

  skip = (page - 1) * limit;

  return {
    totalPage: totalPage,
    skip: skip,
  }
}