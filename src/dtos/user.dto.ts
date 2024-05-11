import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsDate,
} from "class-validator";

export class RegisterUserDto {
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  public username: string;

  @IsString()
  @IsEmail()
  @MinLength(10)
  public email: string;

  @IsString()
  @MinLength(10)
  @IsNotEmpty()
  public password: string;

  @IsString()
  @MinLength(10)
  @IsNotEmpty()
  @IsEmail()
  public confirmPassword: string;

  @IsString()
  @IsOptional()
  public refreshToken?: string;

  @IsString()
  @IsOptional()
  public forgotPasswordToken?: string;

  @IsDate()
  @IsOptional()
  public forgotPasswordExpire?: Date;
}
