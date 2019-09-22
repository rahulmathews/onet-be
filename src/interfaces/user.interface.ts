import {IAddress} from './address.interface';

export interface IUser{
    username: string;
    password: string;
    userType?: 'USER' | 'ADMIN';
    gender?: 'MALE' | 'FEMALE' | 'OTHERS';
    occcupation: string;
    emails?: Array<{
        value : string,
        primary : boolean,
    }>;
    phones?: Array<{
        value : string,
        primary : boolean,
    }>;
    images?: Array<{
        link : string,
        primary : boolean,
    }>;
    address?: IAddress;
}