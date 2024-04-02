import { registerAs } from '@nestjs/config'
import { knexSnakeCaseMappers } from 'objection'
export default registerAs('database', ()=> ({
  isGlobal: true,
  default: 'postgres',
  connections: {
    postgres: {
      client: 'pg',
      connection: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        charset: 'utf8',
      },
      ...knexSnakeCaseMappers()
    }
  }
}))