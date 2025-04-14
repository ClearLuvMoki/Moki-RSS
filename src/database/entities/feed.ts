import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "feed" })
export class FeedListEntities {
  @PrimaryGeneratedColumn("uuid")
  id?: string | undefined;

  // 分组ID
  @Column({ type: "text", default: "" })
  groupId?: string | undefined = "";

  // 订阅源标题
  @Column({ type: "text", default: "" })
  title?: string;

  // 订阅源的头像
  @Column({ type: "text", default: "" })
  avatar?: string;

  // 订阅源的头像 --- base64
  @Column({ type: "text", default: "" })
  avatarBase64?: string;

  // 网页地址
  @Column({ type: "text", default: "" })
  link?: string;

  // 订阅源地址
  @Column({ type: "text", default: "" })
  feedUrl?: string;

  // 修改日期
  @UpdateDateColumn()
  udpateDate?: Date;

  // 创建日期;
  @CreateDateColumn()
  createDate?: Date;
}
