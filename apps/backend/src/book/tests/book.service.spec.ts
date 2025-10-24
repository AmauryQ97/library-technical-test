import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BookService } from "../book.service";
import { Book } from "../book.entity";
import { CreateBookDto, UpdateBookDto, BookDto } from "../book.dto";

describe("BookService", () => {
  let service: BookService;
  let bookRepository: jest.Mocked<Repository<Book>>;

  const mockBook: Book = {
    id: "id-1",
    title: "Test Book",
    author: "Test Author",
    summary: "Test Summary",
    pageNumber: 200,
    stock: 5,
    updatedAt: new Date(),
  };

  const mockBookDto: BookDto = { ...mockBook };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: getRepositoryToken(Book),
          useValue: {
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            preload: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BookService>(BookService);
    bookRepository = module.get(getRepositoryToken(Book));
  });

  afterEach(async () => {
    bookRepository.save.mockClear();
  });

  describe("create", () => {
    it("should create a book", async () => {
      const createBookDto: CreateBookDto = { ...mockBookDto };

      bookRepository.save.mockResolvedValue(mockBook);

      const result = await service.create(createBookDto);

      expect(bookRepository.save).toHaveBeenCalledWith(
        createBookDto
        // expect.objectContaining(createBookDto)
      );
      expect(result).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          ...createBookDto,
        })
      );
    });
  });

  describe("getAll", () => {
    it("should return an array of books", async () => {
      bookRepository.find.mockResolvedValue([mockBook]);

      const result = await service.getAllFiltered();

      expect(bookRepository.find).toHaveBeenCalled();
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            ...mockBook,
            id: expect.any(String),
          }),
        ])
      );
    });

    it("should return an empty array", async () => {
      bookRepository.find.mockResolvedValue([]);

      const result = await service.getAllFiltered();

      expect(bookRepository.find).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(0);
    });
  });

  describe("get", () => {
    it("should return a book by id", async () => {
      bookRepository.findOne.mockResolvedValueOnce(mockBook);

      const result = await service.get(mockBook.id);

      expect(bookRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockBook.id },
      });
      expect(result).toEqual(expect.objectContaining({ id: mockBook.id }));
    });

    it("should throw NotFoundException if book not found", async () => {
      bookRepository.findOne.mockResolvedValue(null);

      await expect(service.get("random-id")).rejects.toThrow(
        "Book with ID random-id not found"
      );
    });
  });

  describe("update", () => {
    it("should update a book", async () => {
      const updateBookDto: UpdateBookDto = {
        title: "Updated Title",
      };

      bookRepository.preload.mockResolvedValue({
        ...mockBook,
        ...updateBookDto,
      });
      bookRepository.save.mockResolvedValue({
        ...mockBook,
        ...updateBookDto,
      });

      const result = await service.update(mockBook.id, updateBookDto);

      expect(bookRepository.preload).toHaveBeenCalledWith({
        id: mockBook.id,
        ...updateBookDto,
      });
      expect(bookRepository.save).toHaveBeenCalled();
      expect(result.title).toBe(updateBookDto.title);
      expect(result.author).toBe(mockBook.author);
    });

    it("should throw NotFoundException and not update book", async () => {
      const updateBookDto: UpdateBookDto = {
        title: "Updated Title",
      };

      bookRepository.preload.mockResolvedValue(undefined);

      await expect(service.update("unkown-id", updateBookDto)).rejects.toThrow(
        "Book with ID unkown-id not found"
      );

      expect(bookRepository.preload).toHaveBeenCalledWith({
        id: "unkown-id",
        ...updateBookDto,
      });
      expect(bookRepository.save).not.toHaveBeenCalled();
    });
  });

  describe("delete", () => {
    it("should delete a book", async () => {
      bookRepository.delete.mockResolvedValue({ affected: 1 } as any);

      await service.delete("existing-id");

      expect(bookRepository.delete).toHaveBeenCalledWith("existing-id");
    });

    it("should throw NotFoundException if book to delete not found", async () => {
      bookRepository.delete.mockResolvedValue({ affected: 0 } as any);

      await expect(service.delete("unkown-id")).rejects.toThrow(
        "Book with ID unkown-id not found"
      );
    });
  });
});
