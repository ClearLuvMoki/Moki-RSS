import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("group")
export class GroupEntities {
  @PrimaryGeneratedColumn("uuid")
  id?: string | undefined;

  // 分组名称
  @Column({ type: "text", default: "" })
  name?: string;

  // 分组图片
  @Column({ type: "text", default: "" })
  avatar?: string;

  // 描述
  @Column({ type: "text", default: "" })
  description?: string;

  // 创建日期
  @CreateDateColumn()
  createDate?: Date;
}
