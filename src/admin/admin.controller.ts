import { Body, Controller, Get } from '@nestjs/common';
import { ApiController } from '../common/controllers/api.controller';
import { AdminService } from './admin.service';

@Controller({
    path: 'admin',
    version: '1',
  })
export class AdminController extends ApiController {
    constructor(private adminService: AdminService) {
        super();
    }

    @Get('validate-documents')
    async validateDocuments(@Body() info: any) {
        return this.successResponse(
            await this.adminService.validateDocuments(info),
            "User's documents validated",
        );
    }
}
