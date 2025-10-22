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
    UnprocessableEntityException,
    NotFoundException,
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
    // @HttpCode(HttpStatus.CREATED)
    // @UsePipes(new ValidationPipe({ transform: false, whitelist: true }))
    create(@Body() createStringDto: CreateStringDto) {
        // Validate that value is actually a string type
        // console.log('Invalid type for value:', typeof createStringDto.value);
        if (typeof createStringDto.value !== 'string') {
            throw new NotFoundException('Invalid data type for "value" (must be string)');
        }
        return this.stringsService.create(createStringDto);
    }

    /**
     * GET /strings - Get all strings with optional filtering
     */
    @Get()
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    findAll(@Query() filters: FilterStringsDto) {
        // console.log('Filters received:', filters);
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

        let parsedFilters: any;
        try {
            parsedFilters = this.stringsService.parseNaturalLanguageQuery(query);
        } catch (error) {
            throw new BadRequestException('Unable to parse natural language query');
        }

        // Check for conflicting filters
        const conflicts = this.detectFilterConflicts(parsedFilters);
        if (conflicts.length > 0) {
            throw new UnprocessableEntityException({
                message: 'Query parsed but resulted in conflicting filters',
                conflicts: conflicts,
                parsed_filters: parsedFilters,
            });
        }

        return this.stringsService.filterByNaturalLanguage(query);
    }

    private detectFilterConflicts(filters: any): string[] {
        const conflicts: string[] = [];

        // Check if min_length > max_length
        if (
            filters.min_length !== undefined &&
            filters.max_length !== undefined &&
            filters.min_length > filters.max_length
        ) {
            conflicts.push(
                `min_length (${filters.min_length}) cannot be greater than max_length (${filters.max_length})`,
            );
        }

        // Check if exact length conflicts with min/max
        if (filters.length !== undefined) {
            if (
                filters.min_length !== undefined &&
                filters.length < filters.min_length
            ) {
                conflicts.push(
                    `Exact length (${filters.length}) conflicts with min_length (${filters.min_length})`,
                );
            }
            if (
                filters.max_length !== undefined &&
                filters.length > filters.max_length
            ) {
                conflicts.push(
                    `Exact length (${filters.length}) conflicts with max_length (${filters.max_length})`,
                );
            }
        }

        return conflicts;
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
