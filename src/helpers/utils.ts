import { BadRequestException } from '@nestjs/common';
import { compare, genSalt, hash } from 'bcrypt-ts';

export const hashPasswordHelper = async (plainPassword: string) => {
  try {
    const salt = await genSalt(10);
    return await hash(plainPassword, salt);
  } catch (error) {}
};

export const comparePasswordHelper = async (
  plainPassword: string,
  hashPassword: string,
) => {
  const is_matching = await compare(plainPassword, hashPassword);
  if (!is_matching) {
    throw new BadRequestException();
  }
};
