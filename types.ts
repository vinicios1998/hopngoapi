import { Dayjs } from "dayjs";



export interface NewUserDto {
    name: string;
    surname: string;
    email: string;
    password: string;
    bio: string;
}
export interface UserEntity {
    name: string;
    surname: string;
    email: string;
    password: string;
    bio: string;
}

export interface LoginDto {
    email: string;
    password: string;
}
export interface CityInfo {
    place_id: string,
    label: string,
    lat: number,
    lng: number
}
export interface TripEntity {
    id: number,
    userId: string,
    from: CityInfo,
    to: CityInfo,
    availableSeats: number
    date: Dayjs
    duration: number
    price: number
}