import {Entity, Column, PrimaryColumn} from "typeorm";

@Entity("config")
export class ConfigEntities {
    @PrimaryColumn({default: '1'})
    id: string = "";
    // 选择的语言
    @Column({type: "text", default: ""})
    locale?: string | undefined = "";
}

