import { useInfiniteQuery, useQuery } from "react-query";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../shared/axios";
import { useInView } from "react-intersection-observer";
import Tutoral from "../components/Tutorial";

import Loading from "../shared/Loading";
import Carousel from "../components/Carousel";

import styled, { css, keyframes } from "styled-components";
import { ReactComponent as CommentIcon } from "../styles/icon/post/commentCnt.svg";
import { ReactComponent as BookmarkIcon } from "../styles/icon/post/bookmark.svg";
import { ReactComponent as BookmarkFill } from "../styles/icon/post/bookmarkFill.svg";

import award from "../styles/icon/main/award.svg";
import gold from "../styles/icon/main/medal0.svg";
import silver from "../styles/icon/main/medal1.svg";
import bronze from "../styles/icon/main/medal2.svg";
import person from "../styles/images/person.png";
import { useRecoilValue } from "recoil";
import { UserInfoAtom } from "../atom/atom";

const getBookmarRank = () => {
  return instance.get("/api/bookMark/rank");
};

const fetchPostList = async (pageParam) => {
  const res = await instance.get(`/api/allpost?page=${pageParam}`);
  const { postList, isLast } = res.data;
  return { postList, nextPage: pageParam + 1, isLast };
};

const Main = () => {
  const navigate = useNavigate();
  const user = useRecoilValue(UserInfoAtom);
  const [mark, setMark] = useState(false);
  const [toggle, setToggle] = useState(true);
  const [isHover, setIsHover] = useState(false);
  const [rank, setRank] = useState([]);
  const { ref, inView } = useInView();
  
  const userMe = user.nickname;
  const isLogin = localStorage.getItem("token");

  useQuery("bookmarkRank", getBookmarRank, {
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      setRank(data.data);
    },
  });

  const { data, status, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    "postList",
    ({ pageParam = 0 }) => fetchPostList(pageParam),
    {
      refetchOnWindowFocus: false,
      getNextPageParam: (lastPage) =>
        !lastPage.isLast ? lastPage.nextPage : undefined, // lastPage.nexPage로만 하면 데이터 없는데 무한 배열 생성 함 .
    }
  );

  useEffect(() => {
    if (inView) fetchNextPage();
  }, [fetchNextPage, inView]);

  if (status === "loading") {
    return <Loading />;
  }
  if (status === "error") {
    return null;
  }
  console.log(data);

  const dataList = data?.pages.map((arr) => arr.postList);
  const postList = dataList.reduce((acc, cur) => {
    return acc.concat(cur);
  });

  const list = toggle ? postList.filter((post) => post.deadline === false) : postList;
 // console.log(list);

  const bookMark = () => {
    if (mark === false) {
      setMark(true);
    } else {
      setMark(false);
    }
  };

  const clickedToggle = () => {
    setToggle((prev) => !prev);
  };

  return (
    <Wrap>
      <Tuto
                onMouseOver={() => setIsHover(true)}
                onMouseOut={() => setIsHover(false)}
                onClick={() => setIsHover(false)}
              >
                {isHover && <Tutoral />}
                ?</Tuto>
      <Carousel />
      <Award>
        <img src={award} alt="" />
        <span>인기 게시글</span>
      </Award>
      <ArticleWrap>
        {rank.map((list, idx) => {
          return (
            <Article2
              key={list.postId}
              onClick={() => {
                if (!isLogin) {
                  window.alert("로그인이 필요한 서비스입니다!");
                  return;
                }
                navigate("/detail/" + list.postId);
              }}
            >
              {idx === 0 ? (
                <img src={gold} alt="" />
              ) : idx === 1 ? (
                <img src={silver} alt="" />
              ) : (
                <img src={bronze} alt="" />
              )}
              <Content>
                <h1>{list.title}</h1>
                <p>{list.content}</p>
              </Content>
              <Hashtag>
                <ul>
                  {list.stacks.map((lang, idx) => (
                    <li key={idx}>#{lang}</li>
                  ))}
                </ul>
                <p style={{ color: "#ffb673" }}>
                  #{list.online ? "온라인" : "오프라인"}
                </p>
              </Hashtag>
              <Info>
                <div>
                  <Comment>
                    <CommentIcon />
                    <p>{list.commentCnt}</p>
                  </Comment>
                  <Bookmark>
                    <BookmarkIcon style={{ width: "10", height: "14" }} />
                    <p>{list.bookmarkCnt}</p>
                  </Bookmark>
                </div>
                <Date>시작예정일 {list.startAt}</Date>
              </Info>
              <Footer>
                <User>
                  <img src={list.profileImg || person} alt="profileImg" />
                  <p>{list.nickname}</p>
                </User>
                {list.bookMarkStatus ? (
                  <BookmarkFill onClick={bookMark} />
                ) : (
                  <BookmarkIcon onClick={bookMark} />
                )}
              </Footer>
            </Article2>
          );
        })}
      </ArticleWrap>
      <ToggleWrap>
        <ToggleBtn onClick={clickedToggle} toggle={toggle}>
          <p style={{ display: "flex" }}>
            <All>ALL</All>
            <Ing>모집중</Ing>
          </p>
          <Circle toggle={toggle}>
            <p>{toggle ? "모집중" : "ALL"}</p>
          </Circle>
        </ToggleBtn>
      </ToggleWrap>
      <>
        <ArticleWrap>
          {list.map((post) => (
            <Article
              key={post.postId}
              onClick={() => {
                if (!isLogin) {
                  window.alert("로그인이 필요한 서비스입니다!");
                  return;
                }
                navigate("/detail/" + post.postId);
              }}
            >
              <Content>
                <h1>{post.title}</h1>
                <p>{post.content}</p>
              </Content>
              <Hashtag>
                <ul>
                  {post.stacks.map((lang, idx) => (
                    <li key={idx}>#{lang}</li>
                  ))}
                </ul>
                <p style={{ color: "#ffb673" }}>
                  #{post.online ? "온라인" : "오프라인"}
                </p>
              </Hashtag>
              <Info>
                <div>
                  <Comment>
                    <CommentIcon />
                    <p>{post.commentCnt}</p>
                  </Comment>
                  <Bookmark>
                    <BookmarkIcon style={{ width: "10", height: "14" }} />
                    <p>{post.bookmarkCnt}</p>
                  </Bookmark>
                </div>
                <Date>시작예정일 {post.startAt}</Date>
              </Info>
              <Footer>
                <User>
                  <img src={post.profileImg || person} alt="profileImg" />
                  <p>{post.nickname}</p>
                </User>
                {userMe === post.nickname ? ("") : post.bookMarkStatus ? (
                  <BookmarkFill onClick={bookMark} />
                ) : (
                  <BookmarkIcon onClick={bookMark} />
                )}
                
              </Footer>
            </Article>   
          ))}
        </ArticleWrap>
        {isFetchingNextPage ? <Loading /> : <div ref={ref}></div>}
      </>
    </Wrap>
  );
};

