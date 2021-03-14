import store from '@/store';
import backend from './backend';
import { IFeed } from './interfaces';

export class FeedManagement {
  private static limit = 33;

  private static get endpoint(): string {
    if (store.getters.valid) {
      return 'feed/personal';
    }
    return 'feed';
  }

  private static get loading(): boolean {
    return store.getters.feedLoading;
  }

  public static get posts(): IFeed[] | null {
    return store.getters.feed;
  }

  public static get canLoad(): boolean {
    return store.getters.canLoadPosts;
  }

  public static async loadPosts(): Promise<void> {
    if (this.loading || !this.canLoad) return;

    store.commit('feedLoading', true);

    let oldest = new Date().getTime();
    const posts = this.posts;
    if (posts) {
      oldest = posts.map(x => x.timestamp).sort((a, b) => a - b)[0];
    }

    const { data } = await backend.get(
      this.endpoint + '?oldest=' + oldest + '&limit=' + this.limit
    );

    this.addPosts(data);

    if (data && data.length === 0) {
      store.commit('canLoadPosts', false);
    }

    store.commit('feedLoading', false);
  }

  public static addPosts(newPosts: IFeed[]) {
    if (newPosts && newPosts.length > 0) {
      const posts = this.posts || [];

      newPosts.forEach(x => {
        let exsits = false;
        posts.forEach(p => {
          if (p._id === x._id) {
            exsits = true;
            return { ...x, reactions: p.reactions };
          }
          return p;
        });
        if (!exsits) posts.push(x);
      });

      store.commit('feed', posts);
    }
  }

  public static removePost(id: string) {
    let posts = this.posts;
    if (!posts) return;
    posts = posts.filter(x => x._id !== id);
    store.commit('feed', posts);
  }

  public static getAmountOfUnread(): number {
    return store.getters.unreadPosts;
  }

  public static markAsRead(): void {
    store.commit('readPosts');
  }

  public static addReaction(id: string, reaction: string): void {
    backend.put('feed/' + id + '/reaction/' + reaction);

    const posts = this.posts;
    if (!posts) return;

    const post = posts.filter(x => x._id === id)[0];
    if (!post) return;

    post.reactions.push(reaction);
    // eslint-disable-next-line
    (post as any)[reaction]++;
    this.addPosts([post]);
  }

  public static removeReaction(id: string, reaction: string): void {
    backend.delete('feed/' + id + '/reaction/' + reaction);

    const posts = this.posts;
    if (!posts) return;

    const post = posts.filter(x => x._id === id)[0];
    if (!post) return;

    post.reactions = post.reactions.filter(x => x !== reaction);
    // eslint-disable-next-line
    (post as any)[reaction]--;
    this.addPosts([post]);
  }
}
