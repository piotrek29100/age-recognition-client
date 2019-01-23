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