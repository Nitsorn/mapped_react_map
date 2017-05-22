class MapComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: props.users,
      date: moment().startOf('day'),
      geo_location_search: null,
      selected_users: props.users.filter( user => {
        return (
          user.account_active &&
          user.gps_enabled && !user.inactive && user.mobile && user.last_known_location
        )
      }).map( user => user.id ),
      day_jobs: [],
      object_on_focus: null,
      job_on_focus: null, //job modal
      customer_on_focus: null //customer modal
    }
    this.poll_for_user_travel_details = null;
  }

  componentDidMount() {
    this.refreshMap(this.state.date, this.state.selected_users);
    this.poll_for_user_travel_details = setInterval(this.getUsersTravelDetails.bind(this, false), 10000);
  }

  refreshMap() {
    const { date, selected_users } = this.state;
    this.getUnassignedJobs(date);
    this.getUsersTravelDetails(true);
  }

  autopan() {
    this.setState({auto_pan: true}, _ => {
      setTimeout( _ => {
        this.setState({auto_pan: false})
      }, 2000)
    });
  }

  componentWillUnmount() {
    clearInterval(this.poll_for_user_travel_details);
  }

  getUnassignedJobs(date) {
    LF.fetch(
      'GET',
      '/jobs/unassigned_day_jobs', {
        date: new Date(date).toString(),
      },
      (err, response) => {
        if (err) console.log(err);
        else this.setState({
          day_jobs: response.jobs
        })
      }
    )
  }

  render() {
    const { company } = this.props;
    return (
      <div className='lf-full-width lf-position-relative lf-overflow-hidden'>
        <div className='map_tab_react'>
          {this.renderMapOverlay()}
          {this.renderModals()}
          {this.renderMap()}
          {this.renderNewJobFullScreen()}
          {this.renderAddNewJob()}
        </div>
      </div>
    )
  }

  renderMap() {
    const { company } = this.props;
    const { geo_location_search, selected_users, day_jobs, users, auto_pan, date } = this.state;
    return (
      <Map
        company={company}
        geo_location_search={geo_location_search}
        auto_pan={auto_pan}
        users={users.filter(user => {
          return (selected_users.indexOf(user.id) > -1 && user.account_active)
        })}
        onSelectObject={ object => this.setState({object_on_focus: object})}
        selected_users={selected_users}
        jobs={day_jobs}
        date={date}
      />
    )
  }

  renderMapOverlay() {
    let { selected_users, geo_location_search, date, users, day_jobs, object_on_focus } = this.state;
    return (
      <div className='map_panels'>
        <MapWorkersPanel
          users={users}
          selected_users={selected_users}
          onToggleUser={ user_id => {
            let index = selected_users.indexOf(user_id);
            if (index > -1) selected_users.splice(index, 1);
            else selected_users.push(user_id);
            this.getUsersTravelDetails(true);
          }}
        />
        <MapSearchPanel
          geo_location_search={geo_location_search}
          onSearchAddress={ geo_location => this.setState({
            geo_location_search: geo_location
          })}
        />
        <MapDatePanel
          date={date}
          onChangeDate={ date_obj => {
            let date = moment(new Date(date_obj));
            this.setState({
              date,
              object_on_focus: null
            }, _ => {
              this.refreshMap(selected_users);
            });
          }}
        />
        { object_on_focus ?
          <MapObjectPanel
            date={date}
            jobs={day_jobs}
            users={users}
            onClose={ _ => this.setState({object_on_focus: null})}
            onExpandJob={ job_on_focus => this.setState({job_on_focus})}
            onExpandCustomer={ customer_on_focus => this.setState({customer_on_focus})}
            object={object_on_focus}
            onRefresh={this.refreshMap.bind(this)}
          /> : ''
        }
        <MapLegendPanel />
      </div>
    )
  }

  renderModals() {
    const { job_on_focus, customer_on_focus } = this.state;
    const { company } = this.props;
    return (
      <div>
        {
          job_on_focus &&
          <ExistingJob
            zIndex={11}
						job={job_on_focus}
						onClose={ _ => this.setState({
              job_on_focus: null
            }, this.refreshMap.bind(this))}
						company={company}
					/>
        }
        {
          customer_on_focus &&
          <ExistingCustomer
            zIndex={11}
						customer={customer_on_focus}
						onClose={ _ => this.setState({
              customer_on_focus: null
            }, this.refreshMap.bind(this))}
						company={company}
					/>
        }
      </div>
    )
  }

  getUsersTravelDetails(auto_pan) {
    let { object_on_focus, selected_users, date } = this.state;
    LF.fetch('GET','/users/get_travel_details',{
      date: new Date(date).toString(),
      user_ids: selected_users
    }, (err, response) => {
      this.setState({
        users: response.users,
        selected_users,
      }, _ => {
        auto_pan && this.autopan();
      })
    })
  }

  renderNewJobFullScreen() {
		const { company } = this.props;
		let { date, add_new_job, day_jobs } = this.state;
		return (
			<AnimatedFullScreen
				closable={false}
				visible={add_new_job ? true : false}
				onClose={ _ => this.setState({
					add_new_job: false,
				})}
			>
				{ add_new_job ?
					<NewJob
						company={company}
						closeModal={ _ => this.setState({
							add_new_job: false
						}, this.refreshMap.bind(this))}
						date={date}
					/> : ''
				}
			</AnimatedFullScreen>
		)
	}

  renderAddNewJob() {
		return (
			<div
				onClick={ _ => this.setState({add_new_job: true})}
				className='add_new_job_button lf-animate lf-animate-fast lf-align-items-inline'
			>
				<i className='lf-icon lf-icon-new-job' />
			</div>
		)
	}

}
