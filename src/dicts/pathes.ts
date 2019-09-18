import {config} from '../configs';

// const base = (rest: string) => `${config.remoteApi}/${rest}`;
const base = (rest: string) => `https://jsonplaceholder.typicode.com/${rest}`;

export default class Pathes {
  static Posts = class {
    static posts = base(`posts`);
    static post = (id: string) => base(`posts/${id}`);
  }
}
