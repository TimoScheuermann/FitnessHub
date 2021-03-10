import store from '@/store';
import backend from './backend';
import { IFeed } from './interfaces';

export class FeedManagement {
  private static loading = false;

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
      const { data } = await backend.get('feed');
      this.commit(data);
    } else if (append) {
      const posts = this.getPosts();
      if (posts) {
        const oldest = posts.map(x => x.timestamp).sort((a, b) => a - b)[0];
        const { data } = await backend.get('feed?oldest=' + oldest);

        posts.push(...data);
        this.commit(posts);

        if (data.length < 5) {
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
        return post;
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
}
