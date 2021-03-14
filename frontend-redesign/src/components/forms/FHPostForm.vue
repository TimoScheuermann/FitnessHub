<template>
  <div class="fh-post-form" max-width>
    <FHErrorList :id="errorList" />
    <FHFeedCard :feed="{ ...dto, timestamp: new Date().getTime() }" />

    <br />
    <h3>Informationen</h3>

    <tl-grid gap="0 10">
      <tc-input
        :dark="$store.getters.darkmode"
        title="Titel"
        v-model="dto.title"
      />
      <tc-input
        :dark="$store.getters.darkmode"
        title="Thumbnail"
        v-model="dto.thumbnail"
      />
    </tl-grid>

    <tc-textarea
      :dark="$store.getters.darkmode"
      title="Text*"
      v-model="dto.text"
    />

    <tl-grid gap="0 10">
      <tc-input
        :dark="$store.getters.darkmode"
        title="Exercise ID"
        v-model="dto.exerciseId"
      />
      <tc-input
        :dark="$store.getters.darkmode"
        title="Recipe ID"
        v-model="dto.recipeId"
      />
    </tl-grid>

    <br />
    <tl-flow>
      <tc-button
        v-if="!item"
        :disabled="submitting"
        icon="cloud-upload"
        name="Post erstellen"
        tfbackground="success"
        variant="filled"
        @click="create"
      />
      <template v-else>
        <tc-button
          :disabled="submitting"
          icon="trashcan-alt"
          name="Post löschen"
          tfbackground="error"
          variant="filled"
          @click="deletePost"
        />
        <tc-button
          :disabled="submitting"
          icon="swap"
          name="Post updaten"
          tfbackground="alarm"
          variant="filled"
          @click="update"
        />
      </template>
    </tl-flow>
  </div>
</template>

<script lang="ts">
import backend from '@/utils/backend';
import { CreatePostDto } from '@/utils/dtos';
import { FeedManagement } from '@/utils/FeedManagement';
import { FHEventBus } from '@/utils/FHEventbus';
import { IFeed } from '@/utils/interfaces';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import FHFeedCard from '../feed/FHFeedCard.vue';
import FHErrorList from '../FHErrorList.vue';

@Component({
  components: {
    FHFeedCard,
    FHErrorList
  }
})
export default class FHPostForm extends Vue {
  @Prop() item!: IFeed;

  public dto: CreatePostDto = { text: '' };
  public submitting = false;
  public errorList = 'post-form';

  mounted() {
    this.upateDto();
  }

  @Watch('item', { deep: true, immediate: true })
  upateDto(): void {
    if (this.item) {
      this.dto.title = this.item.title;
      this.dto.thumbnail = this.item.thumbnail;
      this.dto.text = this.item.text;
      this.dto.recipeId = this.item.recipeId;
      this.dto.exerciseId = this.item.exerciseId;
    }
  }

  public create() {
    if (this.submitting) return;
    this.submitting = true;

    backend
      .post('feed', this.dto)
      .then(this.handleResponse)
      .catch(this.handleCatch);
  }

  public update() {
    if (!this.item || this.submitting) return;
    this.submitting = true;

    backend
      .patch('feed/' + this.item._id, this.dto)
      .then(this.handleResponse)
      .catch(this.handleCatch);
  }

  public deletePost() {
    if (!this.item || this.submitting) return;
    this.submitting = true;
    backend.delete('feed/' + this.item._id);
    FeedManagement.removePost(this.item._id);

    this.$router.push({ name: 'community' });
  }

  private handleResponse(): void {
    this.$router.push({ name: 'community' });
    this.submitting = false;
  }

  private handleCatch(err: { statusCode: number; message: string }): void {
    const { statusCode, message } = err;
    if (statusCode && statusCode === 422 && message) {
      FHEventBus.$emit('fh-error-list-' + this.errorList, message);
    }
    this.submitting = false;
  }
}
</script>

<style lang="scss" scoped>
.fh-feed-card {
  margin-bottom: 0;
}
</style>
