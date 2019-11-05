export namespace UserDTO {
  export interface UserUpdateDTO {
    firstName: string
    lastName: string
    phone: string
    homeAirportId: string
  }

  export interface SignUpDTO {
    email: string
    password: string
    firstName: string
    lastName: string
    phone: string
    acceptTerms: boolean
    countryCode: string
  }
}
