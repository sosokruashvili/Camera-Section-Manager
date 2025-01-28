import { Component } from '@angular/core';
import { RouterModule, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  standalone: true,
  imports: [RouterModule, RouterLink, RouterLinkActive]
})
export class AdminLayoutComponent {
  title = 'Admin Layout';
}
