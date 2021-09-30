import { readdirSync } from 'fs'

(async () => {
  const prefix = '--'
  if(process.argv.length > 2){
    const args = process.argv.slice(2)
    const migrationCommand = args[0].replace(prefix, '')
    const migrations = await Promise.all(readdirSync(__dirname)
      .filter((filename) => !/index.[ts, js]/.test(filename))
      .map(async (filename) => (await import(`./${filename}`)).default))
    
    switch(migrationCommand) {
      case 'up':
        for await(let migration of migrations) {
          await migration.up()
          console.log(`migration ${migration.constructor.name}: up!`)
        }
        break
  
      case 'down':
        for await(let migration of migrations) {
          await migration.down()
          console.log(`migration ${migration.constructor.name}: down!`)
        }
        break
  
      default:
          console.log('Error: command not found!')
          break
    }
  } else {
    console.log('Error: required arguments')
  }
})()

