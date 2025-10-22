import {
    Injectable,
    ConflictException,
    NotFoundException,
    BadRequestException,
    UnprocessableEntityException,
} from '@nestjs/common';
import { createHash } from 'crypto';
import { StringAnalysisEntity, StringProperties } from './entities/string-analysis.entity';
import { CreateStringDto } from './dto/create-string.dto';
import { FilterStringsDto } from './dto/filter-strings.dto';

@Injectable()
export class StringsService {
    private readonly storage: Map<string, StringAnalysisEntity> = new Map();

    /**
     * Analyze a string and compute all required properties
     */
    private analyzeString(value: string): StringProperties {
        // Calculate length
        const length = value.length;

        // Check if palindrome (case-insensitive)
        const normalizedValue = value.toLowerCase();
        const is_palindrome = normalizedValue === normalizedValue.split('').reverse().join('');

        // Count unique characters
        const uniqueChars = new Set(value);
        const unique_characters = uniqueChars.size;

        // Count words (separated by whitespace)
        const word_count = value.trim().split(/\s+/).filter(word => word.length > 0).length;

        // Generate SHA-256 hash
        const sha256_hash = createHash('sha256').update(value).digest('hex');

        // Build character frequency map
        const character_frequency_map: Record<string, number> = {};
        for (const char of value) {
            character_frequency_map[char] = (character_frequency_map[char] || 0) + 1;
        }

        return {
            length,
            is_palindrome,
            unique_characters,
            word_count,
            sha256_hash,
            character_frequency_map,
        };
    }

    /**
     * Create and analyze a new string
     */
    create(createStringDto: CreateStringDto): StringAnalysisEntity {
        const { value } = createStringDto;

        // Analyze the string
        const properties = this.analyzeString(value);

        // Check if string already exists (by SHA-256 hash)
        if (this.storage.has(properties.sha256_hash)) {
            throw new ConflictException('String already exists in the system');
        }

        // Create entity
        const entity = new StringAnalysisEntity(value, properties);
        this.storage.set(properties.sha256_hash, entity);

        return entity;
    }

    /**
     * Get a specific string by its value
     */
    findByValue(stringValue: string): StringAnalysisEntity {
        // Calculate hash of the requested string
        const hash = createHash('sha256').update(stringValue).digest('hex');

        const entity = this.storage.get(hash);
        if (!entity) {
            throw new NotFoundException('String does not exist in the system');
        }

        return entity;
    }

    /**
     * Get all strings with optional filtering
     */
    findAll(filters: FilterStringsDto) {
        let results = Array.from(this.storage.values());

        // Apply filters
        if (filters.is_palindrome !== undefined) {
            results = results.filter(
                (item) => item.properties.is_palindrome === filters.is_palindrome,
            );
        }

        if (filters.min_length !== undefined) {
            results = results.filter(
                (item) => item.properties.length >= filters.min_length!,
            );
        }

        if (filters.max_length !== undefined) {
            results = results.filter(
                (item) => item.properties.length <= filters.max_length!,
            );
        }

        if (filters.word_count !== undefined) {
            results = results.filter(
                (item) => item.properties.word_count === filters.word_count,
            );
        }

        if (filters.contains_character !== undefined) {
            results = results.filter((item) =>
                item.value.includes(filters.contains_character!),
            );
        }

        return {
            data: results,
            count: results.length,
            filters_applied: filters,
        };
    }

    /**
     * Parse natural language query and convert to filters
     */
    private parseNaturalLanguageQuery(query: string): FilterStringsDto {
        const lowerQuery = query.toLowerCase();
        const filters: FilterStringsDto = {};

        // Parse palindrome-related queries
        if (lowerQuery.includes('palindrom')) {
            filters.is_palindrome = true;
        }

        // Parse word count patterns
        const singleWordMatch = lowerQuery.match(/single\s+word/i);
        if (singleWordMatch) {
            filters.word_count = 1;
        }

        const wordCountMatch = lowerQuery.match(/(\d+)\s+words?/i);
        if (wordCountMatch) {
            filters.word_count = parseInt(wordCountMatch[1], 10);
        }

        // Parse length patterns
        const longerThanMatch = lowerQuery.match(/longer\s+than\s+(\d+)/i);
        if (longerThanMatch) {
            filters.min_length = parseInt(longerThanMatch[1], 10) + 1;
        }

        const shorterThanMatch = lowerQuery.match(/shorter\s+than\s+(\d+)/i);
        if (shorterThanMatch) {
            filters.max_length = parseInt(shorterThanMatch[1], 10) - 1;
        }

        const minLengthMatch = lowerQuery.match(/(?:at least|minimum)\s+(\d+)\s+characters?/i);
        if (minLengthMatch) {
            filters.min_length = parseInt(minLengthMatch[1], 10);
        }

        const maxLengthMatch = lowerQuery.match(/(?:at most|maximum)\s+(\d+)\s+characters?/i);
        if (maxLengthMatch) {
            filters.max_length = parseInt(maxLengthMatch[1], 10);
        }

        // Parse character containment patterns
        const containsLetterMatch = lowerQuery.match(/contain(?:s|ing)?\s+(?:the\s+)?(?:letter|character)\s+([a-z])/i);
        if (containsLetterMatch) {
            filters.contains_character = containsLetterMatch[1].toLowerCase();
        }

        // Special case: "first vowel" = 'a'
        if (lowerQuery.includes('first vowel')) {
            filters.contains_character = 'a';
        }

        // Check if we parsed any filters
        if (Object.keys(filters).length === 0) {
            throw new BadRequestException('Unable to parse natural language query');
        }

        return filters;
    }

    /**
     * Filter strings using natural language query
     */
    filterByNaturalLanguage(query: string) {
        const parsedFilters = this.parseNaturalLanguageQuery(query);
        const results = this.findAll(parsedFilters);

        return {
            data: results.data,
            count: results.count,
            interpreted_query: {
                original: query,
                parsed_filters: parsedFilters,
            },
        };
    }

    /**
     * Delete a string by its value
     */
    remove(stringValue: string): void {
        // Calculate hash of the string to delete
        const hash = createHash('sha256').update(stringValue).digest('hex');

        if (!this.storage.has(hash)) {
            throw new NotFoundException('String does not exist in the system');
        }

        this.storage.delete(hash);
    }
}
