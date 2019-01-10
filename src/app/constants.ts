export class Constants {
    public static API_ENDPOINT = `/api/uploadFile`;                                           
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