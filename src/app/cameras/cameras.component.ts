import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CameraService, Camera } from '../services/camera.service';

@Component({
  selector: 'app-camera-list',
  templateUrl: './cameras.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class CamerasComponent implements OnInit {
  cameras: Camera[] = [];

  constructor(private cameraService: CameraService) {}

  ngOnInit() {
    this.loadCameras();
  }

  loadCameras() {
    this.cameraService.getCameras().subscribe((cameras) => {
      this.cameras = cameras;
    });
  }
}
