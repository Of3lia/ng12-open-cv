import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { NgOpenCVService, OpenCVLoadResult } from 'ng-open-cv';
import { tap, switchMap, filter } from 'rxjs/operators';
import { forkJoin, Observable, empty, fromEvent, BehaviorSubject } from 'rxjs';
declare var cv: any;

@Component({
  selector: 'app-video-face-detection',
  templateUrl: './video-face-detection.component.html',
  styleUrls: ['./video-face-detection.component.css']
})
export class VideoFaceDetectionComponent implements OnInit {
  imageUrl = 'assets/DaveChappelle.jpg';
  // Notifies of the ready state of the classifiers load operation
  private classifiersLoaded = new BehaviorSubject<boolean>(false);
  classifiersLoaded$ = this.classifiersLoaded.asObservable();

  // HTML Element references
  @ViewChild('cam_input')
  camInput: ElementRef | any;
  @ViewChild('canvas_output')
  canvasOutput: ElementRef | any;

  constructor(private ngOpenCVService: NgOpenCVService) { }

  ngOnInit(): void {
    // Always subscribe to the NgOpenCVService isReady$ observer before using a CV related function to ensure that the OpenCV has been
    // successfully loaded
    this.ngOpenCVService.isReady$
      .pipe(
        // The OpenCV library has been successfully loaded if result.ready === true
        filter((result: OpenCVLoadResult) => result.ready),
        switchMap(() => {
          let src = new cv.Mat(this.camInput.height, this.camInput.width, cv.CV_8UC4);
          let dst = new cv.Mat(this.camInput.height, this.camInput.width, cv.CV_8UC1);
          let gray = new cv.Mat();
          let cap = new cv.VideoCapture('cam_input');
          let faces = new cv.RectVector();
          let classifier = new cv.CascadeClassifier();
          // let utils = new Utils('errorMessage');
          // let faceCascadeFile = 'haarcascade_frontalface_default.xml'; // path to xml
          const FPS = 24;                     // frames per second (detection loop)
          var xf = this.camInput.height * 0.5;          // filtered detection x coord
          var yf = this.camInput.width * 0.5;           // filtered detection y coord
          const alpha = 0.5;                  // low-pass filter correction factor
          const coord_scale_factor = -0.005;  // scaling factor to provide valid coords to three.js
          // Load the face and eye classifiers files
          return this.loadClassifiers();
        })
      )
      .subscribe(() => {
        // The classifiers have been succesfully loaded
        this.classifiersLoaded.next(true);
      });


  }

  ngAfterViewInit(): void {
    // Here we just load our example image to the canvas
    this.ngOpenCVService.isReady$
      .pipe(
        filter((result: OpenCVLoadResult) => result.ready),
        tap((result: OpenCVLoadResult) => {
          navigator.mediaDevices.getUserMedia({ video: true, audio: false })
            .then((stream) => {
              this.camInput.nativeElement.srcObject = stream;
              this.camInput.nativeElement.play();
            })
            .catch(function (err) {
              console.log("An error occurred! " + err);
            });
        })
      )
      .subscribe(() => { });
  }

  // Before attempting face detection, we need to load the appropriate classifiers in memory first
  // by using the createFileFromUrl(path, url) function, which takes two parameters
  // @path: The path you will later use in the detectMultiScale function call
  // @url: The url where to retrieve the file from.
  loadClassifiers(): Observable<any> {
    return forkJoin(
      this.ngOpenCVService.createFileFromUrl(
        'haarcascade_frontalface_default.xml',
        `assets/opencv/data/haarcascades/haarcascade_frontalface_default.xml`
      ),
      this.ngOpenCVService.createFileFromUrl(
        'haarcascade_eye.xml',
        `assets/opencv/data/haarcascades/haarcascade_eye.xml`
      )
    );
  }

}
