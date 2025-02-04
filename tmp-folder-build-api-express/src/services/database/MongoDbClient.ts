import { isObjectJson } from '@juki-team/commons';
import { EntityLog, EntityLogChanges } from '@juki-team/commons/dist/types/types/entity';
import { MONGO_DATABASE_NAME, MONGO_DATABASE_URI } from 'config/settings';
import { log } from 'helpers';
import { atomizeChangeset, diff } from 'json-diff-ts';
import { Db, Document, MatchKeysAndValues, MongoClient, ObjectId, OptionalUnlessRequiredId, Sort } from 'mongodb';
import objectSizeOf from 'object-sizeof';
import {
  CreateEntityDocument,
  EntityDocument,
  EntityState,
  ErrorCode,
  Filter,
  InsertOneResult,
  JkError,
  LogLevel,
  PaginatedDocuments,
  SortType,
  UpdateEntityDocument,
} from 'types';

const myObjectSizeOf = (obj: any) => {
  if (isObjectJson(obj)) {
    return JSON.stringify(obj).length * 2;
  }
  return objectSizeOf(obj);
};

export class MongoDbClient {
  
  private mongoDatabaseClient: Db | null = null;
  private reconnectionCbs: (() => void)[] = [];
  
  async connect() {
    if (!this.mongoDatabaseClient) {
      log(LogLevel.INFO)(`mongo client connecting...`);
      const mongoClient = await MongoClient.connect(MONGO_DATABASE_URI);
      await mongoClient.connect();
      this.mongoDatabaseClient = mongoClient.db(MONGO_DATABASE_NAME);
      log(LogLevel.INFO)(`mongo client connected`);
      for (const cb of this.reconnectionCbs) {
        cb?.();
      }
    } else {
      log(LogLevel.INFO)(`mongo client already connected`);
    }
  }
  
  get __UNSAFE__mongoDatabaseClient() {
    return this.mongoDatabaseClient;
  }
  
