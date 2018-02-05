import pluralize from 'pluralize'
import PropTypes from 'prop-types'
import React from 'react'

import DownloadDataBtn from '../DownloadDataBtn'
import BarChart from '../graphs/BarChart'
import TableChart from '../graphs/TableChart'
import { slugify } from '../../util/text'

class LeokaCard extends React.Component {

  render() {
    const { data, place, year } = this.props
    let charts = null;
    switch (data.ui_type) {
      case 'basic_table':
        charts = (<BarChart data={data} year={year} />)
        break;
      case 'table':
        charts = (<TableChart data={data} year={year} />)
        break;
      default:
        charts = (<p>{data.ui_type} not supported!</p>)
    }


    const download = {
      data: data.data,
      filename: `${place}-leoka-${slugify(data.noun
      )}-${year}.csv`,
    }

    return (
      <div className="p2 sm-p3 bg-white black">
        <h2 className="mt0 mb2 pb1 fs-18 sm-fs-22 sans-serif blue border-bottom border-blue-light">
          {data.noun}
        </h2>
        {charts}
          <div className="mt-tiny">
            <span className="bold caps fs-12 red">
              Reported {pluralize(data.noun)}
            </span>
          </div>
          <DownloadDataBtn
            ariaLabel={`Download ${data.noun} data as a CSV`}
            data={download}
            filename={`${place}-leoka-${slugify(data.noun)}-${year}`}
            text="Download data"
          />
      </div>
    )
  }

}

LeokaCard.propTypes = {
  data: PropTypes.object.isRequired,
  place: PropTypes.string,
  year: PropTypes.number.isRequired,
}

export default LeokaCard