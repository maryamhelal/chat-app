import mongoose, { Schema, Document, Model } from 'mongoose';

interface IMessage extends Document {
  sender: string;
  receiver: string;
  time: Date;
  message: string;
}

const messageSchema: Schema<IMessage> = new Schema({
  sender: { type: String, required: true },
  receiver: { type: String, required: true },
  time: { type: Date, required: true, default: Date.now },
  message: { type: String, required: true },
});

const Message: Model<IMessage> = mongoose.model<IMessage>('Message', messageSchema);

export default Message;