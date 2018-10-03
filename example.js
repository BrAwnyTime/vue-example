'use strict';

Vue.component('child-row', {
  props: ['child'],
  template: `
    <tr>
      <td>{{child.id}}</td>
      <td>{{child.name}}</td>
      <td v-bind:class="{'is-success': child.success, 'is-danger': !child.success}">{{child.success ? 'succeeded' : 'failed'}}</td>
    </tr>
  `
});

Vue.component('children-table', {
  props: ['selectedParentId'],
  data: () => {
    return {
      parents: [
        {
          id: 1,
          children: [
            {
              id: 1,
              name: 'child 1',
              success: true
            },
            {
              id: 2,
              name: 'child 2',
              success: true
            },
            {
              id: 3,
              name: 'child 3',
              success: false
            }
          ]
        },
        {
          id: 2,
          children: [
            {
              id: 4,
              name: 'child 4',
              success: false
            },
            {
              id: 5,
              name: 'child 5',
              success: false
            },
            {
              id: 6,
              name: 'child 6',
              success: false
            },
            {
              id: 7,
              name: 'child 7',
              success: true
            },
          ]
        },
        {
          id: 3,
          children: [
            {
              id: 8,
              name: 'child 8',
              success: true
            }
          ]
        },
        {
          id: 4,
          children: [
            {
              id: 9,
              name: 'child 9',
              success: true
            },
            {
              id: 10,
              name: 'child 10',
              success: false
            },
            {
              id: 11,
              name: 'child 11',
              success: true
            },
            {
              id: 12,
              name: 'child 12',
              success: false
            },
            {
              id: 13,
              name: 'child 13',
              success: true
            },
          ]
        },
      ]
    };
  },
  computed: {
    selectedParentChildren: function () {
      return this.parents.find((parent) => parent.id === this.selectedParentId).children;
    }
  },
  methods: {
    deselectParent: function () {
      this.$emit('deselect-parent');
    }
  },
  template: `
    <div id="children" class="content">
      <h1 class="title children-title">
        <span>Children</span>
        <span class="icon is-clickable" v-on:click="deselectParent">
          <i class="fa fa-times"></i>        
        </span>
      </h1>
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          <tr
            is="child-row"
            v-bind:child="child"
            v-for="child in selectedParentChildren"
            v-bind:key="child.id"
          ></tr>
        </tbody>
      </table>
    </div>
  `
});

Vue.component('parent-row', {
  props: ['parent'],
  computed: {
    percentPassed: function () {
      return this.parent.passedTests / this.parent.totalTests;
    },
    isSuccess: function () {
      return this.percentPassed >= 0.8;
    },
    isWarning: function () {
      const perc = this.percentPassed;
      return perc < 0.8 && perc >= 0.5;
    },
    isDanger: function () {
        return this.percentPassed < 0.5;
    },
    progressClass: function () {
      return {'is-success': this.isSuccess, 'is-warning': this.isWarning, 'is-danger': this.isDanger};
    }
  },
  template: `
    <tr>
      <td>{{parent.id}}</td>
      <td>{{parent.name}}</td>
      <td>{{parent.desc}}</td>
      <td>{{parent.passedTests}} / {{parent.totalTests}}</td>
      <td>
        <progress
          class="progress"
          v-bind:class="progressClass"
          v-bind:value="parent.passedTests"
          v-bind:max="parent.totalTests"
        >{{percentPassed * 100}}%</progress>
      </td>
    </tr>
  `
});

Vue.component('parents-table', {
  data: () => {
    return {
      parents: [
        {
          id: 1,
          name: 'parent 1',
          desc: 'stuff and things',
          passedTests: 30,
          totalTests: 90
        },
        {
          id: 2,
          name: 'parent 2',
          desc: 'more stuff and things',
          passedTests: 45,
          totalTests: 50
        },
        {
          id: 3,
          name: 'parent 3',
          desc: 'other stuff and things',
          passedTests: 55,
          totalTests: 100
        },
        {
          id: 4,
          name: 'parent 4',
          desc: 'things and stuff',
          passedTests: 99,
          totalTests: 100
        },
      ],
      selectedParentId: undefined
    }
  },
  computed: {
    allPassed: function () {
      return this.parents.map(p => p.passedTests).reduce((acc, cur) => acc + cur);
    },
    allTotal: function () {
      return this.parents.map(p => p.totalTests).reduce((acc, cur) => acc + cur);
    },
    allPerc: function () {
      return this.allPassed / this.allTotal;
    },
    isSuccess: function () {
        return this.allPerc >= 0.8;
    },
    isWarning: function () {
        const perc = this.allPerc;
        return perc < 0.8 && perc >= 0.5;
    },
    isDanger: function () {
        return this.allPerc < 0.5;
    },
    progressClass: function () {
        return {'is-success': this.isSuccess, 'is-warning': this.isWarning, 'is-danger': this.isDanger};
    }
  },
  methods: {
    selectParentId: function(id) {
      this.selectedParentId = id;
    }
  },
  template: `
    <div>
      <div id="parents" class="content">
        <h1 class="title">Parents</h1>
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Tests</th>
              <th>Graph</th>
            </tr>
          </thead>
          <tfoot>
            <tr>
              <td colspan="3">Total</td>
              <td>{{ allPassed }} / {{ allTotal }}</td>
              <td>
                <progress
                  class="progress"
                  v-bind:class="progressClass"
                  v-bind:value="allPassed"
                  v-bind:max="allTotal"
                >{{allPerc * 100}}%</progress>
              </td>
            </tr>
          </tfoot>
          <tbody>
            <tr
              is="parent-row"
              v-bind:parent="parent"
              v-for="parent in parents"
              v-bind:key="parent.id"
              v-on:click.native="selectParentId(parent.id)"
              v-bind:class="{'is-selected': parent.id === selectedParentId}"
              class="is-clickable"
            ></tr>
          </tbody>
        </table>
      </div>
      <children-table v-if="selectedParentId != null" v-bind:selected-parent-id="selectedParentId" v-on:deselect-parent="selectedParentId = undefined"></children-table>
    </div>
  `
});

const app = new Vue({
  el: '#app',
  data: {}
});

