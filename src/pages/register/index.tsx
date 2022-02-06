import React, { FC, ReactElement, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import base from "../../utils/baseUrl";
import useTitle from "../../utils/useTitle";
import "./index.css";

const Register: FC = (): ReactElement => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [repeat, setRepeat] = useState<string>("");
    const [alertUsername, setAlertUsername] = useState<boolean>(true);
    const [alertPassword, setAlertPassword] = useState<boolean>(true);
    const [alertRepeat, setAlertRepeat] = useState<boolean>(true);
    const [isrequest, setIsRequest] = useState<boolean>(false);
    const navigate = useNavigate();

    useTitle("用户注册");

    const handleUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
        setAlertUsername(/^[a-zA-Z0-9_]{4,12}$/.test(e.target.value));
    }

    const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        setAlertPassword(/^(?=[a-zA-Z])(?=.{6,18})(?=.*[0-9])(?=.*[_@#&%]).*$/.test(e.target.value));
    }

    const handleRepeat = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRepeat(e.target.value);
        if (e.target.value === password) {
            setAlertRepeat(true);
        }
    }

    const handleRegister = () => {
        setAlertRepeat(repeat === password);
        if (!username) {
            setAlertUsername(false);
        } else if (!password) {
            setAlertPassword(false);
        } else if (!repeat || repeat !== password) {
            setAlertRepeat(false);
        } else if (alertUsername && alertPassword && alertRepeat) {
            if (!isrequest) {
                setIsRequest(true);
                fetch(`${base}/users/register`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username,
                        password
                    })
                })
                    .then(res => res.json())
                    .then(json => {
                        const { token } = json;
                        if (token) {
                            localStorage.setItem("token", token);
                            navigate("/home", { replace: true });
                        } else {
                            alert("用户名已被注册");
                            setUsername("");
                            setPassword("");
                            setRepeat("");
                            setIsRequest(false);
                        }
                    }).catch(e => {
                        alert("注册失败，检查网络后重试");
                        setIsRequest(false);
                    })
            }
        }
    }

    return (
        <div className="register">
            <div className="register-title">注册</div>
            <div className="register-box">
                <input placeholder="请输入用户名" onChange={handleUsername} value={username} />
                {
                    alertUsername ? <></> :
                        <div className="alertusername">
                            请输入4-12位只包含字母、数字、下划线的用户名
                        </div>
                }
                <input placeholder="请输入密码" onChange={handlePassword} value={password} type="password" />
                {
                    alertPassword ? <></> :
                        <div className="alertpassword">
                            请输入以字母开头,至少包含1位数字和特殊字符的6-18位密码
                        </div>
                }
                <input placeholder="请重复输入密码" onChange={handleRepeat} value={repeat} type="password" />
                {
                    alertRepeat ? <></> :
                        <div className="alertpassword">
                            两次密码输入不一致
                        </div>
                }
                <Link to="/login" className="tologin">登录</Link>
                <button onClick={handleRegister}>注册</button>
            </div>
        </div>
    );
}

export default Register;