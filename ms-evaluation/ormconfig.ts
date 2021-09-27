export default {
   type: "postgres",
   host: "localhost",
   port: 5432,
   username: "ms_evaluation",
   password: "ms_evaluation",
   database: "ms_evaluation",
   synchronize: true,
   logging: true,
   entities: ["src/application/entity/**/*.ts"],
   migrations: [
      "src/infra/database/migration/**/*.ts"
   ],
   subscribers: [
      "src/subscriber/**/*.ts"
   ],
   cli: {
      "entitiesDir": "src/application/entity",
      "migrationsDir": "src/infra/database/migration",
      "subscribersDir": "src/infra/database/subscriber"
   }
}