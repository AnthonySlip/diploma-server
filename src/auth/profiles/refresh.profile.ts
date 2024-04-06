import { Injectable } from '@nestjs/common'
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs'
import { createMap, Mapper, MappingProfile } from '@automapper/core'
import { RefreshTokenDto } from '../dto/refresh-token.dto'
import { RefreshModel } from '../models/refresh.model'

@Injectable()
export class RefreshProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper)
    }

    get profile(): MappingProfile {
        return mapper => {
            createMap(mapper, RefreshModel, RefreshTokenDto)
        }
    }
}
