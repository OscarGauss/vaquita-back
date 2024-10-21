import { Filter, Sort } from 'mongodb';
import { dbClient } from 'services';
import { CreateEntityDocument, UpdateEntityDocument } from 'types';
import { GroupBaseDocument, GroupDocument } from './types';

const { findByFilter, insertOne, findOne, updateOne, deleteOne } =
  dbClient.crud<GroupBaseDocument>('group');

export const getGroups = async (
  filter: Filter<GroupDocument>,
  sort?: Sort,
): Promise<GroupDocument[]> => findByFilter(filter, { sort });

export const createGroup = async (
  contest: CreateEntityDocument<GroupBaseDocument>,
) => {
  return await insertOne(null, contest);
};

export const getGroup = async (id: string): Promise<GroupDocument> =>
  findOne(id);

export const updateGroup = async (
  id: string,
  doc: UpdateEntityDocument<GroupDocument>,
) => updateOne(id, doc, null);

export const deleteGroup = async (id: string) => deleteOne(id, null);