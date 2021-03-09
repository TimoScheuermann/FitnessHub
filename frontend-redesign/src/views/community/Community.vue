<template>
  <div class="view-community" content>
    <div max-width>
      <FHFeedCard v-for="i in items" :key="i._id" :feed="i" />
    </div>
  </div>
</template>

<script lang="ts">
import FHFeedCard from '@/components/feed/FHFeedCard.vue';
import { IFeed, IUserInfo } from '@/utils/interfaces';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    FHFeedCard
  }
})
export default class Community extends Vue {
  public timo: IUserInfo = {
    _id: '',
    username: 'Timo Scheuermann',
    avatar:
      'https://avatars.githubusercontent.com/u/48986503?s=460&u=6db24ca31da385ddaff2ad13a0fde725676dfb60&v=4'
  };

  public items: IFeed[] = [
    {
      _id: '1',
      timestamp: new Date().getTime(),
      thumbnail:
        'https://images.unsplash.com/photo-1565593427994-7d6d81690905?q=5&w=1080',
      title: 'Thunfisch-Quiche',
      text: 'Ich habe ein neues Rezept veröffentlicht!',
      user: this.timo,
      recipeId: '5f68c5158201fcd7f914e4b7'
    },
    {
      _id: '2',
      timestamp: new Date().getTime(),
      thumbnail:
        'https://images.unsplash.com/flagged/photo-1566064336477-864e4f308992?q=5&w=1080',
      title: 'Squats',
      text: 'Ich habe eine neue Übung veröffentlicht!',
      user: this.timo,
      exerciseId: '5f6880348201fcd7f914e49f'
    },
    {
      _id: '3',
      timestamp: new Date().getTime(),
      text: 'Only text'
    },
    {
      _id: '4',
      timestamp: new Date().getTime(),
      title: 'Neuer Post der FH',
      text: 'Only text'
    },
    {
      _id: '5',
      timestamp: new Date().getTime(),
      title: 'Was geht',
      thumbnail:
        'https://timos.s3.eu-central-1.amazonaws.com/drive/fitnesshub/6a465442-ed75-419f-9651-f7c6cfc17dd0.webp',
      text: 'Text and Title'
    }
  ];
}
</script>

<style lang="scss" scoped>
.view-community {
  //
}
</style>
