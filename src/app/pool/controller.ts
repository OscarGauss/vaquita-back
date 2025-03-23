import { createPoolDeposit, getPoolDepositByDepositId, updatePoolDeposit } from 'app/pool/services';
import { DepositPoolStatus, GroupCrypto, PoolDepositBaseDocument } from 'app/pool/types';
import { logService } from 'services/log';
import { JkRequest, JkResponse, NextFunction } from 'types';

export const getAllDeposits = async (req: JkRequest, res: JkResponse, next: NextFunction) => {
  
  const contents: {}[] = [];
  
  res.sendContents(contents, { page: 0, size: 0, sort: [], totalElements: contents.length });
};

export const postScrollTransactionsDeposit = async (req: JkRequest, res: JkResponse, next: NextFunction) => {
  
  await logService.sendInfoMessage('postScrollTransactionsDeposit start', {
    body: req.body, headers: req.headers, params: req.params,
  });
  
  const transactionHash = req.body?.event?.data?.block?.logs?.[0]?.transaction?.hash;
  const timestamp = Number(req.body?.event?.data?.block?.timestamp ?? 0);
  const amount = BigInt(req.body?.event?.data?.block?.logs?.[0]?.data ?? 0).toString();
  const depositId = req.body?.event?.data?.block?.logs?.[0]?.topics?.[1] ?? '';
  const customerPublicKey = req.body?.event?.data?.block?.logs?.[0]?.transaction?.from?.address ?? '';
  const contractAddress = req.body?.event?.data?.block?.logs?.[0]?.account?.address ?? '';
  
  const poolDeposit: PoolDepositBaseDocument = {
    companyId: '',
    transactionHash,
    timestamp,
    amount,
    depositId,
    customerPublicKey,
    crypto: GroupCrypto.USDC,
    status: DepositPoolStatus.ACTIVE,
    event: req.body?.event,
    contractAddress,
    rewardWithdrawn: '0',
    amountWithdrawn: '0',
  };
  
  await createPoolDeposit(poolDeposit);
  
  res.sendContent(true);
};

function splitInHalf(str: string): [ string, string ] {
  const mid = Math.floor(str.length / 2);
  const firstHalf = str.slice(0, mid);
  const secondHalf = str.slice(mid);
  return [ firstHalf, secondHalf ];
}

export const postScrollTransactionsWithdraw = async (req: JkRequest, res: JkResponse, next: NextFunction) => {
  
  await logService.sendInfoMessage('postScrollTransactionsWithdraw start', {
    body: req.body, headers: req.headers, params: req.params,
  });
  
  const depositId = req.body?.event?.data?.block?.logs?.[0]?.topics?.[1] ?? '';
  const [ amount, reward ] = splitInHalf((req.body?.event?.data?.block?.logs?.[0]?.data + '').replace('0x', ''));
  const amountWithdrawn = BigInt(`0x${amount}`).toString();
  const rewardWithdrawn = BigInt(`0x${reward}`).toString();
  
  const poolDeposit = await getPoolDepositByDepositId('', depositId);
  await updatePoolDeposit(poolDeposit._id.toString(), {
    amountWithdrawn,
    rewardWithdrawn,
    status: DepositPoolStatus.CONCLUDED,
  });
  
  res.sendContent(true);
};
