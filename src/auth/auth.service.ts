import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { envVariables } from '../config/env.config';
import { log } from 'console';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UsersService,
    private mailerService: MailerService,
  ) {}

  async register(createUserDto: CreateUserDto, req?: any) {
    try {
      const { email, username, role } = createUserDto;

      // Agar Admin yaratmoqchi bo'lsa, SuperAdmin tokeni kerak
      try {
        if (role === 'Admin') {
          const authHeader = req.headers['authorization'];
          log(authHeader);
          

          if (!authHeader) {
            throw new UnauthorizedException('Authorization header required');
          }
          const token = authHeader.split(' ')[1];
          if (!token) {
            throw new UnauthorizedException('Bearer token required');
          }
          console.log(">>>>>>>>>>>>>>>>>>>>>",token);
          
          try {
            const decoded = this.jwtService.verify(token);
            console.log(">>>>>>>>>>>>>>>>>>>>>",decoded);
            console.log(">>>>>>>>>>>>>>>>>>>>> Role:", decoded.role);
            if (decoded.role !== 'SuperAdmin') {
              throw new UnauthorizedException(
                'Only SuperAdmin can create Admin users',
              );
            }
          } catch (verifyError) {
            console.log(">>>>>>>>>>>>>>>>>>>>> JWT Verify Error:", verifyError.message);
            throw new UnauthorizedException('Invalid token');
          }
        }
      } catch (error) {
        throw new Error('Siz SuperAdmin emassiz');
      }

      this.logger.log(`Starting registration process for email: ${email}`);

      // Email mavjudligini tekshirish
      const eUser = await this.userService.findOneByEmail(email);
      if (eUser) {
        this.logger.warn(`Registration failed: Email already exists: ${email}`);
        throw new BadRequestException('User with this email already exists');
      }

      // Username mavjudligini tekshirish
      const existingUser = await this.userRepository.findOne({
        where: { username },
      });
      if (existingUser) {
        this.logger.warn(
          `Registration failed: Username already exists: ${username}`,
        );
        throw new BadRequestException('Bu username allaqachon ishlatilgan');
      }

      // Barcha ma'lumotlarni JWT token ichiga joylash
      const payload = {
        username: createUserDto.username,
        password: createUserDto.password,
        email: createUserDto.email,
        phoneNumber: createUserDto.phoneNumber,
        role: createUserDto.role || 'User',
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        birthDate: createUserDto.birthDate,
        DLN: createUserDto.DLN,
      };
      const token = this.jwtService.sign(payload, { expiresIn: '24h' });

      this.logger.log(`JWT token created for email: ${email}`);

      try {
        // Tasdiqlash emailini yuborish
        await this.sendEmailVerification(email, username, token);
        this.logger.log(`Verification email sent successfully to: ${email}`);
      } catch (error) {
        this.logger.error(
          `Failed to send verification email to: ${email}`,
          error.stack,
        );
        throw new InternalServerErrorException(
          "Email yuborishda xatolik yuz berdi. Iltimos, keyinroq urinib ko'ring",
        );
      }

      this.logger.log(
        `Registration process completed successfully for email: ${email}`,
      );
      return {
        message: 'Please check your email to verify your account',
        email,
      };
    } catch (error) {
      this.logger.error(
        `Registration process failed for email: ${createUserDto.email}`,
        error.stack,
      );
      throw error;
    }
  }

  async verifyEmail(token: string) {
    try {
      this.logger.log('Starting email verification process');

      // JWT token ni tekshirish va ma'lumotlarni olish
      const payload = this.jwtService.verify(token);
      if (!payload) {
        this.logger.warn('Email verification failed: Invalid token');
        throw new BadRequestException('Invalid token');
      }

      this.logger.log(
        `Token verified successfully for email: ${payload.email}`,
      );

      // Parolni hash qilish
      const hashedPassword = await bcrypt.hash(payload.password, 10);
      this.logger.log('Password hashed successfully');

      // User yaratish va databasega saqlash
      const user = await this.userService.create({
        ...payload,
        password: hashedPassword,
        isEmailVerified: true,
      });

      this.logger.log(`User created successfully with ID: ${user.id}`);

      // Login uchun access token yaratish
      const accessToken = this.jwtService.sign({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      this.logger.log(`Access token created for user ID: ${user.id}`);

      return {
        message: 'Email verified successfully',
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
        },
      };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        this.logger.warn('Email verification failed: Token expired');
        throw new BadRequestException('Token has expired');
      }
      this.logger.error('Email verification process failed', error.stack);
      throw new BadRequestException('Invalid token');
    }
  }

  async login(email: string, password: string) {
    try {
      this.logger.log(`Login attempt for email: ${email}`);

      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        this.logger.warn(`Login failed: User not found for email: ${email}`);
        throw new UnauthorizedException("Noto'g'ri email yoki parol. USER");
      }

      if (!user.isEmailVerified) {
        this.logger.warn(`Login failed: Email not verified for: ${email}`);
        throw new UnauthorizedException('Avval emailni tasdiqlang');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        this.logger.warn(`Login failed: Invalid password for email: ${email}`);
        throw new UnauthorizedException("Noto'g'ri email yoki parol");
      }

      const payload = {
        sub: user.id,
        email: user.email,
        role: user.role,
      };

      const accessToken = this.jwtService.sign(payload);
      this.logger.log(`Login successful for user ID: ${user.id}`);

      return {
        access_token: accessToken,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
        },
      };
    } catch (error) {
      this.logger.error(
        `Login process failed for email: ${email}`,
        error.stack,
      );
      throw error;
    }
  }

  private async sendEmailVerification(
    email: string,
    username: string,
    token: string,
  ) {
    const verificationUrl = `${envVariables.frontend.url}/auth/verify-email?token=${token}`;

    const htmlContent = `
            <h1>Email tasdiqlash</h1>
            <p>Salom <strong>${username}</strong>!</p>
            <p>Emailingizni tasdiqlash uchun quyidagi linkni bosing:</p>
            <a href="${verificationUrl}">Emailni tasdiqlash</a>
            <p>Bu link 24 soatdan keyin amal qilmaydi.</p>
        `;

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'RentCar - Email tasdiqlash',
        html: htmlContent,
      });

      this.logger.log(`✅ Email yuborildi: ${email}`);
    } catch (error) {
      this.logger.error(`❌ Email yuborish xatosi: ${email}`, error.stack);
      throw error;
    }
  }
}
