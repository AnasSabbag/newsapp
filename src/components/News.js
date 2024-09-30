import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'


export class News extends Component {
  static defaultProps = {
    country: 'us',
    pageSize: 6,
    category: 'general',
    apiKey: 'd797d81a6f9843649a3a7d1d44904fd4'
  }
  static propsTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
    apiKey: PropTypes.string
  }


  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      loading: false,
      isOpen:false,
      page: 1
    }
    document.title = this.props.category +'-NewsMonkey'
  }
  async updateNews() {
    let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.props.page}&pageSize=${this.props.pageSize}`;
    this.setState({ loading: true });
    let data = await fetch(url)
    let parsedData = await data.json()
    this.setState({ articles: parsedData.articles, totalResults: parsedData.totalResults, loading: false,isOpen:true })

  }


  async componentDidMount() {
    this.updateNews()
  }

  handlePreviousClick = async () => {
    this.setState({
      page: this.state.page - 1,
    })
    this.updateNews()
  }

  handleNextClick = async () => {
    console.log("Next")

    this.setState({
      page: this.state.page + 1,
    })
    this.updateNews()

  }


  render() {
    return (
      <div className="container my-3">
        <h1 className="text center">News Monkey Top-Headline from {this.props.category}</h1>
        {this.state.loading && <Spinner />}
        <div className="row my-4">
          {
            !this.state.loading && this.isOpen && this.state.articles.map((element) => {
              return <div className="col-md-4 my-3" key={element.url} >
                <NewsItem
                  title={element.title.slice(0, 40)}
                  description={element.description !== null ? element.description.slice(0, 70) : "empty.."}
                  imageUrl={element.urlToImage ? element.urlToImage : "https://imagez.tmz.com/image/22/16by9/2024/09/23/22b17386d8074647961e8fdbe38c8115_xl.jpg"}
                  newsUrl={element.url ? element.url : ""}
                  author={element.author}
                  date={element.publishedAt}
                  source={element.source.name}
                />
              </div>

            })
          }
        </div>
        <div className="container d-flex justify-content-between">
          <button disabled={this.state.page <= 1} type="button" className="btn btn-dark" onClick={this.handlePreviousClick} >&larr;Previous</button>
          <button disabled={(this.state.page + 1 > Math.ceil(this.state.totalResults / this.props.pageSize))} type="button" className="btn btn-dark" onClick={this.handleNextClick} >Next&rarr;</button>
        </div>

      </div>
    )
  }
}

export default News
