import { Expose } from "class-transformer";
import {Entity as TOEntity, Column, Index, BeforeInsert, ManyToMany, ManyToOne, JoinColumn, OneToMany} from "typeorm";
import { makeid, sulgify } from "../utils/helpers";
import Entity from "./Entity";
import Post from "./Post";
import Sub from "./Sub";
import User from "./User";
import Vote from "./Vote";

@TOEntity("comments")
export default class Comment extends Entity {

    constructor(comment: Partial<Comment>){
        super();
        Object.assign(this, comment)
    }

    @Index()
    @Column()
    identifier: string;

    @Column({ nullable: true, type:'text' })
    body: string;

    @Column()
    username: string;

    @ManyToOne(()=> User )
    @JoinColumn({ name: 'username', referencedColumnName:'username'})
    user: User

    @ManyToOne(()=> Post, (post) => post.comments, { nullable: false} )
    post: Post

    @OneToMany(()=>Vote, vote => vote.comment)
    votes: Vote[]

    @Expose() get voteScore() : number {
        return this.votes?.reduce((prev, curr)=> (prev +curr.value || 0),0)
    }

    protected userVote : number
    setUserVote(user: User){
        const index = this.votes?.findIndex((v)=> v.username === user.username)
        this.userVote = index > -1 ? this.votes[index].value : 0
    }

    @BeforeInsert()
    makeIdAndSlug(){
        this.identifier = makeid(7)
    }
}

