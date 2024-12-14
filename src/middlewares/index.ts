import { JkResponse } from '@juki-team/base-back';
import { LogLevel } from '@juki-team/commons';
import { COMPANY_HOSTS } from 'config/settings';
import { NextFunction } from 'express';
import { log } from 'helpers';
import { JkRequest } from 'types';

export {
  loggerRequestTimeHandler,
  errorLoggerHandler,
  errorResponderHandler,
  failSafeHandler,
  notFoundResponse,
} from '@juki-team/base-back';

export function setCompany() {
  return async (_req: Request, res: JkResponse, next: NextFunction) => {
    const req = _req as unknown as JkRequest;
    
    let referer, host = ''; //, domain, subdomain;
    try {
      referer = req.header('Referer') as string;
      host = (referer?.split?.('/')?.[2] as string) || '';
      // domain = host.split('.').splice(-2).join('.');
      // subdomain = host.split('.').slice(0, -2).join('.');
      let companyId = -1;
      COMPANY_HOSTS.forEach((hosts, index) => {
        if (hosts.includes(host)) {
          companyId = index + 1;
        }
      });
      
      if (companyId > 0) {
        req.company = { id: `company-${companyId}` };
      } else {
        req.company = { id: '' };
      }
      
    } catch (error) {
      log(LogLevel.ERROR)('Error on setCompany', { error });
    }
    next();
  };
}
