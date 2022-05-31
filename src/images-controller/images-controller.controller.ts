import { Res, Controller, Get, Param } from '@nestjs/common';
import { Response } from 'express';

@Controller({
  path: 'files',
})
export class ImagesControllerController {
  @Get(':path')
  download(@Param('path') path, @Res() response: Response) {
    return response.sendFile(path, { root: './files' });
  }
}
