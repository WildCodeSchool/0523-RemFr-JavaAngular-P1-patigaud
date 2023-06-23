import { Badge } from "./badge";

export class User {
    key?: string | null;
    pseudo?: string | null;
    gender?: string;
    kilometers?: number;
    distance?: any;
    badges?: Badge[];
}