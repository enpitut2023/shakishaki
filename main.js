
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
  
    ${d.getMonth()+1}/${d.getDate()} 
    ${d.getHours()}:${d.getMinutes()}
    
    `.replace(/\n|\r/g, '');
    return formatted
  }
}

var Deadline = {
  getDate: function(date){
    var d = new Date();
    var formatted = `
      ${d.getMonth()+1}/${d.getDate()+date} 
      ${d.getHours()}:${d.getMinutes()}


      `.replace(/\n|\r/g, '');
    return formatted
  }
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
new Vue({
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
    // ★STEP7 ToDo 追加の処理
    doAdd: function(event, value) {
      // ref で名前を付けておいた要素を参照
      //コメントの内容
      var comment = this.$refs.comment
      // 入力がなければ何もしないで return
      if (!comment.value.length) {
        return
      }
      // { 新しいID, コメント, 作業状態 }
      // というオブジェクトを現在の todos リストへ push
      // 作業状態「state」はデフォルト「新鮮=0」で作成
      this.todos.push({
        id: todoStorage.uid++,
        comment: comment.value,
        date: registerDate.getDate(),
        deadline: Deadline.getDate(1),
        state: 0
      })
      // フォーム要素を空にする
      comment.value = ''
    },
    addItem: function(itemname, i) {
      // ref で名前を付けておいた要素を参照
      //コメントの内容
      //var comment = this.$refs.comment
      // 入力がなければ何もしないで return
      /*if (!comment.value.length) {
        return
      }*/
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
      // フォーム要素を空にする
      comment.value = ''
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
      item.state = !item.state ? 1 : 0
    },

    // ★STEP10 削除の処理
    doRemove: function (item) {
      var index = this.todos.indexOf(item)
      this.todos.splice(index, 1)
    }

  }
})
