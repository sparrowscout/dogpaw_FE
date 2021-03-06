import { useGetParticipantsLists } from "../hook/useProjectData";
import { Btn, GrayLineBtn, LineBtn, ListProfilePic } from "../styles/style";
import {
  ApplyListContent,
  EmptyBody,
  EmptyImg,
  MyBtn,
  Section,
  Stack,
  StackBody,
  Stacks,
  User,
} from "./ApplyList";
import profilepic from "../styles/icon/global/profile.svg";
import { useExplusionMateMutation } from "../hook/useProjectMutation";
import { useWithdrawPartici } from "../hook/useUserData";
import styled from "styled-components";
import { useState } from "react";
import { Content } from "./ApplyBtn";
import WithdrawModal from "./WithdrawalModal";

const ParticipantList = ({ myPostId, currentTab, setViewApply }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [itemState, setItemState] = useState(null);

  const { isLoading: isParticipantListLoading, data: participantList } = useGetParticipantsLists(myPostId);
  const { mutate: ExplusionMate } = useExplusionMateMutation();
  console.log(participantList);
  const { mutateAsync: WithdrawPartici } = useWithdrawPartici();

  const explusionMate = (data) => {
    //console.log(data);
    ExplusionMate(data);
    setModalOpen(false);
  };

  const withDrawParticipate = () => {
    if (window.confirm("정말 탈퇴하시겠어요?")) {
      WithdrawPartici(myPostId);
      setViewApply(false);
    } else {
      return;
    }
  };

  if (isParticipantListLoading) {
    return (
      <EmptyBody>
        <EmptyImg />
        <br />
        <span> Loading . . . </span>
      </EmptyBody>
    );
  }

  const openModal = (team) => {
    setModalOpen(true);
    setItemState(team);
  };
  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      {participantList.data.length === 0 ? (
        <EmptyBody>
          <EmptyImg />
          <br />
          <span> 아직 팀원이 없어요! </span>
        </EmptyBody>
      ) : null}
      {participantList.data.map((team) => {
        return (
          <ApplyListContent>
            <Sections>
              <User>
                {team.profileImg === null ? (
                  <ListProfilePic src={profilepic} />
                ) : (
                  <ListProfilePic src={team.profileImg} />
                )}
                {team.nickname}
                {/* <span> {team.username} </span> */}
              </User>
              {team.username}
              <Stacks>
                {team.stacks?.map((stack, index) => {
                  return <Stack key={index}>#{stack}</Stack>;
                })}
              </Stacks>
            </Sections>
            <Out>
              {currentTab === 2 ? null : (
                <p
                  onClick={() => {
                    openModal(team);
                  }}
                >
                  강퇴하기
                </p>
              )}
            </Out>
          </ApplyListContent>
        );
      })}
      {itemState && (
        <WithdrawModal
          open={modalOpen}
          explusionMate={explusionMate}
          closeModal={closeModal}
          team={itemState}
          myPostId={myPostId}
        />
      )}
      <div onClick={withDrawParticipate}>탈퇴하기</div>
    </>
  );
};

const Sections = styled(Section)`
  width: 100%;
`;

const Out = styled.div`
  cursor: pointer;
  
  p {
    font-size: 14px;
    color: crimson;
    position: absolute;
    top: 25px;
    right: 30px;
  }
`;

export default ParticipantList;