  crud<T>(collection: string) {
    type EntityDoc = EntityDocument<T>;
    
    let mongoCollection = this.mongoDatabaseClient?.collection<EntityDoc>(collection)!;
    
    const connect = () => {
      mongoCollection = this.mongoDatabaseClient?.collection<EntityDoc>(collection)!;
      log(LogLevel.INFO)(`collection "${collection}"connected`);
    };
    
    this.reconnectionCbs.push(connect);
    
    const updateOne = async (documentId: string, document: UpdateEntityDocument<T>, customer: null, withoutLog?: boolean) => {
      const now = new Date();
      let documentToUpdate = { ...document } as MatchKeysAndValues<EntityDoc>;
      Object.keys(documentToUpdate).forEach(key => documentToUpdate[key] === undefined && delete documentToUpdate[key]);
      if (Object.keys(documentToUpdate).length === 0) {
        return;
      }
      let updatedDocument;
      if (withoutLog) {
        documentToUpdate = { ...documentToUpdate, updatedAt: now };
        updatedDocument = await mongoCollection
          .updateOne({ _id: new ObjectId(documentId) } as Filter<EntityDoc>, { $set: documentToUpdate });
      } else {
        const oldDocument = await mongoCollection.findOne({ _id: new ObjectId(documentId) } as Filter<EntityDoc>);
        documentToUpdate = { ...documentToUpdate, updatedAt: now };
        updatedDocument = await mongoCollection
          .updateOne({ _id: new ObjectId(documentId) } as Filter<EntityDoc>, { $set: documentToUpdate });
        const newDocument = await mongoCollection.findOne({ _id: new ObjectId(documentId) } as Filter<EntityDoc>);
        const atomicChanges = atomizeChangeset(diff(oldDocument, newDocument)).filter(({ path }) => path !== '$._id.buffer');
        const documentWithoutLogs = { ...newDocument, logs: [] };
        const bytes = myObjectSizeOf(documentWithoutLogs);
        const maxBytes = 1024 * 50; // 50 KB
        const newLog: EntityLog = {
          changes: atomicChanges as unknown as EntityLogChanges[],
          timestamp: now.getTime(),
          customerUserId: '', // customer._id.toString(),
        };
        let logs: EntityLog[] = [];
        if (bytes < maxBytes) {
          logs = [
            newLog,
            ...(newDocument?.logs ?? []),
          ];
          while (bytes + myObjectSizeOf(logs) > maxBytes && !!logs.length) {
            logs.pop();
          }
        }
        if (!logs.length) {
          logs = [ newLog ];
        }
        const documentToUpdateWithLogs = {
          updatedAt: now,
          logs,
        } as MatchKeysAndValues<EntityDoc>;
        await mongoCollection.updateOne({ _id: new ObjectId(documentId) } as Filter<EntityDoc>, { $set: documentToUpdateWithLogs });
      }
      if (!updatedDocument) {
        throw new JkError(ErrorCode.ERR0303);
      }
      return updatedDocument;
    };
    
    return {
      insertOne: async (customer: null, document: CreateEntityDocument<T>): Promise<InsertOneResult> => {
        const now = new Date();
        const documentToInsert = {
          ...document,
          createdAt: now,
          updatedAt: now,
          // companyId: '',
          ownerUserId: '', // !!(customer?._id?.toString?.()) ? customer._id.toString() : company.systemAdminUserId,
          state: EntityState.RELEASED,
          logs: [],
        } as OptionalUnlessRequiredId<EntityDoc>;
        const newDocument = await mongoCollection.insertOne(documentToInsert);
        if (!newDocument) {
          log(LogLevel.INFO)(JSON.stringify({
            collection, /*company, */
            customer,
            document,
          }), 'error on insertOne');
          throw new JkError(ErrorCode.ERR0810, { message: 'not created' });
        }
        return newDocument;
      },
      findOne: async (documentId: string, options?: {
        projection?: { [key: string]: 1 }
      } | void): Promise<EntityDoc> => {
        const { projection } = options || {};
        const document = await mongoCollection.findOne({ _id: new ObjectId(documentId) } as Filter<EntityDoc>, { projection });
        if (!document) {
          log(LogLevel.INFO)(JSON.stringify({ collection, documentId }), 'error on findOne');
          throw new JkError(ErrorCode.ERR0211, { message: 'not found' });
        }
        return document as EntityDoc;
      },
      findOneByFilter: async (filter: Filter<EntityDoc>, options?: {
        sort?: Sort,
        projection?: { [key: string]: 1 }
      } | void): Promise<EntityDoc> => {
        const { projection, sort } = options || {};
        const document = await mongoCollection.findOne(filter, { projection, sort });
        if (!document) {
          log(LogLevel.INFO)(JSON.stringify({ collection, filter }), 'error on findOneByFilter');
          throw new JkError(ErrorCode.ERR0211, { message: 'not found' });
        }
        return document as EntityDoc;
      },
      findByFilter: async (filter: Filter<EntityDoc>, options?: {
        sort?: Sort,
        projection?: { [key: string]: 1 }
      } | void): Promise<EntityDoc[]> => {
        const { projection, sort } = options || {};
        const document = await mongoCollection.find(filter, { projection, sort }).toArray();
        if (!document) {
          log(LogLevel.INFO)(JSON.stringify({ collection, filter, options }), 'error on findByFilter');
          throw new JkError(ErrorCode.ERR0211, { message: 'not found' });
        }
        return document as EntityDoc[];
      },
      findPaginated: async (page: number, size: number, sort: SortType | undefined = {}, filter: Filter<EntityDoc> | undefined, projection: {} | undefined): Promise<PaginatedDocuments<EntityDoc>> => {
        const totalElements = await mongoCollection.countDocuments(filter as Filter<Document>);
        const pages = Math.ceil(totalElements / size);
        const startFrom = (page - 1) * size;
        
        const result = await mongoCollection
          .find(filter as Filter<EntityDoc>, { projection })
          .sort(sort)
          .skip(startFrom)
          .limit(size)
          .toArray() as EntityDoc[];
        
        return { result, totalElements, page, size, sort, pages };
      },
      updateOne,
      countDocuments: async (filter: Filter<EntityDoc>) => {
        return await mongoCollection.countDocuments(filter);
      },
      deleteOne: (documentId: string, customer: null) => (
        updateOne(documentId, { state: EntityState.ARCHIVED } as unknown as UpdateEntityDocument<T>, customer)
      ),
      __UNSAFE__mongoCollection: () => mongoCollection,
      __UNSAFE__deleteOne: (documentId: string) => {
        return mongoCollection.deleteOne({ _id: new ObjectId(documentId) } as Filter<EntityDoc>);
      },
    };
  }
}
