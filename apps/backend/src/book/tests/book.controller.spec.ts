import { Test, TestingModule } from "@nestjs/testing";
import {
  BadRequestException,
  INestApplication,
  NotFoundException,
  ValidationPipe,
} from "@nestjs/common";
import { BookController } from "../book.controller";
import { BookService } from "../book.service";
import {
  BookDto,
  CreateBookDto,
  UpdateBookDto,
  BookCategory,
} from "../book.dto";

describe("BookController", () => {
  let controller: BookController;
  let bookService: jest.Mocked<BookService>;
  let app: INestApplication;

  const mockBookDto: BookDto = {
    id: "ea594796-c4f8-4841-8769-02579ff644d5",
    title: "Test Book",
    author: "Test Author",
    summary: "Test Summary",
    stock: 5,
    updatedAt: new Date(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookController],
      providers: [
        {
          provide: BookService,
          useValue: {
            create: jest.fn(),
            getAllFiltered: jest.fn(),
            get: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    controller = module.get<BookController>(BookController);
    bookService = module.get(BookService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create a book", async () => {
      const createBookDto: CreateBookDto = { ...mockBookDto };

      bookService.create.mockResolvedValue(mockBookDto);

      const result = await controller.create(createBookDto);

      expect(bookService.create).toHaveBeenCalledWith(createBookDto);
      expect(result).toEqual(mockBookDto);
    });
  });

  describe("getAllFiltered", () => {
    it("should return an array of books", async () => {
      bookService.getAllFiltered.mockResolvedValue([mockBookDto]);

      const result = await controller.getAllFiltered();

      expect(bookService.getAllFiltered).toHaveBeenCalledWith(undefined);
      expect(result).toEqual([mockBookDto]);
    });

    it("should filter by categories when provided", async () => {
      const categories: BookCategory[] = [
        BookCategory.FICTION,
        BookCategory.SCIENCE_FICTION,
      ];
      bookService.getAllFiltered.mockResolvedValue([mockBookDto]);

      const result = await controller.getAllFiltered(categories);

      expect(bookService.getAllFiltered).toHaveBeenCalledWith(categories);
      expect(result).toEqual([mockBookDto]);
    });

    it("should handle single category", async () => {
      const category = BookCategory.FICTION;
      bookService.getAllFiltered.mockResolvedValue([mockBookDto]);

      const result = await controller.getAllFiltered(category);

      expect(bookService.getAllFiltered).toHaveBeenCalledWith(category);
      expect(result).toEqual([mockBookDto]);
    });
  });

  describe("get", () => {
    it("should return a book by id", async () => {
      bookService.get.mockResolvedValue(mockBookDto);

      const result = await controller.get(mockBookDto.id);

      expect(bookService.get).toHaveBeenCalledWith(mockBookDto.id);
      expect(result).toEqual(mockBookDto);
    });

    it("should return 404 error if book not found", async () => {
      const errorMessage = `Book with ID ${mockBookDto.id} not found`;
      bookService.get.mockRejectedValue(new NotFoundException(errorMessage));

      await expect(controller.get(mockBookDto.id)).rejects.toThrow(
        new NotFoundException(errorMessage)
      );

      expect(bookService.get).toHaveBeenCalledWith(mockBookDto.id);
    });
  });

  describe("update", () => {
    it("should update a book", async () => {
      const updateBookDto: UpdateBookDto = { title: "Updated Title" };
      const updatedBook = { ...mockBookDto, ...updateBookDto };

      bookService.update.mockResolvedValue(updatedBook);

      const result = await controller.update(mockBookDto.id, updateBookDto);

      expect(bookService.update).toHaveBeenCalledWith(
        mockBookDto.id,
        updateBookDto
      );
      expect(result).toEqual(updatedBook);
    });
  });

  describe("delete", () => {
    it("should delete a book", async () => {
      bookService.delete.mockResolvedValue(undefined);

      await controller.delete(mockBookDto.id);

      expect(bookService.delete).toHaveBeenCalledWith(mockBookDto.id);
    });
  });
});
