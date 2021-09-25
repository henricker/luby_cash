import "reflect-metadata";
import {createConnection} from "typeorm";
import { CustomerService } from "./application/services/customer-service";

createConnection().then(async connection => {
    const customerService = new CustomerService()
    await customerService.store({ name: 'henricker', email: 'email@email.com', averageSalary: 500 })
}).catch(error => console.log(error));
