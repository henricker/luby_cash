import { MigrationInterface, QueryRunner, Table} from "typeorm";

export class customer1632528883245 implements MigrationInterface {

	private table = new Table({
		name: 'customers',
		columns: [
			{
				name: 'id',
				type: 'int',
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
				isUnique: true, 
				isNullable: false,
			},
			{
				name: 'average_salary',
				type: 'double',
				isNullable: false,
			},
			{
				name: 'status',
				type: 'varchar',
				isNullable: false,
			},
			{
				name: 'created_at',
				type: 'timestamps',
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
