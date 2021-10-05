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
    try {
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
      console.log(query)
      const result = await client.query(query, values)
      await client.end()
  
      const entityObject = new this.classEntity({ ...result.rows[0] })
      return entityObject
    } catch(err) {
      throw new Error(err.message)
    }
  }

  public async findById(id: number): Promise<T | undefined> {
    const client = getClient()
    await client.connect()
    const query = `SELECT * FROM ${this.tableName} WHERE id = $1`
    console.log(query)
    const values = [ id ]
    const result = await client.query(query, values)
    await client.end()
  
    const entityObject = result.rows[0] ? new this.classEntity({ ...result.rows[0] }) : undefined
    return entityObject
  }

  public async update(fieldsToUpdate: Partial<T>, id: number): Promise<T> {
    try {
      const client = getClient()
      await client.connect()
      const values = Object.values(fieldsToUpdate).filter((value) => value !== undefined)
      let query = `UPDATE ${this.tableName} SET `
      Object.keys(fieldsToUpdate).filter((key) => fieldsToUpdate[key] !== undefined).forEach((key, index) => {
        query += `${key}=$${index + 1}, `
      })
      query = query.replace(/, $/, ` WHERE id=$${values.length + 1} RETURNING *`)
      console.log(query)      
      values.push(id)
      const result = await client.query(query, values)
      await client.end()
    
      const entityObject = result.rows[0] ? new this.classEntity({ ...result.rows[0] }) : undefined
      return entityObject
    } catch(err) {
      throw new Error(err.message)
    }
  }

  public async find({ page = 1, limit = 10 }: findOptions, where?: Partial<T> | undefined, dateFilter?: dateFilter): Promise<T[]> {
    const client = getClient()
    await client.connect()
    let query = `SELECT * FROM ${this.tableName} `

    if(where) {
      query += 'WHERE '
      Object.keys(where).forEach((key, index) => {
        query+=`${key}=$${index + 1} `
      })
    }

    if(dateFilter) {
      query += `AND created_at >= '${dateFilter.begin_date}' AND created_at <= '${dateFilter.end_date}'`
    }
    query += ` OFFSET ${ (page - 1 ) * limit } LIMIT ${limit}`

    console.log(query)
    const values = where ? Object.values(where) : undefined
    const result = values ? await client.query(query, values) : await client.query(query) 
    await client.end()

    const entities = result.rows.map((row) => new this.classEntity({ ...row }))
    return entities
  }
}

interface findOptions {
  page?: number
  limit?: number
}

export interface dateFilter {
  begin_date?: string
  end_date?: string
}
