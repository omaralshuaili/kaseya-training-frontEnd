import { Skill } from "./skills";

export interface Employees {
    _id?:string,
    show?: boolean;
    firstName : String,
    lastName : String,
    DOB: string,
    email:String,
    skillLevel : String[]
    active:Boolean,
    age:number,
}

