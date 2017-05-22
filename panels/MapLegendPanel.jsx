class MapLegendPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <div className='map_panel map_panel-legend my-align-items-inline'>
        <div className='my-card my-padding-five my-align-center'>
          <div className='map_panel-legend-item my-align-items-inline'>
            <div className='map_panel-legend-item-bar map_panel-legend-item-bar-past'></div>
            <div className='map_panel-legend-item-label map_panel-legend-item-label-past'>Traveled Route</div>
          </div>
          <div className='map_panel-legend-item my-align-items-inline'>
            <div className='map_panel-legend-item-bar map_panel-legend-item-bar-future'></div>
            <div className='map_panel-legend-item-label map_panel-legend-item-label-future'>Suggested Route</div>
          </div>
        </div>
      </div>
    )
  }
}
