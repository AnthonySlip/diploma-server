import { AutoMap } from '@automapper/classes'

export class UserSearchDto {
  @AutoMap()
  id: number

  @AutoMap()
  firstName: string

  @AutoMap()
  lastName: string
}