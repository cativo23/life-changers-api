import { HttpException, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AdminService {
    constructor(private userService: UserService) {}

    async validateDocuments(info: any): Promise<{
        taxValid: boolean;
        idValid: boolean;
    }> {
        const user = await this.userService.findOne({id: info.user_id});

        if (!user) {
            throw new HttpException('User not found', 404);
        }

        if (user.documentsValid) {
            throw new HttpException('User documents already validated', 422);
        }

        return  await this.userService.validateDocuments(user, info.documents);
    }
}
