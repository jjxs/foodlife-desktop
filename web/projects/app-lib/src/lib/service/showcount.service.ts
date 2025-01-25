import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShowcountService {

  constructor() { }

  // �֘A���|�[�g�^�O�p
  RelationCount = new Subject<string>();
  RelationCount$ = this.RelationCount.asObservable();
  public relationCount(count: string) {
    if (count != '0') {
      this.RelationCount.next(`�i${count}�j`);
    }
  }

  // �Y�t�t�@�C���{�^���p
  AttachmentFile = new Subject<string>();
  AttachmentFile$ = this.AttachmentFile.asObservable();
  public attachmentFile(count: string) {
    if (count != '0') {
      this.AttachmentFile.next(`�i${count}�j`);
    }
  }

  // �N�[�ς݃��|�[�g�^�O�p
  ApplyCount = new Subject<string>();
  ApplyCount$ = this.ApplyCount.asObservable();
  public draftCount(count: string) {
    if (count != '0') {
      this.ApplyCount.next(`�i${count}�j`);
    }
  }
}