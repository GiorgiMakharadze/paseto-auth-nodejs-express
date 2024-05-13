import { Document } from 'mongoose';

export interface IQueryWithCache {
  <T extends Document>(modelName: string, query: object, cacheKey: string): Promise<T[]>;
}
