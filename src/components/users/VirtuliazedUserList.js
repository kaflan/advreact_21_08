import React, { Component } from 'react'
import {connect} from 'react-redux'
import {Table, Column, InfiniteLoader} from 'react-virtualized'
import 'react-virtualized/styles.css'

export class VirtuliazedUserList extends Component {
  componentDidMount() {}

  render() {
    return (
      <Table
        rowHeight={40}
        headerHeight={50}
        overscanRowCount={5}
        width={700}
        height={300}
      >
        <Column
          label="title"
          dataKey="title"
          width={300}
        />
        <Column
          label="where"
          dataKey="where"
          width={250}
        />
        <Column
          label="when"
          dataKey="month"
          width={150}
        />
      </Table>
    )
  }
}

export default connect()(VirtuliazedUserList)