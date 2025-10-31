import { 
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  ParseIntPipe,
 } from '@nestjs/common';
 import { TasksService } from './tasks.service';
 import { CreateTaskDto } from './dto/create-task.dto';
 import { UpdateTaskDto } from './dto/update-task.dto';
 import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  // GET /tasks
  @Get()
  async getTasks(@Req() req) {
    const userId = req.user.id;
    return this.taskService.findAllByUser(userId);
  }

  // POST /tasks
  @Post()
  async createTask(@Req() req, @Body() dto: CreateTaskDto) {
    const userId = req.user.id;
    return this.taskService.create(userId, dto);
  }

  //PUT /tasks/:id
  @Put(':id')
  async updateTask(@Req() req, @Param('id', 
    ParseIntPipe) id: number,
  @Body() dto: UpdateTaskDto) {
    const userId = req.user.id;
    return this.taskService.update(userId, id, dto);
  }

  //DELETE /tasks/:id
  @Delete(':id')
  async deleteTask(@Req() req, @Param('id', ParseIntPipe) id: number) {
    const userId = req.user.id;
    return this.taskService.remove(userId, id);
  }

}
