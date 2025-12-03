import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { CreateEmployeeInput } from './dto/create-employee.input';
import { UpdateEmployeeInput } from './dto/update-employee.input';
import { EmployeeFiltersInput } from './dto/employee-filters.input';
import { PaginationInput } from './dto/pagination.input';
import { EmployeePaginatedResponse } from './dto/employee-paginated-response.dto';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private employeesRepository: Repository<Employee>,
  ) {}

  async create(createEmployeeInput: CreateEmployeeInput): Promise<Employee> {
    const employee = this.employeesRepository.create({
      ...createEmployeeInput,
      attendance: createEmployeeInput.attendance || [],
    });
    return this.employeesRepository.save(employee);
  }

  async findAll(filters?: EmployeeFiltersInput): Promise<Employee[]> {
    const queryBuilder = this.employeesRepository.createQueryBuilder('employee');
    
    if (filters) {
      if (filters.name) {
        queryBuilder.andWhere('employee.name ILIKE :name', { name: `%${filters.name}%` });
      }
      if (filters.age) {
        queryBuilder.andWhere('employee.age = :age', { age: filters.age });
      }
      if (filters.class) {
        queryBuilder.andWhere('employee.class ILIKE :class', { class: `%${filters.class}%` });
      }
      if (filters.subjects && filters.subjects.length > 0) {
        queryBuilder.andWhere('employee.subjects && :subjects', { subjects: filters.subjects });
      }
    }
    
    return queryBuilder.getMany();
  }

  async findWithPagination(
    pagination: PaginationInput,
    filters?: EmployeeFiltersInput
  ): Promise<EmployeePaginatedResponse> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC' } = pagination;
    const skip = (page - 1) * limit;

    const queryBuilder = this.employeesRepository.createQueryBuilder('employee');
    
    if (filters) {
      if (filters.name) {
        queryBuilder.andWhere('employee.name ILIKE :name', { name: `%${filters.name}%` });
      }
      if (filters.age) {
        queryBuilder.andWhere('employee.age = :age', { age: filters.age });
      }
      if (filters.class) {
        queryBuilder.andWhere('employee.class ILIKE :class', { class: `%${filters.class}%` });
      }
      if (filters.subjects && filters.subjects.length > 0) {
        queryBuilder.andWhere('employee.subjects && :subjects', { subjects: filters.subjects });
      }
    }

    queryBuilder
      .orderBy(`employee.${sortBy}`, sortOrder)
      .skip(skip)
      .take(limit);

    const [employees, total] = await queryBuilder.getManyAndCount();
    const totalPages = Math.ceil(total / limit);

    return {
      employees,
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }

  async findOne(id: string): Promise<Employee> {
    const employee = await this.employeesRepository.findOne({ where: { id } });
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    return employee;
  }

  async update(id: string, updateEmployeeInput: UpdateEmployeeInput): Promise<Employee> {
    const employee = await this.findOne(id);
    const updatedEmployee = {
      ...employee,
      ...updateEmployeeInput,
    };
    return this.employeesRepository.save(updatedEmployee);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.employeesRepository.delete(id);
    return (result.affected || 0) > 0;
  }

  async markAttendance(id: string, present: boolean): Promise<Employee> {
    const employee = await this.findOne(id);
    employee.attendance = employee.attendance || [];
    employee.attendance.push(present);
    return this.employeesRepository.save(employee);
  }
}
