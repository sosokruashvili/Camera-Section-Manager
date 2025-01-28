import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SectionService } from '../services/section.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SectionDetailsComponent } from '../section-details/section-details.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-sections',
  templateUrl: './sections.component.html',
  styleUrl: './sections.component.css',
  standalone: true,
  imports: [CommonModule, RouterModule, MatDialogModule] 
})
export class SectionsComponent implements OnInit {
  sections: any[] = [];
  constructor(private http: HttpClient, private sectionService: SectionService, private dialog: MatDialog) {} 


  ngOnInit() {
    this.loadSections();
  }

  loadSections() {
    this.sectionService.getSections().subscribe((sections) => {
      this.sections = sections;
      console.log(this.sections);
    });
  }

  openSectionDetails(id?: string): void {
    const dialogRef = this.dialog.open(SectionDetailsComponent, { 
      width: '800px',
      data: { id: id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) {
        this.loadSections();
      }
    });
  }

  deleteSection(sectionId: string) {

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { message: 'Are you sure you want to delete this section?' }
    });
  
    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.sectionService.deleteSection(sectionId).subscribe(() => {
          this.sections = this.sections.filter(s => s.id !== sectionId); // Remove from list
          console.log('Section deleted');
        });
      }
    });
  }

}
