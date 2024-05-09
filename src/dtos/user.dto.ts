import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

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
  @MinLength(5)
  @IsNotEmpty()
  @IsEmail()
  public confirmPassword: string;
}
