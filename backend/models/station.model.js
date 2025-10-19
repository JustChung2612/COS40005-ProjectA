import mongoose from 'mongoose';
const { Schema } = mongoose;

const stationSchema = new Schema(
    {

    }
)

const Station = mongoose.model( "Station", stationSchema );

export default Station;