export class Resolution {
  width: number;
  height: number;
}

export class Constants {
    public static API_ENDPOINT = `/api/uploadFile`;                                           
    public static RESOLUTIONS = [
      {width: 1920, height: 1080},
      {width: 1280, height: 720},
      {width: 960, height: 540},
    ]   
    public static DESCRIPTION = "This application is able to recognize faces from video camera and predict age of each person. mage from camera is transferred to server. Using face_recognition library face locations are determined. Next, the cropped image of each face is constructed. Image is converted then as float array of shape (1, width, height, 3). ImageDataGenerator from Keras library is used to yield bathches of this input sample to pass it then to prediction function predict_generator. Finally, returned value is decoded by scaling to age range [10, 80]."                               
}

export interface FaceInfo {
    top: string;
    right: string;
    bottom: string;
    left: string;
    age: number;
  }

  export interface FaceInfoList {
    list: FaceInfo[]
  }