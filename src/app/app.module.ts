import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FaceDetectionComponent } from './face-detection/face-detection.component';

import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { NgOpenCVModule, OpenCVOptions } from "ng-open-cv";
import { HelloComponent } from './hello/hello.component';
import { VideoFaceDetectionComponent } from './video-face-detection/video-face-detection.component';

const openCVConfig: OpenCVOptions = {
  scriptUrl: `assets/opencv/opencv.js`,
  wasmBinaryFile: 'wasm/opencv_js.wasm',
  usingWasm: true
};

@NgModule({
  declarations: [
    AppComponent,
    FaceDetectionComponent,
    HelloComponent,
    VideoFaceDetectionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgOpenCVModule.forRoot(openCVConfig),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
