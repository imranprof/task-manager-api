import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaClient } from '../generated/client';

const prisma = new PrismaClient();

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async signup(username: string, email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {username, email, password: hashedPassword},
    });
    return {id: user.id, username: user.username, email: user.email};
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({where: { email } });
    if(!user) throw new Error('User not found');

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) throw new Error('Invalid Password');

    const payload = {sub: user.id, email: user.email };
    return {access_token: this.jwtService.sign(payload)};
  }

}
