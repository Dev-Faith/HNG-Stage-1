import { IsString, IsNotEmpty } from 'class-validator';

export class NaturalLanguageFilterDto {
    @IsString()
    @IsNotEmpty()
    query: string;
}
