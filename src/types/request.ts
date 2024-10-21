import { Request } from 'express';

export interface JkRequest<T = {}> extends Request<T> {

}
