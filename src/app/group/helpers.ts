import {
  GroupDocument,
  GroupMember,
  GroupPeriod,
  GroupResponseDTO,
  GroupStatus,
  GroupTablePaymentItemDTO,
  GroupWithdrawalType,
} from 'app/group/types';
import { addMonths, addWeeks } from 'date-fns';

export const getGroupStatus = (group: GroupDocument) => {
  let depositedCollaterals = 0;
  for (const member of Object.values(group.members || {})) {
    if (
      member.deposits?.[0]?.round === 0 &&
      member.deposits?.[0]?.amount === group.collateralAmount
    ) {
      depositedCollaterals++;
    }
  }
  if (depositedCollaterals < group.totalMembers) {
    // pending, abandoned
    if (group.startsOnTimestamp >= Date.now()) {
      return GroupStatus.PENDING;
    }
    return GroupStatus.ABANDONED;
  } else if (depositedCollaterals === group.totalMembers) {
    // active, concluded
    const endDate =
      group.period === GroupPeriod.MONTHLY
        ? addMonths(new Date(group.startsOnTimestamp), group.totalMembers)
        : addWeeks(new Date(group.startsOnTimestamp), group.totalMembers);
    if (group.startsOnTimestamp > Date.now()) {
      return GroupStatus.PENDING;
    }
    if (endDate.getTime() > Date.now()) {
      return GroupStatus.ACTIVE;
    }
    return GroupStatus.CONCLUDED;
  }
  
  return GroupStatus.ABANDONED;
};

export const getGroupSlots = (group: Pick<GroupDocument, 'members' | 'collateralAmount' | 'totalMembers'>) => {
  let depositedCollaterals = 0;
  for (const member of Object.values(group.members || {})) {
    if (
      member.deposits?.[0]?.round === 0 &&
      member.deposits?.[0]?.amount === group.collateralAmount
    ) {
      depositedCollaterals++;
    }
  }
  
  return group.totalMembers - depositedCollaterals;
};

const isSuccessTransaction = (deposit: GroupMember['deposits'][number] | GroupMember['withdrawals'][string] | undefined, amount: number) => {
  return !!deposit?.amount && +deposit?.amount === +amount && !!deposit?.timestamp && !!deposit?.transactionSignature;
};

export const toGroupResponseDTO = (
  group: GroupDocument,
  customerPublicKey: string,
): GroupResponseDTO => {
  const me = group.members?.[customerPublicKey];
  
  const countSuccessDeposits: { [key: number]: number } = {};
  let countSuccessRounds = 0;
  for (const member of Object.values(group.members || {})) {
    for (const deposit of Object.values(member.deposits || {})) {
      if (isSuccessTransaction(deposit, +deposit.round === 0 ? group.amount * group.totalMembers : group.amount)) {
        countSuccessDeposits[deposit.round] = (countSuccessDeposits[deposit.round] ?? 0) + 1;
      }
    }
  }
  
  for (let i = 0; i <= group.totalMembers; i++) {
    countSuccessRounds += +(countSuccessDeposits[i] === group.totalMembers - (i === 0 ? 0 : 1));
  }
  
  const myDeposits: GroupResponseDTO['myDeposits'] = {};
  for (const deposit of Object.values(me?.deposits || {})) {
    myDeposits[deposit.round] = {
      round: deposit.round,
      successfullyDeposited:
        deposit.round === 0
          ? deposit.amount === group.collateralAmount
          : deposit.amount === group.amount,
      amount: deposit.amount,
      timestamp: deposit.timestamp,
    };
  }
  console.log(countSuccessDeposits, { countSuccessRounds }, me);
  
  const myWithdrawals: GroupResponseDTO['myWithdrawals'] = {
    [GroupWithdrawalType.COLLATERAL]: {
      amount: me?.withdrawals?.collateral?.amount ?? 0,
      type: GroupWithdrawalType.COLLATERAL,
      timestamp: me?.withdrawals?.collateral?.timestamp ?? 0,
      successfullyWithdrawn: isSuccessTransaction(me?.withdrawals?.collateral, group.collateralAmount),
      enabled: countSuccessRounds === group.totalMembers + 1,
    },
    [GroupWithdrawalType.ROUND]: {
      amount: me?.withdrawals?.round?.amount ?? 0,
      type: GroupWithdrawalType.ROUND,
      timestamp: me?.withdrawals?.round?.timestamp ?? 0,
      successfullyWithdrawn: isSuccessTransaction(me?.withdrawals?.round, group.amount),
      enabled: // group.myPosition <= group.currentPosition &&
        countSuccessDeposits[me?.position || 0] === group.totalMembers - 1,
    },
    [GroupWithdrawalType.INTEREST]: {
      amount: me?.withdrawals?.interest?.amount ?? 0,
      type: GroupWithdrawalType.INTEREST,
      timestamp: me?.withdrawals?.interest?.timestamp ?? 0,
      successfullyWithdrawn:
        !!me?.withdrawals?.interest?.timestamp &&
        !!me?.withdrawals?.interest?.transactionSignature,
      enabled: countSuccessRounds === group.totalMembers + 1,
    },
  };
  
  const response = {
    amount: group.amount,
    myDeposits,
    totalMembers: group.totalMembers,
    period: group.period,
    startsOnTimestamp: group.startsOnTimestamp,
    myPosition: me?.position || 0,
  };
  
  const { currentPosition } = getPaymentsTable(response);
  
  return {
    id: group._id.toString(),
    crypto: group.crypto,
    name: group.name,
    amount: group.amount,
    collateralAmount: group.collateralAmount,
    myDeposits,
    myWithdrawals,
    totalMembers: group.totalMembers,
    slots: getGroupSlots(group),
    period: group.period,
    startsOnTimestamp: group.startsOnTimestamp,
    status: getGroupStatus(group),
    isOwner: !!group.members?.[customerPublicKey]?.isOwner,
    myPosition: me?.position || 0,
    currentPosition,
  };
};

export const getPaymentsTable = (
  group: Pick<
    GroupResponseDTO,
    | 'startsOnTimestamp'
    | 'totalMembers'
    | 'period'
    | 'amount'
    | 'myDeposits'
    | 'myPosition'
  >,
) => {
  const items: GroupTablePaymentItemDTO[] = [];
  let startDate = new Date(group.startsOnTimestamp || 0);
  let endDate = startDate;
  let firstUnpaidItemIndex = -1;
  let currentPosition = -1;
  for (let i = 0; i < (group.totalMembers || 0); i++) {
    if (group.period === GroupPeriod.MONTHLY) {
      endDate = addMonths(startDate, 1);
    } else {
      endDate = addWeeks(startDate, 1);
    }
    if (startDate.getTime() <= Date.now() && Date.now() < endDate.getTime()) {
      currentPosition = i + 1;
    }
    const round = i + 1;
    
    items.push({
      round,
      amount: group.amount || 0,
      paymentDeadlineTimestamp: endDate.getTime(),
      status: group.myDeposits[round]?.successfullyDeposited
        ? 'Paid'
        : firstUnpaidItemIndex === -1
          ? 'Pay'
          : 'Pending',
    });
    if (
      firstUnpaidItemIndex === -1 &&
      round !== group.myPosition &&
      !group.myDeposits[round]?.successfullyDeposited
    ) {
      firstUnpaidItemIndex = i;
    }
    startDate = endDate;
  }
  
  return { items, firstUnpaidItemIndex, currentPosition };
};
