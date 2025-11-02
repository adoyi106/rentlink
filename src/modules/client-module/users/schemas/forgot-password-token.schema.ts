import { Document, Schema } from "mongoose";


export const PasswordResetTokenModel = 'PasswordResetToken';

export interface IPasswordResetToken extends Document{
    token: string;
}

export const PasswordResetTokenSchema: Schema<IPasswordResetToken> = new Schema({
    token: {type: String, required: true}
})
