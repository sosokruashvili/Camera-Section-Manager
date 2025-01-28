import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SectionService } from '../services/section.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { CameraService } from '../services/camera.service';

@Component({
  selector: 'app-section-details',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule, 
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './section-details.component.html',
  styleUrl: './section-details.component.css'
})
export class SectionDetailsComponent implements OnInit {
  section?: any;  // Change type to any
  cameras?: any;
  mode: string = 'create';
  sectionForm!: FormGroup;

  
  constructor(private route: ActivatedRoute, 
    private sectionService: SectionService, 
    private cameraService: CameraService,
    public dialogRef: MatDialogRef<SectionDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder) {
      
    this.sectionForm = this.fb.group({
      id: [''],
      name: [''],
      description: [''],
      length: [''],
      speedLimit: [''],
      speedLimitActual: [''],
      startCamera: [''],
      endCamera: ['']
    });
  }
  
  close(): void {
    this.dialogRef.close(); 
  }

  ngOnInit() {
    if (this.data.id) {  // Add null check
      this.mode = 'edit';
      this.sectionService.getSectionById(this.data.id).subscribe((section) => {
        this.section = section;

        this.sectionForm = this.fb.group({
          id: [{ value: this.section.id || '', disabled: this.mode === 'create' }],
          name: [this.section.name || ''],
          description: [this.section.description || ''],
          length: [this.section.length || ''],
          speedLimit: [this.section.speedLimit || ''],
          speedLimitActual: [this.section.speedLimitActual || ''],
          startCamera: [this.section.startCamera?.id || ''],
          endCamera: [this.section.endCamera?.id || '']
        });
        
      });
    } else {
      this.mode = 'create';
      this.section = null;
    }

    this.cameraService.getCameras().subscribe((cameras) => {
      this.cameras = cameras;
    });
  }

  submit(): void {
    if(this.mode === 'create'){
      this.sectionService.createSection(this.sectionForm.value).subscribe((section) => {
        this.dialogRef.close({ success: true });  // Return success status
      });
    } else {
      this.sectionService.updateSection(this.sectionForm.value).subscribe((section) => {
        this.dialogRef.close({ success: true });  // Return success status
      });
    }
  }


}
