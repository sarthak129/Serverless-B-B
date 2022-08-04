import { Typography } from "antd"

const { Title } = Typography;

export default function Dashboard(props) {

    const user = props.user.user?.username;
    const {isAuthenticated} = props.auth;

    return (
        <>
         {user ? <Title> Welcome {user}</Title> : <Title> HOME PAGE </Title>}
        </>
       
    )
}