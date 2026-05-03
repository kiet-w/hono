import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private todosRepository: Repository<Todo>,
  ) {}

  findAll(): Promise<Todo[]> {
    return this.todosRepository.find();
  }

  async findOne(id: string): Promise<Todo> {
    const todo = await this.todosRepository.findOneBy({ id });
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    return todo;
  }

  create(createTodoDto: CreateTodoDto): Promise<Todo> {
    const newTodo = this.todosRepository.create({
      ...createTodoDto,
      userId: 'default-user', // Hardcoded for now until auth is added
    });
    return this.todosRepository.save(newTodo);
  }

  async update(id: string, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    const todo = await this.findOne(id);
    this.todosRepository.merge(todo, updateTodoDto);
    return this.todosRepository.save(todo);
  }

  async remove(id: string): Promise<void> {
    const result = await this.todosRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
  }
}
