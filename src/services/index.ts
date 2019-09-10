import BaseService from '../common/services/base/base';
import {SceneEntry} from '../common/scenes/scenes';
import BaseScene from '../scenes/BaseScene';
import ProcessEnv = NodeJS.ProcessEnv;

export interface PostService extends BaseService {
  getPosts(): void;

  getPost(id: number): void;
}

export interface AuthService extends BaseService {
  login(username: string, password: string): void;

  checkToken(): Promise<void>;

  isLogged(): boolean;

  getAuthInfo(): any;
}

export interface SceneRegistryService extends BaseService {
  rootScenes(): SceneEntry[];

  childScenesFor(scene: BaseScene): SceneEntry[];
}

export interface ConfigService extends BaseService {
  processEnv: ProcessEnv;
}
