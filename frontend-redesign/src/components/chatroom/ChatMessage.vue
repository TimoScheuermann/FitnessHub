<template>
  <div class="fh-chat-message" v-if="message">
    <div v-if="showDate" center class="date">{{ date }}</div>
    <div
      v-if="message.type === 'message'"
      class="message-wrapper"
      :isSender="isSender"
    >
      <div line-break class="message-container">{{ message.content }}</div>
    </div>

    <div v-else-if="exercise" class="message-exercise-publish">
      <tc-avatar size="tiny" :src="exercise.thumbnail" />
      <div class="content">
        Deine Übung {{ exercise.title }} wurde veröffentlicht!
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { months } from '@/utils/constants';
import { ExerciseManagement } from '@/utils/ExerciseManagement';
import { IExercise, IMessage } from '@/utils/interfaces';
import { UserManagement } from '@/utils/UserManagement';
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class FHChatMessage extends Vue {
  @Prop() message!: IMessage;
  @Prop() prev!: IMessage;

  get showDate(): boolean {
    if (!this.prev) return true;
    if (!this.message) return false;
    return (
      new Date(this.prev.date).getDate() !==
      new Date(this.message.date).getDate()
    );
  }

  get date(): string {
    if (!this.message) return '';
    const date = new Date(this.message.date);
    const day = date.getDate();
    const month = months[date.getMonth()].substring(0, 3);
    const year = date.getFullYear();
    const hour = ('00' + date.getHours()).slice(-2);
    const mins = ('00' + date.getMinutes()).slice(-2);

    return `${day}. ${month} ${year} ${hour}:${mins}`;
  }

  get isSender(): boolean {
    if (!this.message) return true;
    return this.message.from === UserManagement.getUserID();
  }

  get exercise(): IExercise | null {
    if (!this.message) return null;
    if (this.message.type !== 'exercisePublish') return null;
    let created:
      | IExercise[]
      | IExercise
      | null = ExerciseManagement.getCreated();
    if (!created) return null;
    created = created.filter(
      x => x._id === JSON.parse(this.message.content).id
    )[0];
    if (!created) return null;
    return {
      ...created,
      title: JSON.parse(this.message.content).title
    };
  }
}
</script>

<style lang="scss" scoped>
.fh-chat-message {
  margin-bottom: 20px;
  .date {
    font-weight: 500;
    text-transform: uppercase;
    opacity: 0.25;
    font-size: 14px;
    margin-bottom: 10px;
  }

  .message-wrapper {
    display: flex;

    &[issender] {
      justify-content: flex-end;
      .message-container {
        background: $success;
        color: #fff;
        border-top-right-radius: 5px;
      }
    }
    &:not([issender]) .message-container {
      background: $paragraph;
      @media #{$isDark} {
        background: $paragraph_dark;
      }
      border-top-left-radius: 5px;
    }
    .message-container {
      max-width: calc(100% - 50px);
      min-width: 50px;
      padding: 10px;
      border-radius: 20px;
    }
  }

  .message-exercise-publish {
    .tc-avatar {
      margin: 0 auto 10px;
    }

    .content {
      margin: 0 auto 20px;
      background: $paragraph;
      @media #{$isDark} {
        background: $paragraph_dark;
      }
      max-width: calc(100% - 50px);
      min-width: 50px;
      padding: 10px;
      border-radius: 20px;
      text-align: center;
    }
  }
}
</style>
