export type TripResponse={choice:'interested'|'declined';updated:number;paid?:boolean;permission?:boolean};
export type TripResponses=Record<string,TripResponse>;
