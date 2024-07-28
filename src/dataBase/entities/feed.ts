import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn} from "typeorm";

@Entity("feed")
export class FeedListEntities {
    @PrimaryGeneratedColumn("uuid")
    id?: string | undefined;

    // 分组ID
    @Column({type: "text", default: ""})
    groupId?: string | undefined = "";

    // 订阅源标题
    @Column({type: "text", default: ""})
    title: string = "";

    // 订阅源的头像
    @Column({type: "text", default: ""})
    avatar?: string = "";

    // 订阅源的头像 --- base64
    @Column({type: "text", default: ""})
    avatarBase64?: string = "";

    // 网页地址
    @Column({type: "text", default: ""})
    link: string = "";

    // 订阅源地址
    @Column({type: "text", default: ""})
    feedUrl: string = "";

    // 上一次更新时间
    @Column({type: "text", default: ""})
    lastBuildDate: string = "";

    // 创建日期
    @CreateDateColumn()
    createDate?: Date | undefined;
}

