import { logError } from 'helpers';
import { Filter, Sort } from 'mongodb';
import { dbClient } from 'services';
import { CreateEntityDocument, ErrorCode, JkError, LogLevel, UpdateEntityDocument } from 'types';
import { GroupBaseDocument, GroupDocument } from './types';

const { findByFilter, insertOne, findOne, updateOne, deleteOne } =
  dbClient.crud<GroupBaseDocument>('group');

export const getGroups = async (
  companyId: string,
  filter: Filter<GroupDocument>,
  sort?: Sort,
): Promise<GroupDocument[]> => findByFilter({ ...filter, companyId }, { sort });

export const createGroup = async (
  contest: CreateEntityDocument<GroupBaseDocument>,
) => {
  return await insertOne(null, contest);
};

export const getGroup = async (companyId: string, id: string): Promise<GroupDocument> => {
  const group = await findOne(id);
  if (group.companyId !== companyId) {
    logError(LogLevel.INFO)(JSON.stringify({ groupId: id, companyId }), 'error on getGroupData');
    throw new JkError(ErrorCode.ERR0211, { message: 'not found' });
  }
  return group;
};

export const updateGroup = async (
  id: string,
  doc: UpdateEntityDocument<GroupDocument>,
) => updateOne(id, doc, null);

export const deleteGroup = async (id: string) => deleteOne(id, null);
