<template>
  <div class="friends" content>
    <tl-grid gap="0px 20">
      <div>
        <h1>Anfragen</h1>
        <p v-if="invites && invites.length === 0">
          Du hast keine offenen Freundschaftsanfragen
        </p>

        <fh-user-list>
          <fh-user-list-item
            v-for="i in invites"
            :key="i._id"
            :user="getInvitedUser(i)"
          >
            {{ getInvitedUser(i).username }}
            <template
              v-if="i.invitee._id === $store.getters.user._id"
              slot="action"
            >
              <tl-flow>
                <div class="pending">pending</div>
                <tc-link tfcolor="error" @click="removeFriend(i.target._id)">
                  <i class="ti-cross" />
                </tc-link>
              </tl-flow>
            </template>
            <template v-else slot="action">
              <tl-flow>
                <tc-link tfcolor="success" @click="acceptInvite(i._id)">
                  <i class="ti-checkmark" />
                </tc-link>
                <tc-link tfcolor="error" @click="denyInvite(i._id)">
                  <i class="ti-cross" />
                </tc-link>
              </tl-flow>
            </template>
          </fh-user-list-item>
        </fh-user-list>
      </div>
      <div>
        <tl-flow horizontal="space-between">
          <h1>Freunde</h1>
          <tc-link @click="openUserSearch" tfcolor="success">
            <i class="ti-plus-inverted" /> Freund hinzufügen
          </tc-link>
        </tl-flow>

        <p v-if="friends.length === 0">
          Füge Freunde hinzu, um Neuigkeiten über ihre sportlichen Erfolge zu
          erhalten
        </p>

        <fh-user-list>
          <fh-user-list-item
            v-for="f in friends"
            :key="f._id"
            :user="f"
            :to="{ name: 'friend', params: { id: f._id } }"
          >
            {{ f.username }}

            <tc-select
              slot="action"
              :onlyIcon="true"
              icon="dots"
              variant="filled"
              :dark="$store.getters.darkmode"
              :tfbackground="
                $store.getters.darkmode ? 'backgroundDark' : 'container'
              "
            >
              <tc-select-item
                tfcolor="error"
                title="Freund entfernen"
                icon="trashcan-alt"
              />
              <tc-select-item title="Herausfordern" icon="trophy" />
              <tc-select-item title="Training planen" icon="calendar-alt" />
            </tc-select>
            <!-- <tc-link slot="action" tfcolor="error" @click="removeFriend(f._id)">
              <i class="ti-trashcan-alt" />
            </tc-link> -->
          </fh-user-list-item>
        </fh-user-list>
      </div>
    </tl-grid>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { IUserInfo, IPendingFriendship } from '@/utils/interfaces';
import axios from '@/utils/axios';
import { sendNotification } from '@/utils/functions';
import { EventBus } from '@/utils/eventbus';

@Component
export default class Friends extends Vue {
  mounted() {
    EventBus.$on('friends-us', (user: IUserInfo) => {
      this.invite(user);
    });
  }

  public openUserSearch(): void {
    EventBus.$emit('modal-user-search', 'friends-us');
  }

  get friends(): IUserInfo[] {
    return this.$store.getters.friends;
  }

  get invites(): IPendingFriendship[] {
    return this.$store.getters.friendRequests;
  }

  getInvitedUser(pf: IPendingFriendship): IUserInfo {
    return pf.invitee._id === this.$store.getters.user._id
      ? pf.target
      : pf.invitee;
  }

  public async invite(user: IUserInfo): Promise<void> {
    if (this.friends.filter(x => x._id === user._id).length > 0) {
      sendNotification({
        title: '',
        text: 'Du bist bereits mit ' + user.username + ' befreundet'
      });
      return;
    }
    if (this.invites.filter(x => x.target._id === user._id).length > 0) {
      sendNotification({
        title: '',
        text: 'Du hast ' + user.username + ' bereits eingeladen'
      });
      return;
    }
    if (this.invites.filter(x => x.invitee._id === user._id).length > 0) {
      this.acceptInvite(
        this.invites.filter(x => x.invitee._id === user._id)[0]._id
      );
      return;
    }
    await axios.post('friends/invite/' + user._id);
  }

  public async acceptInvite(friendshipId: string): Promise<void> {
    await axios.put('friends/accept/' + friendshipId);
  }

  public async denyInvite(friendshipId: string): Promise<void> {
    await axios.delete('friends/deny/' + friendshipId);
  }

  public async removeFriend(friendId: string): Promise<void> {
    await axios.delete('friends/remove/' + friendId);
  }
}
</script>

<style lang="scss" scoped>
.friends {
  .pending {
    opacity: 0.6;
    font-style: italic;
    margin-right: 10px;
  }
}
</style>
