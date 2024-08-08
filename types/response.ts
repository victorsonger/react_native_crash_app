export interface IUser {
  username: string;
  avatar: string;
}

export interface IVideoItem {
  $id: string;
  title: string;
  thumbnail: string;
  video: string;
  users: IUser;
}
