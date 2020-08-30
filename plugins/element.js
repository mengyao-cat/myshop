import Vue from 'vue'
import { Button, Form, FormItem, Input, Message, Breadcrumb, Card, Row, Col, Table, TableColumn, Switch, Tooltip, Pagination, MessageBox } from 'element-ui'
Vue.use(Button)

Vue.use(Form)

Vue.use(FormItem)

Vue.use(Input)

Vue.use(Breadcrumb)

Vue.use(Card)

Vue.use(Row)

Vue.use(Col)

Vue.use(Table)

Vue.use(TableColumn)

Vue.use(Switch)

Vue.use(Tooltip)

Vue.use(Pagination)

// 导入弹框提示组件

// 进行全局挂载
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
