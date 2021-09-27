import getClient from "../../infra/database";

export abstract class Repository<T> {
  private tableName: string
  private classEntity: any
  constructor() {
    this.tableName = this.constructor.name.replace(/Repository$/, '').toLocaleLowerCase()
    import(`../entity/${this.tableName}`).then((module) => {
      this.classEntity = module.default
    })
  }

  public async create (entity: T): Promise<T> {
    const client = getClient()
    await client.connect()
    const values = Object.values(entity)
    let query = `INSERT INTO ${this.tableName}(`
    
    Object.keys(entity).forEach((key) => {
      query += `${key}, `
    })
    query = query.replace(/, $/, '') + ') VALUES('

    Object.keys(entity).forEach((_, index) => {
      query += `$${index + 1}, `
    })
    
    query = query.replace(/, $/, '') + ') RETURNING *'
    const result = await client.query(query, values)
    await client.end()

    const entityObject = new this.classEntity({ ...result.rows[0] })
    return entityObject
  }

  public async findById(id: number): Promise<T | undefined> {
    const client = getClient()
    await client.connect()
    const query = `SELECT * FROM ${this.tableName} WHERE id = $1`
    const values = [ id ]
    const result = await client.query(query, values)
    await client.end()
  
    const entityObject = result.rows[0] ? new this.classEntity({ ...result.rows[0] }) : undefined
    return entityObject
  }

  public async find({ page = 0, limit = 10 }: findOptions): Promise<T[]> {
    const client = getClient()
    await client.connect()
    const query = `SELECT * FROM ${this.tableName} OFFSET ${page * limit} LIMIT ${limit}`
    const result = await client.query(query)
    await client.end()

    const entities = result.rows.map((row) => new this.classEntity({ ...row }))
    return entities
  }
}

interface findOptions {
  page?: number
  limit?: number
}
