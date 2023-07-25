
// ★STEP2
// https://jp.vuejs.org/v2/examples/todomvc.html
var STORAGE_KEY = 'todos-vuejs-demo'
var todoStorage = {
  fetch: function () {
    var todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    todos.forEach(function (todo, index) {
      todo.id = index
    })
    todoStorage.uid = todos.length
    return todos
  },
  save: function (todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }
}
var registerDate = {
  getDate: function(){
    var d = new Date();
    var formatted = `
    ${d.getFullYear()}/
    ${d.getMonth()+1}/${d.getDate()} 
    ${d.getHours()}:${d.getMinutes()}
    
    `.replace(/\n|\r/g, '');
    return formatted
  }
}

var Deadline = {
  getDate: function(date){
    var d = new Date();
    var lastd = new Date(d.getFullYear(), d.getMonth(), 0);
    if ((d.getDate()+date) > lastd.getDate()){
      var formatted = `
      ${d.getFullYear()}/${d.getMonth()+2}/${(d.getDate()+date) - lastd.getDate()} 
      ${d.getHours()}:${d.getMinutes()}


      `.replace(/\n|\r/g, '');
    } else {
      var formatted = `
      ${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()+date} 
      ${d.getHours()}:${d.getMinutes()}


      `.replace(/\n|\r/g, '');
    }
    return formatted
  }
} 
//デモ用Deadline関数
var DeadlineDemo = {
  getDate: function(date){
    var d = new Date();
    var formatted = `
    ${d.getMonth()+1}/${d.getDate()} 
    ${d.getHours()}:${d.getMinutes()+date}
    `.replace(/\n|\r/g, '');
    return formatted
  }
}
function comTime(deadline){
  var d = new Date();
  var dead = new Date(deadline)
  console.log(dead);
  console.log(d);
  console.log(dead <= d);
  return dead <= d
}

function autoChange() {
  for (var i in vm._data.todos){
    console.log(vm._data.todos[i]);
    vm.doTimer(vm._data.todos[i])
  }
}
window.onload = function(){
  autoChange();
}









/*賞味期限のタイマー関数
function test(){
  setTimeout("shori()",3000);
}

function shori(){
  alert('切れました。');
}
*/

// ★STEP1
let vm = new Vue({
  el: '#app',

  data: {
    // ★STEP5 localStorage から 取得した ToDo のリスト
    todos: [],
    buttons: [],
    // ★STEP11 抽出しているToDoの状態
    current: -1,
    // ★STEP11＆STEP13 各状態のラベル
    options: [
      { value: -1, label: 'すべて' },
      { value: 0, label: '新鮮' },
      { value: 1, label: '腐敗' }
    ]
  },

  computed: {

    // ★STEP12
    computedTodos: function () {
      return this.todos.filter(function (el) {
        return this.current < 0 ? true : this.current === el.state
      }, this)
    },

    // ★STEP13 新鮮・腐敗のラベルを表示する
    labels() {
      return this.options.reduce(function (a, b) {
        return Object.assign(a, { [b.value]: b.label })
      }, {})
      // キーから見つけやすいように、次のように加工したデータを作成
      // {0: '新鮮', 1: '腐敗', -1: 'すべて'}
    }
  },

  // ★STEP8
  watch: {
    // オプションを使う場合はオブジェクト形式にする
    todos: {
      // 引数はウォッチしているプロパティの変更後の値
      handler: function (todos) {
        todoStorage.save(todos)
      },
      // deep オプションでネストしているデータも監視できる
      deep: true
    }
  },

  // ★STEP9
  created() {
    // インスタンス作成時に自動的に fetch() する
    this.todos = todoStorage.fetch()
  },

  methods: {
    addItem: function(itemname, i) {
      // { 新しいID, コメント, 作業状態 }
      // というオブジェクトを現在の todos リストへ push
      // 作業状態「state」はデフォルト「新鮮=0」で作成
      this.todos.push({
        id: todoStorage.uid++,
        comment: itemname,
        date: registerDate.getDate(),
        //ここで任意の消費期限の設定
        deadline: Deadline.getDate(i),
        state: 0
      })
/*
      console.log(this.todos)
      // フォーム要素を空にする
      comment.value = ''
      */
      autoChange();
    },
    //デモ用addItem関数
    addItemDemo: function(itemname, i) {
      this.todos.push({
        id: todoStorage.uid++,
        comment: itemname,
        date: registerDate.getDate(),
        //ここで任意の消費期限の設定
        deadline: DeadlineDemo.getDate(i),
        state: 0
      })
      autoChange();
    },

    addButton: function() {
      var buttonName = this.$refs.buttonName
      var buttonDate = this.$refs.buttonDate
      if (!buttonName.value.length) {
        return
      }
      if (!buttonDate.value.length) {
        return
      }
      this.buttons.push({
        name: buttonName.value,
        date: Number(buttonDate.value),
      })
      buttonName.value = ''
      buttonDate.value = ''
    },

    // ★STEP10 状態変更の処理
    doChangeState: function (item) {
      if (item.state==0){
        item.state = 1;
      }
    },

    // ★STEP10 削除の処理
    doRemove: function (item) {
      var index = this.todos.indexOf(item)
      this.todos.splice(index, 1)
    },

   
    doTimer: function (item) {
        const intervalTime = setInterval(() =>{   
          if(comTime(item.deadline)){
              this.doChangeState(item);
              clearInterval(intervalTime);
          }
        },1000);
    },
    // doPrint: function(item) {
    //   console.log(item.deadline);
    //   this.doTimer(item);
    // }
    }    })
