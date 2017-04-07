/**
 * Created by slipkinem on 2016/12/9.
 */
'use strict'
import Vue from 'vue'
import * as types from './mutation-types'
import {Message, MessageBox} from 'element-ui'

import util from '../Util'
export default {
  /**
   * 获取数据
   * @param commit
   * @param page
   * @returns {Promise.<TResult>|*}
   */
  getTableData ({commit}, page) { //
    console.info(commit)
    if (!page) page = {current: 1, size: 10}
    return Vue.http({
      type: 'GET',
      url: 'api/table/getTable',  // 不加 / 前缀不然会导致后台URL拼接失败，后台URL =》 http://localhost:8084/articlepr/
      params: page
    })
      .then(response => {
        let responseBody = response.body
        if (responseBody.errorCode === 0) {
          responseBody.data.map(function (tableData) {
            tableData.date = util.format(new Date(tableData.date), 'yyyy-MM-dd')
            return tableData
          })
          console.log(responseBody)
          commit(types.GET_TABLEDATA, responseBody)
        } else {
          MessageBox.error(responseBody.errorMessage)
        }
      })
  },
  /**
   * 删除数据
   * @param commit
   * @param dispatch
   * @param id
   * @returns {Promise.<T>}
   */
  deleteData ({commit, dispatch}, row) {
    console.log(row)
    let id = row.id
    return MessageBox.confirm('確定要刪除嗎？', '提醒！', {type: 'warning'})
      .then(() => {
        Vue.http.delete('api/table/deleteTable?id=' + id) // es5写法 {id: id}
          .then(response => response.body.errorCode === 1 ? Message.success('已刪除') : Message.error('删除失败！'))
          .then(() => dispatch('getTableData'))
      })
      .catch(() => {
        console.error('cancel')
      })
  },
  /**
   * 编辑数据
   * @param commit
   * @param updateParams
   */
  editData ({commit, dispatch}, updateParams) {
    console.log(updateParams)
    Vue.http.post('api/table/updateTable', updateParams)
      .then(response => response.body.errorCode === 1 ? Message.success('编辑成功')
        : Message.error(`編輯失敗：${response.body.errorMessage}`))
      .then(() => dispatch('getTableData'))
  }
}
