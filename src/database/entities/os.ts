import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("os")
export class ConfigEntities {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  // 选择的语言
  @Column({ type: "text", default: "" })
  locale?: string;

  // 主题
  @Column({ type: "text", default: "" })
  theme?: string;

  // 列表展示模式
  @Column({ type: "text", default: "" })
  listMode?: string;
}
