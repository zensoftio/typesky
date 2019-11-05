import {JsonObject, JsonProperty, JsonType} from 'ta-json'
import {observable} from 'mobx'
import {WithRequestMetadata} from '@Types'

export namespace User {

  @JsonObject()
  export class UserInfo {
    @JsonProperty()
    @JsonType(String)
    @observable
    id: string

    @JsonProperty()
    @JsonType(String)
    @observable
    firstName: string

    @JsonProperty()
    @JsonType(String)
    @observable
    lastName: string

    @JsonProperty()
    @JsonType(String)
    @observable
    phone: string

    @JsonProperty()
    @JsonType(String)
    @observable
    email: string

    @JsonProperty()
    @JsonType(String)
    @observable
    airportId: string

    @JsonProperty()
    @JsonType(String)
    @observable
    airportCode: string

    @JsonProperty()
    @JsonType(String)
    @observable
    airportEnglishName: string

    @JsonProperty()
    @JsonType(String)
    @observable
    airportRussianName: string

    @JsonProperty()
    @JsonType(String)
    @observable
    cityEnglishName: string

    @JsonProperty()
    @JsonType(String)
    @observable
    cityRussianName: string

    @JsonProperty()
    @JsonType(String)
    @observable
    countryEnglishName: string

    @JsonProperty()
    @JsonType(String)
    @observable
    countryRussianName: string
  }

  @JsonObject()
  export class PassengerInfo {
    @JsonProperty()
    @JsonType(String)
    @observable
    id: string

    @JsonProperty()
    @JsonType(String)
    @observable
    firstName: string

    @JsonProperty()
    @JsonType(String)
    @observable
    lastName: string

    @JsonProperty()
    @JsonType(String)
    @observable
    phone: string

    @JsonProperty()
    @JsonType(String)
    @observable
    email: string

    @JsonProperty()
    @JsonType(String)
    @observable
    airportId: string

    @JsonProperty()
    @JsonType(String)
    @observable
    airportCode: string

    @JsonProperty()
    @JsonType(String)
    @observable
    airportEnglishName: string

    @JsonProperty()
    @JsonType(String)
    @observable
    airportRussianName: string

    @JsonProperty()
    @JsonType(String)
    @observable
    cityEnglishName: string

    @JsonProperty()
    @JsonType(String)
    @observable
    cityRussianName: string

    @JsonProperty()
    @JsonType(String)
    @observable
    countryEnglishName: string

    @JsonProperty()
    @JsonType(String)
    @observable
    countryRussianName: string
  }

  export interface Records {
    userInfo: WithRequestMetadata<UserInfo>
    passengerInfo: WithRequestMetadata<PassengerInfo>
  }
}

export default User
