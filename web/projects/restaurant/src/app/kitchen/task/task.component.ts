import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TaskData } from '../kitchen.interface';
import { TaskDetailComponent } from '../task-detail/task-detail.component';
import { MatDialog } from '@angular/material';
import { Util, JsonResult } from 'ami';

@Component({
  selector: 'restaurant-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

  @Input() taskData: TaskData;

  @Output() next = new EventEmitter<TaskData>();
  @Output() back = new EventEmitter<TaskData>();
  @Output() cancel = new EventEmitter<TaskData>();
  @Output() delete = new EventEmitter<TaskData>();
  @Output() subDel = new EventEmitter<TaskData>();
  @Output() subNext = new EventEmitter<TaskData>();
  @Output() subCancel = new EventEmitter<TaskData>();
  @Output() removeTask = new EventEmitter();

  @Input() buttonColor = 'accent';
  @Input() nextName = '次へ';
  @Input() backName = '戻';
  @Input() cancelName = '取消';
  @Input() deleteModel = false;
  @Input() canBack = true;
  @Input() canNext = true;
  @Input() canDelete = false;

  @Input() multiTask: boolean = false;

  constructor(
    private dialog: MatDialog
    ) { }

  ngOnInit() {
  }

  onNext() {
    this.next.emit(this.taskData);
  }

  onBack() {
    this.back.emit(this.taskData);
  }

  onCancel() {
    this.cancel.emit(this.taskData);
  }

  onDelete() {
    this.delete.emit(this.taskData);
  }

  onSubDel(sub: TaskData, index: number) {

    // this.removeSub(index);
    this.subDel.emit(sub);
  }

  onSubNext(sub: TaskData, index: number) {
    // this.removeSub(index);
    this.subNext.emit(sub);
  }

  onSubCancel(sub: TaskData, index: number) {
    // this.removeSub(index);
    this.subCancel.emit(sub);
  }

  // removeSub(index: number) {
  //   //　subtask　因为先隐藏数据再更新数据库，当数据库更是中错误发生时，可以考虑刷新全部数据
  //   this.taskData.sub_data.splice(index, 1);
  //   if (this.taskData.sub_data.length === 0) {
  //     this.removeTask.emit();
  //   }
  // }

  showDetail(task: TaskData) {
    if ( task.status_code != 100 && task.status_code != 300 ) {
      return ;
    }
    if ( Util.isEmpty(task.option) || Object.keys(task.option).length==0 ) {
      return;
    }
    // tslint:disable-next-line: no-console
    const dialog = this.dialog.open(TaskDetailComponent, {
      width: '600px',
      data: {
        task: task
      }
    });
  }
}
