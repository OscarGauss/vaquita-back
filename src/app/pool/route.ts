import {
  getAllDeposits,
  getData,
  postScrollTransactionsDeposit,
  postScrollTransactionsWithdraw,
} from 'app/pool/controller';
import { safeResponse } from 'helpers';
import type { API } from 'types';

export default (api: API) => {
  
  api.get('/', safeResponse(getAllDeposits));
  api.get('/data', safeResponse(getData));
  api.post('/scroll/transactions/deposit', safeResponse(postScrollTransactionsDeposit));
  api.post('/scroll/transactions/withdraw', safeResponse(postScrollTransactionsWithdraw));
  
}
