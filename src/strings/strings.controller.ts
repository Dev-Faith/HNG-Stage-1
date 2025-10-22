import {
    Controller,
    Get,
    Post,
    Delete,
    Body,
    Param,
    Query,
    HttpCode,
    HttpStatus,
    ValidationPipe,
    UsePipes,
    BadRequestException,
} from '@nestjs/common';
import { StringsService } from './strings.service';
import { CreateStringDto } from './dto/create-string.dto';
import { FilterStringsDto } from './dto/filter-strings.dto';

@Controller('strings')
export class StringsController {
    constructor(private readonly stringsService: StringsService) { }

    /**
     * POST /strings - Create/Analyze a new string
     */
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    create(@Body() createStringDto: CreateStringDto) {
        // Validate that value is actually a string type
        if (typeof createStringDto.value !== 'string') {
            throw new BadRequestException('Invalid data type for "value" (must be string)');
        }
        return this.stringsService.create(createStringDto);
    }

    /**
     * GET /strings - Get all strings with optional filtering
     */
    @Get()
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    findAll(@Query() filters: FilterStringsDto) {
        return this.stringsService.findAll(filters);
    }

    /**
     * GET /strings/filter-by-natural-language - Natural language filtering
     */
    @Get('filter-by-natural-language')
    filterByNaturalLanguage(@Query('query') query: string) {
        if (!query) {
            throw new BadRequestException('Query parameter "query" is required');
        }
        return this.stringsService.filterByNaturalLanguage(query);
    }

    /**
     * GET /strings/:stringValue - Get a specific string by its value
     */
    @Get(':stringValue')
    findOne(@Param('stringValue') stringValue: string) {
        return this.stringsService.findByValue(stringValue);
    }

    /**
     * DELETE /strings/:stringValue - Delete a string by its value
     */
    @Delete(':stringValue')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('stringValue') stringValue: string) {
        this.stringsService.remove(stringValue);
    }
}
