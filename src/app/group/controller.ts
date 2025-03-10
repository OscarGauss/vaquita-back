import { ErrorCode } from '@juki-team/commons';
import { Filter, Sort } from 'mongodb';
import { logService } from 'services/log';
import { EntityState, JkError, JkRequest, JkResponse, NextFunction, UpdateEntityDocument } from 'types';
import { getGroupSlots, toGroupResponseDTO } from './helpers';
import { createGroup, deleteGroup, getGroup, getGroups, updateGroup } from './services';
import {
  GroupBaseDocument,
  GroupCreateDTO,
  GroupCrypto,
  GroupDepositDTO,
  GroupDocument,
  GroupEnrollDTO,
  GroupPeriod,
  GroupResponseDTO,
  GroupStatus,
  GroupWithdrawalDTO,
  GroupWithdrawalType,
} from './types';

export function shuffle<T>(array: T[]) {
  let currentIndex = array.length;
  
  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    
    // And swap it with the current element.
    [ array[currentIndex], array[randomIndex] ] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
}

export const postCreateGroup = async (req: JkRequest, res: JkResponse, next: NextFunction) => {
  
  const {
    name,
    amount,
    crypto,
    totalMembers,
    period,
    startsOnTimestamp,
    customerPublicKey,
  } = req.body as GroupCreateDTO;
  
  const collateralAmount = amount * totalMembers;
  
  const companyId = req.company.id;
  const newGroup: GroupBaseDocument = {
    companyId,
    crypto,
    name,
    amount,
    collateralAmount,
    totalMembers,
    period,
    startsOnTimestamp,
    memberPositions: [],
    ownerPublicKey: customerPublicKey,
    members: {},
  };
  
  const result = await createGroup(newGroup);
  res.sendContent(toGroupResponseDTO(
    await getGroup(companyId, result.insertedId.toString()),
    customerPublicKey,
  ));
};

export const getAllGroups = async (req: JkRequest<{}, {
  status?: GroupStatus,
  myGroups?: string,
  period?: GroupPeriod,
  crypto?: GroupCrypto,
  amount?: string,
  minAmount?: string,
  maxAmount?: string,
  customerPublicKey?: string
  orderBy?: string,
}>, res: JkResponse, next: NextFunction) => {
  const status = req.query.status;
  const myGroups = !!req.query.myGroups;
  const period = req.query.period;
  const crypto = req.query.crypto;
  const amount = +(req.query.amount || 0);
  const minAmount = +(req.query.minAmount ?? NaN);
  const maxAmount = +(req.query.maxAmount ?? NaN);
  const customerPublicKey = req.query.customerPublicKey || '';
  const orderBy = req.query.orderBy;
  
  const filter: Filter<GroupDocument> = { state: EntityState.RELEASED };
  
  if (period) {
    filter.period = period;
  }
  if (crypto) {
    filter.crypto = crypto;
  }
  if (amount) {
    filter.amount = amount;
  } else if (!Number.isNaN(minAmount) && !Number.isNaN(maxAmount)) {
    filter.amount = { $gte: minAmount, $lte: maxAmount };
  }
  
  if (customerPublicKey) {
    if (myGroups) {
      filter[`members.${customerPublicKey}`] = { $exists: true };
    } else {
      filter[`members.${customerPublicKey}`] = { $exists: false };
    }
  }
  
  const sort: Sort = {};
  switch (orderBy) {
    case '+amount':
      sort.amount = 1;
      break;
    case '-amount':
      sort.amount = -1;
      break;
    case '+period':
      sort.period = 1;
      break;
    case '-period':
      sort.period = -1;
      break;
    case '+date':
      sort.startsOnTimestamp = 1;
      break;
    case '-date':
      sort.startsOnTimestamp = -1;
      break;
    // case '+slots':
    //   sort.slots = 1;
    //   break;
    // case '-slots':
    //   sort.slots = -1;
    //   break;
    case '+totalMembers':
      sort.totalMembers = 1;
      break;
    case '-totalMembers':
      sort.totalMembers = -1;
      break;
    default:
  }
  const groups = await getGroups(req.company.id, filter, sort);
  const contents: GroupResponseDTO[] = groups
    .map((group) => toGroupResponseDTO(group, customerPublicKey))
    .filter(
      (group) =>
        (status ? status === group.status : true)
        && group.totalMembers !== group.slots &&
        (!myGroups ? group.slots > 0 : true) && // only with free slots
        true,
    ).sort((a, b) => (b.slots - a.slots) / Math.abs(b.slots - a.slots));
  
  res.sendContents(contents, { page: 0, size: 0, sort: [], totalElements: contents.length });
};

