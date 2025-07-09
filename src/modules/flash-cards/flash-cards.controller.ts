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
} from '@nestjs/common';
import { FlashCardsService } from './flash-cards.service';
import { CreateFlashCardDto } from './dto/create-flash-card.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { RequestWithUser } from '@/types/request.type';

@Controller('flash-cards')
@ApiTags('Flash Cards')
@ApiBearerAuth()
export class FlashCardsController {
  constructor(private readonly flashCardsService: FlashCardsService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        vocabulary: { type: 'string' },
        definition: { type: 'string' },
        meaning: { type: 'string' },
        pronunciation: { type: 'string' },
        examples: { type: 'array', items: { type: 'string' } },
        image: { type: 'string', format: 'binary' },
      },
      required: ['vocabulary', 'definition', 'meaning', 'image'],
    },
  })
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Req() request: RequestWithUser,
    @UploadedFile() image: Express.Multer.File,
    @Body() createFlashCardDto: CreateFlashCardDto,
  ) {
    // return this.flashCardsService.create({
    //   ...createFlashCardDto,
    //   user: request.user,
    //   image: image.originalname,
    // });
    return this.flashCardsService.createFlashCard(
      {
        ...createFlashCardDto,
        user: request.user,
        image: image.originalname,
      },
      image,
    );
  }

  // @Get()
  // findAll() {
  //   return this.flashCardsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.flashCardsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateFlashCardDto: UpdateFlashCardDto,
  // ) {
  //   return this.flashCardsService.update(+id, updateFlashCardDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.flashCardsService.remove(+id);
  // }
}
