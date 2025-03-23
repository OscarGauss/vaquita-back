import { EntityDocument } from 'types';

export enum DepositPoolStatus {
  ACTIVE = 'active',
  CONCLUDED = 'concluded',
  EARLY_CONCLUDED = 'early-concluded',
}

export enum GroupCrypto {
  USDC = 'USDC',
  SOL = 'SOL',
}

export interface PoolDepositBaseDocument {
  companyId: string,
  contractAddress: string,
  transactionHash: string,
  timestamp: number,
  amount: string,
  depositId: string,
  customerPublicKey: string,
  crypto: GroupCrypto,
  status: DepositPoolStatus,
  event: object,
  rewardWithdrawn: string,
  amountWithdrawn: string,
}

export interface PoolDepositDTO {
  companyId: string,
  contractAddress: string,
  transactionHash: string,
  timestamp: number,
  amount: string,
  depositId: string,
  customerPublicKey: string,
  crypto: GroupCrypto,
  status: DepositPoolStatus,
}

export type PoolDepositDocument = EntityDocument<PoolDepositBaseDocument>;
