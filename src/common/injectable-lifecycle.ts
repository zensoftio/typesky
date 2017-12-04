export default interface InjectableLifecycle {
  postConstructor(): Promise<any>
  
  onReady(): Promise<any>
}