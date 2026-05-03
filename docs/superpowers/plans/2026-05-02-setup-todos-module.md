# NestJS Todos Module Setup Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Thiết lập cấu trúc thư mục và file chuẩn cho module 'todos' trong NestJS theo đúng yêu cầu của người dùng.

**Architecture:** Sử dụng cấu trúc Module-Controller-Service-Entity-DTO chuẩn của NestJS. Di chuyển `app.module.ts` ra ngoài thư mục `src/` để đồng bộ với cấu trúc đơn giản.

**Tech Stack:** NestJS, TypeScript.

---

### Task 1: Setup DTOs cho Todos

**Files:**
- Create: `src/todos/dto/create-todo.dto.ts`
- Create: `src/todos/dto/update-todo.dto.ts`

- [ ] **Step 1: Tạo CreateTodoDto**

```typescript
export class CreateTodoDto {
  title: string;
  description?: string;
}
```

- [ ] **Step 2: Tạo UpdateTodoDto**

```typescript
import { PartialType } from '@nestjs/mapped-types';
import { CreateTodoDto } from './create-todo.dto';

export class UpdateTodoDto extends PartialType(CreateTodoDto) {
  completed?: boolean;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/todos/dto/*.ts
git commit -m "feat: add todo dtos"
```

---

### Task 2: Setup Todo Entity

**Files:**
- Modify: `src/todos/todo.entity.ts`

- [ ] **Step 1: Định nghĩa Todo Entity đơn giản**

```typescript
export class Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/todos/todo.entity.ts
git commit -m "feat: define todo entity"
```

---

### Task 3: Setup Todos Service

**Files:**
- Create: `src/todos/todos.service.ts`
- Delete: `src/todos/todos.controller.service.ts` (nếu có)

- [ ] **Step 1: Tạo TodosService với logic CRUD giả lập**

```typescript
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
```

- [ ] **Step 2: Xóa file rác**

Run: `rm src/todos/todos.controller.service.ts` (nếu tồn tại)

- [ ] **Step 3: Commit**

```bash
git add src/todos/todos.service.ts
git rm src/todos/todos.controller.service.ts
git commit -m "feat: implement todos service"
```

---

### Task 4: Setup Todos Controller

**Files:**
- Modify: `src/todos/todos.controller.ts`

- [ ] **Step 1: Implement TodosController**

```typescript
import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  create(@Body() createTodoDto: CreateTodoDto) {
    return this.todosService.create(createTodoDto);
  }

  @Get()
  findAll() {
    return this.todosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.todosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todosService.update(id, updateTodoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.todosService.remove(id);
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/todos/todos.controller.ts
git commit -m "feat: implement todos controller"
```

---

### Task 5: Setup Todos Module

**Files:**
- Modify: `src/todos/todos.module.ts`

- [ ] **Step 1: Đăng ký Service và Controller vào Module**

```typescript
import { Module } from '@nestjs/common';
import { TodosService } from './todos.service';
import { TodosController } from './todos.controller';

@Module({
  controllers: [TodosController],
  providers: [TodosService],
})
export class TodosModule {}
```

- [ ] **Step 2: Commit**

```bash
git add src/todos/todos.module.ts
git commit -m "feat: finalize todos module"
```

---

### Task 6: Refactor App Module & Main Entry

**Files:**
- Create: `src/app.module.ts`
- Modify: `src/main.ts`
- Delete: `src/app/` (sau khi chuyển logic)

- [ ] **Step 1: Tạo src/app.module.ts mới**

```typescript
import { Module } from '@nestjs/common';
import { TodosModule } from './todos/todos.module';

@Module({
  imports: [TodosModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

- [ ] **Step 2: Cập nhật src/main.ts để import đúng AppModule**

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  console.log(`Application is running on: http://localhost:3000`);
}
bootstrap();
```

- [ ] **Step 3: Dọn dẹp thư mục src/app**

Run: `rm -rf src/app`

- [ ] **Step 4: Commit**

```bash
git add src/app.module.ts src/main.ts
git rm -r src/app
git commit -m "refactor: simplify app module structure"
```
