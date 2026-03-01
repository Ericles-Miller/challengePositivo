import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type ClientDocument = HydratedDocument<Client>;

@Schema()
export class Client {
  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'Client ID' })
  _id: string;

  @ApiProperty({ example: 'John Doe', description: 'Client name' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ example: 'john@example.com', description: 'Client email' })
  @Prop({ required: true, unique: true })
  email: string;

  @ApiProperty({ example: '12345678900', description: 'Client CPF' })
  @Prop({ required: true })
  document: string;

  @ApiProperty({ example: '2026-02-27T10:00:00.000Z', description: 'Creation date' })
  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @ApiProperty({ example: '2026-02-27T10:00:00.000Z', description: 'Last update date' })
  @Prop({ required: false, default: Date.now })
  updatedAt?: Date;
}

export const ClientSchema = SchemaFactory.createForClass(Client);
