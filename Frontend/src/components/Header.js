import { Link, useNavigate } from 'react-router-dom'

import { Button, Layout, PageHeader } from 'antd';
import { Auth } from 'aws-amplify';

export default function Header(props) {
    const navigate = useNavigate();

    // const { isAuthenticated, user } = props.user
    // const { setUser } = props;

    const onLogout = (event) => {
        // setUser({...user,isAuthenticated:false});
        
        event.preventDefault();
        try {
            Auth.signOut();
            props.auth.setAuthStatus(false);
            props.auth.setUser(null);
            navigate("/login");
        } catch (error) {
            console.log(error.message);
        }

        navigate('/')
    }

    const user = props.user.user

    return (
        <Layout className="layout">
            <PageHeader
                ghost
                title="B&B"
                extra={
                    [user
                        ?<Button.Group>
                            <Button ><Link to='/Availtour'>   Request a tour   </Link></Button>
                            <Button ><Link to='/FoodStatus'>   Food Status   </Link></Button>
                            <Button ><Link to='/BookRooms'>   Boook Rooms   </Link></Button>
                            <Button ><Link to='/ShowVisuals'>   Analytics   </Link></Button>

                             <Button key="3"><Link to='/feedback'>   Provide Feedback    </Link></Button>
                             <Button key="4" type='primary' onClick={onLogout}><Link to='/'>   logout    </Link></Button>
                        </Button.Group>
                        : <Button.Group key='1'>
                            <Button key="1"><Link to='/register'>   Register    </Link></Button>
                            <Button key="2"><Link to='/login'>   login    </Link></Button>
                        </Button.Group>
                    ]
                }
            ></PageHeader>
        </Layout>
    )
}