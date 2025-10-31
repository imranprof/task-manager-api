import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaClient } from '../generated/client';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

const prisma = new PrismaClient();

@Injectable()
export class TasksService {
  //get all task 
  async findAllByUser(userId: number) {
    return prisma.task.findMany({
      where: {userId},
      orderBy: {createdAt: 'desc'}
    })
  }

  async create(userId: number, dto: CreateTaskDto) {
    const data = {
      title: dto.title,
      description: dto.description ?? '',
      status: dto.status ?? 'todo',
      user: {connect: {id: userId} },
    };

    const task = await prisma.task.create({ data });
    return task;
  }

  async update(userId: number, id: number, dto: UpdateTaskDto) {
    const existing = await prisma.task.findUnique({ where: {id}});

    if (!existing) throw new NotFoundException('Task not found');
    if (existing.userId !== userId) throw new ForbiddenException('Not allowed');

    const updated = await prisma.task.update({
      where: { id },
      data: {
        title: dto.title ?? existing.title,
        description: dto.description ?? existing.description,
        status: dto.status ?? existing.status,
      }
    });

    return updated;
  }

  async remove(userId: number, id: number) {
    const existing = await prisma.task.findUnique({ where: {id}});
    if (!existing) throw new NotFoundException('Task not Found');
    if (existing.userId !== userId) throw new ForbiddenException('Not Allowed');

    await prisma.task.delete({where: { id }});
    return {sucess: true};
  }

  async findOneByIdForUser(userId: number, id: number) {
    const task = await prisma.task.findFirst({where: {id, userId}});

    if(!task) throw new NotFoundException('Task not found');
    return task;
  }

}
