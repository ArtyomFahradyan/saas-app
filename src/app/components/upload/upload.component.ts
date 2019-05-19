import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UploadService} from '../../services/upload.service';
import {MeGlobal} from '../me';
import {ErrorMessage} from '../../services/errorInterceptorMessage';
import {HelpersService} from '../../services/helpers.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  contract: string;
  uploadForm: FormGroup;
  selectedFile: File = null;
  loading = false;
  submitted = false;
  disabled = false;
  message = '';
  fileName = '';
  errType: 'success' | 'error' = 'success';
  showMessage = false;
  textForInput = `<span class="text-small">or <a href="">chose file</a> to upload</span>`;
  textForSelected = `<span class="text-small">Drag or <a href="">chose</a> another</span>`;
  dropzoneActive = false;
  @ViewChild('fileInput') fileInput: ElementRef;
  @Output() voted = new EventEmitter<boolean>();
  @Input('contractId') set contractId(id: string) {
    this.contract = id;
  }
  constructor(private uploadService: UploadService,
              private meGlobal: MeGlobal,
              public helper: HelpersService,
              private fb: FormBuilder,
              private errorMessage: ErrorMessage) { }

  ngOnInit() {
    this.createForm();
  }
  vote(agreed) {
    this.voted.emit(agreed);
  }
  onFileChange(event) {
    if (event.target.files.length > 0) {
      if (event.target.files[0].type !== 'application/pdf') {
        this.errorMessage.message = this.helper.i18nVal('fileMustBePdf');
        const div = document.getElementById('errorMessages');
        div.classList.add('bounceInDown');
        setTimeout(() => {
          div.classList.remove('bounceInDown');
        }, 3000);
        return 0;
      }
      this.fileName = event.target.files[0].name;
      this.selectedFile = <File>event.target.files[0];
    }
  }
  private prepareSave(): any {
    const formData = new FormData();
    formData.append('files', this.selectedFile, this.selectedFile.name);
    if (this.contract) {
      formData.append('contract', this.contract);
    }
    return formData;
  }
  get f() { return this.uploadForm.controls; }
  onSubmit() {
    this.submitted = true;
    if (this.uploadForm.invalid) {
      return;
    }
    this.prepareSave();
    const formModel = this.prepareSave();
    this.loading = true;
    this.disabled = true;
    this.uploadService.upload(formModel)
      .subscribe(data => {
          this.vote(data);
          this.meGlobal.me.account.attachments.push(data);
          this.loading = false;
          this.errType = 'success';
          this.message = this.helper.i18nVal('fileUpload');
          this.showMessage = true;
          this.clearFile();
          setTimeout(() => {
            this.showMessage = false;
            this.disabled = false;
            // this.router.navigate(['dashboard']);
          }, 1500);
        },
        error => {
          this.disabled = false;
          this.errType = 'error';
          this.showMessage = true;
          setTimeout(() => {
            this.showMessage = false;
          }, 2500);
          this.message = error.message;
          this.loading = false;
        }
      );
  }
  createForm() {
    this.uploadForm = this.fb.group({
      file: ['', Validators.required]
    });
  }
  clearFile() {
    this.selectedFile = null;
    this.fileName = '';
    this.f.file.setValue(null);
    this.uploadForm.reset();
    this.submitted = false;
  }
}
