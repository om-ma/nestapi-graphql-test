import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Employee } from './entities/employee.entity';
import { EmployeesService } from './employees.service';
import { CreateEmployeeInput } from './dto/create-employee.input';
import { UpdateEmployeeInput } from './dto/update-employee.input';
import { EmployeeFiltersInput } from './dto/employee-filters.input';
import { PaginationInput } from './dto/pagination.input';
import { EmployeePaginatedResponse } from './dto/employee-paginated-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enums/role.enum';

@Resolver(() => Employee)
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmployeesResolver {
  constructor(private readonly employeesService: EmployeesService) {}

  @Mutation(() => Employee)
  @Roles(UserRole.ADMIN)
  createEmployee(@Args('createEmployeeInput') createEmployeeInput: CreateEmployeeInput) {
    return this.employeesService.create(createEmployeeInput);
  }

  @Query(() => [Employee], { name: 'employees' })
  @Roles(UserRole.ADMIN, UserRole.USER)
  findAll(@Args('filters', { nullable: true }) filters?: EmployeeFiltersInput) {
    return this.employeesService.findAll(filters);
  }

  @Query(() => Employee, { name: 'employee' })
  @Roles(UserRole.ADMIN, UserRole.USER)
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.employeesService.findOne(id);
  }

  @Query(() => EmployeePaginatedResponse, { name: 'employeesPaginated' })
  @Roles(UserRole.ADMIN, UserRole.USER)
  findWithPagination(
    @Args('pagination') pagination: PaginationInput,
    @Args('filters', { nullable: true }) filters?: EmployeeFiltersInput
  ) {
    return this.employeesService.findWithPagination(pagination, filters);
  }

  @Mutation(() => Employee)
  @Roles(UserRole.ADMIN)
  updateEmployee(@Args('updateEmployeeInput') updateEmployeeInput: UpdateEmployeeInput) {
    return this.employeesService.update(updateEmployeeInput.id, updateEmployeeInput);
  }

  @Mutation(() => Boolean)
  @Roles(UserRole.ADMIN)
  async removeEmployee(@Args('id', { type: () => ID }) id: string) {
    return this.employeesService.remove(id);
  }

  @Mutation(() => Employee)
  @Roles(UserRole.ADMIN)
  markAttendance(
    @Args('id', { type: () => ID }) id: string,
    @Args('present', { type: () => Boolean }) present: boolean,
  ) {
    return this.employeesService.markAttendance(id, present);
  }
}
