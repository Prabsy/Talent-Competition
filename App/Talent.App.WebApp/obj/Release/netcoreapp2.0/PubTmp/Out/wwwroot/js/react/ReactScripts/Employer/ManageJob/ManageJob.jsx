import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { Pagination, Icon, Dropdown, Checkbox, Accordion, Form, Segment } from 'semantic-ui-react';

export default class ManageJob extends React.Component {
    constructor(props) {
        super(props);
        let loader = loaderData
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");
        this.state = {
            loadJobs: [],
            loaderData: loader,
            activePage: 1,
            sortBy: {
                date: "desc"
            },
            filter: {
                showActive: true,
                showClosed: false,
                showDraft: true,
                showExpired: true,
                showUnexpired: true
            },
            totalPages: 1,
            activeIndex: ""
        }
        this.loadData = this.loadData.bind(this);
        this.init = this.init.bind(this);
        this.handlePaginationChange = this.handlePaginationChange.bind(this);
        this.sorttrigger = this.sorttrigger.bind(this);
        this.filterchangeevent = this.filterchangeevent.bind(this);
        this.loadNewData = this.loadNewData.bind(this);
        this.handleClick = this.handleClick.bind(this);
    };

    init() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.isLoading = false;
        this.loadData(() =>
            this.setState({ loaderData })
        )
    }

    componentDidMount() {
        this.init();
    };

    loadData(callback) {
        var link = 'https://talentservicestalent20210607154210.azurewebsites.net/listing/listing/getSortedEmployerJobs';
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: link,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            data: {
                activePage: this.state.activePage,
                sortByDate: this.state.sortBy.date,
                showActive: this.state.filter.showActive,
                showClosed: this.state.filter.showClosed,
                showDraft: this.state.filter.showDraft,
                showExpired: this.state.filter.showExpired,
                showUnexpired: this.state.filter.showUnexpired
            },
            contentType: "application/json",
            dataType: "json",
            success: function (res) {
                console.log(res);
                this.setState({ loadJobs: res.myJobs, totalPages: Math.ceil(res.totalCount / 6) }, callback);
            }.bind(this),

            error: function (res, a, b) {
                //this.init();

                console.log(res)
                console.log(a)
                console.log(b)

            }.bind(this)
        })
    }
    filterchangeevent(e, { checked, name }) {
        this.state.filter[name] = checked;
        this.setState({
            filter: this.state.filter
        })
    }

    handlePaginationChange(e, { activePage }) {
        this.loadNewData({ activePage: activePage });
    }

    sorttrigger(e, { value, name }) {
        this.state.sortBy[name] = value;
        this.loadNewData({ sortBy: this.state.sortBy });
    }

    

    loadNewData(data) {
        var loader = this.state.loaderData;
        loader.isLoading = true;
        data[loaderData] = loader;
        this.setState(data, () => {
            this.loadData(() => {
                loader.isLoading = false;
                this.setState({
                    loadData: loader
                })
            })
        });
    }
    handleClick(e, titleProps) {
        const { index } = titleProps
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? -1 : index

        this.setState({ activeIndex: newIndex })
    }
    render() {
        var jobs = undefined;
        if (this.state.loadJobs.length > 0) {

            jobs = this.state.loadJobs.map(j =>
                <JobSummaryCard
                    key={j.id}
                    data={j}
                    reloadData={this.loadData}
                />);
        }
        const dropdownoptionsforsort = [
            {
                key: 'desc',
                text: 'Newest first',
                value: 'desc',
                content: 'Newest first',
            },
            {
                key: 'asc',
                text: 'Oldest first',
                value: 'asc',
                content: 'Oldest first',
            }
        ];

        const { activeIndex } = this.state;
        return (
            <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
                <div className="ui container">
                    <div className="ui grid">
                        <div className="row">
                            <div className="sixteen wide column">
                                <h1>List of Jobs</h1>
                                <div>
                                <Icon name='filter'  />
                                <Dropdown inline simple text="Choose filter">
                                    <Dropdown.Menu>
                                            <Dropdown.Item key={"status"}>
                                                <Form>
                                                    <Form.Group grouped>
                                                        <Form.Checkbox label='Active Jobs'
                                                            name="showActive" onChange={this.filterchangeevent} checked={this.state.filter.showActive} />
                                                        <Form.Checkbox label='Closed Jobs'
                                                            name="showClosed" onChange={this.filterchangeevent} checked={this.state.filter.showClosed} />
                                                        <Form.Checkbox label='Drafts'
                                                            name="showDraft" onChange={this.filterchangeevent} checked={this.state.filter.showDraft} />
                                                    </Form.Group>
                                                </Form>
                                            </Dropdown.Item>
                                            <button className="ui teal small button"
                                                style={{ width: "100%", borderRadius: "0" }}
                                                onClick={() => this.loadNewData({ activePage: 1 })}
                                            >
                                                <i className="filter icon" />
                                                Filter
                                                </button>
                                    </Dropdown.Menu>
                                    </Dropdown>
                                
                                    <Icon name='calendar' />
                                    <Dropdown inline simple options={dropdownoptionsforsort}
                                        name="date"
                                        onChange={this.sorttrigger}
                                        value={this.state.sortBy.date}
                                    />
                                </div>
                                <div className="ui three cards">
                                    {
                                        jobs != undefined ?
                                            jobs
                                            : <React.Fragment>
                                                <p style={{
                                                    paddingTop: 15,
                                                    paddingBottom: 40,
                                                    marginLeft: 15
                                                }}>No Jobs Found</p>
                                            </React.Fragment>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="centered row">
                            <Pagination
                                ellipsisItem={{ content: <Icon name='ellipsis horizontal' />, icon: true }}
                                firstItem={{ content: <Icon name='angle double left' />, icon: true }}
                                lastItem={{ content: <Icon name='angle double right' />, icon: true }}
                                prevItem={{ content: <Icon name='angle left' />, icon: true }}
                                nextItem={{ content: <Icon name='angle right' />, icon: true }}
                                totalPages={this.state.totalPages}
                                activePage={this.state.activePage}
                                onPageChange={this.handlePaginationChange}
                            />
                        </div>
                        <div className="row">
                        </div>
                    </div>
                </div>
            </BodyWrapper>
        )
    }
}