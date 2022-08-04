import { SyncOutlined } from '@ant-design/icons';
import { Typography, Spin, Tag, message, Table, Button, Rate, Input } from 'antd'
import axios from 'axios';
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { GET_REVIEWS, POST_REVIEW } from '../api/Api';
import moment from 'moment'

const { Title, Text } = Typography;
const { ColumnGroup, Column } = Table;
const { TextArea } = Input;

export default function Feedback(props) {

    const [getProcess, setGetProcess] = useState(false);
    const [reviews, setReviews] = useState([])
    const [feedback,setFeedback] = useState('')
    const [refresh,setRefresh] = useState(false)


    const navigate = useNavigate();

    const  username  = props.auth.user?.username || null
 
    useEffect(() => {
        setGetProcess(true);
        if(username === null){
            navigate('/')
        }
        loadReviews();
    }, [])

    function loadReviews() {
        var config = {
            method: 'get',
            url: GET_REVIEWS,
            headers: {}
        };

        axios(config)
            .then(function (response) {
                setReviews(response.data.data)
                setGetProcess(false);
                setRefresh(false);
            })
            .catch(function (error) {
                message.error('Error while getting feedbacks')
            })
    }

    function submitReview() {
        console.log('sffdsas');
            setGetProcess(true)
            var data = JSON.stringify({
                "username": username,
                "feedback": feedback
            });

            var config = {
                method: 'post',
                url: POST_REVIEW,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };

            axios(config)
                .then(function (response) {
                    message.success('feedback added successfully')
                    setGetProcess(false);
                })
                .catch(function (error) {
                    message.error('Feedback failed')
                });
    }

    const handleFeeback = (e) => {
        setFeedback(e.target.value)
      }

    return (<>
        <div style={{ width: '75%', margin: 'auto' }}>
            {getProcess
                ? <Spin size='large' />
                :
                <div>
                    <div style={{margin:'5%'}}>
                    <TextArea placeholder="Write your feedback here"
                        autoSize={{ minRows: 3, maxRows: 6 }} style={{ width: '60%' }} onChange={handleFeeback} />
                        <Button onClick={submitReview} style={{margin:'2.5%'}} type='primary'> Submit </Button>
                        <Button onClick={()=>{ loadReviews(); setRefresh(true) }} style={{margin:'2.5%'}} > <SyncOutlined spin = {refresh} /> </Button>
                        </div>
                    <Table dataSource={reviews} key='table' rowKey='table'>
                        <Column title="User Name" dataIndex="username" key="username" />
                        <Column title="Feedback" dataIndex="feedback" key="feedback" />
                        <Column title="Polarity" render={(item) => {
                            return (
                                <Tag color={item == 'positive' ? 'green' : 'red'}>{item}</Tag>
                            )
                        }} dataIndex="polarity" key="polarity" />
                        <Column title="Score" render={(item) => {
                            return (
                                <Rate disabled defaultValue={item} />
                            )
                        }} dataIndex="score" key="score" />
                        <Column title="Date" dataIndex="date" key="date" render={(date) => {
                            const seconds = date._seconds;
                            const d = moment.unix(seconds).toDate().toUTCString().split(' ');
                            return (
                                <Text level={5}>{d[1] + '   ' + d[2] + '  ' + d[3]}</Text>
                            )
                        }} />
                    </Table>
                </div>
            }
        </div>
    </>)
}