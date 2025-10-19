import mongoose from 'mongoose';
const { Schema } = mongoose;

const examSchema = new Schema(
    {

    }
)

const Exam = mongoose.model( "Station", examSchema );

export default Exam ;