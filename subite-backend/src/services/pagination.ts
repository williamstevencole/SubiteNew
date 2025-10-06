import { Op, WhereOptions } from "sequelize";
import { PaginatedResponse } from "../types/api.js";

export interface CursorPaginationOptions {
  limit: number;
  cursor?: number;
}

export interface OffsetPaginationOptions {
  page: number;
  limit: number;
}

export function createCursorPaginatedResponse<T>(
  data: T[],
  limit: number,
  getId: (item: T) => number
): PaginatedResponse<T> {
  const hasNextPage = data.length === limit;
  const nextCursor = hasNextPage && data.length > 0
    ? getId(data[data.length - 1]!)
    : undefined;

  return {
    data,
    pageInfo: {
      nextCursor: nextCursor?.toString(),
      hasNextPage,
    },
  };
}

export function createOffsetPaginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number
): PaginatedResponse<T> {
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
}

export function getCursorWhereClause(cursor?: number): WhereOptions {
  if (!cursor) return {};

  return {
    id: {
      [Op.lt]: cursor,
    },
  };
}

export function getOffsetSkip(page: number, limit: number): number {
  return (page - 1) * limit;
}