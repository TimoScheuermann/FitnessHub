<template>
  <div class="view-variables" content>
    <FHErrorList :id="errorList" />
    <div max-width>
      <h3>Variable hinzufügen</h3>
      <tl-grid minWidth="20" gap="10">
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
      <tc-divider :dark="$store.getters.darkmode" />
      <tl-grid minWidth="20" gap="10">
        <tc-button
          :disabled="isSubmitting"
          @click="addVariable('muscle')"
          name="Muskel"
          icon="plus"
          tfbackground="success"
        />
        <tc-button
          :disabled="isSubmitting"
          @click="addVariable('category')"
          name="Kategorie"
          icon="plus"
          tfbackground="success"
        />
      </tl-grid>
      <br />

      <h3>Muskeln</h3>
      <FHAppear>
        <tc-spinner v-if="!muscles" size="20" :dark="$store.getters.darkmode" />
        <p v-else-if="muscles.length === 0">Es gibt noch keine Muskeln</p>
        <FHVarList v-else>
          <FHVarListItem v-for="m in muscles" :key="m._id" :title="m.title">
            <div class="remove-var" @click="removeMuscle(m._id)">
              <i error class="ti-cross-circle-filled"></i>
            </div>
          </FHVarListItem>
        </FHVarList>
      </FHAppear>
      <br />

      <h3>Kategorien</h3>
      <FHAppear>
        <tc-spinner
          v-if="!categories"
          size="20"
          :dark="$store.getters.darkmode"
        />
        <p v-else-if="categories.length === 0">Es gibt noch keine Kategorien</p>
        <FHVarList v-else>
          <FHVarListItem v-for="c in categories" :key="c._id" :title="c.title">
            <div class="remove-var" @click="removeCategory(c._id)">
              <i error class="ti-cross-circle-filled"></i>
            </div>
          </FHVarListItem>
        </FHVarList>
      </FHAppear>
    </div>
  </div>
</template>

<script lang="ts">
import { IVariable } from '@/utils/interfaces';
import { Vue, Component } from 'vue-property-decorator';
import { VariableManagement } from '@/utils/VariableManagement';
import { FHEventBus } from '@/utils/FHEventbus';
import backend from '@/utils/backend';
import { CreateVariableDTO } from '@/utils/dtos';
import FHVarList from '@/components/variable-list/FHVarList.vue';
import FHVarListItem from '@/components/variable-list/FHVarListItem.vue';
import FHAppear from '@/components/FHAppear.vue';
import FHErrorList from '@/components/FHErrorList.vue';

@Component({
  components: {
    FHVarList,
    FHVarListItem,
    FHAppear,
    FHErrorList
  }
})
export default class Variables extends Vue {
  public errorList = 'variables';
  public isSubmitting = false;
  public dto: CreateVariableDTO = { title: '', thumbnail: '' };

  get vars(): IVariable[] | null {
    return VariableManagement.getVariables();
  }

  get muscles(): IVariable[] | null {
    const vars = this.vars;
    if (!vars) return null;
    return vars.filter(x => x.type === 'muscle');
  }

  get categories(): IVariable[] | null {
    const vars = this.vars;
    if (!vars) return null;
    return vars.filter(x => x.type === 'category');
  }

  public addVariable(type: 'category' | 'muscle'): void {
    if (this.isSubmitting) return;
    this.isSubmitting = true;
    backend
      .post('variables/' + type, this.dto)
      .then(this.handleResponse)
      .catch(this.handleCatch);
  }

  public removeMuscle(id: string): void {
    backend.delete('variables/muscle/' + id);
    VariableManagement.removeVariable(id);
  }

  public removeCategory(id: string): void {
    backend.delete('variables/category/' + id);
    VariableManagement.removeVariable(id);
  }

  private handleResponse(res: { data: IVariable }): void {
    VariableManagement.addVariable(res.data);
    this.dto = { title: '', thumbnail: '' };
    this.isSubmitting = false;
  }

  private handleCatch(err: { statusCode: number; message: string }): void {
    const { statusCode, message } = err;
    if (statusCode && statusCode === 422 && message) {
      FHEventBus.$emit('fh-error-list-' + this.errorList, message);
    }
    this.isSubmitting = false;
  }
}
</script>

<style lang="scss" scoped>
.view-variables {
  padding-top: 0;

  .fh-var-list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: transparent;
    border: 1px solid hsla(0, 0%, 7%, 0.1);
    @media #{$isDark} {
      border-color: hsla(0, 0%, 100%, 0.1);
    }
    padding: 7.5px 15px;
    margin: 0 5px 10px;
    cursor: default;

    &:hover,
    &:active {
      border-color: hsla(0, 0%, 7%, 0.4);
      @media #{$isDark} {
        border-color: hsla(0, 0%, 100%, 0.4);
      }
    }
  }

  .remove-var {
    display: grid;
    margin-left: 5px;
    cursor: pointer;
    opacity: 0.75;
    &:hover {
      opacity: 1;
    }
  }
}
</style>
