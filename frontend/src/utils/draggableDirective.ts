import { Sortable } from '@shopify/draggable';
import { DirectiveOptions } from 'vue';
import { Vue } from 'vue-property-decorator';

const sortableDirective: DirectiveOptions = {
  inserted(el: HTMLElement, node) {
    new Sortable(el, node.value);
  }
};

Vue.directive('sortable', sortableDirective);

export default sortableDirective;
