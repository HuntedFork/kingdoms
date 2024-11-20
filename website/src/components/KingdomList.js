import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { Grid, Segment, Button, Popup, Pagination, Dropdown, Input } from "semantic-ui-react";
import KingdomSummary from "./KingdomSummary.js"
import SetSelect from "./SetSelect.js"
import { sortFunctionCreator } from "../utility.js"
import SETS from "../sets.js"

import { styles as s } from "../styles/styles.js"
import "../styles/Kingdom.css"

class KingdomList extends React.Component {

  static propTypes = {
    kingdoms: PropTypes.array
  };

  resultsPerPage = 10;

  state = {
    activePage: 1,
    selectedSets: [],
    sortSelection: 'score',
    search: ''
  };

  componentDidMount() {
    const userSets = localStorage.getItem("userSets")
    this.setState({selectedSets: userSets ? JSON.parse(userSets) : SETS})
    const startPage = new URLSearchParams(window.location.search).get('page');
    if (parseInt(startPage)) {
      this.setState({activePage: parseInt(startPage)})
    }
  }

  searchIncludesKingdom = kingdom => {
    if (!this.state.search) return true
    const searchStrings = this.state.search.split(',').map(x => x.trim())
    const searchable = [
      kingdom.name.toLowerCase(),
      ...kingdom.supply.flatMap(x=>x ? [x.name.toLowerCase()] : []),
      ...kingdom.landscapes.flatMap(x=>x ? [x.name.toLowerCase()] : [])
    ]
    return searchStrings.every((string) => {
      return searchable.some(x=>x.includes(string.toLowerCase()))
    });
  }

  kingdomsInSearch = () => {
    const compareFuncs = {
      name: (x,y) => {return x.name > y.name},
      rating: (x,y) => {return x.rating < y.rating},
      created: (x,y) => {return x.created < y.created},
    }
    if (!this.props.kingdoms) {
      return []
    }
    const kingdoms = this.props.kingdoms.filter(kingdom => {
      if (!kingdom.sets.every(set => this.state.selectedSets.includes(set))) return false
      if (!this.searchIncludesKingdom(kingdom)) return false
      return true
    })
    if (this.state.sortSelection !== 'score') {
      kingdoms.sort(sortFunctionCreator(compareFuncs[this.state.sortSelection]))
    }
    return kingdoms
  }

  resultsOnPage = kingdoms => {
    if (!kingdoms) return []
    const startIndex = (this.state.activePage - 1) * this.resultsPerPage
    return kingdoms.slice(startIndex, startIndex+this.resultsPerPage)
  }

  handlePageChange = (e, {activePage}) => {
    const searchParams = new URLSearchParams(window.location.search)
    searchParams.set("page", activePage);
    const newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
    window.history.replaceState(null, '', newRelativePathQuery);
    this.setState({ activePage })
  }

  handleSetsSelected = sets => {
    this.setState({ selectedSets: sets })
  }

  handleSortSelection = (e, {value}) => {
      this.setState({sortSelection: value})
  }


  renderSetSelector = () => {
    const setButtonText = "Sets (" + this.state.selectedSets.length + ")"
    return (
      <Popup
        trigger={<Button content={setButtonText} style={s.secondaryButton} />}
        on='click'
        pinned
        position="bottom left"
      >
        <SetSelect selected={this.state.selectedSets} onChange={this.handleSetsSelected} />
      </Popup>
    )
  }

  renderSortDropdown = () => {
    const options = [
      {text: 'Popular', value: 'score'},
      {text: 'Name', value: 'name'},
      {text: 'Date Created', value: 'created'}
    ]
    if (!this.props.anonymous) {
      options.push({text: 'My Rating', value: 'rating'})
    }
    return (
      <span style={{whiteSpace:'nowrap', marginLeft:10}}>
        Sort By:
        <Dropdown
          selection
          button
          options={options}
          onChange={this.handleSortSelection}
          value={this.state.sortSelection}
          className='icon'
          style={{marginLeft: 5}}
        />
      </span>
    )
  }

  renderSearchBar = () => {
    return (
      <span style={{whiteSpace:'nowrap', marginLeft:10}}>
        Search:
        <Input
          placeholder={'village,smithy,market'}
          onChange={(e, {value}) => this.setState({search: value})}
          style={{marginLeft:5}}
        />
      </span>
    );
  }

  renderOptionsBar = () => {
    return (
      <div style={{display: 'flex', flexWrap: 'wrap'}}>
          {this.renderSetSelector()}
          {this.renderSortDropdown()}
          {this.renderSearchBar()}
      </div>
    )
  }

  renderPagination = kingdoms => {
    const numPages = Math.ceil(kingdoms.length/this.resultsPerPage)
    return (
      <div>
        <Pagination
          secondary
          firstItem={null}
          lastItem={null}
          activePage={this.state.activePage}
          onPageChange={this.handlePageChange}
          totalPages={numPages}
        />

      </div>
    )
  }

  renderKingdomTile = kingdom => {
    return (
      <KingdomSummary key={kingdom.pk} kingdom={kingdom} />
    )
  }

  render() {
    const kingdoms = this.kingdomsInSearch()
    return (
      <div>
        {this.renderOptionsBar()}
        {this.resultsOnPage(kingdoms).map(kingdom => this.renderKingdomTile(kingdom))}
        {this.renderPagination(kingdoms)}
      </div>
    )
  }
}


const mapStateToProps = state => {
  return {
    anonymous: state.auth.anonymous
  };
};

const mapDispatchToProps = dispatch => {
  return { };
}

export default connect(mapStateToProps, mapDispatchToProps)(KingdomList);
