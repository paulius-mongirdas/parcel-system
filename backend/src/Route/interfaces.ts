export interface PackageData {
    id: number;
    address: string;
    city: string;
    country: string;
    postalCode: number;
    length: number;
    width: number;
    height: number;
    weight: number;
    status: Status;
    createdAt: Date;
    deliveredAt: Date;
    price: number;
    centerId: number;
    transportId?: number;
}

export interface TransportData {
    id: number;
    type: string;
    capacity: number; // volume capacity
    weight: number; // weight capacity
    averageSpeed: number;
    centerId: number;
}

export enum Status {
    CREATED = 'CREATED',
    IN_DELIVERY = 'IN_DELIVERY',
    DELIVERED = 'DELIVERED',
    CANCELED = 'CANCELED',
    NOT_DELIVERED = 'NOT_DELIVERED'
}
