import { BookCategory } from "./book.dto";
import { Column, Entity, UpdateDateColumn } from "typeorm";

@Entity("book")
export class Book {
  @Column({
    type: "uuid",
    primary: true,
    default: () => "gen_random_uuid()",
  })
  id: string;

  @Column({ type: "varchar", length: 255 })
  title: string;

  // Could be update to a foreign id pointing on a specific author table
  @Column({ type: "varchar", length: 255 })
  author: string;

  @Column({
    type: "varchar",
    length: 50,
    nullable: true,
    enum: Object.values(BookCategory),
  })
  category?: BookCategory;

  @Column({ type: "integer", nullable: true })
  pageNumber?: number;

  @Column({ type: "text", default: "" })
  summary: string;

  @Column({ type: "timestamp", nullable: true })
  publicationDate?: Date;

  // Number of book owned (not available, need to check loan for that)
  @Column({ type: "integer" })
  stock: number;

  @UpdateDateColumn()
  updatedAt: Date;
}
