import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("rss")
export class RSSEntities {
  @PrimaryGeneratedColumn("uuid")
  id?: string | undefined;

  // 订阅源Id
  @Column({ type: "text", default: "" })
  feedId?: string;

  // 当前文章自己在订阅源中的ID
  @Column({ type: "text", default: "" })
  rssId?: string;

  // 网页地址
  @Column({ type: "text", default: "" })
  rssLink?: string;

  // 标题
  @Column({ type: "text", default: "" })
  title?: string;

  // 正文
  @Column({ type: "text", default: "" })
  content?: string;

  // 内容简介
  @Column({ type: "text", default: "" })
  contentSnippet?: string;

  // 订阅摘要
  @Column({ type: "text", default: "" })
  summary?: string;

  // 所有图片
  @Column({ type: "text", default: "[]" })
  images?: string;

  // 资源文件
  @Column({ type: "text", default: "[]" })
  mediaContent?: string;

  // 作者
  @Column({ type: "text", default: "" })
  author?: string;

  // 推送日期
  @Column({ type: "text", nullable: true })
  pubDate?: string;

  @Column({ type: "text", nullable: true })
  isoDate?: string;

  // 创建日期
  @CreateDateColumn()
  createDate?: Date;
}
