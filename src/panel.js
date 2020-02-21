import Vue from 'vue';
import Panel from './components/Panel.vue';

import './panel.scss';

new Vue({
    el: '#panel',
    render(h) {
        return h(Panel);
    },
});
