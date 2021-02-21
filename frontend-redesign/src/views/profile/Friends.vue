<template>
  <div class="view-friends" content>
    <div max-width>
      <h3>Anfragen</h3>
      <tc-spinner
        v-if="!friendRequests"
        :dark="$store.getters.darkmode"
        size="20"
        variant="dots-spin"
      />
      <p v-else-if="friendRequests.length > 0">{{ friendRequests }}</p>
      <p v-else>Du hast keine offenen Freundschaftsanfragen</p>

      <tl-flow horizontal="space-between">
        <h3>Freunde</h3>
        <tc-link @click="$oFS('add-friend')" tfcolor="success">
          Freund hinzufügen
        </tc-link>
      </tl-flow>
      <tc-spinner
        v-if="!friends"
        :dark="$store.getters.darkmode"
        size="20"
        variant="dots-spin"
      />
      <FHList v-else-if="friends.length > 0">
        <FHListItem
          v-for="f in friends"
          :key="f._id"
          :avatar="f.avatar"
          :title="f.username"
        >
          <tc-action :dark="$store.getters.darkmode">
            <tc-action-item
              icon="trophy"
              title="Herausfordern"
              @click="challengeFriend(f._id)"
            />
            <tc-action-item
              icon="calendar-alt"
              title="Training planen"
              @click="planTraining(f._id)"
            />
            <tc-action-item
              success
              icon="lens"
              title="Profil ansehen"
              @click="showProfile(f._id)"
            />
            <tc-action-item
              error
              icon="trashcan-alt"
              title="Freund enternen"
              @click="removeFriend(f._id)"
            />
          </tc-action>
        </FHListItem>
      </FHList>
      <p v-else>Füge Freunde hinzu TODO:</p>
    </div>
  </div>
</template>

<script lang="ts">
import FHList from '@/components/list/FHList.vue';
import FHListItem from '@/components/list/FHListItem.vue';
import { IPendingFriendship, IUserInfo } from '@/utils/interfaces';
import { UserManagement } from '@/utils/UserManagement';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    FHList,
    FHListItem
  }
})
export default class Friends extends Vue {
  get friends(): IUserInfo[] | null {
    return UserManagement.getFriends();
  }

  get friendRequests(): IPendingFriendship[] | null {
    return this.$store.getters.friendRequests;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public challengeFriend(friendId: string): void {
    // TODO:
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public planTraining(friendId: string): void {
    // TODO:
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public showProfile(friendId: string): void {
    // TODO:
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public removeFriend(friendId: string): void {
    UserManagement.removeFriend(friendId);
  }
}
</script>

<style lang="scss" scoped>
.view-friends {
  padding-top: 0;
}
</style>