export const getGroupData = async (req: JkRequest<{ id: string }, {
  customerPublicKey?: string
}>, res: JkResponse, next: NextFunction) => {
  const groupId = req.params.id;
  const customerPublicKey = req.query.customerPublicKey || '';
  
  const group = await getGroup(req.company.id, groupId);
  
  const content: GroupResponseDTO = toGroupResponseDTO(
    group,
    customerPublicKey,
  );
  
  res.sendContent(content);
};

export const postDepositGroup = async (req: JkRequest<{ id: string }>, res: JkResponse, next: NextFunction) => {
  
  const now = new Date();
  const groupId = req.params.id;
  const { customerPublicKey, transactionSignature, round /*amount*/ } = req.body as GroupDepositDTO;
  
  console.log(req.body);
  // TODO: validate amount
  
  const group = await getGroup(req.company.id, groupId);
  const collateral = group.amount * group.totalMembers;
  let newMembers: GroupBaseDocument['members'];
  const memberPositions = [ ...group.memberPositions ];
  if (round === 0) {
    if (group.members[customerPublicKey]) {
      newMembers = {
        ...group.members,
        [customerPublicKey]: {
          ...group.members[customerPublicKey],
          deposits: {
            [round]: {
              amount: collateral,
              round,
              timestamp: now.getTime(),
              transactionSignature,
            },
          },
          withdrawals: {},
        },
      };
    } else {
      const position = memberPositions.pop() as number;
      newMembers = {
        ...group.members,
        [customerPublicKey]: {
          publicKey: customerPublicKey,
          position,
          deposits: {
            [round]: {
              amount: collateral,
              round,
              timestamp: now.getTime(),
              transactionSignature,
            },
          },
          withdrawals: {},
        },
      };
    }
  } else {
    newMembers = {
      ...group.members,
      [customerPublicKey]: {
        ...group.members[customerPublicKey],
        deposits: {
          ...group.members[customerPublicKey]?.deposits,
          [round]: {
            amount: group.amount,
            round,
            timestamp: now.getTime(),
            transactionSignature,
          },
        },
      },
    };
  }
  
  const slots = getGroupSlots({
    members: newMembers,
    totalMembers: group.totalMembers,
    collateralAmount: group.collateralAmount,
  });
  
  const doc: UpdateEntityDocument<GroupDocument> = {
    members: newMembers,
    memberPositions: [ ...memberPositions ],
  };
  
  if (slots === 0) { // TODO: only for testing purposes
    doc.startsOnTimestamp = Date.now();
  }
  
  await updateGroup(groupId, doc);
  
  res.sendContent('ok');
};

export const postDisjoinGroup = async (req: JkRequest<{ id: string }>, res: JkResponse, next: NextFunction) => {
  
  const groupId = req.params.id;
  const { customerPublicKey } = req.body as GroupDepositDTO;
  
  // TODO: validate amount
  
  const group = await getGroup(req.company.id, groupId);
  if (group.members[customerPublicKey]) {
    const newMembers: GroupBaseDocument['members'] = { ...group.members };
    const memberPositions = [ newMembers[customerPublicKey].position, ...group.memberPositions ].filter((position) => !!position);
    delete newMembers[customerPublicKey];
    await updateGroup(groupId, {
      members: newMembers,
      memberPositions: [ ...memberPositions ],
    });
  }
  
  const groupUpdated = await getGroup(req.company.id, groupId);
  const content: GroupResponseDTO = toGroupResponseDTO(
    groupUpdated,
    customerPublicKey,
  );
  
  res.sendContent(content);
};

export const postJoinGroup = async (req: JkRequest<{ id: string }>, res: JkResponse, next: NextFunction) => {
  const groupId = req.params.id;
  const { customerPublicKey } = req.body as GroupDepositDTO;
  
  // TODO: validate amount
  
  const group = await getGroup(req.company.id, groupId);
  const memberPositions = [ ...group.memberPositions ];
  if (!memberPositions.length) {
    throw new Error('there are no free slots in the group');
  }
  const position = memberPositions.pop() as number;
  const newMembers: GroupBaseDocument['members'] = {
    ...group.members,
    [customerPublicKey]: {
      publicKey: customerPublicKey,
      position,
      deposits: {},
      withdrawals: {},
    },
  };
  
  await updateGroup(groupId, {
    members: newMembers,
    memberPositions: [ ...memberPositions ],
  });
  
  const groupUpdated = await getGroup(req.company.id, groupId);
  const content: GroupResponseDTO = toGroupResponseDTO(
    groupUpdated,
    customerPublicKey,
  );
  
  res.sendContent(content);
};

