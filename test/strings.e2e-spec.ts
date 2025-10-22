import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('StringsController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();

        // Apply the same configuration as in main.ts
        app.enableCors();
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
                transform: true,
                transformOptions: {
                    enableImplicitConversion: true,
                },
            }),
        );

        await app.init();
    });

    afterEach(async () => {
        await app.close();
    });

    describe('POST /strings', () => {
        it('should create and analyze a string', () => {
            return request(app.getHttpServer())
                .post('/strings')
                .send({ value: 'hello world' })
                .expect(201)
                .expect((res) => {
                    expect(res.body).toHaveProperty('id');
                    expect(res.body).toHaveProperty('value', 'hello world');
                    expect(res.body).toHaveProperty('properties');
                    expect(res.body).toHaveProperty('created_at');
                    expect(res.body.properties).toHaveProperty('length', 11);
                    expect(res.body.properties).toHaveProperty('is_palindrome', false);
                    expect(res.body.properties).toHaveProperty('word_count', 2);
                    expect(res.body.properties).toHaveProperty('unique_characters', 8);
                    expect(res.body.properties).toHaveProperty('sha256_hash');
                    expect(res.body.properties).toHaveProperty('character_frequency_map');
                });
        });

        it('should detect palindromes', () => {
            return request(app.getHttpServer())
                .post('/strings')
                .send({ value: 'racecar' })
                .expect(201)
                .expect((res) => {
                    expect(res.body.properties.is_palindrome).toBe(true);
                });
        });

        it('should return 409 for duplicate strings', async () => {
            await request(app.getHttpServer())
                .post('/strings')
                .send({ value: 'duplicate' })
                .expect(201);

            return request(app.getHttpServer())
                .post('/strings')
                .send({ value: 'duplicate' })
                .expect(409)
                .expect((res) => {
                    expect(res.body.message).toContain('already exists');
                });
        });

        it('should return 400 for missing value field', () => {
            return request(app.getHttpServer())
                .post('/strings')
                .send({})
                .expect(400);
        });
    });

    describe('GET /strings/:stringValue', () => {
        it('should retrieve a specific string', async () => {
            const createRes = await request(app.getHttpServer())
                .post('/strings')
                .send({ value: 'test string' })
                .expect(201);

            return request(app.getHttpServer())
                .get('/strings/test%20string')
                .expect(200)
                .expect((res) => {
                    expect(res.body.value).toBe('test string');
                    expect(res.body.id).toBe(createRes.body.id);
                });
        });

        it('should return 404 for non-existent string', () => {
            return request(app.getHttpServer())
                .get('/strings/nonexistent')
                .expect(404)
                .expect((res) => {
                    expect(res.body.message).toContain('does not exist');
                });
        });
    });

    describe('GET /strings', () => {
        beforeEach(async () => {
            await request(app.getHttpServer())
                .post('/strings')
                .send({ value: 'racecar' });

            await request(app.getHttpServer())
                .post('/strings')
                .send({ value: 'hello world' });

            await request(app.getHttpServer())
                .post('/strings')
                .send({ value: 'madam' });
        });

        it('should return all strings without filters', () => {
            return request(app.getHttpServer())
                .get('/strings')
                .expect(200)
                .expect((res) => {
                    expect(res.body).toHaveProperty('data');
                    expect(res.body).toHaveProperty('count');
                    expect(res.body).toHaveProperty('filters_applied');
                    expect(res.body.count).toBeGreaterThanOrEqual(3);
                });
        });

        it('should filter by palindrome status', () => {
            return request(app.getHttpServer())
                .get('/strings?is_palindrome=true')
                .expect(200)
                .expect((res) => {
                    expect(res.body.count).toBeGreaterThanOrEqual(2);
                    expect(res.body.filters_applied.is_palindrome).toBe(true);
                    res.body.data.forEach(item => {
                        expect(item.properties.is_palindrome).toBe(true);
                    });
                });
        });

        it('should filter by word count', () => {
            return request(app.getHttpServer())
                .get('/strings?word_count=1')
                .expect(200)
                .expect((res) => {
                    res.body.data.forEach(item => {
                        expect(item.properties.word_count).toBe(1);
                    });
                });
        });

        it('should filter by min and max length', () => {
            return request(app.getHttpServer())
                .get('/strings?min_length=5&max_length=7')
                .expect(200);
        });

        it('should filter by character containment', () => {
            return request(app.getHttpServer())
                .get('/strings?contains_character=w')
                .expect(200)
                .expect((res) => {
                    res.body.data.forEach(item => {
                        expect(item.value).toContain('w');
                    });
                });
        });
    });

    describe('GET /strings/filter-by-natural-language', () => {
        beforeEach(async () => {
            await request(app.getHttpServer())
                .post('/strings')
                .send({ value: 'level' });
        });

        it('should parse and filter by natural language query', () => {
            return request(app.getHttpServer())
                .get('/strings/filter-by-natural-language?query=all%20single%20word%20palindromic%20strings')
                .expect(200)
                .expect((res) => {
                    expect(res.body).toHaveProperty('data');
                    expect(res.body).toHaveProperty('count');
                    expect(res.body).toHaveProperty('interpreted_query');
                    expect(res.body.interpreted_query.parsed_filters).toEqual({
                        is_palindrome: true,
                        word_count: 1,
                    });
                });
        });

        it('should return 400 for missing query parameter', () => {
            return request(app.getHttpServer())
                .get('/strings/filter-by-natural-language')
                .expect(400);
        });

        it('should return 400 for unparseable query', () => {
            return request(app.getHttpServer())
                .get('/strings/filter-by-natural-language?query=gibberish')
                .expect(400);
        });
    });

    describe('DELETE /strings/:stringValue', () => {
        it('should delete a string successfully', async () => {
            await request(app.getHttpServer())
                .post('/strings')
                .send({ value: 'to-delete' });

            await request(app.getHttpServer())
                .delete('/strings/to-delete')
                .expect(204);

            return request(app.getHttpServer())
                .get('/strings/to-delete')
                .expect(404);
        });

        it('should return 404 when deleting non-existent string', () => {
            return request(app.getHttpServer())
                .delete('/strings/nonexistent')
                .expect(404);
        });
    });
});
