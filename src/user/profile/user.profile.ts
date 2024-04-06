import { Injectable } from '@nestjs/common'
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs'
import { createMap, Mapper, MappingProfile } from '@automapper/core'
import { UserDto } from '../dto/user.dto'
import { UserModel } from '../models/user.model'
import { UserSearchDto } from '../dto/out/user-search.dto'

@Injectable()
export class UserProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper)
  }

  get profile(): MappingProfile {
    return mapper => {
      createMap(mapper, UserModel, UserSearchDto)
      createMap(mapper, UserModel, UserDto)
      createMap(mapper, UserDto, UserModel)
    }
  }
}
