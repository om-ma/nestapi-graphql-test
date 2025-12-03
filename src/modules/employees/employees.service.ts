import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { CreateEmployeeInput } from './dto/create-employee.input';
import { UpdateEmployeeInput } from './dto/update-employee.input';

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

  async findAll(): Promise<Employee[]> {
    return this.employeesRepository.find();
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
