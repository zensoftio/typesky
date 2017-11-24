import 'mocha'
import DefaultPostService from '../../services/impl/post'
import {DefaultPostStore} from '../../stores/impl/post'
import DefaultFetcher from '../../fetchers/impl/fetch'
import {instance, mock, verify, when} from 'ts-mockito'
import Pathes from '../../dicts/pathes'

const genResponse = (value: any) => Promise.resolve({json: () => Promise.resolve(value)}) as any

describe('PostStore', () => {
  
  it('::loadPost', async () => {
    
    const MockedPostStore = mock(DefaultPostStore)
    const MockedFetcher = mock(DefaultFetcher)
    const postStore = instance(MockedPostStore)
    const fetcher = instance(MockedFetcher)
    
    when(MockedFetcher.get(Pathes.Post.byId(1)))
      .thenReturn(genResponse('check'))
    
    when(MockedPostStore.prepare('postById'))
    
    const postService = new DefaultPostService(postStore)
    postService.setFetcher(fetcher)
    
    await postService.loadPost(1)
    
    // check if loadings was setted
    verify(MockedPostStore.prepare('postById'))
      .once()
    
    // check if we fetch data from server
    verify(MockedFetcher.get(Pathes.Post.byId(1)))
      .once()
    
    // check if we load data into store
    verify(MockedPostStore.load('postById', 'check'))
      .once()
    
    // check if loadings was setted before load
    verify(MockedPostStore.prepare('postById'))
      .calledBefore(MockedPostStore.load('postById', 'check'))
  })
  
})