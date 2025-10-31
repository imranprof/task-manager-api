
export class CreateTaskDto {
  title:        string;
  description?: string;
  status?:      'todo' | 'in-progress' | 'done';
}