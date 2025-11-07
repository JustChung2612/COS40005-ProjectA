import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Name is required!"],
        },
        email: {
            type: String,
            required: [true, "Email is required!"],
            unique: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        role: { 
            type: String,
            enum: ["user" , "admin"],
            default: "user",
        },
        department: {
            type: String,
            required: [true, "Department is required"],
        },
        lop: { 
            type: String, 
            default: ""
        },
        maSinhVien: { 
            type: String,  
            required: [true, "maSinhVien is required"], 
        },

    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User" , userSchema);
export default User;