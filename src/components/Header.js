import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { DarkThemeAtom } from "../atom/theme";
import React, { useEffect, useState } from "react";
import ModalOpen from "./Modal";
import axios from "axios";
import { Link } from "react-router-dom";



import logo from "../styles/images/logo.png";



import lightMode from "../styles/icon/toggleLight.svg";
import darkMode from "../styles/icon/toggleDark.svg";
import sun from "../styles/icon/sun.svg";
import moon from "../styles/icon/moon.svg";
import styled, { css } from "styled-components";
import { useNavigate } from "react-router-dom";
import { UserInfoAtom } from "../atom/userQuery";

const Header = () => {
  const navigate = useNavigate();

  const [isDark, setIsDark] = useRecoilState(DarkThemeAtom);
  // const isLogin = useRecoilValue(UserInfoAtom);
  // console.log(isLogin)
  
  


  const logout = async () => {
    localStorage.removeItem("token");

    localStorage.removeItem("retoken");
    localStorage.removeItem("id");

    // const data = {
    //   userId: localStorage.getItem("id"),
    // };
    // try {
    //   await axios
    //     .post("http://13.125.213.81/user/signup/addInfo", data)
    //     .then((res) => console.log(res, "로그아웃"));
    // } catch (err) {
    //   console.log(err);
    // }
  };
  return (
    <Wrap>

      <div>
        <img
          src={logo}
          onClick={() => {
            navigate("/");
          }}
          alt=""
        />
      </div>
      <UserInfo>
        <ModeBtn onClick={() => setIsDark((prev) => !prev)} isDark={isDark}>
          <ModeCircle isDark={isDark} />
        </ModeBtn>
        <Link to="/write">게시글 작성</Link>
        <details>
          <summary>
            <Profile>
            </Profile>
            </summary>
            <ol>
              <li> </li>
              <li><Link to="/mypage">마이페이지</Link></li>
             
        
            </ol>
          
        </details>
        

        <ModalOpen />
        <button onClick={logout}>로그아웃</button>
      </UserInfo>

    </Wrap>
  );
};

const Wrap = styled.div`
box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.1);
width:100%;
height:75px;
margin-bottom:50px;
display: flex;
justify-content:space-between;
align-items:center;
padding: 0 80px;

img{
  width:203px;
  height:56px;
}

`;

const ModeBtn = styled.button`
  background-image: url(${(props) =>props.isDark ? `${darkMode}` : `${lightMode}`});
  background-repeat: no-repeat;
  background-size: cover;

  width: 80px;
  height: 34px;
  border-radius: 30px;
  border: none;
  cursor: pointer;

  margin-left: 10px;
  position: relative;
  display: flex;
  align-items: center;
  transition: all 0.5s ease-in-out;
`;

const ModeCircle = styled.div`
  display: flex;
  flex-direction: center;
  align-items: center;
  background-image: url(${(props) => (props.isDark ? `${moon}` : `${sun}`)});

  background-repeat: no-repeat;
  background-size: cover;

  width: 44px;
  height: 44px;
  border-radius: 50px;
  position: absolute;
  right: 0%;
  bottom: -6px;
  transition: all 0.4s ease-in-out;
  ${(props) =>
    props.isDark &&
    css`
      transform: translate(-35px, 0);
      transition: all 0.4s ease-in-out;
    `}
`;

const Detail = styled.details`
display:none
`;

 
const UserInfo = styled.div`
display:flex;
`;

const Profile = styled.div`
width:50px;
height:50px;
border-radius:50%;
background-color:gold;

`;




export default Header;
