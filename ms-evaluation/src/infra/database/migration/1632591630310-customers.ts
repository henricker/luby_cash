import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class customers1632591630310 implements MigrationInterface {
	private table = new Table({
		name: 'customers',
		columns: [
			{
				name: 'id',
				type: 'integer',
				isPrimary: true,
			},
			{
				name: 'name',
				type: 'varchar',
				isNullable: false,
			},
			{
				name: 'email',
				type: 'varchar',
				isNullable: false,
				isUnique: true,
			},
			{
				name: 'cpf_number',
				type: 'varchar',
				isNullable: false,
			},
			{
				name: 'status',
				type: 'boolean',
				isNullable: false,
			},
			{
				name: 'averageSalary',
				type: 'float8',
				isNullable: false
			},
			{
				name: 'created_at',
				type: 'timestamp',
				default: 'now()'
			}
		]
	})
	public async up(queryRunner: QueryRunner): Promise<void> {
		queryRunner.createTable(this.table)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		queryRunner.dropTable(this.table)
	}
}
