import { BaseModel } from '@squareboat/nestjs-objection';
import { AutoMap } from '@automapper/classes';
import { UserModel } from '../../user/models/user.model';


export class ReportModel extends BaseModel {

  static tableName = 'report'

  @AutoMap()
  id!: number

  @AutoMap()
  text: string

  @AutoMap()
  userId: number

  @AutoMap()
  dateCreated: Date

  static relationMappings = {
    user: {
      relation: BaseModel.HasOneRelation,
      modelClass: () => UserModel,
      join: {
        from: 'report.userId',
        to: 'user.id'
      }
    },
  }

}