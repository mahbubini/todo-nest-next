import { Injectable } from '@nestjs/common';
import { PrismaClient, Todo } from '@prisma/client';

@Injectable()
export class TodoService {
    private prisma = new PrismaClient();

    async getTodos(): Promise<Todo[]> {
        return this.prisma.todo.findMany();
    }

    async createTodo(title: string): Promise<Todo> {
        return this.prisma.todo.create({
            data: { title },
        });
    }

    async updateTodo(id: number, completed: boolean): Promise<Todo> {
        return this.prisma.todo.update({
            where: { id },
            data: { completed },
        });
    }

    async deleteTodo(id: number): Promise<Todo> {
        return this.prisma.todo.delete({
            where: { id },
        });
    }
}
