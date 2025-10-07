// User Address attributes
export interface UserAddress {
  id: number;
  createdAt: Date;
  userId: number;
  addressType?: AddressType;
  address: string;
  latitude: number;
  longitude: number;
  updatedAt?: Date;
}

export interface UserAddressCreationAttributes {
  userId: number;
  addressType?: AddressType;
  address: string;
  latitude: number;
  longitude: number;
}

export enum AddressType {
  HOME = "HOME",
  WORK = "WORK",
  OTHER = "OTHER",
}
