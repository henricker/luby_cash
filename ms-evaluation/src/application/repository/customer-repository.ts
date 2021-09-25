import { EntityRepository, Repository } from "typeorm";
import { Customer } from "../entity/customer";

@EntityRepository(Customer)
export class CustomerRepository extends Repository<Customer>{}