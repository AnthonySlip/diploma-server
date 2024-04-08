import { Injectable } from '@nestjs/common'
import { Repository } from '../../common/database/repository'
import { InjectModel } from '@squareboat/nestjs-objection'
import { UserModel } from '../models/user.model'
import { hash } from '../../auth/utilities/password'
import { getCurrentDate } from '../../common/helpers/date'

export const USER_REPOSITORY = 'user_repository'

@Injectable()
export class UserRepository extends Repository<UserModel> {
  @InjectModel(UserModel)
  model: UserModel

  async findOne(userId: number): Promise<UserModel|undefined> {
    return this.firstWhere({
      id: userId
    }, false)
  }

  async markDeleted(user: UserModel): Promise<void> {
    return (async () => {
      await this.update(user, {
        dateDeleted: getCurrentDate()
      })
    })()
  }
}
