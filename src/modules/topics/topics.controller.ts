import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { TopicsService } from './topics.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { Public } from '@/decorators/auth.decorator';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('topics')
@ApiBearerAuth()
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        // Test upload multiple files
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
      required: ['name', 'description'],
    },
  })
  @UseInterceptors(FilesInterceptor('images'))
  create(
    @UploadedFiles() images: Express.Multer.File,
    @Body()
    createTopicDto: CreateTopicDto,
  ) {
    console.log('debug', images);
    return this.topicsService.create(createTopicDto);
  }

  // @Get()
  // @Public()
  // findAll() {
  //   return this.topicsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.topicsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTopicDto: UpdateTopicDto) {
  //   return this.topicsService.update(+id, updateTopicDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.topicsService.remove(+id);
  // }
}
