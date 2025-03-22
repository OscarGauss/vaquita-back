import { logService } from 'services/log';
import { ErrorCode, JkError, JkRequest, JkResponse, NextFunction } from 'types';

export const getAllDeposits = async (req: JkRequest, res: JkResponse, next: NextFunction) => {
  
  const contents: {}[] = [];
  
  res.sendContents(contents, { page: 0, size: 0, sort: [], totalElements: contents.length });
};

export const postScrollTransactionsDeposit = async (req: JkRequest, res: JkResponse, next: NextFunction) => {
  
  await logService.sendInfoMessage('postScrollTransactionsDeposit start', {
    body: req.body, headers: req.headers, params: req.params,
  });
  
  res.sendError(new JkError(ErrorCode.ERR500, { message: 'unprocessed' }));
};

export const postScrollTransactionsWithdraw = async (req: JkRequest, res: JkResponse, next: NextFunction) => {
  
  await logService.sendInfoMessage('postScrollTransactionsWithdraw start', {
    body: req.body, headers: req.headers, params: req.params,
  });
  
  res.sendError(new JkError(ErrorCode.ERR500, { message: 'unprocessed' }));
};
