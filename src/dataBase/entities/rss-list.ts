import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn} from "typeorm";

@Entity("rss-list")
export class RSSListEntities {
    @PrimaryGeneratedColumn("uuid")
    id?: string | undefined;

    // 订阅源Id
    @Column({type: "text", default: ""})
    feedId: string = "";

    // 当前文章自己在订阅源中的ID
    @Column({type: "text", default: ""})
    rssId: string = "";

    // 网页地址
    @Column({type: "text", default: ""})
    rssLink: string = "";

    // 标题
    @Column({type: "text", default: ""})
    title: string = "";

    // 正文
    @Column({type: "text", default: ""})
    content: string = "";

    // 内容简介
    @Column({type: "text", default: ""})
    contentSnippet: string = "";

    // 订阅摘要
    @Column({type: "text", default: ""})
    summary: string = "";

    // 作者
    @Column({type: "text", default: ""})
    author: string = "";

    // 推送日期
    @Column({type: "text", nullable: true})
    pubDate: string | undefined;

    @Column({type: "text", nullable: true})
    isoDate: string | undefined;

    // 创建日期
    @CreateDateColumn()
    createDate?: Date | undefined;
}

