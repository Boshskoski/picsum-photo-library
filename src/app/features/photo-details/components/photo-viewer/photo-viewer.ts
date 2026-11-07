import { Component, input, linkedSignal } from '@angular/core';
import { PhotoUrlPipe } from '../../../../shared/pipes/photo-url-pipe';
import { Loader } from '../../../../shared/components/loader/loader';

@Component({
  imports: [PhotoUrlPipe, Loader],
  selector: 'app-photo-viewer',
  styleUrl: './photo-viewer.scss',
  templateUrl: './photo-viewer.html',
})
export class PhotoViewer {
  readonly photoId = input.required<string>();

  protected readonly imageReady = linkedSignal<string, boolean>({
    source: this.photoId,
    computation: () => false,
  });

  protected readonly imageFailed = linkedSignal<string, boolean>({
    source: this.photoId,
    computation: () => false,
  });
}
