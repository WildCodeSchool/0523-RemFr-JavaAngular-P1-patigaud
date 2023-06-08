export class Location {
    constructor(
        public id: string,
        public address: string,
        public geoPoint: Array<number>,
        public area: number,
        public structure: string,
        public postalCode: number,
        public label: string,
        public city: string,
        public shape?: Array<number>,
    ) { }
}