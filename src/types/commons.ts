export { Document } from 'mongodb';
export { NextFunction, Request, Response } from 'express';
export { Filter, InsertOneResult, ObjectId, UpdateFilter, WithId } from 'mongodb';

export {
  NewEntityDocument, EntityState, ErrorCode, JkError, LogLevel, CreateEntityDocument, UpdateEntityDocument,
} from '@juki-team/commons';

export { JkResponse } from '@juki-team/base-back';

export type SortType = { [key: string]: -1 | 1 };

export type PaginatedDocuments<T> = {
  result: T[],
  totalElements: number,
  page: number,
  size: number,
  pages: number,
  sort: SortType,
};
