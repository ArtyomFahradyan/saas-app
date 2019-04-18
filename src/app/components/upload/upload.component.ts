import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UploadService} from '../../services/upload.service';
import {Router} from '@angular/router';
import {AlertService} from '../../services/alert.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  uploadForm: FormGroup;
  selectedFile: File = null;
  loading = false;
  submitted = false;
  fileName = '';
  textForInput = `<span class="text-small">or <a href="">chose file</a> to upload</span>`;
  textForSelected = `<span class="text-small">Drag or <a href="">chose</a> another</span>`;

  dropzoneActive = false;
  @ViewChild('fileInput') fileInput: ElementRef;
  constructor(private uploadService: UploadService,
              private fb: FormBuilder,
              private router: Router,
              private alertService: AlertService) { }

  ngOnInit() {
    this.createForm();
  }
  onFileChange(event) {
    if (event.target.files.length > 0) {
      if (event.target.files[0].type !== 'application/pdf') {
        return this.alertService.error('File must be only of type .pdf', false);
      }
      this.fileName = event.target.files[0].name + '.pdf';
      this.selectedFile = <File>event.target.files[0];
    }
  }
  private prepareSave(): any {
    const formData = new FormData();
    formData.append('files', this.selectedFile, this.selectedFile.name);
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
    this.uploadService.upload(formModel)
      .subscribe(
        data => {
          this.loading = false;
          this.router.navigate(['/home']);
          this.alertService.success('The file was uploaded successfully.', false);
        },
        error => {
          this.alertService.error(error.error.message, false);
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
    this.fileName = '';
    this.f.file.setValue(null);
    this.uploadForm.reset();
    this.submitted = false;
  }
}
