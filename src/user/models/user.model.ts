import { BaseModel } from '@squareboat/nestjs-objection'
import { AutoMap } from '@automapper/classes'
import { getCurrentDate } from '../../common/helpers/date'
import { hash } from '../../auth/utilities/password'
import { IUser } from '../../events/interfaces/user.interface'

export class UserModel extends BaseModel {
    static tableName = 'user'

    static get virtualAttributes() {
        return ['fullName']
    }

    @AutoMap()
    get fullName(): string {
        return `${this.firstName} ${this.lastName}`
    }

    public getShortInfo(): IUser {
        return {
            id: this.id,
            firstName: this.firstName,
            lastName: this.lastName,
        }
    }

    @AutoMap()
    id!: number

    @AutoMap()
    firstName: string

    @AutoMap()
    lastName: string

    @AutoMap()
    email!: string

    password: string

    @AutoMap()
    dateCreated: Date

    dateDeleted?: Date

    static get modifiers() {
        return {
            selectShort(builder) {
                builder.select(
                  UserModel.ref('id'),
                  UserModel.ref('firstName'),
                  UserModel.ref('lastName'),
                )
            },
            selectShortColor(builder) {
                builder.select(
                  UserModel.ref('id'),
                  UserModel.ref('firstName'),
                  UserModel.ref('lastName'),
                )
            },
        }
    }

    private async setPassword(password: string) {
        this.password = await hash(password)
    }

    async $beforeInsert(queryContext) {
        await super.$beforeInsert(queryContext)
        await this.setPassword(this.password)
        this.dateCreated = getCurrentDate()
    }

    static relationMappings = {
    }
}

