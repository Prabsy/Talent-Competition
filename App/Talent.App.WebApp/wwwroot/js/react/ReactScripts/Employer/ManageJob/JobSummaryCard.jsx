import React from 'react';
import Cookies from 'js-cookie';
import { Icon, Button, Card, Container, Popup } from 'semantic-ui-react';
import moment from 'moment';

export class JobSummaryCard extends React.Component {
    constructor(props) {
        super(props);
        this.selectJob = this.selectJob.bind(this)
    }

    selectJob(id) {
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: 'http://localhost:51689/listing/listing/closeJob',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            dataType: 'json',
            type: "post",
            data: JSON.stringify(id),
            success: function (res) {
                if (res.success == true) {
                    this.props.reloadData();
                    TalentUtil.notification.show(res.message, "success", null, null)
                } else {
                    TalentUtil.notification.show(res.message, "error", null, null)
                }
            }.bind(this)
        })
    }

    render() {
        var data = this.props.data
        var buttonsblock = undefined;
        if (data.status == 0) {
            buttonsblock =
                <Card.Content extra>
                <Container textAlign='right'>
                    {
                        moment(data.expiryDate) < moment() ?
                            <label className="ui red left floated label">
                                Expired</label>
                            : null}
                    <div className="ui right floated mini buttons">
                       
                        <Button basic color='blue' onClick={() => this.selectJob(data.id)}><Icon name='remove circle' />Close</Button>
                        <Button basic color='blue' onClick={() => { window.location = "/EditJob/" + data.id }}><Icon name='edit outline' />Edit</Button>
                        <Button basic color='blue' onClick={() => { window.location = "/PostJob/" + data.id }}><Icon name='copy outline' />Copy</Button>
                        
                        </div>
                    </Container>
                </Card.Content>
        }
        else {
            buttonsblock =
                <Card.Content extra>
                <Button negative floated='left'>Expired</Button>
                <Container textAlign='right'>
                    <div className="ui right floated mini buttons">

                        <Button basic color='blue' onClick={() => { window.location = "/PostJob/" + data.id }}><Icon name='copy outline' />Copy</Button>
                        <label className="ui black left floated label">
                            <i className="ban icon" />Job closed</label>
                        </div>
                    </Container>
                </Card.Content>                
        }

        return (
                
                <Card key={data.id}>
                <Card.Content>
                    <Card.Header>{data.title}</Card.Header>
                    <Popup trigger={
                        <a className="ui black right ribbon label">
                            <i className="user icon"></i>{data.noOfSuggestions}
                        </a>
                    }>
                        <span>Suggested Talents</span>
                    </Popup>
                            <Card.Meta>{data.location.city}, {data.location.country}</Card.Meta>
                            <Card.Description style={{ minHeight: "150px" }}>
                                {data.summary}
                            </Card.Description>
                </Card.Content>
                {buttonsblock != undefined ? buttonsblock : null}                   
                       
                    </Card>
                
                
        )
    }
}