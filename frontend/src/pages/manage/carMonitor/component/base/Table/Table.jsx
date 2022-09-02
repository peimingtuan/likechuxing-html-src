require('./Table.less')
import React from "react"
import Pagination from '../Pagination'

class Row extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <tr>
        {this.props.header.map((item, index) => <td
          key={this.props.row + "_" + index}>{this.props.data[item.key]}</td>)}
      </tr>
    )
  }
}

class Table extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      title: props.title || '',
      header: getHeaders(props),
      list: props.list || [],
      items: props.items || 15,
      page_index: 1,
      page_total: 1
    }
  }

  componentWillReceiveProps(nextProps) {
    let state = {
      list: nextProps.list,
      page_total: Math.ceil(nextProps.list.length / this.state.items)
    }
    if(this.state.list.length !== nextProps.list.length){
      state.page_index = 1
    }
    this.setState(state)
  }

  changePage(page) {
    this.setState({page_index: page})
  }

  render() {
    let title=''
    if(this.state.title){
      title = <div className="title">{this.state.title}</div>
    }
    // 分页后显示出的数组
    let list_show = this.state.list.slice((this.state.page_index - 1) * this.state.items, this.state.page_index * this.state.items)
    return (
      <div className="Table_garvey">
        {title}
        <table>
          <thead>
          <tr className="th">{this.state.header.map((td, index) => <th key={td.key + "_" + index}>{td.name}</th>)}</tr>
          </thead>
          <tbody>
          {list_show.map((item, index) => <Row key={"row_" + index} data={item} header={this.state.header}
                                               row={index}/>)}
          </tbody>
        </table>
        <Pagination page_index={this.state.page_index} page_total={this.state.page_total} changePage={this.changePage.bind(this)}/>
      </div>
    )
  }
}

function getHeaders(props) {
  if (props.hasOwnProperty('header')) {
    return props.header
  } else {
    if (props.list.length > 0) {
      let header = []
      for (let k in props.list[0]) {
        let type = typeof props.list[0][k]
        if (type === 'number' || type === 'string') {
          header.push({
            key: k,
            name: k
          })
        }
      }
      return header
    } else {
      return []
    }
  }
}

/*
Table.propTypes={
	data:PropTypes.array.isRequired,
	option:PropTypes.shape({
		add_index:PropTypes.boolen,
		title:PropTypes.string,
		th:PropTypes.arrayOf(PropTypes.object),
		item:PropTypes.number,
		items:PropTypes.arrayOf(PropTypes.number)
	})
};
*/

export default Table