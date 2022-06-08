import { Res, Controller, Get, Param } from '@nestjs/common';
import { Response } from 'express';
import { ApiResponseSkip } from 'src/common/decorators';

@Controller({
  path: 'images',
})
export class ImagesControllerController {
  @Get(':path')
  @ApiResponseSkip()
  download(@Param('path') path: string, @Res() response: Response) {
    return response.sendFile(path, { root: './files' });
  }
}
