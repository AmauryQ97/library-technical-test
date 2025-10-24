import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  Query,
} from "@nestjs/common";
import { BookService } from "./book.service";
import {
  BookDto,
  CreateBookDto,
  UpdateBookDto,
  BookCategory,
} from "./book.dto";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";

@ApiTags("books")
@Controller("books")
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create a new book" })
  @ApiResponse({
    status: 201,
    description: "The book has been successfully created.",
  })
  @ApiResponse({ status: 400, description: "Invalid input." })
  async create(@Body() createBookDto: CreateBookDto): Promise<BookDto> {
    return this.bookService.create(createBookDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all books, can be filtered by categories" })
  @ApiQuery({
    name: "categories",
    required: false,
    type: [String],
    enum: Object.values(BookCategory),
    isArray: true,
    description: "List of categories to filter by",
    example: [BookCategory.FICTION, BookCategory.SCIENCE_FICTION],
  })
  @ApiResponse({ status: 200, description: "Return all books." })
  async getAllFiltered(
    @Query("categories") categories?: BookCategory | BookCategory[]
  ): Promise<BookDto[]> {
    const arrayCategories = categories
      ? Array.isArray(categories)
        ? categories
        : [categories]
      : undefined;
    return this.bookService.getAllFiltered(arrayCategories);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a book by ID" })
  @ApiParam({ name: "id", description: "Book ID", type: String })
  @ApiResponse({
    status: 200,
    description: "Return the book with the specified ID.",
  })
  @ApiResponse({ status: 404, description: "Book not found." })
  async get(@Param("id", ParseUUIDPipe) id: string): Promise<BookDto> {
    return this.bookService.get(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a book" })
  @ApiParam({ name: "id", description: "Book ID", type: String })
  @ApiResponse({
    status: 200,
    description: "The book has been successfully updated.",
  })
  @ApiResponse({ status: 404, description: "Book not found." })
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateBookDto: UpdateBookDto
  ): Promise<BookDto> {
    return this.bookService.update(id, updateBookDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete a book" })
  @ApiParam({ name: "id", description: "Book ID", type: String })
  @ApiResponse({
    status: 204,
    description: "The book has been successfully deleted.",
  })
  @ApiResponse({ status: 404, description: "Book not found." })
  async delete(@Param("id", ParseUUIDPipe) id: string): Promise<void> {
    return this.bookService.delete(id);
  }
}