const Wrap = styled.div`
  width: 1200px;
  margin: auto;

  @media screen and (max-width: 996px) {
    margin: 0px 40px;
  }

  ul {
    display: flex;
  }
  li {
    list-style: none;
  }

  h1 {
    font-size: 25px;
  }
  p {
    font-size: 15px;
  }
`;
const Move = keyframes`
0% {
    transform: scale3d(1, 1, 1);
  }
  30% {
    transform: scale3d(1.25, 0.75, 1);
  }
  40% {
    transform: scale3d(0.75, 1.25, 1);
  }
  50% {
    transform: scale3d(1.15, 0.85, 1);
  }
  65% {
    transform: scale3d(0.95, 1.05, 1);
  }
  75% {
    transform: scale3d(1.05, 0.95, 1);
  }
  100% {
    transform: scale3d(1, 1, 1);
  }

`;
const Tuto = styled.div`
width:50px;
height:50px;
border-radius:50%;
background-color:gold;
display:flex;
align-items:center;
justify-content:center;
position:absolute;
left:150px;
z-index:99;
animation:${Move} 1s ease-in-out ;

`;
const Award = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
  span {
    font-weight: 500;
    color: ${(props) => props.theme.keyColor};
  }
`;

const Img = styled.img`
  border-radius: 15px;
  margin-top: 50px;
`;
// 토글 스위치
const ToggleWrap = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 20px;
`;
const ToggleBtn = styled.button`
  width: 106px;
  height: 44px;
  border-radius: 30px;
  border: 2px solid #ffb673;
  cursor: pointer;
  background-color: ${(props) => props.theme.divBackGroundColor};
  position: relative;
  display: flex;
  align-items: center;
  transition: all 0.5s ease-in-out;
`;

const All = styled.span`
  width: 40px;
  font-weight: 700;
  color: #ffb673;
  opacity: 0.5;
  display: flex;
  align-items: center;
  padding-left: 6px;
`;
const Ing = styled(All)`
  width: 50px;
  flex-direction: row-reverse;
`;

const Circle = styled.div`
  display: flex;
  flex-direction: center;
  align-items: center;
  background-color: #ff891c;
  //background-color: #ffb673;
  width: 52px;
  height: 34px;
  border-radius: 50px;
  position: absolute;
  left: 2%;
  transition: all 0.4s ease-in-out;
  ${(props) =>
    props.toggle &&
    css`
      transform: translate(44px, 0);
      transition: all 0.4s ease-in-out;
    `}

  p {
    width: 100%;
    color: white;
    font-weight: 700;
  }
`;
// 토글 스위치 끝

const ArticleWrap = styled.ul`
  width: 1200px;
  gap: 2%;
  row-gap: 24px;
  display: flex;
  flex-wrap: wrap;
  margin-top: 20px;
`;
const Article = styled.li`
  background-color: ${(props) => props.theme.divBackGroundColor};
  padding: 16px 20px;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.09);
  border-radius: 16px;
  width: 23.5%;
  height: 352px;
  position: relative;
  transition: 0.2s ease-in;
  cursor: pointer;

  &:hover {
    transform: scale(1.02);
  }
`;

const Article2 = styled(Article)`
  width: 32%;
  height: 364px;
  padding-top: 0;
`;

const Content = styled.div`
  margin: 20px 0;

  h1 {
    padding-bottom: 20px;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  p {
    line-height: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
`;

const Hashtag = styled.div`
  position: absolute;
  bottom: 100px;

  li {
    margin-right: 5px;
    color: #ffb673;
  }
`;

const Deadline = styled.div`
  padding: 15px;
  border-radius: 8px;
  font-weight: bold;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.3);
`;
const Footer = styled.div`
  display: flex;
  width: 88%;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  bottom: 20px;

  svg {
    margin-right: 5px;
  }
`;
const User = styled.div`
  display: flex;
  align-items: center;
  img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-right: 10px;
  }
`;
const Info = styled.div`
  display: flex;
  justify-content: space-between;
  width: 87%;
  position: absolute;
  bottom: 70px;
  div {
    display: flex;
  }
  svg {
    margin-right: 5px;
  }
`;
const Comment = styled.div`
  display: flex;
  margin-right: 15px;
`;

const Bookmark = styled.div`
  display: flex;
`;
const Date = styled.p`
  color: #8b8b8b;
  //width: 203px;
  display: flex;
  justify-content: flex-end;
`;

export default Main;
