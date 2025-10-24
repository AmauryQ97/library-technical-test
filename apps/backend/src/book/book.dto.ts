import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsUUID,
  IsDate,
} from "class-validator";
import { PartialType, OmitType } from "@nestjs/mapped-types";
import { Transform } from "class-transformer";

export enum BookCategory {
  FICTION = "FICTION",
  NON_FICTION = "NON_FICTION",
  SCIENCE_FICTION = "SCIENCE_FICTION",
  FANTASY = "FANTASY",
  BIOGRAPHY = "BIOGRAPHY",
  HISTORY = "HISTORY",
  SELF_HELP = "SELF_HELP",
  OTHER = "OTHER",
}

export class BookDto {
  @ApiProperty({
    description: "Unique identifier of the book",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: "Title of the book",
    example: "The Great Gatsby",
    required: true,
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: "Author of the book",
    example: "F. Scott Fitzgerald",
    required: true,
  })
  @IsString()
  author: string;

  @ApiPropertyOptional({
    description: "Category of the book",
    enum: BookCategory,
    example: BookCategory.FICTION,
  })
  @IsEnum(BookCategory)
  @IsOptional()
  category?: BookCategory;

  @ApiPropertyOptional({
    description: "Number of pages in the book",
    example: 218,
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  pageNumber?: number;

  @ApiProperty({
    description: "Summary of the book",
    example: "A story of decadence, excess, and the American Dream.",
    required: true,
  })
  @IsString()
  summary: string;

  @ApiPropertyOptional({
    description: "Publication date of the book",
    example: "1925-04-10",
    type: Date,
  })
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  publicationDate?: Date;

  @ApiProperty({
    description: "Number of copies in stock",
    example: 5,
    type: Number,
    required: true,
  })
  @IsNumber()
  stock: number;

  @ApiProperty({
    description: "Last update timestamp",
    example: "2023-01-01T12:00:00.000Z",
    readOnly: true,
  })
  @Transform(({ value }) => new Date(value))
  @IsDate()
  updatedAt: Date;
}

export class CreateBookDto extends OmitType(BookDto, [
  "id",
  "updatedAt",
] as const) {
  @ApiProperty({
    description: "Titre du livre",
    example: "Le Seigneur des Anneaux",
  })
  title: string;

  @ApiProperty({
    description: "Auteur du livre",
    example: "J.R.R. Tolkien",
  })
  author: string;

  @ApiPropertyOptional({
    description: "Catégorie du livre",
    enum: BookCategory,
    example: BookCategory.FANTASY,
  })
  category?: BookCategory;

  @ApiPropertyOptional({
    description: "Nombre de pages",
    type: Number,
    example: 423,
  })
  pageNumber?: number;

  @ApiProperty({
    description: "Résumé du livre",
    example: "Une épopée fantastique dans un monde imaginaire.",
  })
  summary: string;

  @ApiPropertyOptional({
    description: "Date de publication",
    type: String,
    format: "date",
    example: "1954-07-29",
  })
  @Transform(({ value }) => new Date(value))
  @IsDate()
  publicationDate?: Date;

  @ApiProperty({
    description: "Nombre d'exemplaires en stock",
    type: Number,
    example: 5,
  })
  stock: number;
}

export class UpdateBookDto extends PartialType(CreateBookDto) {
  @ApiProperty({
    description: "Titre du livre",
    example: "Le Seigneur des Anneaux",
  })
  title?: string;

  @ApiProperty({
    description: "Auteur du livre",
    example: "J.R.R. Tolkien",
  })
  author?: string;

  @ApiPropertyOptional({
    description: "Catégorie du livre",
    enum: BookCategory,
    example: BookCategory.FANTASY,
  })
  category?: BookCategory;

  @ApiPropertyOptional({
    description: "Nombre de pages",
    type: Number,
    example: 423,
  })
  pageNumber?: number;

  @ApiProperty({
    description: "Résumé du livre",
    example: "Une épopée fantastique dans un monde imaginaire.",
  })
  summary?: string;

  @ApiPropertyOptional({
    description: "Date de publication",
    type: String,
    format: "date",
    example: "1954-07-29",
  })
  @Transform(({ value }) => new Date(value))
  @IsDate()
  publicationDate?: Date;

  @ApiProperty({
    description: "Nombre d'exemplaires en stock",
    type: Number,
    example: 5,
  })
  stock?: number;
}
