import { BadRequestException } from '@nestjs/common';
import { hash, verify } from 'argon2';

export const hashContent = async (plainContent: string) => {
  try {
    return await hash(plainContent);
  } catch (error) {}
};

export const compareContent = async (
  plainContent: string,
  hashedContent: string,
) => {
  const is_matching = await verify(hashedContent, plainContent);
  if (!is_matching) {
    throw new BadRequestException();
  }
};
