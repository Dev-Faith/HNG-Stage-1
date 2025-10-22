import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { StringsService } from './strings.service';

describe('StringsService', () => {
    let service: StringsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [StringsService],
        }).compile();

        service = module.get<StringsService>(StringsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should analyze and create a string successfully', () => {
            const result = service.create({ value: 'hello' });

            expect(result).toBeDefined();
            expect(result.value).toBe('hello');
            expect(result.properties.length).toBe(5);
            expect(result.properties.is_palindrome).toBe(false);
            expect(result.properties.word_count).toBe(1);
            expect(result.properties.unique_characters).toBe(4); // h, e, l, o
            expect(result.properties.sha256_hash).toBeDefined();
            expect(result.properties.character_frequency_map).toEqual({
                h: 1,
                e: 1,
                l: 2,
                o: 1,
            });
        });

        it('should detect palindromes correctly', () => {
            const result = service.create({ value: 'racecar' });

            expect(result.properties.is_palindrome).toBe(true);
        });

        it('should detect palindromes case-insensitively', () => {
            const result = service.create({ value: 'RaceCar' });

            expect(result.properties.is_palindrome).toBe(true);
        });

        it('should count words correctly', () => {
            const result = service.create({ value: 'hello world test' });

            expect(result.properties.word_count).toBe(3);
        });

        it('should throw ConflictException for duplicate strings', () => {
            service.create({ value: 'duplicate' });

            expect(() => {
                service.create({ value: 'duplicate' });
            }).toThrow(ConflictException);
        });
    });

    describe('findByValue', () => {
        it('should find a string by its value', () => {
            service.create({ value: 'test' });
            const result = service.findByValue('test');

            expect(result).toBeDefined();
            expect(result.value).toBe('test');
        });

        it('should throw NotFoundException for non-existent string', () => {
            expect(() => {
                service.findByValue('nonexistent');
            }).toThrow(NotFoundException);
        });
    });

    describe('findAll', () => {
        beforeEach(() => {
            service.create({ value: 'racecar' }); // palindrome, 1 word
            service.create({ value: 'hello world' }); // not palindrome, 2 words
            service.create({ value: 'madam' }); // palindrome, 1 word
        });

        it('should return all strings without filters', () => {
            const result = service.findAll({});

            expect(result.count).toBe(3);
            expect(result.data).toHaveLength(3);
        });

        it('should filter by palindrome status', () => {
            const result = service.findAll({ is_palindrome: true });

            expect(result.count).toBe(2);
            expect(result.data.every(item => item.properties.is_palindrome)).toBe(true);
        });

        it('should filter by word count', () => {
            const result = service.findAll({ word_count: 1 });

            expect(result.count).toBe(2);
            expect(result.data.every(item => item.properties.word_count === 1)).toBe(true);
        });

        it('should filter by min length', () => {
            const result = service.findAll({ min_length: 10 });

            expect(result.count).toBe(1);
            expect(result.data[0].value).toBe('hello world');
        });

        it('should filter by max length', () => {
            const result = service.findAll({ max_length: 7 });

            expect(result.count).toBe(2);
        });

        it('should filter by character containment', () => {
            const result = service.findAll({ contains_character: 'w' });

            expect(result.count).toBe(1);
            expect(result.data[0].value).toBe('hello world');
        });

        it('should apply multiple filters', () => {
            const result = service.findAll({
                is_palindrome: true,
                word_count: 1,
            });

            expect(result.count).toBe(2);
        });
    });

    describe('filterByNaturalLanguage', () => {
        beforeEach(() => {
            service.create({ value: 'racecar' });
            service.create({ value: 'hello world' });
            service.create({ value: 'level' });
        });

        it('should parse "single word palindromic strings"', () => {
            const result = service.filterByNaturalLanguage('all single word palindromic strings');

            expect(result.count).toBe(2);
            expect(result.interpreted_query.parsed_filters).toEqual({
                is_palindrome: true,
                word_count: 1,
            });
        });

        it('should parse "strings longer than X"', () => {
            const result = service.filterByNaturalLanguage('strings longer than 10 characters');

            expect(result.interpreted_query.parsed_filters.min_length).toBe(11);
        });

        it('should parse "containing letter X"', () => {
            const result = service.filterByNaturalLanguage('strings containing the letter w');

            expect(result.interpreted_query.parsed_filters.contains_character).toBe('w');
            expect(result.count).toBe(1);
        });

        it('should throw BadRequestException for unparseable query', () => {
            expect(() => {
                service.filterByNaturalLanguage('gibberish nonsense');
            }).toThrow(BadRequestException);
        });
    });

    describe('remove', () => {
        it('should delete a string successfully', () => {
            service.create({ value: 'to-delete' });

            expect(() => {
                service.remove('to-delete');
            }).not.toThrow();

            expect(() => {
                service.findByValue('to-delete');
            }).toThrow(NotFoundException);
        });

        it('should throw NotFoundException when deleting non-existent string', () => {
            expect(() => {
                service.remove('nonexistent');
            }).toThrow(NotFoundException);
        });
    });
});
