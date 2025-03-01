import { BuyRoute, BuyRouteDto, fromBuyRouteDto } from "./BuyRoute";
import { Country } from "./Country";
import { Language } from "./Language";
import { fromSellRouteDto, SellRoute, SellRouteDto } from "./SellRoute";

export enum UserRole {
  Unknown = "Unknown",
  User = "User",
  Admin = "Admin",
  EMPLOYEE = "Employee",
  VIP = "VIP",
  BETA = "Beta",
}

export enum UserStatus {
  NA = "NA",
  ACTIVE = "Active",
  VERIFY = "Verified",
}

export enum KycStatus {
  NA = "NA",
  WAIT_CHAT_BOT = "Chatbot",
  WAIT_VERIFY_ADDRESS = "Address",
  WAIT_VERIFY_ONLINE = "OnlineId",
  WAIT_VERIFY_VIDEO = "VideoId",
  WAIT_VERIFY_MANUAL = "Manual",
  COMPLETED = "Completed",
}

export enum KycState {
  NA = "NA",
  FAILED = "Failed",
  REMINDED = "Reminded",
}

export enum AccountType {
  PERSONAL = "Personal",
  BUSINESS = "Business",
}

export interface NewUserDto {
  address: string;
  signature: string;
  wallet: number;
  usedRef: string | undefined | null;
}

export interface NewUser {
  address: string;
  signature: string;
  walletId: number;
  usedRef: string | undefined | null;
}

export interface RefData {
  ref: string;
  refFee: number;
  refCount: number;
  refCountActive: number;
  refVolume: number;
}

export interface Fees {
  buy: number;
  refBonus: number;
  sell: number;
}

export interface UserVolume {
  buyVolume: number;
  sellVolume: number;
}

export const toNewUserDto = (user: NewUser): NewUserDto => ({
  address: user.address,
  signature: user.signature,
  wallet: user.walletId,
  usedRef: user.usedRef === "" ? null : user.usedRef,
});

export interface UserDto extends NewUserDto {
  accountType: AccountType;
  firstname: string;
  surname: string;
  street: string;
  houseNumber: string;
  zip: string;
  location: string;
  country: Country;
  mail: string | null;
  phone: string;

  usedRef: string | null;
  fees: Fees;
  refData: RefData;
  userVolume: UserVolume;
  status: UserStatus;
  kycStatus: KycStatus;
  kycState: KycState;
  depositLimit: number;
  language: Language;
  ip: string;

  organizationName: string;
  organizationStreet: string;
  organizationHouseNumber: string;
  organizationLocation: string;
  organizationZip: string;
  organizationCountry: Country;
}

export interface User extends NewUser {
  accountType: AccountType;
  firstName: string;
  lastName: string;
  street: string;
  houseNumber: string;
  zip: string;
  location: string;
  country: Country;
  mail: string;
  mobileNumber: string;
  usedRef: string;
  fees: Fees;
  refData: RefData;
  userVolume: UserVolume;
  status: UserStatus;
  kycStatus: KycStatus;
  kycState: KycState;
  depositLimit: number;
  language: Language;
  ip: string;

  organizationName: string;
  organizationStreet: string;
  organizationHouseNumber: string;
  organizationLocation: string;
  organizationZip: string;
  organizationCountry: Country;
}

export interface UserDetailDto extends UserDto {
  buys: BuyRouteDto[];
  sells: SellRouteDto[];
}

export interface UserDetail extends User {
  buys: BuyRoute[];
  sells: SellRoute[];
}

export const fromUserDto = (user: UserDto): User => ({
  accountType: user.accountType,
  address: user.address,
  signature: user.signature,
  firstName: user.firstname,
  lastName: user.surname,
  street: user.street,
  houseNumber: user.houseNumber,
  zip: user.zip,
  location: user.location,
  country: user.country,
  mail: user.mail ?? "",
  mobileNumber: user.phone,
  usedRef: user.usedRef ?? "",
  fees: user.fees,
  refData: user.refData,
  userVolume: user.userVolume,
  walletId: user.wallet,
  status: user.status,
  kycStatus: user.kycStatus,
  kycState: user.kycState,
  depositLimit: user.depositLimit,
  language: user.language,
  ip: user.ip,
  organizationName: user.organizationName,
  organizationStreet: user.organizationStreet,
  organizationHouseNumber: user.organizationHouseNumber,
  organizationLocation: user.organizationLocation,
  organizationZip: user.organizationZip,
  organizationCountry: user.organizationCountry,
});

export const toUserDto = (user: User): UserDto => ({
  accountType: user.accountType,
  address: user.address,
  signature: user.signature,
  firstname: user.firstName,
  surname: user.lastName,
  street: user.street,
  houseNumber: user.houseNumber,
  zip: user.zip,
  location: user.location,
  country: user.country,
  mail: toStringDto(user.mail),
  phone: user.mobileNumber,
  usedRef: toStringDto(user.usedRef),
  fees: user.fees,
  refData: user.refData,
  userVolume: user.userVolume,
  wallet: user.walletId,
  status: user.status,
  kycStatus: user.kycStatus,
  kycState: user.kycState,
  depositLimit: user.depositLimit,
  language: user.language,
  ip: user.ip,
  organizationName: user.organizationName,
  organizationStreet: user.organizationStreet,
  organizationHouseNumber: user.organizationHouseNumber,
  organizationLocation: user.organizationLocation,
  organizationZip: user.organizationZip,
  organizationCountry: user.organizationCountry,
});

export const fromUserDetailDto = (dto: UserDetailDto): UserDetail => ({
  ...fromUserDto(dto),
  buys: dto.buys.map((buy) => fromBuyRouteDto(buy)),
  sells: dto.sells.map((sell) => fromSellRouteDto(sell)),
});

const toStringDto = (string: string): string | null => (string === "" ? null : string);
