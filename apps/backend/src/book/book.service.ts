import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { Book } from "./book.entity";
import {
  BookDto,
  CreateBookDto,
  UpdateBookDto,
  BookCategory,
} from "./book.dto";
import { plainToInstance } from "class-transformer";

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>
  ) {}

  async create(createBookDto: CreateBookDto): Promise<BookDto> {
    const savedBook = await this.bookRepository.save({ ...createBookDto });
    return plainToInstance(BookDto, savedBook);
  }

  async get(id: string): Promise<BookDto> {
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return plainToInstance(BookDto, book);
  }

  async update(id: string, updateBookDto: UpdateBookDto): Promise<BookDto> {
    const book = await this.bookRepository.preload({
      id,
      ...updateBookDto,
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    const updatedBook = await this.bookRepository.save(book);
    return plainToInstance(BookDto, updatedBook);
  }

  async delete(id: string): Promise<void> {
    const result = await this.bookRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
  }

  async getAllFiltered(categories?: BookCategory[]): Promise<BookDto[]> {
    const books = await this.bookRepository.find({
      where: {
        category: In(
          categories ? [...categories] : Object.values(BookCategory)
        ),
      },
    });
    return plainToInstance(BookDto, books);
  }
}