export const postEnrollGroup = async (req: JkRequest<{ id: string }>, res: JkResponse, next: NextFunction) => {
  const groupId = req.params.id;
  const { customerPublicKey, playerAddedDataLog } = req.body as GroupEnrollDTO;
  
  const log = playerAddedDataLog.replace('0x', '');
  const secondPart = log.slice(log.length / 2);
  const position = parseInt('0x' + secondPart, 16) + 1;
  await logService.sendInfoMessage('postEnrollGroup', {
    customerPublicKey,
    playerAddedDataLog,
    position,
    secondPart,
  }, true);
  const group = await getGroup(req.company.id, groupId);
  const newMembers: GroupBaseDocument['members'] = {
    ...group.members,
    [customerPublicKey]: {
      publicKey: customerPublicKey,
      position,
      deposits: {},
      withdrawals: {},
    },
  };
  
  await updateGroup(groupId, {
    members: newMembers,
  });
  
  const groupUpdated = await getGroup(req.company.id, groupId);
  const content: GroupResponseDTO = toGroupResponseDTO(
    groupUpdated,
    customerPublicKey,
  );
  
  res.sendContent(content);
};

export const postWithdrawal = async (req: JkRequest<{ id: string }>, res: JkResponse, next: NextFunction) => {
  const now = new Date();
  
  const groupId = req.params.id;
  const { customerPublicKey, transactionSignature, type /*amount*/ } = req.body as GroupWithdrawalDTO;
  
  // TODO: validate amount
  
  const group = await getGroup(req.company.id, groupId);
  let newMembers: GroupBaseDocument['members'] = { ...group.members };
  
  if (type === GroupWithdrawalType.COLLATERAL) {
    newMembers = {
      ...group.members,
      [customerPublicKey]: {
        ...group.members[customerPublicKey],
        withdrawals: {
          ...group.members[customerPublicKey].withdrawals,
          [GroupWithdrawalType.COLLATERAL]: {
            amount: group.collateralAmount,
            type: GroupWithdrawalType.COLLATERAL,
            timestamp: now.getTime(),
            transactionSignature,
          },
        },
      },
    };
  }
  
  if (type === GroupWithdrawalType.ROUND) {
    newMembers = {
      ...group.members,
      [customerPublicKey]: {
        ...group.members[customerPublicKey],
        withdrawals: {
          ...group.members[customerPublicKey].withdrawals,
          [GroupWithdrawalType.ROUND]: {
            amount: group.amount,
            type: GroupWithdrawalType.ROUND,
            timestamp: now.getTime(),
            transactionSignature,
          },
        },
      },
    };
  }
  
  if (type === GroupWithdrawalType.INTEREST) {
    newMembers = {
      ...group.members,
      [customerPublicKey]: {
        ...group.members[customerPublicKey],
        withdrawals: {
          ...group.members[customerPublicKey].withdrawals,
          [GroupWithdrawalType.INTEREST]: {
            amount: 0,
            type: GroupWithdrawalType.INTEREST,
            timestamp: now.getTime(),
            transactionSignature,
          },
        },
      },
    };
  }
  
  await updateGroup(groupId, { members: newMembers });
  
  res.sendContent('ok');
};

export const archiveGroup = async (req: JkRequest<{ id: string }>, res: JkResponse, next: NextFunction) => {
  const groupId = req.params.id;
  await deleteGroup(groupId);
  res.sendContent('ok');
};

export const __setTimestampGroup = async (req: JkRequest<{ id: string }>, res: JkResponse, next: NextFunction) => {
  const groupId = req.params.id;
  await updateGroup(groupId, { startsOnTimestamp: req.body.startsOnTimestamp });
  res.sendContent('ok');
};

export const postSetPosition = async (req: JkRequest<{ id: string }>, res: JkResponse, next: NextFunction) => {
  res.sendError(new JkError(ErrorCode.ERR500, { message: 'unprocessed' }));
};
