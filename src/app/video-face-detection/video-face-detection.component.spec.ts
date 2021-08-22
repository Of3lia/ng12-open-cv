import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoFaceDetectionComponent } from './video-face-detection.component';

describe('VideoFaceDetectionComponent', () => {
  let component: VideoFaceDetectionComponent;
  let fixture: ComponentFixture<VideoFaceDetectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoFaceDetectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoFaceDetectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
