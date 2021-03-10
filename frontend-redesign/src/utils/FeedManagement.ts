import store from '@/store';
import backend from './backend';
import { IFeed } from './interfaces';

export class FeedManagement {
  private static loading = false;
  private static limit = 20;
  private static endpoint = (): string => {
    if (store.getters.valid) {
      return 'feed/personal';
    }
    return 'feed';
  };

  private static commit(items: IFeed[]): void {
    if (items) {
      store.commit(
        'feed',
        items.sort((a, b) => b.timestamp - a.timestamp)
      );
    }
  }

  public static getPosts(): IFeed[] | null {
    return store.getters.feed;
  }

  public static async loadPosts(append = false): Promise<void> {
    if (this.loading) return;

    this.loading = true;
    if (!this.getPosts()) {
      const { data } = await backend.get(
        this.endpoint() + '?limit=' + this.limit
      );
      this.commit(data);
    } else if (append) {
      const posts = this.getPosts();
      if (posts) {
        const oldest = posts.map(x => x.timestamp).sort((a, b) => a - b)[0];
        const { data } = await backend.get(
          this.endpoint() + '?oldest=' + oldest + '&limit=' + this.limit
        );

        posts.push(...data);
        this.commit(posts);

        if (data.length < this.limit) {
          store.commit('canLoadPosts', false);
        }
      }
    }
    this.loading = false;
  }

  public static updatePost(post: IFeed) {
    if (!post) return;
    let posts = this.getPosts();
    if (!posts) return;
    let exists = false;
    posts = posts.map(x => {
      if (x._id === post._id) {
        exists = true;
        return {
          ...post,
          reactions: x.reactions
        };
      }
      return x;
    });
    if (!exists) this.addPost(post);
  }

  public static addPost(post: IFeed) {
    if (!post) return;
    const posts = this.getPosts();
    if (posts) {
      posts.push(post);
      this.commit(posts);
      store.commit('unreadPosts');
    }
  }

  public static getAmountOfUnread(): number {
    return store.getters.unreadPosts;
  }

  public static markAsRead(): void {
    store.commit('readPosts');
  }

  public static addReaction(id: string, reaction: string): void {
    backend.put('feed/' + id + '/reaction/' + reaction);
    const posts = this.getPosts();
    if (!posts) return;
    const post = posts.filter(x => x._id === id)[0];
    if (!post) return;
    post.reactions.push(reaction);
    // eslint-disable-next-line
    (post as any)[reaction]++;
    this.updatePost(post);
  }

  public static removeReaction(id: string, reaction: string): void {
    backend.delete('feed/' + id + '/reaction/' + reaction);
    const posts = this.getPosts();
    if (!posts) return;
    const post = posts.filter(x => x._id === id)[0];
    if (!post) return;
    post.reactions = post.reactions.filter(x => x !== reaction);
    // eslint-disable-next-line
    (post as any)[reaction]--;
    this.updatePost(post);
  }
}
