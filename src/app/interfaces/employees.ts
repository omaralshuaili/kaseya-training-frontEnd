import { Skills } from "./skills";

export interface Employees {
    _id:string,
    show: boolean;
    firstName : String,
    lastName : String,
    DOB: Date,
    email:String,
    skillLevel : Skills
    active:Boolean,
    age:number
}

