import {Entity, Column, PrimaryColumn} from "typeorm";

@Entity("config")
export class ConfigEntities {
    @PrimaryColumn({default: '1'})
    id: string = "";

    // 选择的语言
    @Column({type: "text", default: ""})
    locale?: string | undefined = "";

    // 主题
    @Column({type: "text", default: "light"})
    theme?: string | undefined = "";

    // 列表展示模式
    @Column({type: "text", default: "magazine"})
    listMode?: string | undefined = "";
}

