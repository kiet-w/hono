import { Injectable, NotFoundException } from '@nestjs/common';
import { Todo } from './todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodosService {
  private todos: Todo[] = [];
  private idCounter = 1;

  findAll(): Todo[] {
    return this.todos;
  }

  findOne(id: number): Todo {
    const todo = this.todos.find(t => t.id === id);
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    return todo;
  }

  create(createTodoDto: CreateTodoDto): Todo {
    const newTodo: Todo = {
      id: this.idCounter++,
      title: createTodoDto.title,
      description: createTodoDto.description || '',
      completed: false,
    };
    this.todos.push(newTodo);
    return newTodo;
  }

  update(id: number, updateTodoDto: UpdateTodoDto): Todo {
    const todo = this.findOne(id);
    if (updateTodoDto.title) todo.title = updateTodoDto.title;
    if (updateTodoDto.description) todo.description = updateTodoDto.description;
    if (updateTodoDto.completed !== undefined) todo.completed = updateTodoDto.completed;
    return todo;
  }

  remove(id: number): void {
    const index = this.todos.findIndex(t => t.id === id);
    if (index === -1) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    this.todos.splice(index, 1);
  }
}
