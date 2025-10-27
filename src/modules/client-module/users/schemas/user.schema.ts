import { Document, Schema, Types } from "mongoose";
import { SystemUsers } from "src/shared/enum/users.enum";


export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  role: SystemUsers;
  address?: string;
  avatarUrl?: string;
  gender?: string;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  bankAccount?: string;
  bankName?: string;
  active: boolean;
  fullName?: string;
}

export interface User extends IUser,  Document{
_id: Types.ObjectId;

}

export const UserSchema = new Schema<User>({
firstName:{type: String, required: true },
lastName: {type: String, required: true},
email: {type: String, required: true, unique: true}, 
password: {type: String, required: true},
phone: {type: String},
role:{type: String, enum:Object.values(SystemUsers), default: SystemUsers.Tenant, required: true},
address: {type: String},
avatarUrl: {type: String},
gender: {type:String},
isEmailVerified: {type: Boolean},
isPhoneVerified: {type: Boolean},
bankAccount: {type: String},
bankName: {type:String},
active: {type: Boolean, required: true, default: true, }

},
 {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
); 

  UserSchema.virtual('fullName').get(function(){
    return `${this.firstName} ${this.lastName}`
  });

  UserSchema.index({email: 1});
  UserSchema.index({phone: 1});
 
  export const UserModelName= 'User'