import { EntityRepository, Repository } from "typeorm";
import { Customer } from "../entity/Customer";

@EntityRepository(Customer)
export class CustomerRepository extends Repository<Customer>{}