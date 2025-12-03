import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginInput } from '../users/dto/login.input';
import { RegisterInput } from '../users/dto/register.input';
import { AuthResponse } from '../users/dto/auth-response.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UserRole } from '../users/enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await this.usersService.validateUser(email, password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginInput: LoginInput): Promise<AuthResponse> {
    const user = await this.validateUser(loginInput.email, loginInput.password);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      email: user.email,
      sub: user.id,
      roles: user.roles,
    };

    return {
      token: this.jwtService.sign(payload),
      user,
    };
  }

  async register(registerInput: RegisterInput): Promise<AuthResponse> {
    // Check if user with this email already exists
    const existingUser = await this.usersService.findOneByEmail(registerInput.email);
    if (existingUser !== null) {
      throw new ConflictException('Email already in use');
    }

    // Create new user with default USER role
    const user = await this.usersService.create({
      username: registerInput.username,
      email: registerInput.email,
      password: registerInput.password,
      roles: [UserRole.USER] // Default role for new users
    });

    // Generate JWT token
    const payload: JwtPayload = {
      email: user.email,
      sub: user.id,
      roles: user.roles,
    };

    return {
      token: this.jwtService.sign(payload),
      user,
    };
  }
}
