import { Injectable } from '@nestjs/common';
import { MessagesRepository } from './messages.repository';

@Injectable()
export class MessagesService {
  constructor(public messagesRepo: MessagesRepository) {
    //don't do this in a real application, use dependency injection
  }
  findOne(id: string) {
    return this.messagesRepo.findOne(id);
  }
  findAll() {
    return this.messagesRepo.findAll();
  }
  create(message: string) {
    return this.messagesRepo.create(message);
  }
}
