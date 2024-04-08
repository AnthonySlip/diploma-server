import { Migration } from '@mikro-orm/migrations'

export class Migration20220517050939 extends Migration {
	async up(): Promise<void> {
		const knex = this.ctx ?? this.driver.getConnection('write').getKnex()

		await knex.schema.createTable('user', tableBuilder => {
			tableBuilder.increments('id', { primaryKey: true })
			tableBuilder.string('first_name')
			tableBuilder.string('last_name')
			tableBuilder.string('password').notNullable()
			tableBuilder.string('email').notNullable().unique()
			tableBuilder.dateTime('date_created', { useTz: false }).notNullable()
		})
	}

	async down(): Promise<void> {
		const knex = this.ctx ?? this.driver.getConnection('write').getKnex()

		await this.getKnex().schema.dropTable('user')
	}
}
