import React, { FC, ReactElement, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import base from "../../utils/baseUrl";
import useTitle from "../../utils/useTitle";
import "./index.css";
const Login: FC = (): ReactElement => {
    const TypeError = {
        1: "用户名不能为空",
        2: "密码不能为空",
        3: ["用户名不能为空", "密码不能为空"]
    }

    useTitle("用户登录");

    const [typeError, setTypeError] = useState<number>(0);
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isrequest, setIsRequest] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
        setTypeError(0);
    }

    const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        setTypeError(0);
    }

    const handleLogin = () => {
        if (username === "" && password === "") {
            setTypeError(3);
        } else if (username === "") {
            setTypeError(1);
        } else if (password === "") {
            setTypeError(2);
        } else {
            if (!isrequest) {
                setIsRequest(true);
                fetch(`${base}/users/login`, {
                    method: "post",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username,
                        password
                    })
                })
                    .then(response => response.json())
                    .then(json => {
                        setIsRequest(false);
                        const { token } = json;
                        if (!token) {
                            alert("用户名或密码错误");
                        } else {
                            localStorage.setItem("token", token);
                            navigate("/home", { replace: true });
                        }
                    })
                    .catch(res => {
                        alert("登录失败，检查网络后重试");
                        setIsRequest(false);
                    })
            }
        }
    }

    return (
        <div className="login">
            <div className="login-title">用户登录</div>
            <div className="login-box">
                <input placeholder="请输入用户名" onChange={handleUsername} value={username} />
                {
                    typeError === 1 || typeError === 3 ?
                        <div className="alertusername">
                            {typeError === 3 ? TypeError[typeError][0] : TypeError[typeError]}
                        </div> :
                        <></>
                }
                <input placeholder="请输入密码" onChange={handlePassword} value={password} type="password" />
                {
                    typeError === 2 || typeError === 3 ?
                        <div className="alertpassword">
                            {typeError === 3 ? TypeError[typeError][1] : TypeError[typeError]}
                        </div> :
                        <></>
                }
                <Link to="/register" className="toregister">注册</Link>
                <button onClick={handleLogin}>登录</button>
            </div>
        </div>
    );
}

export default Login;