import type { User } from '@prisma/client';

export class UserResponse {
  id: number;

  email: string;

  emailVerified: boolean;

  name: string;

  image: string | null;

  phone: string | null;

  registrationDate: Date; // ISO Date

  static fromUserEntity(entity: User): UserResponse {
    const response = new UserResponse();
    response.id = entity.id;
    response.email = entity.email;
    response.emailVerified = entity.emailVerified;
    response.name = [entity.first_name, entity.last_name]
      .filter((s) => s !== null)
      .join(' ');
    response.image = entity.image;
    response.phone = entity.phone;
    response.registrationDate = entity.created_at;
    return response;
  }
}
