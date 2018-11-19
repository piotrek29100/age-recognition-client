export class Constants {
    public static API_ENDPOINT = `http://localhost:5000/uploadFile`;                                           
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