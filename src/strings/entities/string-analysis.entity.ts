export interface StringProperties {
    length: number;
    is_palindrome: boolean;
    unique_characters: number;
    word_count: number;
    sha256_hash: string;
    character_frequency_map: Record<string, number>;
}

export class StringAnalysisEntity {
    id: string;
    value: string;
    properties: StringProperties;
    created_at: string;

    constructor(value: string, properties: StringProperties) {
        this.id = properties.sha256_hash;
        this.value = value;
        this.properties = properties;
        this.created_at = new Date().toISOString();
    }
}
