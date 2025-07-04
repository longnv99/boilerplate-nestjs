import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Req,
  Query,
} from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { COLLECTION_LEVEL } from './entities/collection.entity';
import { RequestWithUser } from '@/types/request.type';
import { FindAllCollectionDto } from './dto/find-all-collection.dto';
import { ApiDocsPagination } from '@/decorators/swagger-form-data.decorator';

@Controller('collection')
@ApiTags('Collections')
@ApiBearerAuth()
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          default: 'Learn Kitchen Vocabulary',
        },
        description: { type: 'string', default: 'Some description' },
        level: {
          type: 'string',
          enum: Object.values(COLLECTION_LEVEL),
          default: COLLECTION_LEVEL.CHAOS,
        },
        isPublic: {
          type: 'boolean',
          default: true,
        },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['name', 'level', 'isPublic', 'image'],
    },
  })
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Req() request: RequestWithUser,
    @Body() createCollectionDto: CreateCollectionDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.collectionService.create({
      ...createCollectionDto,
      image: image.originalname,
      user: request.user,
    });
  }

  @Get()
  @ApiDocsPagination()
  findAll(@Query() query: FindAllCollectionDto) {
    const { limit, offset, ...filter } = query;
    return this.collectionService.findAll({ ...filter }, { limit, offset });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.collectionService.findOne(id);
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateCollectionDto: UpdateCollectionDto,
  // ) {
  //   return this.collectionService.update(+id, updateCollectionDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.collectionService.remove(+id);
  // }
}
